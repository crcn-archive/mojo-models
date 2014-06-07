var memoize = require("./utils/memoize"),
_           = require("lodash");

module.exports = {
  getOptions: function (target) {
    return target.create || target.read || target.update || target.del;
  },
  decorate: function(model) {

    model.save = function (complete) {
      if (!complete) complete = function() { };

      // if data exists, then update
      if (this.data) {
        if(this.update) {
          this.update(complete);
        } else {
          complete(new Error("cannot update model"));
        }
      } else {
        if(this.create) {
          var self = this;
          this.create(function (err, data) {
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
      if (!this.del) return complete(new Error("cannot remove model"));
      this.del(complete);
    };

    model.reload = function (complete) {
      if (!complete) complete = function(){};
      if (!this.read) return complete(new Error("cannot load model"));
      this.read(function (err, data) {
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