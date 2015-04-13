! function () {
  
  'use strict';

  var Synapp    =   require('../Synapp');

  window.app = new Synapp();

  var template = {
    schemaTable   :   '<table class="schema-table"><thead><tr><th>Name</th><th>Type</th><th>Required</th><th>Default</th><th>Validation</th><th>Indexes</th></tr></thead><tbody></tbody></table>',

    staticsList   :   '<div class="row"><div class="static-name phone-50"></div><div class="static-button phone-50"><button class="primary block">Test</button></div></div>'
  };

  function $Model (model) {
    var $model = $('<section class="model"></section>');
    
    $model.append($('<h3><i class="fa fa-chevron-down"></i><span class="model-name"></span></h3>'));

    $model.append($('<h4><i class="fa fa-chevron-down"></i>Schema</h4>'));

    $model.append($(template.schemaTable));

    $model.append($('<h4><i class="fa fa-chevron-down"></i>Statics</h4>'),
      $('<div class="statics-list"></div>'));

    /***/

    $model.find('.model-name').text(model.name);

    $Schema(model.schema).forEach(function (row) {
      $model.find('.schema-table tbody:first').append(row);
    });

    $Statics(model.statics).forEach(function (row) {
      $model.find('.statics-list').append(row);
    });

    return $model;
  }

  function $Statics (statics) {
    var row, rows = [];

    console.info(statics);

    for ( var _static in statics ) {
      row = $(template.staticsList);

      row.find('.static-name').text(require('string')(_static).humanize().s);

      rows.push(row);
    }

    return rows;
  }

  function $Schema (schema) {
    var row, rows = [];

    for ( var field in schema ) {

      if ( schema[field].instance ) {
        row = $('<tr><th class="field-name"></th><td class="field-type"></td><td class="is-required"><i class="fa"></i></td><td class="field-default"><i class="fa"></i></td><td>...</td><td>...</td></tr>');

        row.find('.field-name').text(field);
        row.find('.field-type').text(schema[field].instance);

        if ( schema[field].isRequired ) {
          row.find('.is-required i').addClass('fa-check').css({ color: 'green' });
        }
        else {
          row.find('.is-required i').addClass('fa-times').css({ color: 'red' });
        }

        if ( schema[field].defaultValue ) {
          row.find('.field-default i').remove();
          row.find('.field-default').text(schema[field].defaultValue);
        }
        else {
          row.find('.field-default i').addClass('fa-times').css({ color: 'red' });
        }
      }

      else if ( schema[field].schema ) {
        row = $('<tr><th class="field-name"></th><td colspan="5" class="sub-document"></td></tr>');

        row.find('.field-name').text(field);

        var table = $(template.schemaTable);

        $Schema(schema[field].schema.paths).forEach(function (_row) {
          table.find('tbody:first').append(_row);
        });

        row.find('.sub-document').append(table);
      }

      rows.push(row);
    }

    return rows;
  }

  app.ready(function onceAppConnects_HomePage () {
    
    app.socket
      .on('models', function (models) {
        console.log('models', models);

        models.forEach(function (model) {
          $('.models').append($Model(model));
        });
      })
      .emit('get models');

  });

} ();
