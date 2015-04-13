! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  var Model = src('lib/Model');

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

    src.domain(onDomainError, run);

  }

  module.exports = getModels;

} ();
