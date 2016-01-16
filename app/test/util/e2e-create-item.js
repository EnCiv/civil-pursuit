'use strict';

import selectors              from 'syn/../../selectors.json';

function createItem (driver, context, options = {}) {
  return it => {
    it('should set subject', () => driver.client
      .setValue([
        selectors.create.form,
        selectors.create.subject
      ].join(' '), options.subject || '')
    );

    it('should set description', () => driver.client
      .setValue([
        selectors.create.form,
        selectors.create.description
      ].join(' '), options.description || '')
    );

    it('should submit form', () =>
      driver.client.submitForm(selectors.create.form)
    );

    if ( typeof options.error === 'string' ) {
      it('Error message', it => {
        it('should be visible', () =>
          driver.isVisible([
            selectors.create.form,
            selectors.flash.error
          ].join(' '))
        );

        it(`should have an error message saying "${options.error}"`, () =>
          driver.hasText([
            selectors.create.form,
            selectors.flash.error
          ].join(' '), options.error)
        );
      });
    }
  };
}

export default createItem;
