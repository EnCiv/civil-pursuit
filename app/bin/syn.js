#!/usr/bin/env node

! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  require('mongoose').connect(process.env.MONGOHQ_URL);

  require('mongoose').connection.on('connected', function () {
    switch ( process.argv[2] ) {
      default:
        console.log('syn models <Model> <action>');
        break;

      case 'models':

        switch ( process.argv[3] ) {
          case 'Item':

            switch ( process.argv[4] ) {

              case 'findById':

                var _id = process.argv[5];

                src('models/Item').findById(_id, function (error, item) {
                  if ( error ) {
                    throw error;
                  }
                  console.log(item);
                  process.exit(0);
                });

                break;

              case 'evaluate':

                var item = process.argv[5];

                src('models/Item').evaluate(item, function (error, evaluation) {
                  if ( error ) {
                    throw error;
                  }
                  console.log(evaluation);
                  process.exit(0);
                });

                break;
            }

            break;
        }

        break;
    }
  });

} ();
