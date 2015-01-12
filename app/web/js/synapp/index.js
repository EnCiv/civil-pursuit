 /**
                 


   $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$   
  $$        $$    $$  $$    $$        $$  $$    $$  $$    $$  
   $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$  
        $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$  
  $$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$   
                  $$                      $$        $$        
            $$    $$                      $$        $$        
             $$$$$$                       $$        $$        
                          
*/


;! function () {

  'use strict';

  module.exports = {
    on: {
      error: function (error) {
        console.error(error);
      }
    },
    
    extensions: {
      User:         require('../User/'),
      Panel:        require('../Panel/'),
      Item:         require('../Item/'),
      Intro:        require('../Intro/'),
      Evaluation:   require('../Evaluation/')
    },
    
    emitters : {
      socket: io.connect('http://' + window.location.hostname + ':' +
        window.location.port)
    },
    
    controllers: {
      'bootstrap/responsive-image':
        require('./controllers/bootstrap/responsive-image')
    },
    
    run: function () {

      for ( var ext in this.extensions ) {
        this.extensions[ext].on('error', function (error) {
          this.emit('error', error);
        }.bind(this));
      }

      /** On socket error */

      this.emitter('socket')
      
        .on('error', function (error) {
          console.warn('socket error', socket);
        });

      /** Extensions */

      var User = this.extension('User');
      var Intro = this.extension('Intro');
      var Panel = this.extension('Panel');
      var Item = this.extension('Item');

      /** User/stories/show-user-features-when-user-is-signed-in */

      User
        .story('show user features when user is signed in')();

      /** If panel page */

      if ( $('#intro').length ) {
        
        Intro.story('get intro')();

        Panel.story('get panel')();

        Item.story('get items')();

      }
    }
  };

}();
