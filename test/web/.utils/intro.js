! function () {
  
  'use strict';

  var Domain = require('domain').Domain;

  var config = require('syn/config.json');

  var Type = require('syn/models/Type');
  var Item = require('syn/models/Item');

  require('should');

  function Intro (client, done) {
    var domain = new Domain().on('error', done);

    domain.run(function () {

      Type
        .findOne({ name: 'Intro' })
        .exec().then(function (IntroType) {
          
          Item
            .findOne({ type: IntroType._id })
            .exec().then(browser);

        });

      function browser (intro) {
        client

          .isVisible('#intro')

          .getText('#intro .panel-title', domain.intercept(function (text) {
            text.should.be.a.String
              .and.is.exactly(intro.subject);
          }))

          .getText('#intro .item-subject', domain.intercept(function (text) {
            text.should.be.a.String
              .and.is.exactly(intro.subject);

            done();
          }));
      }

    });
  }

  module.exports = Intro;

} ();
