'use strict';

import selectors              from 'syn/../../selectors.json';

function createItem (driver, context, options = {}) {
  return it => {
    if ( ( 'subject' in options ) ) {
      it('should set subject', () => driver.client
        .setValue([
          selectors.create.form,
          selectors.create.subject
        ].join(' '), options.subject)
      );
    }

    if ( ( 'description' in options ) ) {
      it('should set description', () => driver.client
        .setValue([
          selectors.create.form,
          selectors.create.description
        ].join(' '), options.description)
      );
    }

    it('should submit form', () =>
      driver.client.submitForm(selectors.create.form)
    );
  };
}

export default createItem;
