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

      if (typeof complete2 !== "function") complete2 = function() { };

      function complete (err, data) {

        if (err) return complete2(err);
        if (typeof data === "object") {
          model.set("data", data);
        }
        model.emit("save");
        complete2(null, model);
      }

      if(persist.save) {
        persist.save.call(this, complete);
      } else {
        complete(new Error("cannot save model"));
      }
    };

    model.remove = function (complete) {
      if (typeof complete !== "function") complete = function() { };
      if (!persist.remove) return complete(new Error("cannot remove model"));
      persist.remove.call(this, function(err) {
        if (err) return complete(err);
        model.emit("remove");
        model.dispose();
        complete(null, model);
      });
    };

    model.reload = function (complete) {
      if (!persist.load) return complete(new Error("cannot load model"));
      persist.load.call(this, function (err, data) {
        if (err) {
          complete(err);
          return model._load.clear();
        }
        model.set("data", data);
        complete(null, model);
      });
    };

    model._load = memoize(_.bind(model.reload, model));
    model.load = function (complete) {
      if (typeof complete !== "function") complete = function() { };
      model._load(complete);
    }
  }
}