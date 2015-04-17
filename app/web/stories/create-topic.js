! function () {
  
  'use strict';

  module.exports = function (cb) {
    var src = require(require('path').join(process.cwd(), 'src'));

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      cb(error);
    });
    
    domain.run(function () {

      require('colors');

      console.log('[ Create Topic ]'.yellow);

      console.log();

      console.log(('  #1 - When I, as a ' + 'signed-in user'.bold + ', click on ' + 'Toggle Creator'.bold + ', ' + 'Creator Panel'.bold + ' should appear').grey);

      console.log(('  #2 - When I submit the ' + 'Creator Panel Form'.bold + '  without entering a subject, ' + 'Creator Panel Form'.bold + ' should complain about an error').grey);

      console.log(('  #3 - When I submit the ' + 'Creator Panel Form'.bold + ' having entered a subject without entering a description, ' + 'Creator Panel Form'.bold + ' should complain about an error').grey);

      console.log(('  #4 - When I submit the ' + 'Creator Panel Form'.bold + ' having entered both a subject and a description, ' + 'New Item Box'.bold + ' should appear').grey);

      console.log();

      console.log('  ⌛ Connecting to MongoDB'.magenta);
      
      require('mongoose').connect(process.env.MONGOHQ_URL, function () {
        console.log('  ✔ Connected to MongoDB'.green);
      });

      var webdriverio = require('webdriverio');

      var options = {
        desiredCapabilities: {
          browserName: 'firefox'
        }
      };

      var url = 'http://localhost:3012';

      var subject = 'Hey! I am a test topic!';

      var description = 'Hey! This is a cool description';

      var $             =   {
        'panels'        :   '.panels',
        'panel topic'   :   '#panel-Topic'
      };

      $.toggle          =   $['panel topic'] + ' .toggle-creator';
      $.creator         =   $['panel topic'] + ' form.creator[name="create"][novalidate][role="form"][method="POST"]';
      $.submit          =   $.creator + ' .button-create';
      $.subject         =   $.creator + ' input[name="subject"][required]';
      $.description     =   $.creator + ' textarea[name="description"][required]';
      $['new item']     =   $['panel topic'] + ' .item.new';
      $['new item subject'] = $['new item'] + ' .item-subject';
      $['new item description'] = $['new item'] + ' .item-description';

      function isVisible (selector, visible) {
        if ( ! visible ) {
          throw new Error('Not visible: ' + selector);
        }

        console.log('  ✔ Is visible: '.green + selector);
      }

      src('models/User').disposable(domain.intercept(function (user) {

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

          .isVisible($.panels, domain.intercept(isVisible.bind(null, $.panels)))

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

