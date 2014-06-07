var memoize = require("./utils/memoize"),
_           = require("underscore");

module.exports = {
  getOptions: function (target) {
    return target.create || target.update;
  },
  decorate: function(model, virtuals) {

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


  }
}