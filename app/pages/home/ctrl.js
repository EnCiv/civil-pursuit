'use strict';

import App              from '../../app';
import IntroCtrl        from '../../components/intro/ctrl';
import TopBar           from '../../components/top-bar/ctrl';
import Panel            from '../../components/panel/ctrl';
import CountDownCtrl    from '../../components/countdown/ctrl';

synapp.app = new App(true);

let panel;

synapp.app.ready(() => {

  new IntroCtrl().render();

  new CountDownCtrl().render();

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
