var memoize = require("./utils/memoize"),
_           = require("underscore");

module.exports = {
  getOptions: function (target) {
    return target.del;
  },
  decorate: function(model, virtuals) {

    model.remove = function (complete) {
      if (!complete) complete = function(){};
      if (!this.data) return new Error("cannot remove a model without data");
      this.del(complete);
    };
  }
}