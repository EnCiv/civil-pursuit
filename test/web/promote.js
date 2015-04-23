! function () {
  
  'use strict';

  describe ( 'Web / Promote' , function () {

    var mongoose    =   require('mongoose');

    var When        =   require('syn/lib/When');
    var User        =   require('syn/models/User');
    var Item        =   require('syn/models/Item');
    var Type        =   require('syn/models/Type');

    var subject     =   'Test topic for test web/promote';
    var description =   'Description Description Description Description Description';

    var user;
    var item;

    before ( function ( done ) {

      this.timeout(15000);

      mongoose.connect(process.env.MONGOHQ_URL);

      Type

        .findOne({ name: 'Topic' })

        .exec().then(function (Topic) {

          User

            .disposable().then(function (_user) {

              Item

                .create({
                  type          :   Topic._id,
                  subject       :   subject,
                  description   :   description,
                  user          :   _user._id,
                })

                .then(function (_item) {

                  user = _user;
                  item = _item;

                  done();

                });

            });

        });
    });
          

    it ( 'rocks' , function () {

    });

  });

  require('colors');

  function promote (cb) {
    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {

      var mongoose    =   require('mongoose');

      var When        =   require('syn/lib/When');
      var User        =   require('syn/models/User');
      var Item        =   require('syn/models/Item');

      var subject     =   'Test topic for test web/promote';
      var description =   'Description Description Description Description Description';

      console.log(' [ Promote Topic ] '.bgBlue);

      mongoose.connect(process.env.MONGOHQ_URL, function () {
        console.log('  ✔ Connected to MongoDB'.green);
      });

      User.disposable(domain.intercept(function (user) {

        Item.create({
            type          :   'Topic',
            subject       :   subject,
            description   :   description,
            user          :   user._id,
          },

          domain.intercept(function (item) {
            tellStory(user, item);
          }));

      }));

      function tellStory (user, item) {

        var ItemBox = require('syn/components/item')(item._id);

        var ItemTogglePromote = ItemBox + ' ' + require('syn/components/item-toggle-promote')();

        var Promote =  ItemBox + ' ' + require('syn/components/promote')();

        var LeftItemSubject     =   Promote + ' ' + require('syn/components/promote-left-item-subject')({ split: false });

        var LeftItemDescription =   Promote + ' ' + require('syn/components/promote-left-item-description')({ split: false });

        var page = require('syn/lib/Page')('Item Page', item);

        console.log(LeftItemSubject)

        var view = {
          width: 770,
          height: 900
        };
        
        When.I(user).visit(page, view).then(function (I, done) {

          I.see       (ItemBox);

          I.see       (ItemTogglePromote);

          I.click     (ItemTogglePromote);

          I.wait      (.5, 'seconds');

          I.see       (Promote);

          // I.wait      (1, 'second');

          I.read      (subject, '.split-hide-down .left-item.subject h4');

          I.wait      (5, 'seconds');

          done(function () {
            user.remove(domain.intercept(function () {
              console.log('  ✔ Test user removed'.green);

              console.log('  ⌛ Deleting test item'.magenta);

              item.remove(domain.intercept(function () {
                console.log('  ✔ Test user removed'.green);

                console.log('  ⌛ Disconnecting from MongoDB'.magenta);

                require('mongoose').disconnect(domain.intercept(function () {
                  cb();  
                }));
              }));

            }));
          });
        });

      }

    });
  }

  module.exports = promote;

} ();
