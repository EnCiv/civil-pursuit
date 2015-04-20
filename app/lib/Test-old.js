! function () {
  
  'use strict';

  require('colors');

  var argumentsToArray = require('syn/lib/arguments-to-array');

  /**
   *  @arg              {String} describer
   *  @arg              {Function} fn
  */

  function Unit (describer, fn) {
    this.describer  =   describer;
    this.fn         =   fn;
  }

  /**
   *  @arg          {[String]} describers
   *  @arg          {Object} serie - List of functions
   *  @return       [Unit] tests
  */

  function toArray (describers, serie) {

    var tests = [];

    for ( var key in serie ) {

      if ( typeof serie[key] === 'function' ) {
        tests.push(new Unit(key, serie[key]));
      }

      else if ( typeof serie[key] === 'object' ) {
        tests = tests.concat(toArray(describers.concat([key]), serie[key]));
      }

    }

    return tests;

  }

  function testUnit (describer, error) {
    console.log(arguments);
  }

  function testUnit2 (error) {

    var section = this.describe.shift().cyan;

    var step = ((counter + 1) + '/' + total).grey;

    var cell = '';

    for ( var i = 0; i < 55; i ++ ) {
      cell += ' ';
    }

    var padding = '';

    for ( i = (section + step).length; i < cell.length; i ++ ) {
      padding += " ";
    }

    var time = Date.now () - chrono;

    var timeColor = 'grey';

    if ( time > 50 ) {
      timeColor = 'magenta';
    }

    if ( time > 250 ) {
      timeColor = 'yellow';
    }

    if ( time > 500 ) {
      timeColor = 'red';
    }

    if ( error ) {
      console.log(section, step, padding, ('✖ ' + this.describe.pop()).bgRed.bold);

      console.log(cell.substr(18), error.message.red.bold);

      error.stack.split(/\r\n/).forEach(function (line) {
        console.log(cell.substr(18), line.yellow);
      });

      if ( typeof cb === 'function' ) {
        cb(error);
      }
    }

    else {

      console.log(section + ' ' + step, padding, ('✔ ' + this.describe.pop()).green, (time.toString() + ' ms')[timeColor]);

      counter ++;

      iterate();
    }
  }

  /** 
   *  @arg            {String} describe
   *  @arg            {Object} serie - List of functions
   *  @arg            {Function} cb
   *  @return         null
  */

  function Suite (describe, serie, cb, listen) {

    console.log('serie', serie)

    var self      =   this;

    if ( typeof listen === 'function' ) {
      listen(self);
    }

    /** @type         [Object] */
    this.results  =   [];

    var counter   =   0;

    /** @type         [Unit] */
    var tests     =   toArray([describe], serie);

    var total     =   tests.length;

    function iterate () {

      if ( tests[counter] ) {

        var chrono = Date.now();

        console.log('test', tests[counter]);

        tests[counter].fn(function (error) {

          self.results[this.describer] = argumentsToArray(arguments);

          if ( ! error ) {
            counter ++;

            iterate();
          }

        }.bind({ describer: tests[counter].describer }));

      }

      else {
        if ( typeof cb === 'function' ) {
          cb(null, self.results);
        }
      }
    }

    process.nextTick(iterate);
  }

  require('util').inherits(Suite, require('events').EventEmitter);

  exports.suite = Suite;

} ();
