var frills = require("frills"),
virtuals   = require("./virtuals");

module.exports = function (app) {
  var decor = frills();
  decor.
  use(virtuals);

  app.models.decorator = function (decorator) {
    decor.decorator(decorator);
  };

  app.models.decorate = function (target, proto) {
    decor.decorate(target, proto);
  };
};