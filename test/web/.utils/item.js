! function () {
  
  'use strict';

  var Domain = require('domain').Domain;

  var config = require('syn/config.json');

  var Type = require('syn/models/Type');
  var Item = require('syn/models/Item');

  require('should');

  function isItem (id, client, done) {
    var domain = new Domain().on('error', done);

    domain.run(function () {

      client

        .isVisible('#item-' + id)

        .isVisible('#item-' + id + '>.item-media-wrapper')

        .isVisible('#item-' + id + '>.item-media-wrapper>.item-media')

        .isVisible('#item-' + id + '>.item-media-wrapper>.item-media img')

        .getAttribute('#item-' + id + '>.item-media-wrapper>.item-media img',
          'src', domain.intercept(function (src) {
            src.should.be.a.String;
            src.should.match(/^https?:/);
          }))

        .isVisible('#item-' + id + '>.item-buttons')

        .isVisible('#item-' + id + '>.item-buttons>button.item-toggle-promote')

        .isVisible('#item-' + id +
          '>.item-buttons>button.item-toggle-promote>.promoted')

        .getText('#item-' + id +
          '>.item-buttons>button.item-toggle-promote>.promoted',
          domain.intercept(function (text) {
            parseInt(text).should.be.a.Number.which.is.above(-1);
          }))

        .isVisible('#item-' + id + '>.item-buttons>button.item-toggle-details')

        .isVisible('#item-' + id +
          '>.item-buttons>button.item-toggle-details>.promoted-percent')

        .getText('#item-' + id +
          '>.item-buttons>button.item-toggle-details>.promoted-percent',
          domain.intercept(function (text) {
            text.should.be.a.String.and.match(/^\d\d?%$/);
            done();
          }));

    });
  }

  module.exports = isItem;

} ();
