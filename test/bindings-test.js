var models  = require(".."),
Application = require("mojo-application"),
expect      = require("expect.js");

describe("model-bindings#", function () {

  var app = new Application();
  app.use(models);

  it("can add a binding to a model", function (next) {
    var Model = models.Base.extend({
      bindings: {
        "firstName, lastName": {
          "fullName": {
            "map": function (firstName, lastName) {
              return firstName + " " + lastName;
            }
          }
        }
      }
    });

    var m = new Model({firstName: "Craig", lastName: "Condon"}, app);


    // todo - needs to be immediate
    setTimeout(function () {
      expect(m.fullName).to.be("Craig Condon");
      next();
    }, 100);
  });
});