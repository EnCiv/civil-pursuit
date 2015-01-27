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

    /** div events */

    "on": {

      /** on div error */

      "error": function (error) {
        console.error(error);
      }
    },

    models: {
      socket_conn: false
    },

    /** div extensions */
    
    extensions: {
      "User":         require('../User/'),
      "Panel":        require('../Panel/'),
      "Item":         require('../Item/'),
      "Intro":        require('../Intro/'),
      "Promote":      require('../Promote/')
    },
    
    /** div emitters */

    "emitters" : {
      socket: io.connect('http://' + window.location.hostname + ':' +
        window.location.port),
      // queue: new (require('/home/francois/Dev/queue.js/'))()
    },
    
    // controllers: {
    //   'bootstrap/responsive-image':
    //     require('./controllers/bootstrap/responsive-image')
    // },

    /** run div */
    
    run: function () {

      for ( var ext in this.extensions ) {
        this.extensions[ext].on('error', function (error) {
          this.emit('error', error);
        }.bind(this));
      }

      var div = this;

      /** On socket error */

      this.emitter('socket')
      
        .on('error', function (error) {
          console.warn('socket error', socket);
        })

        .on('connect', function () {
          div.model('socket_conn', true);
        });

      /** Extensions */

      var User      =     this.extension('User');
      var Intro     =     this.extension('Intro');
      var Panel     =     this.extension('Panel');
      var Item      =     this.extension('Item');
      var Promote   =     this.extension('Promote');

      /** User Run() */

      User.run();

      /** If panel page */

      if ( $('#intro').length ) {
        
        setTimeout(function () {
          Intro.run();
        }, 500);

        setTimeout(function () {
          Promote.run();
          Item.run();
          Panel.run();
        }, 1000);

        // 
        
        // 

      }
    }
  };

}();
