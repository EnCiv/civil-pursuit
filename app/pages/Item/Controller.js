'use strict';

import App from 'syn/app';
import TopBar from 'syn/components/TopBar/Controller';
import Panel from 'syn/components/Panel/Controller';

synapp.app = new App(true);

synapp.app.ready(() => {

  new TopBar().render();

  synapp.app
    .publish('get top-level type')
    .subscribe((pubsub, topLevelPanel) => {
      
      pubsub.unsubscribe();

      let panel = new Panel({ panel: { type: topLevelPanel } });

      $('.panels').append(panel.load());

      panel
        .render()
        .then(
          success => panel.fill(),
          error => synapp.app.emit('error', error)
        );

    });

});
