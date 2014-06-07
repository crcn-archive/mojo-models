var memoize = require("./utils/memoize"),
_           = require("underscore");

module.exports = {
  getOptions: function (target) {
    return target.read;
  },
  decorate: function(model, virtuals) {

    model.reload = function (complete) {
      if (!complete) complete = function(){};
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