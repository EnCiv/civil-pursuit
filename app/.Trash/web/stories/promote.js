! function () {
  
  'use strict';

  var When = require('syn/lib/When');

  function testPromote (cb) {
    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {

      // require('mongoose').connect(process.env.MONGOHQ_URL);

      function tellStory (user, item) {

        var page = require('syn/lib/Page')('Item', item);

        var PanelsContainer     =   require('syn/components/panels-container')();
        
        var Panel               =   require('syn/components/panel')({ type: item.type });
        
        var ToggleCreator       =   require('syn/components/panel-creator-toggle')(Panel);
        
        var Creator             =   require('syn/components/creator')(Panel);
        
        var CreateSubject       =   function CreateSubject (message) {
          return require('syn/components/creator-subject')({
            creator   :   Creator,
            error     :   message === 'with error'
          });
        };
        
        var CreateDescription   =   function CreateDescription (message) {
          return require('syn/components/creator-description')({
            creator   :   Creator,
            error     :   message === 'with error'
          });
        };
        
        var CreatorSubmitButton =   require('syn/components/creator-submit')(Creator); 

        When.I(user).visit(page).then(function (I) {

            I.see     (PanelsContainer);
            
            I.wait    (1.5).second;
            
            I.see     (Panel);
            
            I.see     (ToggleCreator);
            
            I.click   (ToggleCreator);

            I.wait    (1).second;

            I.see     (Creator);

            I.see     (CreateSubject('without error'));

            I.see     (CreateDescription('without error'));

            I.see     (CreatorSubmitButton);

            I.click   (CreatorSubmitButton);

            I.see     (CreateSubject('with error'));

            I.select  (CreateSubject());

            I.type    (subject);

            I.click   (CreatorSubmitButton);

            I.see     (CreateSubject('without error'));

            I.see     (CreateDescription('with error'));

            I.select  (CreateDescription());

            I.type    (description);

            I.click   (CreatorSubmitButton);

            I.see     (CreateSubject('without error'));

            I.see     (CreateDescription('without error'));

          });

      }

      require('syn/models/User').disposable(domain.intercept(function (user) {



      }));

      // require('colors');

      // var url = 'http://localhost:3012';

      // I('disposable')
      //   .visiting('disposable item')
      //   .

      // console.log('  ⌛ Connecting to MongoDB'.magenta);

      // console.log('[ Promote ]'.yellow);

      // console.log();

      // console.log(' ⌛ Creating disposable user'.magenta);

      // require('syn/models/User').disposable(domain.intercept(function (user) {
      //   console.log(' ✔ Disposable user created'.green, JSON.stringify(user, null, 2).grey);

      //   console.log(' ⌛ Creating disposable item'.magenta);

      //   require('syn/models/Item').create({
      //     type          :   'Topic',
      //     subject       :   'Test topic for test web/promote',
      //     description   :   'Description Description Description Description Description ',
      //     user          :   user._id
      //   }, domain.intercept(function (item) {
      //     console.log(' ✔ Disposable item created'.green, JSON.stringify(item, null, 2).grey);
      //   }));

      //   cb();
      // }));

    });
  }

  module.exports = testPromote;

} ();
