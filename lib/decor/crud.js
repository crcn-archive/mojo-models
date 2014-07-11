var memoize = require("./utils/memoize"),
_           = require("lodash"),
tq          = require("tq"),
hurryup     = require("hurryup");


module.exports = {
  getOptions: function (target) {
    return target.persist;
  },
  decorate: function(model) {

    var persist = model.persist, queue = tq.create().start();

    if (typeof persist === "function") {
      persist = persist(model);
    }

    model.persist = persist;

    function _queue (fn) {

      fn = hurryup(fn, { timeout: 1000 * 10, retry: false });

      queue.push(function (next) {
        fn(function () {
          next();
        })
      });
    }

    model.save = function (complete2) {

      if (typeof complete2 !== "function") complete2 = function() { };

      var self = this;

      _queue(function (next) {

        model.emit("willSave");

        function complete (err, data) {

          next();

          if (err) return complete2(err);
          if (typeof data === "object") {
            model.set("data", data);
          }
          model.emit("didSave");
          model.emit("saved");
          complete2(null, model);
        }

        if(persist.save) {
          persist.save.call(self, complete);
        } else {
          complete(new Error("cannot save model"));
        }
      })
    };

    model.remove = function (complete) {
      if (typeof complete !== "function") complete = function() { };
      if (!persist.remove) return complete(new Error("cannot remove model"));

      var self = this;

      _queue(function (next) {
        model.emit("willRemove");
        persist.remove.call(self, function(err) {
          next();
          if (err) return complete(err);
          model.emit("didRemove");
          model.emit("removed");
          model.dispose();
          complete(null, model);
        });
      });
      
    };

    model.reload = function (complete) {
      if (typeof complete !== "function") complete = function() { };
      if (!persist.load) return complete(new Error("cannot load model"));

      var self = this;

      _queue(function (next) {
        persist.load.call(self, function (err, data) {
          next();
          if (err) {
            complete(err);
            return model._load.clear();
          }
          model.set("data", data);
          complete(null, model);
        });
      });
    };

    model._load = memoize(_.bind(model.reload, model));
    model.load = function (complete) {
      if (typeof complete !== "function") complete = function() { };
      model._load(complete);
    }
  }
}
