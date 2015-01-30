/**

  oo   dP                                
       88                                
  dP d8888P .d8888b. 88d8b.d8b. .d8888b. 
  88   88   88ooood8 88'`88'`88 Y8ooooo. 
  88   88   88.  ... 88  88  88       88 
  dP   dP   `88888P' dP  dP  dP `88888P' 

*/

! function () {

  'use strict';

  module.exports = {
    
    models: {
      items: []
    },
    
    controllers: {
      'youtube':                  require('./controllers/youtube'),
      'youtube play icon':        require('./controllers/youtube-play-icon'),
      'item media':               require('./controllers/item-media'),
      'truncate':                 require('./controllers/truncate'),
      'toggle details':           require('./controllers/toggle-details'),
      'progress bar':             require('./controllers/progress-bar'),
      'invite people in':         require('./controllers/invite-people-in'),
      'get item details':         require('./controllers/get-item-details'),
      'get items':                require('./controllers/get-items'),
      'create item':              require('./controllers/create-item'),
      'toggle edit and go again': require('./controllers/toggle-edit-and-go-again'),
      'update panel model':       require('./controllers/update-panel-model'),
      'update panel view':        require('./controllers/update-panel-view'),
      'render':                   require('./controllers/render'),
      'expand':                   require('./controllers/expand'),
      'place item in panel':      require('./controllers/place-item-in-panel'),
      'details votes':            require('./controllers/details-votes'),
      'edit and go again':        require('./controllers/edit-and-go-again'),
      'toggle promote':           require('./controllers/toggle-promote'),
      'toggle arrow':             require('./controllers/toggle-arrow')
    },

    run: function () {
      
      this.controller('get items')();

      this.controller('create item')();

    }
  };

} ();
