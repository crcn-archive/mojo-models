module.exports = {
  getOptions: function (target) {
    return target.virtuals;
  },
  decorate: function(model, virtuals) {

    var loading = {}, loadingModel = false;

    model.on("watching", function (propertyPath) {
      var property = propertyPath[0];

      if (model.has(property)) return;
      var self = this;

      if (virtuals[property]) {
        if (loading[property]) return;
        loading[property] = true;
        virtuals[property].call(model, function (err, value) {
          loading[property] = false;
          if (err) return;
          model.set(property, value);
        });
      } else {

        // TODO - call virtuals["*"]?
        /*if (loadingModel || !model.load) return;
        loadingModel = true;
        model.load(function () {
          loadingModel = false;
        });*/
      }
    });
  }
}