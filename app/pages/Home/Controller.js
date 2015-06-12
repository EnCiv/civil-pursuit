'use strict';

import App from 'syn/app';
import Intro from 'syn/components/Intro/Controller';
import TopBar from 'syn/components/TopBar/Controller';
import Panel from 'syn/components/Panel/Controller';

synapp.app = new App(true);

let panel;

synapp.app.ready(() => {

  new Intro().render();

  new (TopBar)().render();

  if ( ! panel ) {
    synapp.app
      .publish('get top level type')
      .subscribe((pubsub, topLevelPanel) => {
        
        pubsub.unsubscribe();

        panel = new Panel({ panel: { type: topLevelPanel } });

        $('.panels').append(panel.load());

        panel
          .render()
          .then(
            success => panel.fill(),
            error => synapp.app.emit('error', error)
          );

      });
  }

});
