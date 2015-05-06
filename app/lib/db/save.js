! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  // null saveDB (Function cb)


  function saveDB (cb) {
    var fs          =   require('fs');
    var async       =   require('async');
    var Domain      =   require('domain').Domain;
    var mongoose    =   require('mongoose');

    mongoose.connect(process.env.MONGOHQ_URL);
    
    var models = ['Config', 'Country', 'Error', 'Item', 'User', 'Vote',
      'Criteria', 'Feedback', 'Type'];

    var d = new Domain().on('error', cb);

    var o = 0;

    models.forEach(function (model) {
      setTimeout(function () {
        saveModel(model, function () {

        });
      }, (o = o + 1000));
    });

    function saveModel (model, done) {
      var Model = require('syn/models/' + model);
      var stream = fs.createWriteStream('data/' + model + '.js');
      var save = {
        starts      :   Date.now(),
        documents   :   []
      };

      Model.count(d.intercept(function (size) {

        save.size = size;

        var split = Math.ceil(size / 1000);

        save.chunks = split;

        for ( var i = 0; i < split; i += 1000 ) {
          setTimeout(function () {

            Model
              .find()
              .skip(this.i)
              .limit(1000)
              .sort({ _id: 1 })
              .exec(d.intercept(function (models) {
                save.documents = save.documents.concat(models);
                
                if ( i >= split ) {

                  save.end = Date.now();

                  stream
                    .write(JSON.stringify(save, null, 2));

                  stream
                    .end();

                  console.log('OK', model);
                }

              }));
            }.bind({ i: i }), i + 1000);
        }
      }));
    }
  }

  module.exports = saveDB;

  saveDB(function (error, orElse) {
    if ( error ) {
      console.log(error.stack.split(/\n/))
    }
    else {
      console.log(orElse)
    }
  })

  

} ();
