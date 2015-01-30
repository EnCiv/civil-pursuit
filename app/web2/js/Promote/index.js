/**

  88888888b                   dP                     dP   oo                   
   88                          88                     88                        
  a88aaaa    dP   .dP .d8888b. 88 dP    dP .d8888b. d8888P dP .d8888b. 88d888b. 
   88        88   d8' 88'  `88 88 88    88 88'  `88   88   88 88'  `88 88'  `88 
   88        88 .88'  88.  .88 88 88.  .88 88.  .88   88   88 88.  .88 88    88 
   88888888P 8888P'   `88888P8 dP `88888P' `88888P8   dP   dP `88888P' dP    dP

*/

! function () {

  'use strict';

  module.exports = {
    
    models: {
      evaluations: []
    },

    controllers: {
      'get evaluation': require('./controllers/get-evaluation'),
      'render': require('./controllers/render')
    },

    run: function () {
      this.controller('get evaluation')();
    }
  };

} ();
