var models  = require(".."),
Application = require("mojo-application"),
expect      = require("expect.js");

describe("model#", function () {

  var app = new Application();
  app.use(models);

  it("can load a virtual property", function (next) {
    var Model = models.Base.extend({
      virtuals: {
        name: function (complete) {
          complete(null, "abba");
        }
      }
    });

    app.models.register("model", Model);
    app.models.create("model").bind("name", function (value) {
      expect(value).to.be("abba");
      next();
    }).now();
  });

  it("doesn't re-call a virtual property", function (next) {
    var i = 0;
    var Model = models.Base.extend({
      virtuals: {
        name: function (complete) {
          i++;
          complete(null, "abba");
        }
      }
    });

    app.models.register("model", Model);
    var model = app.models.create("model");

    model.bind("name", function (value) {
      model.bind("name", function (value) {
        expect(i).to.be(1);
        expect(value).to.be("abba");
        next();
      }).now();
    }).now();
  });

  it("passes the context of the model to the virtual function ", function () {
    var i = 0, model;
    var Model = models.Base.extend({
      virtuals: {
        name: function () {
          i++;
          expect(model).to.be(this);
        }
      }
    });

    app.models.register("model", Model);
    var model = app.models.create("model");
    model.bind("name", function(){}).now();
    expect(i).to.be(1);
  })

  it("recalls a virtual property if it doesn't exist", function (next) {
    var i = 0;
    var Model = models.Base.extend({
      virtuals: {
        name: function (complete) {
          i++;
          complete(null);
        }
      }
    });

    app.models.register("model", Model);
    var model = app.models.create("model");

    model.bind("name", function (value) {
      model.bind("name", function (value) {
        expect(i).to.be(2);
        next();
      }).now();
    }).now();
  });

  it("calls load on a model if a property doesn't exist", function () {

    var i = 0;

    var Model = models.Base.extend({
      virtuals: {
      },
      load: function () {
        i++;
      }
    }); 


    app.models.register("model", Model);
    var model = app.models.create("model");

    model.bind("name", function (value) {
    }).now();
    expect(i).to.be(1);
  });

  it("doesn't call load more than once", function () {
    var i = 0;

    var Model = models.Base.extend({
      virtuals: {
      },
      load: function () {
        i++;
      }
    }); 


    app.models.register("model", Model);
    var model = app.models.create("model");

    model.bind("name", function(){}).now();
    expect(i).to.be(1);
    model.bind("name", function(){}).now();
    expect(i).to.be(1);
  });

  it("calls load if a property still doesn't exist", function () {
    var i = 0;

    var Model = models.Base.extend({
      virtuals: {
      },
      load: function (complete) {
        i++;
        complete();
      }
    }); 


    app.models.register("model", Model);
    var model = app.models.create("model");
    model.bind("name", function(){}).now();
    expect(i).to.be(1);
    model.bind("name", function(){}).now();
    expect(i).to.be(2);
  });



});