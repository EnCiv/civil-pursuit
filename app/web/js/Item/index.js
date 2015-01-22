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
      'youtube':      require('./controllers/youtube'),
      'item media':   require('./controllers/item-media'),
      'truncate':     require('./controllers/truncate'),
      'toggle details':     require('./controllers/toggle-details'),
      'progress bar':     require('./controllers/progress-bar'),
      'invite people in':     require('./controllers/invite-people-in'),
      'get item details':     require('./controllers/get-item-details'),
      'toggle edit and go again':     require('./controllers/toggle-edit-and-go-again')
    },
    
    templates: {
      'details votes':  require('./templates/details-votes'),
      'details feedback': require('./templates/details-feedback'),
      'item': require('./templates/item'),
      'edit and go again': require('./templates/edit-and-go-again')
    },
    
    stories: {
      'create item': require('./stories/create-item'),
      'get items': require('./stories/get-items'),
      'listen to broadcast': require('./stories/listen-to-broadcast')
    },

    run: function () {
      this.story('get items')();

      this.story('create item')();

      this.story('listen to broadcast')();
    }
  };

} ();
