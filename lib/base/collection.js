var bindable = require("bindable"),
_            = require("lodash"),
BaseModel    = require("./model"),
janitor      = require("janitorjs");

function BaseCollection (options, application) {
  if (!options) options = {};
  bindable.Collection.call(this, []);
  this.application = application;
  this._modelsJanitor = janitor();
  this.bind("data", _.bind(this._onData, this));
  this.setProperties(options);
  application.models.decorate(this);
}

// deserialize should check for UID

module.exports = bindable.Collection.extend(BaseCollection, {
  idProperty: "_id",
  deserialize: function (data) {
    return data;
  },
  createModel: function (data) {
    var options = { data: data, collection: this },
    ModelClass = BaseModel;

    if (this.modelType) {
      if (typeof this.modelType === "function") {
        ModelClass = this.modelType;
      } else {
        return this.application.models.create(this.modelType, options);
      }
    }
    return new ModelClass(options, this.application);
  },
  create: function (options) {
    
    if (!options) options = {};

    var model = this.createModel(options.data);
    model.setProperties(options);

    if (!model.data) {
      var self = this;
      model.once("save", function () {
        if (options.waitUntilSave === true) self.push(model);
      });
    }

    if (options.waitUntilSave !== true) {
      this.push(this._watchModel(model));
    }

    return model;
  },
  serialize: function () {
    return this.source().toJSON();
  },
  _onData: function (data) {
    var self = this;

    var nsrc = this.deserialize(data || []),
    emodels  = this.source().concat();


    // update existing
    for (var i = emodels.length; i--;) {
      var emodel = emodels[i];
      for (var j = nsrc.length; j--;) {
        var newValue = nsrc[j];
        if (this._compareIds(emodel, newValue)) {

          // update with emodel
          emodel.set("data", newValue);

          // remove so it doesn't get processed
          emodels.splice(i, 1);
          nsrc.splice(j, 1);
        }
      }
    }

    // remove all models that couldn't be updated
    for (var i = emodels.length; i--;) {
      this.splice(this.indexOf(emodels[i]), 1);
    }

    // insert the new models
    for (var i = 0, n = nsrc.length; i < n; i++) {
      this.push(this._watchModel(this.createModel(nsrc[i])));
    }

    this._rewatchModels();
  },
  _watchModel: function (model) {
    var self = this;
    model.once("dispose", function () {
      self.splice(self.indexOf(model), 1);
    });
    return model;
  },
  _rewatchModels: function () {
    this._modelsJanitor.dispose();
    for (var i = this.length; i--;) {
      this._watchModel(this.at(i));
    }
  },
  _compareIds: function (model, value) {
    if (typeof value === "object") {
      return model.data[this.idProperty] === value[this.idProperty];
    } else {
      return model.value === value;
    }
  },
  toJSON: function () {
    return tis.serialize();
  }
});