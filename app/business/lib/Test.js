! function () {
  
  'use strict';

  require('colors');

  function toArray (describe, serie) {

    var tests = [];

    for ( var key in serie ) {

      if ( typeof serie[key] === 'function' ) {
        tests.push({
          describe: describe.concat([key]),
          fn: serie[key]
        });
      }

      else if ( typeof serie[key] === 'object' ) {
        tests = tests.concat(toArray(describe.concat([key]), serie[key]));
      }

    }

    return tests;

  }

  module.exports = {
    suite: function (describe, serie, cb) {

      var counter = 0;

      var tests = toArray([describe], serie);

      var total = tests.length;

      function iterate () {
        if ( tests[counter] ) {

          var chrono = Date.now();

          tests[counter].fn(function (error) {

            var section = this.describe.shift().cyan;

            var step = ((counter + 1) + '/' + total).grey;

            var cell = '';

            for ( var i = 0; i < 40; i ++ ) {
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

          }.bind({ describe: tests[counter].describe }));
        }

        else {
          if ( typeof cb === 'function' ) {
            cb();
          }
        }
      }

      iterate();
    }
  };

} ();
