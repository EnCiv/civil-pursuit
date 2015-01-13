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
      'sign': '#signer',
      'forgot password': '#forgot-password'
    },
    
    templates: {
      'online users': require('./templates/online-users')
    },
    
    stories: {
      'show user features when user is signed in': 
        require('./stories/show-user-features-when-user-is-signed-in'),

      'get online users': require('./stories/get-online-users'),

      'forgot password': require('./stories/forgot-password'),

      'sign in': require('./stories/sign-in'),

      'sign up': require('./stories/sign-up')
    },

    run: function () {
      this.story('get online users')();  
      this.story('forgot password')();
      this.story('sign in')();
      this.story('sign up')();
    }
  };

} ();
