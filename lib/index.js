var RegisteredClasses = require("mojo-registered-classes"),
modelDecor            = require("./decor"),
BaseModel             = require("./base/model"),
BaseCollection        = require("./base/collection");


module.exports = function (app) {
  app.models = new RegisteredClasses(app);
  app.use(modelDecor);
}

module.exports.Base       = BaseModel;
module.exports.Collection = BaseCollection;