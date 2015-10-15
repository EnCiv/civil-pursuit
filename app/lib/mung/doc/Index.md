Mung / indexes

===

We try to stay as fidel as possible to MongoDB index design. Please refer to MongoDB official documentation for more in-depth information.

# Indexes

You specify indexes directly in schema:

```js
class Player extends Mung.Model {
  static schema () {
    return {
      name : {
        type : String,
        index : true
      }
    };
  }
}
```

# Index options

```js
class Player extends Mung.Model {
  static schema () {
    return {
      name : {
        type : String,
        index : {
          // here you can pass any standard MongoDB options
          background : true
        }
      }
    };
  }
}
```

You can pass any standard MongoDB options plus these two Mung options:

- fields (see below about coumpound)
- sort (by default 1, for ascending order. You can set it to -1 for descending orders)
- type (to specify an index type, see below)

# Unique

To specify a unique index:

```js
{
  unique : true
}
```

# Index type

You can pass the index type as a string:

```js
{
  index : 'hashed'
}
```

Or in the options via the type attribute:

```js
{
  index : {
    type : '2d'
  }
}
```

# Coumpound indexes

Pass an array of fields to be indexed with the one declared

```js
class Player extends Mung.Model {
  static schema () {
    return {
      name : {
        type : String,
        unique : ['team'] // creates compound index [name, team]
      },

      team : Team
    };
  }
}
```

# Compound indexes with options

You can pass options to compound indexes such as:

```js
class Player extends Mung.Model {
  static schema () {
    return {
      name : {
        type : String,
        unique : {
          fields : ['team'],
          // here you can pass any standard MongoDB options
          dropDups : true
        }
      },

      team : Team
    };
  }
}
```

# Index in subdocument

You can index subdocument:

```js
{
  subdocument : Mung.embed({
    foo : {
      type : String,
      index : true
    }
  })
}
```

# Index in array of subdocuments

```js
{
  subdocument : [{
    foo : {
      type : String,
      index : true
    }
  }]
}
```

`fields` can be an object if you want to specify a descending order:

```js
{
  unique : {
    fields : { team : -1 },
    // here you can pass any standard MongoDB options
    expireAfterSeconds : 1000
  }
}
````

# Unique non-embedded arrays

If your array is made of non-embedded documents (ie, [1, 2, 3]), you can not index them inside the array's context (by design from MongoDB).

For example:

```js
{
  array : {
    type : [Number],
    unique : true
  }
}
```

This means that documents can not have the same arrays:

```js
Document.insert({ array : [1] });
Document.insert({ array : [1] }); // unique error : there is already a document with the same array
```

Now let's say you want array to have only distinct unique values, you can use `distinct`;

```js
{
  array : {
    type : [Number],
    distinct : true
  }
}

document.push('array', 1); // OK
document.push('array', 1); // false! there is already a 1 in the array
```

Note that this does not create an index but ensure a check made directly in Mung.

# When are indexes built?

Indexes are built when you run migrations:

```js
/** {Promise} */ Player.migrate(); // will build indexes
```

# Manually build indexes

You can build indexes manually such as:

```js
/** {Promise} */ Player.buildIndexes();
```

# Drop index

Specify the field which contains the index

```js
Player.dropIndex(...<field>);
```

# Reindex

```js
Player.reIndex(...<field>);
```

# Full text wildcard

To use a full text wildcard outside a compound index:

```js
class Tweets extends Mung.Model {
  static schema () {
    return {
      /* ... */
    };
  }

  static indexes () {
    return [{ "$**": "text" }];
  }
}
```
