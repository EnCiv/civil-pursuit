! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'async',
    'syn/lib/util/arguments-to-array',
    'syn/lib/util/to-human',
    'colors'
  ];

  /**
   *  @arg        [Function] serie
   *  @arg        Function done
   *  @return     null
  */

  function App_Lib_Test (serie, done) {
    
    di(done, deps, function Test (domain, async, argsToArray, toHuman) {

      var series = [];

      series = serie.map(function (test) {

        return function (done) {
          var name = toHuman(test.name
            .replace(/____/g, ' | ')
            .replace(/__/g, '/'));

          console.log(('  ? '.bold.white + name.grey));

          test(domain.bind(function (error) {

            if ( error ) {
              console.log(('  × '.bold + name).red);
              error.stack.split(/\n/).forEach(function (line) {
                console.log(line.yellow);
              });

              done(error);
            }

            else {
              console.log(('  ✔ '.bold + name).green, argsToArray(arguments));
              done();
            }

          }));
        };

      });

      async.series(series, done);

    });

  }

  module.exports = App_Lib_Test;

} ();
