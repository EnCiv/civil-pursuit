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
      panels: [],
      $creator: '.creator:first'
    },
    
    controllers: {
      'scroll to point of attention':
        require('./controllers/scroll-to-point-of-attention'),

      'show':             require('./controllers/show'),
      'make':             require('./controllers/make'),
      'hide':             require('./controllers/hide'),
      'reveal':           require('./controllers/reveal'),
      'upload':           require('./controllers/upload'),
      'render':           require('./controllers/render'),
      'toggle creator':   require('./controllers/toggle-creator'),
      'create':           require('./controllers/create'),
      'find creator':     require('./controllers/find-creator'),
      'new item':         require('./controllers/new-item')
    },

    run: function () {
      var div = this;

      // function to insert top level panel if not inserted

      function topLevelPanel () {
        if ( ! div.model('panels').length ) {
          div.push('panels', {
            type: 'Topic',
            size: synapp['navigator batch size'],
            skip: 0
          });
        }
      }

      // trigger topLevelPanel when socket connects

      div.root.model('socket_conn')
        ?   topLevelPanel()
        :   div.root.emitter('socket').once('connect', topLevelPanel);

      // on new panel added to model, render the panel

      div.watch
        .on('push panels', div.controller('render'));

    }
  };

} ();
