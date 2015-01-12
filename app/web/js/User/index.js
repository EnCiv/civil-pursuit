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
    views: {
      'online now': '.online-users',
      'sign': '#signer'
    },
    templates: {
      'online users': require('./templates/online-users')
    },
    stories: {
      'show user features when user is signed in': 
        require('./stories/show-user-features-when-user-is-signed-in')
    }
  };

} ();
