var bindable = require("bindable"),
_            = require("lodash");

function BaseModel (options, application) {

  // set the context of the model to itself
  bindable.Object.call(this, this);

  this.application = application;

  // watch when data changes
  this.bind("data", _.bind(this._onData, this));

  // set the data from the constructor
  this.setProperties(options || {});

  // decorate this model
  application.models.decorate(this);
}

module.exports = bindable.Object.extend(BaseModel, {
  deserialize: function (data) {
    return data;
  },
  serialize: function () {
    var serialized = {}, data = this.data;
    for (var key in data) {
      serialized[key] = this[key];
    }
    return serialized;
  },
  toJSON: function () {
    return this.serialize();
  },
  _onData: function (data) {

    // deserialize data, and set to this model

    var data = this.deserialize(data);

    if (typeof data === "object") {
      this.setProperties(data);
    } else {
      this.set("value", data);
    }
  }
});