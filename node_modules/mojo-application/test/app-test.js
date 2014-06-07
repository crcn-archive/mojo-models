var expect = require("expect.js"),
Application = require(".."),
nofactor = require("nofactor");



describe("application#", function () {

  it("can create an application", function () {
    new Application();
  });

  it("sets the appropriate default node factory", function ( ){
    expect(new Application().nodeFactory).to.be(nofactor["default"]);
  })

  it("can register a plugin", function (next) {
    var app = new Application();
    app.use(function (a) {
      expect(a).to.be(app);
      next();
    })
  });

  it("calls the registerPlugins command", function (next) {
    var TestApplication = Application.extend({
      registerPlugins: function () {
        next();
      }
    });
    new TestApplication();
  });

  it("calls the willInitialize command", function (next) {
    var TestApplication = Application.extend({
      willInitialize: function (ab) {
        expect(ab).to.be(1);
        next();
      }
    });
    new TestApplication().initialize(1);
  });

  it("calls the didInitialize command", function (next) {
    var TestApplication = Application.extend({
      didInitialize: function (ab) {
        expect(ab).to.be(1);
        next();
      }
    });
    new TestApplication().initialize(1);
  });

  it("can register multiple plugins", function (next) {
    var app = new Application(), i = 0;
    app.use(function () {
      i++;
    }, function () {
      expect(i).to.be(1);
      next();
    })
  });

  it("returns this on .use()", function () {
    var app = new Application();
    expect(app.use()).to.be(app);
  });

  it("emits initialize", function (next) {
    var app = new Application();
    app.once("initialize", function (a, b) {
      expect(a).to.be(1);
      expect(b).to.be(2);
      next();
    });
    app.initialize(1, 2);
  });

  it("has a main application", function () {
    expect(Application.main.constructor.name).to.be("Application");
  })
});
