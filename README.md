```javascript
var models = require("mojo-models");

var User = models.Base.extend({
  bindings: {
    "firstName, lastName": {
      "fullName": {
        "map": function (firstName, lastName) {
          return firstName + " " + lastName;
        }
      }
    }
  },
  deserialize: function (data) {
    return {
      firstName : data.first_name,
      lastName  : data.last_name
    };
  }
});

var u = new User({ 
  data: {
    first_name : "Jon",
    last_name  : "Smith"
  }
});

console.log(u.data); // { first_name: "Jon", last_name: "Smith" }
console.log(u.firstName); // Jon
console.log(u.lastName); // Smith
```