Mung / Schema
===

# Attributes

These are the attributes a field can declare:

- `type {Function|Array|Object}`
- `required {Boolean|Function}`
- `index {Boolean|String|Object|Array|Function}`
- `unique {Boolean|String|Object|Array|Function}`
- `default {Mixed|Function}`
- `validate {Mixed|Function}`
- `distinct {Boolean|Function}`
- `null {Boolean|Function}`
- `convert {Boolean|Function}`

## `type`

View [types](./Type.md).

## `required`

- Boolean

If set to true, that means the field must be defined when inserting a new document. Since it defaults to false, you don't need to declare it if field is not required.

```js
{
  foo : {
    required : true
  }
}
```


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
