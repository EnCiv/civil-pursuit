'use strict';

import App      from '../../app';
import TopBar   from '../../components/top-bar/ctrl';
import Panel    from '../../components/panel/ctrl';

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
