/**
                                        
                                            
    $$    $$                                
    $$    $$                                
    $$    $$   $$$$$$$   $$$$$$    $$$$$$   
    $$    $$  $$        $$    $$  $$    $$  
    $$    $$   $$$$$$   $$$$$$$$  $$        
    $$    $$        $$  $$        $$        
     $$$$$$   $$$$$$$    $$$$$$$  $$        
                                            
                                        
                                        
*/

! function () {

  'use strict';

  module.exports = {
    
    models: {
      user:   synapp.user,
      online: 0
    },

    controllers: {
      'sign in': require('./controllers/sign-in')
    },

    run: function () {
      
      var div = this;

      var Socket = div.root.emitter('socket');

      var Queue = div.root.queue;

      Socket.on('online users', function (online) {
        div.model('online', online);
      });

      div.bind({ model: 'online' }, function (users) {
        $('.online-users').text(users);
      });

      if ( synapp.user ) {
        $('.is-in').css('visibility', 'visible');
      }

      div.controller('sign in')();
    }
  };

} ();
