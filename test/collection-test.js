var models  = require(".."),
expect      = require("expect.js"),
Application = require("mojo-application");

describe("collection#", function () {

  var app = new Application();
  app.use(models);

  it("can create a new collection", function () {
    var c = new models.Collection(null, app);
    expect(c.application).to.be(app);
  });

  it("can set the source of a collection with data property", function () {
    var c = new models.Collection({data:[0,1,2]}, app);
    expect(c.data[0]).to.be(0);
    expect(c.at(0).data).to.be(0);
  });

  it("default id property is _id", function () {
    var c = new models.Collection({}, app);
    expect(c.idProperty).to.be("_id");
  })

  it("can dynamically change the data, and reset the source of a collection", function () {
    var c = new models.Collection(null, app);
    c.set("data", [0, 1, 2]);
    expect(c.data[0]).to.be(0);
    expect(c.at(0).data).to.be(0);
  });

  it("properly deserializes a collection", function () {
    var c = new models.Collection({
      deserialize: function (data) {
        return data.map(function (n) { return n * 10 });
      },
      data: [1, 2, 3]
    }, app);
    expect(c.at(0).data).to.be(10);
  });

  it("can override the createModel method", function () {
    var c = new models.Collection({
      createModel: function (options) {

        return new models.Base({ data: options.data * 10 }, this.application);
      },
      data: [1, 2, 3]
    }, app);
    expect(c.at(0).data).to.be(10);
  });

  it("maintains the same models for integers", function () {
    var c = new models.Collection({
      data: [1, 2, 3]
    }, app);
    expect(c.length).to.be(3);

    var m1 = c.at(1),
    m2     = c.at(2);

    c.set("data", [2, 3, 4]);
    expect(c.length).to.be(3);

    var m3 = c.at(2);

    expect(m1).to.be(c.at(0));
    expect(m2).to.be(c.at(1));

    c.set("data", [3, 4, 5]);

    expect(m2).to.be(c.at(0));
    expect(m3).to.be(c.at(1));
  });

  it("maintains the same models for objects", function () {

    var c = new models.Collection({
      data: [{_id: 1}, {_id:2}, { _id:3}]
    }, app);

    var m1 = c.at(1),
    m2     = c.at(2);

    c.set("data", [{_id: 2}, {_id:3}, { _id:4}]);

    expect(m1).to.be(c.at(0));
    expect(m2).to.be(c.at(1));

    c.set("data", [{_id: 3}, {_id:4}]);

    expect(m2).to.be(c.at(0));
    expect(c.length).to.be(2);
  });

  it("can customize the idproperty", function () {

    var c = new models.Collection({
      data: [{uid: 1}, {uid:2}, { uid:3}],
      idProperty: "uid"
    }, app);

    var m1 = c.at(1),
    m2     = c.at(2);

    c.set("data", [{uid: 2}, {uid:3}, { uid:4}]);

    expect(m1).to.be(c.at(0));
    expect(m2).to.be(c.at(1));

    c.set("data", [{uid:4}]);
    expect(c.length).to.be(1);

  });

  it("can create a model and push immediately to the collection", function () {
    var c = new models.Collection(null, app);
    var m = c.create({ data: 5 });
    expect(m.value).to.be(5);
    expect(c.length).to.be(1);
    expect(c.at(0)).to.be(m);
  });

  it("can create a model, and stop from pushing immediately to the collection", function () {
    var c = new models.Collection(null, app);
    var m = c.create({ data: 5, waitUntilSave: true });
    expect(m.value).to.be(5);
    expect(c.length).to.be(0);
  });

  it("can create a model, and push only after saving the model", function () {
    var Model = models.Base.extend({
      persist: {
        save: function (complete) {
          complete(null, { _id: "blah" });
        }
      }
    });
    var c = new models.Collection({
      createModel: function (options) {
        return new Model({ data: options.data }, this.application);
      }
    }, app);

    var model = c.create({ waitUntilSave: true });
    expect(c.length).to.be(0);
    model.save();
    expect(c.length).to.be(1);
    expect(c.at(0)).to.be(model);
  }); 

  it("emits didUpdate when a model is saved", function (next) {
    var Model = models.Base.extend({
      persist: {
        save: function (complete) {
          complete(null, { _id: "blah" });
        }
      }
    });
    var c = new models.Collection({
      createModel: function (options) {
        return new Model({ data: options.data }, this.application);
      }
    }, app);

    c.once("didUpdate", function() { next(); });

    c.create().save();
  });

  it("emits didUpdate when a model is removed", function (next) {
    var Model = models.Base.extend({
      persist: {
        save: function (complete) {
          complete(null, { _id: "blah" });
        },
        remove: function(complete) {
          complete();
        }
      }
    });
    var c = new models.Collection({
      createModel: function (options) {
        return new Model({ data: options.data }, this.application);
      }
    }, app);

    var m = c.create();
    m.save();

    c.once("didUpdate", function() { next(); });

    m.remove();
  });

  it("removes a model if .dispose() is called on a model", function () {
    var c = new models.Collection(null, app);
    var m = c.create();
    expect(c.length).to.be(1);
    m.dispose();
    expect(c.length).to.be(0);
  });

  it("can create a model from modelType string", function () {

    var Model = models.Base.extend();

    app.models.register("someModel", Model);
    var c = new models.Collection({
      modelType: "someModel"
    }, app);
    expect(c.create().constructor).to.be(Model);
  });

  it("can create a model from modelType class", function () {

    var Model = models.Base.extend();

    var c = new models.Collection({
      modelType: Model
    }, app);
    expect(c.create().constructor).to.be(Model);
  });


  it("calls dispose on models that aren't part of the collection anymore", function () {
    var c = new models.Collection({ data: [0,1,2,3]}, app);
    var m1 = c.at(0), m2 = c.at(1), i = 0;

    m1.on("dispose", function () {
      i++;
    });

    m2.on("dispose", function () {
      i++;
    });

    c.set("data", [2, 3])

    expect(i).to.be(2);

  })


});