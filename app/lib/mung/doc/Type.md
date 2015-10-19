Mung / Types
===

# Usage

At the heart of making a schema for a schemaless database such as MongoDB are types. They are the equivalent of the types in a traditional relational database model (INT, VARCHAR, etc.).

Since MongoDB works well with JavaScript syntax, you can use JavaScript primitive types to declare your fields types. Let's say your users collection are made of documents composed of a username and a password. Both are string and be declared in your app such as:

```js
class User extends Mung.Model {
  static schema () {
    return {
      username : String,
      password : String
    }
  }
}
```

This will ensure all your usernames and passwords will be strings.

On top of [JavaScript native types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types), we offer custom types to make your life easier. You can also create your own types. We also offer multi-type supports (see `types`).

## Note

You can view a complete summary of type acceptance by running the test `mocha --compilers js:babel/register test/convert.js test/validate.js` to see results for convert and validate.

# Supported types

- Number
- String
- Boolean
- Date
- Object
- Error
- Regexp
- Mung.Mixed
- Mung.Hex
- Mung.Binary
- Mung.Octal
- Mung.ObjectID
- Mung.Location

Note that these types can be declared inside an array or an object (see below). Note also that you can create your custom types.

# Number

Will accept only numbers but will try to convert any givem values into numbers (unless the attribute `convert` is set to `false` or to a function that evaluates to `false`).

```js
{
  field : Number
}
```

Will accept only numbers validated by the `Mung.Number` class `validate` method (see [_Number class](../lib/mung.js)). If `convert` is not set to false (and by default it is not), Mung will attempt to convert values to numbers using the `+` tick. This is native in JavaScript so please refer to ECMA official docs about the specificities. For example, a non-numeric string (`+'hello'`) will fail to convert to a number, while an array will succeed because its length is returned (`+[]` returns 0, which is the array length). If convert fails, an exception is thrown and the operation fails.

# String
