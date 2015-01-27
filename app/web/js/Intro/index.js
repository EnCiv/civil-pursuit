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

    controllers: {
      'get intro': require('./controllers/get-intro')
    },

    run: function () {

      var div = this;

      div.root.model('socket_conn')
        ?   div.controller('get intro')()
        :   div.root.emitter('socket').once('connect', div.controller('get intro'));

    }
  };

} ();
