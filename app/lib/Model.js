! function () {
  
  'use strict';

  

  var root = process.cwd();

  var path = require('path');

  function Models () {
  }

  Models.ls = function (cb) {
    var ls = [];

    require('syn/lib/domain/next-tick')(cb, function (domain) {
      require('fs').readdir(path.join(root, 'app/business/models'),
        domain.intercept(function (files) {
          ls = files
            .filter(function (file) {
              return /\.js$/.test(file);
            })
            .map(function (file) {
              return file.replace(/\.js$/, '');
            })
            .map(function (model) {

              var Model = require('syn/models/' + model);

              console.log('mOOOOOOdel', Model.schema);
              
              var structure = {};

              for ( var i in Model.schema.paths ) {

                structure[i] = {};

                for ( var k in Model.schema.paths[i] ) {
                  structure[i][k] = Model.schema.paths[i][k];
                }

                if ( typeof structure[i].defaultValue === 'function' ) {
                  structure[i].defaultValue = structure[i].defaultValue.name;
                }

                if ( ! structure[i].instance && structure[i].options.type ) {
                  structure[i].instance = structure[i].options.type.name;
                }
              }

              var statics = {};

              for ( var i in Model.schema.statics ) {
                statics[i] = i;
              }

              return {
                name    :   model,
                schema  :   structure,
                statics :   statics
              };
            });
          cb(null, ls);
        }));
    });
  }

  module.exports = Models;

} ();
