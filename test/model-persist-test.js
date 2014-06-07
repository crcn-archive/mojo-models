var models  = require(".."),
Application = require("mojo-application"),
expect      = require("expect.js");

describe("model-load#", function () {

  var app = new Application();
  app.use(models);

  it("applies crud methods when .persist() is present", function () {
    var Model = models.Base.extend({
      persist: {

      }
    });

    var m = new Model({}, app);
    m.load();
    m.save();
  });

  it("passes the context of the model to crud methods", function () {
    var i = 0;
    var m, Model = models.Base.extend({
      persist: {
        create: function () {
          expect(this).to.be(m);
          i++;
        },
        read: function () {
          expect(this).to.be(m);
          i++;
        },
        update: function () {
          expect(this).to.be(m);
          i++;
        },
        del: function () {
          expect(this).to.be(m);
          i++;
        }
      }
    });

    m = new Model({}, app);
    m.load();
    m.save();
    m.set("data", {});
    m.save();
    m.remove();
    expect(i).to.be(4);
  });

  it("calls persist as a function with the model", function (next) {
    var Model = models.Base.extend({
      persist: function () {
        next();
      }
    }); 

    var m = new Model(null, app);
  });


});