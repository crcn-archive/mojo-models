var frills   = require("frills"),
virtuals     = require("./virtuals"),
createUpdate = require("./createUpdate"),
read         = require("./read"),
del          = require("./del.js");

module.exports = function (app) {
  var decor = frills();

  decor.
  use(virtuals, createUpdate, read, del);

  app.models.decorator = function (decorator) {
    decor.decorator(decorator);
  };

  app.models.decorate = function (target, proto) {
    decor.decorate(target, proto);
  };
};