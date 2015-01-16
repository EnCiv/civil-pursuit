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
      'truncate':     require('./controllers/truncate')
    },
    
    templates: {
      'details votes':  require('./templates/details-votes'),
      'details feedback': require('./templates/details-feedback'),
      'item': require('./templates/item')
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
