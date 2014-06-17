var models  = require(".."),
Application = require("mojo-application"),
expect      = require("expect.js");

describe("model-load#", function () {

  var app = new Application();
  app.use(models);

  it("can call load on a model", function () {
    var Model = models.Base.extend({
      persist: {
        read: function(){}
      }
    });

    var m = new Model({}, app);
    m.load();
  });

  it("returns an error if a model can't be loaded", function (next) {
    var Model = models.Base.extend({
      persist: {
        update: function(){}
      }
    });

    var m = new Model({}, app);
    m.load(function (err) {
      expect(err.message).to.be("cannot load model");
      next();
    });
  });

  it("properly sets the data from .load() on the model", function (next) {

    var Model = models.Base.extend({
      persist: {
        read: function (complete) {
          complete(null, { name: "a" });
        }
      }
    });

    var m = new Model(null, app);
    m.load(function () {
      expect(m.get("name")).to.be("a");
      expect(m.get("data.name")).to.be("a");
      next();
    });
  });

  it("deserializes data once it's been loaded", function (next) {
    var Model = models.Base.extend({
      persist: {
        read: function (complete) {
          complete(null, { name: "a" });
        },
      },
      deserialize: function (data) {
        return {
          name: data.name.toUpperCase()
        }
      }
    });

    var m = new Model(null, app);
    m.load(function () {
      expect(m.get("name")).to.be("A");
      expect(m.get("data.name")).to.be("a");
      next();
    });
  });

  it("can return an error", function (next) {
    var Model = models.Base.extend({
      persist: {
        read: function (complete) {
          complete(new Error("abba"));
        }
      }
    });

    var m = new Model(null, app);
    m.load(function (err) {
      expect(err.message).to.be("abba");
      next();
    });
  });

  it("cannot load a model without an id property", function (next) {
    var Model = models.Base.extend({
      idProperty: "_id",
      persist: {
        read: function (complete) {
          complete(new Error("abba"));
        }
      }
    });

    var m = new Model({}, app);
    m.load(function (err) {
      expect(err.message).to.be("cannot load a model without _id");
      next();
    });
  });

  it("can load a model with an id properly", function (next) {
    var Model = models.Base.extend({
      idProperty: "_id",
      persist: {
        read: function (complete) {
          complete();
        }
      }
    });

    var m = new Model({_id: "abba"}, app);
    m.load(function (err) {
      expect(err).to.be(null);
      next();
    });
  });

  it("can reload a model that hasn't loaded properly", function (next) {
    var i = 0;
    var Model = models.Base.extend({
      persist: {
        read: function (complete) {
          i++;
          complete(new Error("abba"));
        }
      }
    });

    var m = new Model(null, app);
    m.load(function (err) {
      expect(i).to.be(1);
      process.nextTick(function () {
        m.load(function () {
          expect(i).to.be(2);
          next();
        })
      })
    });
  });

  it("returns model on load", function (next) {
    var Model = models.Base.extend({
      persist: {
        read: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model({data:{}}, app);
    m.load(function (err, m2) {
      expect(m).to.be(m2);
      next();
    });
  });

});