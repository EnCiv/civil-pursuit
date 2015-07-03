! function () {
  
  'use strict';

  var Domain = require('domain').Domain;

  var config = require('syn/config.json');

  var Type = require('syn/models/type');
  var Item = require('syn/models/item');

  var mongoUp = require('syn/lib/util/connect-to-mongoose');

  require('should');

  function isItem (id, client, done) {
    var domain = new Domain().on('error', done);

    domain.run(function () {

      // console.log('is item?', id)

      Item

        .findById(id)

        .exec().then(function (item) {
          item.toPanelItem(checkYourself);
        });

      function checkYourself (error, item) {

        if ( error ) return done(error);

        client

          .pause(0, function () {
            console.log()
            console.log("\t  ##".grey)
            console.log(["\t  ## ", item.subject.bold, item.id.italic].join(' ').grey);
            console.log("\t  ##".grey);
            console.log();
          })

          .isVisible('#item-' + id, domain.intercept(function (isVisible) {
            console.log("\t  ✓".green, ('item#' + item.id + ' is visible').grey);
          }))

          /////////////////////////////////////////////////////////////////////

          //  ITEM MEDIA

          /////////////////////////////////////////////////////////////////////

          .isVisible('#item-' + id + '>.item-media-wrapper', domain.intercept(function (isVisible) {
            console.log("\t  ✓".green, ('item#' + item.id + ' > media wrapper is visible').grey)
          }))

          .isVisible('#item-' + id + '>.item-media-wrapper>.item-media', domain.intercept(function (isVisible) {
            console.log("\t  ✓".green, ('item#' + item.id + ' > media is visible').grey);
          }))

          .isVisible('#item-' + id + '>.item-media-wrapper>.item-media img', domain.intercept(function (isVisible) {
            console.log("\t  ✓".green, ('item#' + item.id + ' > media image is visible').grey);
          }))

          .getAttribute('#item-' + id + '>.item-media-wrapper>.item-media img',
            'src', domain.intercept(function (src) {
              src.should.be.a.String;
              src.should.match(/^https?:/);

              if ( item.image && /^https?:/.test(item.image) ) {
                src.should.be.exactly(item.image);
              }

              console.log("\t  ✓".green, ('item#' + item.id + ' > image source is the good one').grey);
            }))

          /////////////////////////////////////////////////////////////////////

          //  ITEM SUBJECT

          /////////////////////////////////////////////////////////////////////

          .getText('#item-' + id + '>.item-text .item-subject',
            domain.intercept(function (text) {
              text.should.be.exactly(item.subject);
              console.log("\t  ✓".green, ('item#' + item.id + ' > subject is the good one').grey);
            }))

          /////////////////////////////////////////////////////////////////////

          //  ITEM BUTTONS

          /////////////////////////////////////////////////////////////////////

          .isVisible('#item-' + id + '>.item-buttons', domain.intercept(function (isVisible) {
            console.log("\t  ✓".green, ('item#' + item.id + ' > buttons is visible').grey)
          }))

          /////////////////////////////////////////////////////////////////////

          //  TOGGLE PROMOTE

          /////////////////////////////////////////////////////////////////////

          .isVisible('#item-' + id + '>.item-buttons>button.item-toggle-promote', domain.intercept(function (isVisible) {
            console.log("\t  ✓".green, ('item#' + item.id + ' > toggle promote is visible').grey)
          }))

          /////////////////////////////////////////////////////////////////////

          //  PROMOTIONS COUNT

          /////////////////////////////////////////////////////////////////////

          .isVisible('#item-' + id +
            '>.item-buttons>button.item-toggle-promote>.promoted', domain.intercept(function (isVisible) {
            console.log("\t  ✓".green, ('item#' + item.id + ' > Promotion Counter is visible').grey);
          }))

          .getText('#item-' + id +
            '>.item-buttons>button.item-toggle-promote>.promoted',
            domain.intercept(function (text) {
              parseInt(text).should.be.a.Number.which.is.above(-1);
              console.log("\t  ✓".green, ('item#' + item.id + ' > Promotion Counter is a number greater than 0').grey);
            }))

          /////////////////////////////////////////////////////////////////////

          //  TOGGLE DETAILS

          /////////////////////////////////////////////////////////////////////

          .isVisible('#item-' + id + '>.item-buttons>button.item-toggle-details', domain.intercept(function (isVisible) {
            console.log("\t  ✓".green, ('item#' + item.id + ' > Toggle Details is visible').grey);
          }))

          /////////////////////////////////////////////////////////////////////

          //  POPULARITY

          /////////////////////////////////////////////////////////////////////

          .isVisible('#item-' + id +
            '>.item-buttons>button.item-toggle-details>.promoted-percent', domain.intercept(function (isVisible) {
            console.log("\t  ✓".green, ('item#' + item.id + ' > Popularity is visible').grey);
          }))

          .getText('#item-' + id +
            '>.item-buttons>button.item-toggle-details>.promoted-percent',
            domain.intercept(function (text) {
              text.should.be.a.String.and.match(/^\d\d?\d?%$/);
              console.log("\t  ✓".green, ('item#' + item.id + ' > Popularity is a percentage').grey);
            }))

          /////////////////////////////////////////////////////////////////////

          //  CHILDREN

          /////////////////////////////////////////////////////////////////////

          .isVisible('#item-' + id +
            '>.item-buttons > div > .related > .children-count', domain.intercept(function (isVisible) {
            console.log("\t  ✓".green, ('item#' + item.id + ' > Children count is visible').grey);
          }))

          .getText('#item-' + id +
            '>.item-buttons  > div > .related > .children-count',
            domain.intercept(function (text) {
              parseInt(text).should.be.a.Number.which.is.above(-1);
              console.log("\t  ✓".green, ('item#' + item.id + ' > Children Count is a number greater than -1').grey);
            }))

          .pause(500, done);

        }

    });
  }

  module.exports = isItem;

} ();
