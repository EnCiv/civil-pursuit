! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function importModel (model, src, cb) {

    // First find source

    var srcName;

    switch ( src ) {
      case 'alpha':
        srcName = 'synappalpha';
        break;
    }

    require('child_process')
      .exec('heroku config:get MONGOHQ_URL', d.intercept(function () {
        console.log(arguments);
      }));

  }

  module.exports = importModel;

  if ( /import\.js$/.test(process.argv[1]) ) {
    importModel(process.argv[2], process.argv[3], console.log.bind(console));
  }

} ();
