'use strict';

import App          from 'syn/app';
import IntroCtrl    from 'syn/components/intro/ctrl';
import TopBar       from 'syn/components/top-bar/ctrl';
import Panel        from 'syn/components/panel/ctrl';

synapp.app = new App(true);

let panel;

synapp.app.ready(() => {

  new IntroCtrl().render();

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
