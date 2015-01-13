! function () {

  'use strict';

  var done = 0;
  var todo = 0;

  function checkIfOk () {
    var ok = this.assert();

    if ( ok ) {
      console.info('%c [TEST]  OK!  ' + this.title,
        'background: green; color: #fff; font-size: 150%');

      done ++;
    }
    else {
      console.warn('%c [TEST]  KO!  ' + this.title,
        'background: orange; color: #fff; font-size: 150%');
    }

    if ( done === todo ) {
      console.info('%c OH YEAH BABY YEAH!',
        'color: green; font-size: 300%');

      setTimeout(function () {
        history.back();
      }, 4000);
    }
  }

  function mothership (tests) {

    todo = tests.length;

    console.log('%c [TEST] RUNNING TEST #' + story + '   "' + mothership_stories[0].stories[story] + '"', 'background: #369; color: #fff; font-weight: bold; font-size: 200%');

    tests.forEach(function (test) {
  
      if ( test.before ) {
        if ( test.waitBefore ) {
          setTimeout(function () {
            test.before();

            if ( test.wait ) {
              setTimeout(checkIfOk.bind(test), test.wait);
            }
            else if ( test.when ) {
              if ( 'emitter' in test.when && 'receives' in test.when ) {
                if ( test.when.saveAs ) {
                  test.when.emitter.on(test.when.receives, function (message) {
                    test[test.when.saveAs] = message;
                    checkIfOk.apply(test);
                  });
                }
                else {
                  test.when.emitter.on(test.when.receives, checkIfOk.bind(test));
                }
              }
            }
            else {
              checkIfOk.apply(test);
            }

          }, test.waitBefore);
        }

        else {
          test.before();

          if ( test.wait ) {
            setTimeout(checkIfOk.bind(test), test.wait);
          }
          else {
            checkIfOk.apply(test);
          }
        }
      }

      else if ( test.wait ) {
        setTimeout(checkIfOk.bind(test), test.wait);
      }

      else if ( test.when ) {
        if ( 'emitter' in test.when && 'receives' in test.when ) {
          if ( test.when.saveAs ) {
            test.when.emitter.on(test.when.receives, function (message) {
              test[test.when.saveAs] = message;
              checkIfOk.apply(test);
            });
          }
          else {
            test.when.emitter.on(test.when.receives, checkIfOk.bind(test));
          }
        }
      }

      else {
        checkIfOk.apply(test);
      }
    });
  }

  window.mothership = mothership;

} ();
