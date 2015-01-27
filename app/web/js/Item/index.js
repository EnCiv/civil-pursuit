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
      'toggle edit and go again': require('./controllers/toggle-edit-and-go-again'),
      'update panel model':       require('./controllers/update-panel-model'),
      'update panel view':        require('./controllers/update-panel-view'),
      'render':                   require('./controllers/render'),
      'place item in panel':      require('./controllers/place-item-in-panel')
    },

    run: function () {

      var div       =   this;
      var Socket    =   div.root.emitter('socket');
      var Panel     =   div.root.extension('Panel');

      

      // On new panel, get panel items from socket

      Panel.watch.on('panel view rendered', function (panel) {
        Socket.emit('get items', panel);
      });

      Socket.on('got items', function (panelView) {
        var panel = panelView.panel;
        var items = panelView.items;

        div.watch.on('panel model updated', function (panel) {
          div.controller('update panel view')(panel, items);

          if ( items.length ) {

            require('async').series(items
              .map(function (item) {
                return function (cb) {
                  div.controller('render')(item,
                    function (error, item, view) {
                      div.controller('place item in panel')(item, view,
                        cb);
                    });
                };
              }),
              div.domain.intercept(function (results) {
                var panelId = '#panel-' + panel.type;

                if ( panel.parent ) {
                  panelId += '-' + panel.parent;
                }

                var $panel  =   $(panelId);

                $panel.removeClass('is-filling')

                // Show/Hide load-more

                if ( items.length === synapp['navigator batch size'] ) {
                  $(panelId).find('.load-more').show();
                }
                else {
                  $(panelId).find('.load-more').hide();
                }
              }));
          }

        });

        div.controller('update panel model')(panel, items);
      });
      
      // this.story('get items')();

      // this.story('create item')();

      // this.story('listen to broadcast')();
    }
  };

} ();
