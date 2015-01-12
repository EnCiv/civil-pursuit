/**
                                            
                                                
     888888ba                             dP 
     88    `8b                            88 
    a88aaaa8P' .d8888b. 88d888b. .d8888b. 88 
     88        88'  `88 88'  `88 88ooood8 88 
     88        88.  .88 88    88 88.  ... 88 
     dP        `88888P8 dP    dP `88888P' dP 

                                        
*/

! function () {

  'use strict';

  module.exports = {
    models: {
      panels: []
    },
    
    controllers: {
      'scroll to point of attention':
        require('./controllers/scroll-to-point-of-attention'),
      'show':     require('./controllers/show'),
      'hide':     require('./controllers/hide'),
      'reveal':   require('./controllers/reveal'),
      'upload':   require('./controllers/upload')
    },
    
    views: {
      'panels': '.panels',
      'creator': '.creator'
    },
    
    templates: {
      'panel': require('./templates/panel')
    },
    
    stories: {
      'get panel': require('./stories/get-panel')
    }
  };

} ();
