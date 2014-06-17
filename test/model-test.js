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

  it("calls deserialize when 'data' changes", function () {
    var Model = models.Base.extend({
      deserialize: function (data) {
        return {
          name: data.name.toUpperCase()
        }
      }
    });

    var model = new Model({ data: {name: "a"} }, app);
    expect(model.get("name")).to.be("A");
    model.set("data", { name: "B" });
    expect(model.get("name")).to.be("B");
  });

  it("properly serializes data", function () {
    var Model = models.Base.extend({
      deserialize: function (data) {
        return {
          name: data.name.toUpperCase()
        }
      }
    });

    var model = new Model({ data: {name: "a"} }, app);
    expect(model.serialize().name).to.be("A");
  });

  it("sets the value property if data is not an object", function () {
    var model = new models.Base({
      data: 5
    }, app);
    expect(model.value).to.be(5);
    expect(model.data).to.be(5);
  });

  it("can access a property sent to the constructor before accessing deserialize", function (next) {
    var Model = models.Base.extend({
      deserialize: function (data) {
        expect(this.name).to.be('abba');
        next();
      }
    });

    new Model({data: "blarg",  name: "abba" }, app);
  })

});