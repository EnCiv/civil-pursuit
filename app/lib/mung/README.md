Mung
===

Schema models for MongoDB

# Install

```bash
npm install mung
```

# Overview

`Mung` is a library to create models for MongoDB with the following key features in mind:

- ES6 class syntax
- Migration
- Robust type validation
- Promise support

# Usage

```js
import Mung from 'mung';

class Team extends Mung.Model {
  static schema () {
    return {
      name : {
        type : String,
        required : true,
        unique : true
      }
    };
  }
}

class Player extends Mung.Model {
  static schema () {
    return {
      name : {
        type : String,
        required : true,
        unique : true,
        validate : name => name.length >= 4 && name.length <= 16
      },

      team : {
        type : Team,
        index : true,
        required : true
      },

      score : {
        type : Number,
        default : 100
      }
    };
  }
}

// New user in red team

Team
  .findOne({ name : 'red'})
  .then(team => {
    User.create({ name : 'dude' , team });
  });

```
