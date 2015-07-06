'use strict';

!(function () {

  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = ['async', 'syn/lib/util/to-human', 'colors'];

  /**
   *  @arg        [Function] serie
   *  @arg        Function done
   *  @return     null
  */

  function App_Lib_Test(serie, done) {

    di(done, deps, function Test(domain, async, toHuman) {

      var series = [];

      var total = serie.length;

      var passed = 0;

      series = serie.map(function (test) {

        return function (done) {
          var name = toHuman(test.name.replace(/____/g, ' | ').replace(/__/g, ' > '));

          console.log('  ? '.bold.white + name.grey);

          test(domain.bind(function (error) {

            if (error) {
              console.log(('  × '.bold + name).red);
              error.stack.split(/\n/).forEach(function (line) {
                console.log(line.yellow);
              });

              done(error);
            } else {
              passed++;
              console.log(('  ✔ '.bold + name).green);
              done();
            }
          }));
        };
      });

      async.series(series, domain.intercept(function (results) {
        // console.log(total, passed);
        done(null, results);
      }));
    });
  }

  module.exports = App_Lib_Test;
})();