## Mojo Models [![Build Status](https://travis-ci.org/classdojo/mojo-models.svg)](https://travis-ci.org/classdojo/mojo-models)

### Features

- virtual properties allow you to load 


## API

### Base(properties, application)

Creates a new model

#### base.data

#### base.deserialize(data)

deserializes data once `data` is set on the model

```javascript

var models = require("mojo-models");

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
