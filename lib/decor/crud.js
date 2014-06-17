var memoize = require("./utils/memoize"),
_           = require("lodash");


module.exports = {
  getOptions: function (target) {
    return target.persist;
  },
  decorate: function(model) {

    var persist = model.persist;

    if (typeof persist === "function") {
      persist = persist(model);
    }

    model.persist = persist;

    model.save = function (complete2) {
      if (!complete2) complete2 = function() { };


      function complete (err) {
        if (err) return complete2(err);
        model.emit("save");
        complete2(null, model);
      }

      // if data exists, then update
      if (this.data) {
        if(persist.update) {
          persist.update.call(this, complete);
        } else {
          complete(new Error("cannot update model"));
        }
      } else {
        if(persist.create) {
          persist.create.call(this, function (err, data) {
            if (err) return complete(err);
            model.set("data", data);
            complete(err, data);
          });
        } else {
          complete(new Error("cannot create model"));
        }
      }
    };

    model.remove = function (complete) {
      if (!complete) complete = function(){};
      if (!this.data) return complete(new Error("cannot remove model without data"));
      if (!persist.del) return complete(new Error("cannot remove model"));
      persist.del.call(this, function(err) {
        if (err) return complete(err);
        model.emit("remove");
        model.dispose();
        complete(null, model);
      });
    };

    model.reload = function (complete) {
      if (!complete) complete = function(){};
      if (this.idProperty && !this[this.idProperty]) return complete(new Error("cannot load a model without " + this.idProperty));
      if (!persist.read) return complete(new Error("cannot load model"));
      persist.read.call(this, function (err, data) {
        if (err) {
          complete(err);
          return model.load.clear();
        }
        model.set("data", data);
        complete(null, model);
      });
    };

    model.load = memoize(_.bind(model.reload, model));
  }
}