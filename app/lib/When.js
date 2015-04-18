! function () {
  
  'use strict';

  var webdriverio = require('webdriverio');

  require('colors');

  var options = {
    desiredCapabilities: {
      browserName: 'firefox'
    }
  };

  function I (me) {
    this.me = me;
    this.instructions = [];
  }

  I.prototype.then = function(cb, cbError) {

    var self = this;

    cb(this, function (cb) {

      var domain = require('domain').create();
      
      domain.on('error', function (error) {
        if ( typeof cbError === 'function' ) {
          cbError(error);
        }
        else {
          throw error;
        }
      });
      
      domain.run(function () {
        if ( cb instanceof Error ) {
          throw cb;
        }

        self.client = webdriverio.remote(options).init();

        self.client.url(self.address, domain.intercept(function () {
          console.log('  ✔ Url:'.green, self.address);
        }));

        if ( self.me ) {

          var cookie =  {
            name     :  "synuser",
            value    :  JSON.stringify({
              email  :  self.me.email,
              id     :  self.me._id
            }),
            secure   :  false
          };

          self.client.setCookie(cookie, domain.intercept(function (something, results) {
            if ( results.cookie.state === 'success' ) {
              console.log('  ✔ Cookie set:'.green, cookie);
            }
          }));

          self.client.pause(0, domain.intercept(function () {
            console.log('  ↻ Refreshing page'.magenta);  
          }));

          self.client.refresh(domain.intercept(function () {
            console.log('  ↻ Page was refreshed'.cyan);
          }));
        }

        self.instructions.forEach(function (instruction) {

          switch ( instruction.action ) {
            case 'see':

              self.client.pause(0, domain.intercept(function () {
                console.log('  ⌛ Is visible?'.magenta, instruction.element);  
              }));

              self.client.isVisible(instruction.element, domain.intercept(function (isVisible) {
                if ( isVisible ) {
                  console.log('  ✔ Is visible:'.green, instruction.element);
                }
                else {
                  console.log('  × Is not visible:'.red, instruction.element);
                  throw new Error('Element is not visible');
                }
              }));
              break;

            case 'wait':
              self.client.pause(0, domain.intercept(function () {
                console.log('  ⌛ Waiting'.magenta, instruction.time / 1000, 'seconds');  
              }));

              self.client.pause(instruction.time, domain.intercept(function () {
                console.log('  ✔ Waited'.cyan, instruction.time / 1000, 'seconds');
              }));
              break;

            case 'click':

              self.client.pause(0, domain.intercept(function () {
                console.log('  ⌛ Clicking'.magenta, instruction.element);  
              }));

              self.client.click(instruction.element, domain.intercept(function () {
                console.log('  ✔ Clicked:'.cyan, instruction.element);
              }));
              break;

            case 'type':

              self.client.pause(0, domain.intercept(function () {
                console.log('  ⌛ Typing'.magenta, instruction.text, instruction.element.grey);  
              }));

              self.client.setValue(instruction.element, instruction.text, domain.intercept(function () {
                  console.log('  ✔ Typed:'.cyan, instruction.text, instruction.element.grey); 
              }));

              break;

            case 'read':

              self.client.pause(0, domain.intercept(function () {
                console.log('  ⌛ Reading'.magenta, instruction.text, instruction.element.grey);  
              }));

              self.client.getText(instruction.element, instruction.text, domain.intercept(function (text) {

                  if ( text === instruction.text ) {
                    console.log('  ✔ Read:'.green, instruction.text, instruction.element.grey);
                  }

                  else {
                    console.log('  × Could not read:'.red, instruction.text, instruction.element.grey);
                    throw new Error('Text not match. Expected "' + instruction.text + '", but instead got "' + text + '"');
                  }

              }));

              break;
          }

        });

        self.client.end(cb);
      });

    });
  };

  I.prototype.visit = function(address) {
    this.address = address;
    return this;
  };

  I.prototype.see = function (element) {
    this.instructions.push({
      action  : 'see',
      element : element
    });
    return this;
  };

  I.prototype.wait = function (time, timeUnit) {
    this.instructions.push({
      action  : 'wait',
      time    : time * 1000
    });
    return this;
  };

  I.prototype.click = function (element) {
    this.instructions.push({
      action  : 'click',
      element : element
    });
    return this;
  };

  I.prototype.select = function (element) {
    return this;
  };

  I.prototype.type = function (text, element) {
    this.instructions.push({
      action  : 'type',
      element : element,
      text    : text
    });
    return this;
  };

  I.prototype.read = function (text, element) {
    this.instructions.push({
      action  : 'read',
      element : element,
      text    : text
    });
    return this;
  };

  exports.I = function (am) {
    return new I(am);
  };

} ();
