'use strict';

import WebDriver from '../lib/web-driver';

function runStory (event, stories) {
  try {
    let driver = new WebDriver()
      .on('error', error => this.error(error))
      .on('ready', () => {
        try {
          let url;

          let promises = stories.map(story => new Promise((ok, ko) => {
            this.emit('running story', story._id);
            driver.client
              .url(`http://localhost:3012${story.driver.page.url}`)
              .then(() => {
                let Unit = require('../test/web/atomic/' + story.unit.atom);

                new Unit(...story.unit.params)
                  .test()
                  .then(
                    () => {
                      this.emit('ok story', story._id);
                      ok();
                    },
                    error => {
                      this.emit('ko story', story._id);
                      ko(error);
                    }
                  );
              });
          }));

          Promise.all(promises)
            .then(
              ok => {

              },
              ko => {
                driver.client.end();
              }
            );
        }
        catch ( error ) {
          this.error(error);
        }
      });
  }
  catch ( error ) {
    this.error(error);
  }
}

export default runStory;
