! function () {
  
  'use strict';

  var should = require('should');

  var Test = require('syn/lib/Test');

  module.exports = function mockSocket (done) {

    var socket = require('./socket').client;

    Test

      .suite(

        'Socket mockup',

        {

          'should be an events emitter': function (done) {
            socket.should.be.an.instanceof(require('events').EventEmitter);
            done();
          },

          'should have a pronto property': function (done) {
            socket.should.have.property('pronto');
            done();
          },

          'pronto should be an events emitter' : function (done) {
            socket.pronto.should.be.an.instanceof(require('events').EventEmitter);
            done();
          },

          'should have a domain property which is a Domain': function (done) {
            socket
              .should.have.property('domain')
              .which.is.an.instanceof(require('domain').Domain);

            done();
          },

          'should have a handshake': function (done) {
            socket
              .should.have.property('handshake')
              .which.is.an.Object;

            done();
          },

          'should have a handshake headers': function (done) {
            socket.handshake
              .should.have.property('headers')
              .which.is.an.Object;

            done();
          },

          'should have a handshake headers host': function (done) {
            socket.handshake.headers
              .should.have.property('host')
              .which.is.a.String
              .and.eql('localhost:3012');

            done();
          }

        },

        done

      );

  };

} ();
