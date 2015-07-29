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
        let tr = $(`<tr id="state-${page._id}">
            <th>${page.name}</th>
            <td><button class="primary block">Run</button></td>
          </tr>`);

        $('.test-pages tbody').append(tr);
      });
    });

});
