Mung / Document
===

Documents are the objects representing a collection's documents.

# Creating document

Consider you have a model called Player:

```js
class Player extends Mung.Model {
  static schema () {
    return {
      name : String,
      score : {
        type : Number,
        default : 100
      }
    };
  }
}
```

You can create a new document such as:

```js
const player = new Player({ name : 'Joe' });
```

You can also retrieve document from Model CRUD operations:

```js
Player.findOne().then(
  player => assert(player instanceof Player) // true
);

Player.updateOne({ name : 'Joe' }, { score : 150 }).then(
  player => assert(player instanceof Player) // true
);

Player.create({ name : 'Joe' }).then(
  player => assert(player instanceof Player) // true
);
```

# Instantiate

# Modify

## Set

## Array modifiers

### Push

```js
class Foo extends Mung.Model {
  static schema () {
    return {
      numbers : [Number],
      arrayInSubdocument : {
        type : {
          strings : [Strings]
        }
      }
    };
  }
}

const foo = new Foo();

foo.push('numbers', 1, 2, 3);

console.log(foo.numbers); // [ 1, 2, 3 ]

foo.push('arrayInSubdocument.strings', 'hello');

console.log(foo.arrayInSubdocument.strings); // ['hello']
```

# Save

## Insert

## Update

# Delete

# Populate

# Serialize

If you want to convert the document to a JSON object, call the `toJSON` method. It will convert ObjectIDs into strings.

```js
Player.create({ name : 'Joe' }).then(
  player => {
    assert(player._id instanceof Mung.ObjectId); // true

    const json = player.toJSON();

    assert(typeof json._id === 'string'); // true
  }
);
```

## JSON options

### Timestamps

If you want the timestamp to be calculated from the ObjectID and passed as a JSON property, specify it as such:


```js
const json = player.toJSON({ timeStamp : true });
// Now you can access the timestamp via the __timeStamp property
assert(json.__timeStamp instanceof Date);
```

### Populate

If you want the populated fields to show up in the JSON serialization, you must first populate the document via its `populate()` method and then set `populate : true` in `toJSON` options:

```js
player.toJSON({ populate : true });
```
