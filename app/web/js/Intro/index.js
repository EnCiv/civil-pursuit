/**
                                                        
            dP            dP                     
                          88                     
            88 88d888b. d8888P 88d888b. .d8888b. 
            88 88'  `88   88   88'  `88 88'  `88 
            88 88    88   88   88       88.  .88 
            dP dP    dP   dP   dP       `88888P'                                  

*/

! function () {

  'use strict';

  module.exports = {
    models: {
      intro: null
    },

    views: {
      intro: '#intro'
    },
    
    templates: {
      intro: require('./templates/intro')
    },
    
    stories: {
      'get intro': require('./stories/get-intro')
    }
  };

} ();
