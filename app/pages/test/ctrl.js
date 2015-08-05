'use strict';

import App                from '../../app';
import TopBar             from '../../components/top-bar/ctrl';

synapp.app = new App(true);

synapp.app.ready(() => {

  new TopBar().render();

  Promise
    .all([
      new Promise((ok, ko) => {
        synapp.app
          .publish('get stories')
          .subscribe((pubsub, stories) => {
            pubsub.unsubscribe();
            ok(stories);
          });
      }),
      new Promise((ok, ko) => {
        synapp.app
          .publish('get config')
          .subscribe((pubsub, config) => {
            pubsub.unsubscribe();
            ok(config);
          });
      })
    ])
    .then(
      results => {
        let [ stories, config ] = results;

        console.log('stories', stories);

        $('.test-stories tbody').empty();

        stories.forEach(story => {
          let tr = $(`<tr>
            <td style="vertical-align: top"><input type="checkbox" /></td>
            <td>
              <h4>${story.pitch}</h4>
              <code class="pre-text muted">${story.description}</code>
              <hr/>
              <table>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Env</th>
                    <th>Vendor</th>
                    <th>Viewport</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="driver-page">
                      <select></select>
                    </td>
                    <td class="driver-env">
                      <select multiple>
                        <option>Production</option>
                        <option>Development</option>
                      </select>
                    </td>
                    <td class="driver-vendor">
                      <select multiple>
                        <option>Firefox</option>
                        <option>Chrome</option>
                      </select>
                    </td>
                    <td class="driver-vendor">
                      <select multiple>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>`);

          // tr.find('.driver-page').text(story.driver.page.name);

          $('.test-stories tbody').append(tr);
        });

      },
      error => console.error(error)
    );

});
