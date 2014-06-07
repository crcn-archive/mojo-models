var bindable = require("bindable");

function BaseCollection (options, application) {
  bindable.Collection.call(this, options.data);
  this.application = application;
}

module.exports = bindable.Collection.extend(BaseCollection, {

});