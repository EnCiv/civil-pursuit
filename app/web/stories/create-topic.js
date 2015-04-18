! function () {
  
  'use strict';

  var When = require('synapp/business/lib/When');

  require('colors');

  module.exports = function (cb) {

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {

      console.log(' [ Create Topic ] '.bgBlue);

      var subject = 'This is a test topic';

      var description = ' This is a test topic\'s description';

      function tellStory (user) {

        var page = require('synapp/business/lib/Page')('Home');

        var PanelsContainer = require('synapp/business/components/panels-container')();
        
        var Panel  = require('synapp/business/components/panel')({ type: 'Topic' });
        
        var ToggleCreator       =   require('synapp/business/components/panel-creator-toggle')(Panel);
        
        var Creator             =   require('synapp/business/components/creator')(Panel);
        
        var CreateSubject       =   function CreateSubject (message) {
          return require('synapp/business/components/creator-subject')({
            creator   :   Creator,
            error     :   message === 'with error'
          });
        };
        
        var CreateDescription   =   function CreateDescription (message) {
          return require('synapp/business/components/creator-description')({
            creator   :   Creator,
            error     :   message === 'with error'
          });
        };
        
        var CreatorSubmitButton =   require('synapp/business/components/creator-submit')(Creator);

        var NewItem             =   require('synapp/business/components/new-item')();

        var NewItemSubject      =   NewItem + ' ' + require('synapp/business/components/item-subject')();

        When.I(user).visit(page).then(function (I, done) {

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



          done(function () {
            console.log('TEST DONE!');
            user.remove(domain.intercept(function () {
              console.log('  ✔ Test user removed'.green);
              console.log('  ⌛ Disconnecting from MongoDB'.magenta);
              require('mongoose').disconnect(domain.intercept(function () {
                cb();  
              }));
            }));
          });

          });

      }

      require('colors');

      require('mongoose').connect(process.env.MONGOHQ_URL, function () {
        console.log('  ✔ Connected to MongoDB'.green);
      });

      var webdriverio = require('webdriverio');

      var options = {
        desiredCapabilities: {
          browserName: 'firefox'
        }
      };

      src('models/User').disposable(domain.intercept(function (user) {

        tellStory(user);

        return;

        console.log();
        console.log(('  #1 - When I, as a ' + 'signed-in user'.bold + ', click on ' + 'Toggle Creator'.bold + ', ' + 'Creator Panel'.bold + ' should appear').bgBlue);
        console.log();

        var cookie =  {
          name     :  "synuser",
          value    :  JSON.stringify({ email: user.email, id: user._id }),
          secure   :  false
        };

        webdriverio
      
          .remote(options)
      
          .init()
      
          .url(url, domain.intercept(function () {
            console.log('  ✔ Url:'.green, url);
          }))

          .setCookie(cookie, domain.intercept(function (something, results) {
            if ( results.cookie.state === 'success' ) {
              console.log('  ✔ Cookie set:'.green, cookie);
            }
          }))

          .refresh(domain.intercept(function () {
            console.log('  ↻ Page was refreshed'.cyan);
          }))

          .isVisible(
            require('synapp/business/components/panels-container')(),
            domain.intercept(isVisible.bind(null, $.panels)))

          .waitForExist($['panel topic'], 2500, domain.intercept(function () {
            console.log('  ✔ Found: '.green + $['panel topic']); 
          }))

          .isVisible($.toggle, domain.intercept(isVisible.bind(null, $.toggle)))

          .click($.toggle, domain.intercept(function () {
            console.log('  ☞ Clicked:'.cyan, $.toggle);  
          }))

          .pause(1000)

          .isVisible($.creator, domain.intercept(isVisible.bind(null, $.creator)))

          .pause(500, function () {
            console.log();
            console.log(('  #2 - When I submit the ' + 'Creator Panel Form'.bold + '  without entering a subject, ' + 'Creator Panel Form'.bold + ' should complain about an error').bgBlue);
            console.log();
          })

          .click($.submit, domain.intercept(function () {
            console.log('  ☞ Clicked:'.cyan, $.submit);  
          }))

          .pause(1000)

          .getAttribute($.subject, 'class', domain.intercept(function (attr) {
            if ( attr === 'error' ) {
              console.log('  ✔ Is marked as error: '.green + $.subject); 
            }
            else {
              console.log(('  × Expected argument ' + 'class'.bold + ' to be ' + 'error'.bold + ', but instead got ' + attr.bold).red);
              throw new Error('Expected attribute to have correct value');
            }
          }))

          .pause(500, function () {
            console.log();
            console.log(('  #3 - When I submit the ' + 'Creator Panel Form'.bold + ' having entered a subject without entering a description, ' + 'Creator Panel Form'.bold + ' should complain about an error').bgBlue);
            console.log();
          })

          .setValue($.subject, subject, domain.intercept(function () {
            console.log('  ✔ Set value: '.green + $.subject, subject); 
          }))

          .click($.submit, domain.intercept(function () {
            console.log('  ☞ Clicked:'.cyan, $.submit);  
          }))

          .pause(1000)

          .getAttribute($.description, 'class', domain.intercept(function (attr) {
            if ( attr === 'error' ) {
              console.log('  ✔ Is marked as error: '.green + $.description); 
            }
            else {
              console.log(('  × Expected argument ' + 'class'.bold + ' to be ' + 'error'.bold + ', but instead got ' + attr.bold).red);
              throw new Error('Expected attribute to have correct value');
            }
          }))

          .pause(250, domain.intercept(function () {
            console.log(('  #4 - When I submit the ' + 'Creator Panel Form'.bold + ' having entered both a subject and a description, ' + 'New Item Box'.bold + ' should appear').bgBlue);
          }))

          .setValue($.description, description, domain.intercept(function () {
            console.log('  ✔ Set value: '.green + $.description, description); 
          }))

          .click($.submit, domain.intercept(function () {
            console.log('  ☞ Clicked:'.cyan, $.submit);  
          }))

          .pause(2500)

          .isVisible($['new item'], domain.intercept(isVisible.bind(null, $['new item'])))

          .getText($['new item subject'], domain.intercept(function (text) {

            if ( text === subject ) {
              console.log('  ✔ Has text:'.green, subject, $['new item subject']);
            }
            else {
              console.log('  × Expected text:'.red, subject, ', instead got', text.toString(), $['new item subject']);
              throw new Error('New item subject');
            }
          }))

          .getText($['new item description'], domain.intercept(function (text) {

            if ( text === description ) {
              console.log('  ✔ Has text:'.green, description, $['new item description']);
            }
            else {
              console.log('  × Expected text:'.red, description, ', instead got', text.toString(), $['new item description']);
              throw new Error('New item description');
            }
          }))

          .pause(5000)
      
          .end(domain.intercept(function () {
            console.log('  ⌛ Removing test user'.magenta);
            user.remove(domain.intercept(function () {
              console.log('  ✔ Test user removed'.green);
              console.log('  ⌛ Disconnecting from MongoDB'.magenta);
              require('mongoose').disconnect(domain.intercept(function () {
                cb();  
              }));
            }));
             
          }));
      }));

    });
  };
    

} ();

