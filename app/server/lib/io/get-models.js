! function () {

  'use strict';

  

  var Model = require('syn/lib/Model');

  function getModels () {

    var socket = this;

    function onDomainError (error) {
      socket.app.arte.emit('error', error);
    }

    function run (domain) {
      Model.ls(domain.intercept(function (models) {
        socket.emit('models', models);
      }));
    }

    require('syn/lib/domain')(onDomainError, run);

  }

  module.exports = getModels;

} ();
