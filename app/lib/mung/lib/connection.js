'use strict';

import { EventEmitter }     from 'events';
import mongodb              from 'mongodb';
import Mung                 from './mung';

class Connection extends EventEmitter {

  constructor () {
    super();
  }

  disconnect () {
    return new Promise((ok, ko) => {
      try {
        this.db.close().then(() => {
          this.emit('disconnected');
          ok();
        }, ko);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static connect (url) {
    let connection = new Connection();

    Mung.connections.push(connection);

    mongodb.MongoClient.connect(url, (error, db) => {
      if ( error ) {
        return Mung.events.emit('error', error);
      }

      connection.connected = true;

      connection.db = db;

      connection.emit('connected');

      Mung.events.emit('connected', connection);
    });

    return connection;
  }

  static disconnect () {
    let connections = Mung.connections;

    return Promise.all(connections.map(connection => connection.disconnect()));
  }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Mung.connections = [];

Mung.connect = Connection.connect.bind(Connection);
Mung.disconnect = Connection.disconnect.bind(Connection);
