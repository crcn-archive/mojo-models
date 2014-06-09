var models  = require(".."),
Application = require("mojo-application"),
expect      = require("expect.js");

describe("model-save#", function () {

  var app = new Application();
  app.use(models);

  it("can call save on a model when update is defined", function () {
    var Model = models.Base.extend({
      persist: {
        update: function () {
        }
      }
    });

    var m = new Model({}, app);
    m.save();
  });

  it("can call save on a model when create is defined", function () {
    var Model = models.Base.extend({
      persist: {
        create: function () {
        }
      }
    });

    var m = new Model({}, app);
    m.save();
  });

  it("returns an error for a model that cannot be updated ", function (next) {
    var Model = models.Base.extend({
      persist: {
        create: function () {
        }
      }
    });

    var m = new Model({ data: {} }, app);
    m.save(function (err) {
      expect(err.message).to.be("cannot update model");
      next();
    }); 
  });

  it("returns an error for a model that cannot be created", function (next) {
    var Model = models.Base.extend({
      persist: {
        update: function () {
        }
      }
    });

    var m = new Model({ }, app);
    m.save(function (err) {
      expect(err.message).to.be("cannot create model");
      next();
    }); 
  });


  it("calls .create() when data is not defined", function (next) {
    var Model = models.Base.extend({
      persist: {
        create: function () {
          next();
        }
      }
    });

    var m = new Model({}, app);
    m.save();
  });

  it("calls .update() when data is defined", function (next) {
    var Model = models.Base.extend({
      persist: {
        update: function () {
          next();
        }
      }
    });

    var m = new Model({ data: {} }, app);
    m.save();
  });

  it("sets data when .create() calls successfuly", function (next) {
    var Model = models.Base.extend({
      persist: {
        create: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model(null, app);
    m.save(function () {
      expect(m.name).to.be("abba");
      next();
    });
  });

  it("doesn't set data when .update() calls successfuly", function (next) {
    var Model = models.Base.extend({
      persist: {
        update: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model({data:{}}, app);
    m.save(function () {
      expect(m.name).to.be(undefined);
      next();
    });
  });

  it("emits 'save' after running update", function (next) {
    var Model = models.Base.extend({
      persist: {
        update: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model({data:{}}, app);
    m.once("save", next);
    m.save();
  });

  it("emits 'save' after running create", function (next) {
    var Model = models.Base.extend({
      persist: {
        create: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model({data:null}, app);
    m.once("save", next);
    m.save();
  });

  it("returns model on save", function (next) {
    var Model = models.Base.extend({
      persist: {
        create: function (complete) {
          complete(null, { name: "abba"});
        }
      }
    });

    var m = new Model({data:null}, app);
    m.save(function (err, m2) {
      expect(m).to.be(m2);
      next();
    });
  });
});