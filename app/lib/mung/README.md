Mung
===

Schema models for MongoDB

# Install

```bash
npm install mung
```

# Connect

```js
import Mung from 'mung';

Mung.connect('mongodb://@localhost');
```

## Connection events

```js
Mung
  // return a new Mung.Connection()
  .connect('mongodb://@localhost')
  // fired up when connection is established or upon reconnected
  .on('connected', () => { /* ... */ })
  // fired up upon disconnection
  .on('disconnected', () => { /* ... */ });
```

## Close connection

```js
Mung.disconnect();
```

## Multiple connections

Mung stores all the connections here : `Mung.connections` which is an array of database connections. By default, Mung always uses the first connection in array if no other is specified.

```js
const { Connection } = Mung;

const conn1 = Connection.connect('mongodb://...');
const conn2 = Connection.connect('mongodb://...');

conn1.disconnect().then((ok, ko) => { /* ... */ });

// Disconnect 2nd connection in array
Mung.connections[1].disconnect();

// Disconnect all connections
Mung.disconnect().then((ok, ko) => { /* ... */ });
```

# Schemas

Define a schema by extending Mung.Model and use the schema static method to return an object that will be used as the schema.

```js
import Mung from 'mung';

class Player extends Mung.Model {
  static schema () {
    return {
      name  : String,
      score : Number
    };
  }
}
```

## Types

Each attribute (field) of your schema must declare its type. If the attribute only needs to declare its type and no other settings, a shorthand notation can be used:

```js
// This:
{
  myField : {
    type : String
  }
}

// can be written such as:

{
  myField : String
}
```

## Native types

The following native or pseudo native types can be used:

```js
[String, Number, Boolean, Date, Mixed, Object]
```

## Subdocuments

```js
{
  subdocument : {
    type : {
      key : String,
      value : Mixed
    }
  }
}
```

Note that subdocuments can not use the type shorthand notation.

## Arrays

```js
{
  scores : [Number], // all elements in array are numbers
  mixed : [Number, String, Mixed], // arrays must be of 3 elements of these types
  subdocs : [{
    key : String,
    value : Mixed
  }]
}
```

## Geospatial type

Shorthand for storing an array of [<longitude>, <latitude>]

```js
{
  location : Mung.Geo
}
```

## Required

```js
{
  username : {
    type : String,
    required : true
  }
}
```

## Default

```js
{
  score : {
    type : Number,
    default : 100
  },

  // You can also use functions provided they are blocking

  edited : {
    type : Date,
    default : Date.now
  }
}
```

## Validate

```js
{
  email : {
    type : String,
    validate : value => /^.+@.+/.test(value)
  },

  scores : {
    type : [Number],
    validate : value => value.every(score => score > 100)
  }
}
```

## References

You can reference an attribute to another model:

```js
class Team extends Mung.Model {
  static schema () {
    return {
      name : String
    };
  }
}

class Player extends Mung.Model {
  static schema () {
    return {
      name : String,
      score : Number,
      team : Team
    };
  }
}
```

## Custom types

You can pass custom type provided they have a `validate` function that return true or false

```js
class Email {
  static validate (value) {
    return /^.+@.+$/.test(value);
  }
}

class User extends Mung.Model {
  static schema () {
    return {
      username : String,
      email : Email
    };
  }
}
```

## Indexes

```js
class Player extends Mung.Model {
  static schema () {
    return {
      username : {
        type : String,
        // Regular index
        index : true
      }
    };
  }
}
```

### Unique

```js
{
  unique : true
}
```

### Named index

```js
{
  index : '2d'
}
```

### Coumpound indexes

```js
class Player extends Mung.Model {
  static schema () {
    return {
      username : {
        type : String,
        unique : ['email']
      },

      email : String
    };
  }
}
```

# Find

```js
Player.find().then(
  players => console.log(players),
  error => console.log(error.stack)
);
```

## Find query

You can pass regular MongoDB queries along with MongoDB operators:

```js
Player.find({ name : 'John', score : { $gt : 100 } });
```

## Limit, skip and order

These can be specified as a second argument

```js
Player.find({ score : 100 }, { limit : 10, skip : 100, order : { score : -1 } });
```

## Find sugars

```js
Player.findOne({ score : 100 });
Player.findById(ObjectId);
```
