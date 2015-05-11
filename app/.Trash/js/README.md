Synapp
======

This is the JS framework for the app.

# Design principles

## CommonJS

Synapp uses CommonJS's require module. Browserify is used to emulate `require` in the browser.

```js
var Synapp = require('synapp-js');
```

## Global

Synapp attaches itself to `window` so it can be accessed globally - thought that might change, so prefer the syntax above rather than the one below.

```js
require('synapp-js');
!! Synapp; // true
```

## Unique

Even though `Synapp` is a class, you should only have **one instance of new Synapp()** in your runtime.

## Object

Synapp is an object that must be instantiated in a page component (found in [pages](pages/)). **Instance must be global and have the name app**.

```js
var Synapp = require('synapp-js');
window.app = new Synapp();
```

## Events emitter

Synapp inherits from the EventEmitter object so it can emit and listen to events.

```js
var Synapp = require('synapp-js');
window.app = new Synapp();

// Example on how to listen to/emit events

app .on('hello', console.log('hello'))
    .emit('hello');
```

## Errors

Errors are passed to the emitter. **Errors must be listened to**

```js
var Synapp = require('synapp-js');
window.app = new Synapp();

// Make sure you listen to errors

app.on('error', function (error) {
    // Do something about error
});
```

## Domain

You can use `app.domain` to safe-run code:

```js
app.domain.run(function () {
    // Errors will be emitted
});

app.domain.intercept(function () {
    // If first argument is an error, it is emitted
    // Otherwise this is run ...
});
```

## Socket

**Each instance of Synapp is creating a new connection to Web Socket**. The socket connection is saved in the `socket` property.

## Ready

Once the new instance has established connection with the Web Socket Server, it emits a "ready" event, meaning the app is ready to be "composed".

```js
var Synapp = require('synapp-js');
window.app = new Synapp();

app.on('error', function (error) {
    // Do something about error
});

app.on('ready', function () {
    // Do something
});

// You could also use sugar ready() method
app.ready(function () {
    // Send something to WS
    app.socket.emit('hello there!');
});
```