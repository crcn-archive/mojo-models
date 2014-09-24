## Mojo Models [![Build Status](https://travis-ci.org/classdojo/mojo-models.svg)](https://travis-ci.org/classdojo/mojo-models)

### Features

- virtual properties allow you to load 


## API

### Base(properties, application)

Creates a new model

```javascript
var models = require("mojo-models");
var model = new models.Base({ message: "Hello world!" });
console.log(model.message);
```

#### base.data

The raw data set on the model - this is usually transformed into something the model can 
use via `deserialize`. 

```javascript
var model = new models.Base({ data: { message: "Hello world!" }});
consol.log(model.message); // Hello world!
console.log(model.data); // { message: "Hello world!" }
```

#### base.deserialize(data)

deserializes data once `data` is set on the model

```javascript


var Person = models.Base.extend({
  deserialize: (data) {
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: data.firstName + " " + data.lastName
    }
  }
});

var person = new Person({
  data: {
    firstName: "Craig",
    lastName: "Condon"
  }
});

console.log(person.fullName); // Craig Condon

person.set("data", { 
  firstName: "A",
  lastName: "B"
});

console.log(person.fullName); // A B
```

#### base.serialize()

serializes data. This is an alias to `toJSON`

### Collection(properties, application)

## Built-in plugins

#### virtuals

#### bindings

#### persist

## Application API
