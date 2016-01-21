'use strict';

import selectors              from 'syn/../../selectors.json';

function evaluateItem (driver, item, options = {}) {
  return it => {
    it('should click on evaluation toggler', () =>
      driver.client.click([
        `${selectors.item.id.prefix}${item._id}`,
        selectors.item.togglers.evaluation
      ].join(' '))
    );

    if ( options.votes ) {
      options.votes.forEach((vote, index) => {
        const selector = `${selectors.sliders.criteria.selector}:nth-of-type(${index + 1}) ${selectors.sliders.slider}`;

        it(`should vote criteria #${index + 1} to ${vote}`, it => {
          it('should scroll to criteria', () => driver.scroll(selector));
          it('should set value', () => new Promise((ok, ko) => {
            driver.click(selector)
              .then(() => {
                let key;
                if ( vote === -1 ) {
                  driver.client.keys(['\uE012']).then(ok, ko);
                }
                else if ( vote === 1 ) {
                  driver.client.keys(['\uE014']).then(ok, ko);
                }
                else {
                  ok();
                }
              })
              .catch(ko);
          }));
        });
      });
    }

    it('Finish', it => {
      it('should click finish button', () => driver.click(selectors.evaluation.button));
    });
  };
}

export default evaluateItem;
