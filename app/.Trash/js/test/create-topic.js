! function () {
  
  'use strict';

  var When = require('syn/lib/When');

  require('colors');

  module.exports = function (cb) {

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {

      console.log(' [ Create Topic (2-columns view) ] '.bgBlue);

      var subject = 'This is a test topic';

      var description = 'This is a test topic\'s description';

      require('mongoose').connect(process.env.MONGOHQ_URL, function () {
        console.log('  ✔ Connected to MongoDB'.green);
      });

      require('syn/models/User').disposable(domain.intercept(function (user) {

        var page = require('syn/lib/Page')('Home');

        var PanelsContainer = require('syn/components/panels-container')();
        
        var Panel  = require('syn/components/panel')({ type: 'Topic' });
        
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

        var NewItem             =   require('syn/components/new-item')();

        var NewItemSubject      =   NewItem + ' ' + require('syn/components/item-subject')();

        var NewItemDescription      =   NewItem + ' ' + require('syn/components/item-description')();

        var NewEvaluation       =   NewItem + ' ' + require('syn/components/promote')();

        var LeftItemSubject     =   NewItem + ' ' + require('syn/components/promote-left-item-subject')({ split: false });

        var LeftItemDescription =   NewItem + ' ' + require('syn/components/promote-left-item-description')({ split: false });

        var view = {
          width: 601,
          height: 900
        };

        When.I(user).visit(page, view).then(function (I, done) {

          /** Toggle Creator */

          I.see     (PanelsContainer);
          
          I.wait    (1.5, 'second');
          
          I.see     (Panel);
          
          I.see     (ToggleCreator);
          
          I.click   (ToggleCreator);

          I.wait    (1, 'second');

          I.see     (Creator);

          /** Creator Form Validations */

          I.see     (CreateSubject('without error'));

          I.see     (CreateDescription('without error'));

          I.see     (CreatorSubmitButton);

          I.click   (CreatorSubmitButton);

          I.see     (CreateSubject('with error'));

          I.type    (subject, CreateSubject());

          I.click   (CreatorSubmitButton);

          I.see     (CreateSubject('without error'));

          I.see     (CreateDescription('with error'));

          I.type    (description, CreateDescription());

          I.click   (CreatorSubmitButton);

          I.wait    (2, 'seconds');

          I.see     (NewItemSubject);

          /** New item box */

          I.see     (NewItem);

          I.see     (NewItemSubject);

          I.read    (subject, NewItemSubject);

          I.see     (NewItemDescription);

          I.read    (description, NewItemDescription);

          /** New item Evaluation Cycle */

          I.see     (NewEvaluation);

          I.read    (subject, LeftItemSubject);

          I.read    (description, LeftItemDescription);

          I.wait    (5, 'seconds');

          done(function () {
            user.remove(domain.intercept(function () {
              console.log('  ✔ Test user removed'.green);
              console.log('  ⌛ Disconnecting from MongoDB'.magenta);
              require('mongoose').disconnect(domain.intercept(function () {
                cb();  
              }));
            }));
          });

          });
             
      }));

    });
  };
    

} ();

