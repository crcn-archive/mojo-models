var models  = require(".."),
Application = require("mojo-application"),
expect = require("expect.js");

describe("model#", function () {

  var app = new Application();
  app.use(models);
  app.models.register("model", models.Base);

  it("can create a new model", function () {
    app.models.create("model");
  });

  it("sets data to the model", function () {
    var model = app.models.create("model", { data: { name: "abba" }});
    expect(model.get("name")).to.be("abba");
    expect(model.name).to.be("abba");
    expect(model.data.name).to.be("abba");
  });

  it("deserializes data from the constructor", function () {
    
    var Model = models.Base.extend({
      deserialize: function (data) {
        return {
          name: data.name.toUpperCase()
        }
      }
    });

    var model = new Model({ data: {name: "a"} }, app);
    expect(model.get("name")).to.be("A");
  });
});