! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function revertDB (model, cb) {
    
    var stream = require('fs').createReadStream('data/' + model + '.js');

    var mongoose    =   require('mongoose');

    mongoose.connect(process.env.MONGOHQ_URL);

    var Model = require('syn/models/' + model);

    Model.remove(function (error) {
      if ( error ) throw error;


      stream

        .on('data', function (data) {
          this.data = this.data || '';
          this.data += data.toString();
        })

        .on('end', function () {
          var backup = JSON.parse(this.data);
          require('async').each(backup.documents,
            function (document, done) {
              Model.create(document, function (error, doc) {
                done(null, doc);
              });
            },
            cb);
        });


    });

  }

  module.exports = revertDB;

  revertDB('User', console.log.bind(console));

} ();
