'use strict';

import colors from 'colors';
import fs from 'fs';
import printTime from 'syn/lib/util/print-time';

class Log {

  constructor (namespace) {
    this.namespace = namespace;
  }

  colorify (message, ...options) {
    if ( typeof window === 'undefined' ) {
      let _uncolored = message.split('').join('');
      
      for ( let option of options ) {
        message = message[option];
      }

      return {
        message   :   message,
        toString  :   function () {
          return this.message.toString();
        },
        _uncolored :  _uncolored
      };
    }
  }

  log (...messages) {
    let msg = {
      date      :   new Date(),
      namespace :   this.namespace,
      messages  :   messages.map(message => {
        
        if ( message && message._uncolored ) {
          console.log(printTime().join(':').magenta, this.namespace.grey, message.toString());
          return message._uncolored;
        }

        else {
          console.log(message);
        }

        return message;
      })
    };

    Log.stream.write(JSON.stringify(msg, null, 2));
  }

  loading (text, ...more) {
    text = this.colorify('⌛ ' + text, 'cyan');
    this.log(text, ...more);
  }

  success (text, ...more) {
    text = this.colorify('✔ ' + text, 'green');
    this.log(text, ...more);
  }

  info (text, ...more) {
    text = this.colorify(text, 'blue');
    this.log(text, ...more);
  }

  error (error) {
    let err = {
      name      :   error.name,
      message   :   error.message,
      code      :   error.code,
      stack     :   error.stack.split(/\n/)
    };

    this.log(this.colorify('✖ LOG ERROR', 'red'));
  }

}

Log.stream = fs.createWriteStream('/tmp/logs.txt', { flags: 'a+' });

export default Log;