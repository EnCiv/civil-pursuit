'use strict';

import App                from '../../app';
import TopBar             from '../../components/top-bar/ctrl';

synapp.app = new App(true);

synapp.app.ready(() => {

  new TopBar().render();

  synapp.app
    .publish('get tests')
    .subscribe((pubsub, tests) => {

      let pages = tests.filter(test => test.type === 'page');

      $('.number-of-pages').text(pages.length);

      pages.forEach(page => {
        let stories = [];

        page.stories.forEach(story => {
          stories.push(`<tr>
              <td>${story.name}</td>
              <td></td>
              <td></td>
            </tr>`);
        });

        let tr = $(`<tr id="state-${page._id}">
            <th>${page.name}</th>
            <td><button class="primary block run-test">Run</button></td>
          </tr>
          <tr>
            <td colspan="2">
              <table>
                <thead>
                  <tr>
                    <th>Story</th>
                    <th>Status</th>
                    <th>Last run</th>
                  </tr>
                </thead>
                <tbody>
                  ${stories.join('')}
                </tbody>
              </table>
            </td>
          </tr>`);

        $('.test-pages tbody').append(tr);

        tr.find('.run-test').on('click', () => {
          synapp.app
            .publish('run test', page)
            .subscribe();
        });
      });
    });

});
