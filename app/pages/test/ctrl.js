'use strict';

import App                from '../../app';
import TopBar             from '../../components/top-bar/ctrl';

synapp.app = new App(true);

synapp.app.ready(() => {

  new TopBar().render();

  synapp.app
    .publish('get stories')
    .subscribe((pubsub, stories) => {
      pubsub.unsubscribe();

      console.log('stories', stories);

      $('.test-stories tbody').empty();

      stories.forEach(story => {
        let tr = $(`<tr>
          <td style="font-weight: bold">${story.pitch}</td>
          <td>
            <button class="primary block radius run-story">Run</button>
          </td>
        </tr>`);

        tr.find('.run-story').on('click', () => {
          synapp.app
            .publish('run story')
            .subscribe((pubsub) => {
              
            });
        });

        $('.test-stories tbody').append(tr);
      });

    });

});
