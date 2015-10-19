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
