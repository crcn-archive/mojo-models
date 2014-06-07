var memoize = require("./utils/memoize"),
_           = require("lodash");

module.exports = {
  getOptions: function (target) {
    return target.create || target.read || target.update || target.del || target.persist;
  },
  decorate: function(model) {

    var persist = model.persist || {
      create : model.create,
      read   : model.read,
      update : model.update,
      del    : model.del
    };

    if (typeof persist === "function") {
      persist = persist(model);
    }


    model.save = function (complete) {
      if (!complete) complete = function() { };

      // if data exists, then update
      if (this.data) {
        if(persist.update) {
          persist.update.call(this, complete);
        } else {
          complete(new Error("cannot update model"));
        }
      } else {
        if(persist.create) {
          var self = this;
          persist.create.call(this, function (err, data) {
            if (err) return complete(err);
            self.set("data", data);
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
      persist.del.call(this, complete);
    };

    model.reload = function (complete) {
      if (!complete) complete = function(){};
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