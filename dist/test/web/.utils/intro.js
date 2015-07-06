'use strict';

!(function () {

  'use strict';

  var Domain = require('domain').Domain;

  var config = require('syn/config.json');

  var Type = require('syn/models/type');
  var Item = require('syn/models/item');

  require('should');

  function Intro(client, done) {
    var domain = new Domain().on('error', done);

    domain.run(function () {

      Type.findOne({ name: 'Intro' }).exec().then(function (IntroType) {

        Item.findOne({ type: IntroType._id }).exec().then(browser);
      });

      function browser(intro) {
        client.isVisible('#intro').getText('#intro .panel-title', domain.intercept(function (text) {
          text.should.be.a.String.and.is.exactly(intro.subject);
        })).getText('#intro .item-subject', domain.intercept(function (text) {
          text.should.be.a.String.and.is.exactly(intro.subject);
        })).getText('#intro .item-description', domain.intercept(function (text) {
          text.should.be.a.String;
          text.split(/\n/)[0].should.be.exactly(intro.description.split(/\n/)[0]);

          done();
        }));
      }
    });
  }

  module.exports = Intro;
})();