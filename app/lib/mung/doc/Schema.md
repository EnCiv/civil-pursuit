Mung / Schema
===

# Type

# Embedded documents

Just declare the document in the type:

```js
{
  embedded : {
    type : {
      foo : Number,
      bar : String
    }
  }
}
```

Use the embed method for short-hand notations :

```js
{
  embedded : Mung.embed({
    foo : Number,
    bar : String
  })
}
```

# Arrays

Arrays of embedded subdocuments:

```js
{
  embedded : [{
    type : {
      foo : Number,
      bar : String
    }
  }]
}
```

# Required

# Default

# Validate

# Private

# Index
