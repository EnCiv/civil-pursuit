'use strict';

import selectors              from 'syn/../../selectors.json';

function createItem (driver, context, options = {}) {
  return it => {
    it('should set subject', () => driver.client
      .setValue([
        context,
        selectors.create.form,
        selectors.create.subject
      ].join(' '), options.subject || '')
    );

    it('should set description', () => driver.client
      .setValue([
        context,
        selectors.create.form,
        selectors.create.description
      ].join(' '), options.description || '')
    );

    if ( ( 'image' in options ) ) {
      it('should upload image', () => driver.client.setValue(
        context + ' ' + selectors.create.image.input, options.image
      ));

      it('should see image', () =>
        driver.client.isVisible(context + ' ' + selectors.create.image.preview, 5000)
      );
    }

    if ( 'reference' in options ) {
      it('should set reference', () => driver.client
        .setValue([
          context,
          selectors.create.form,
          selectors.create.reference
        ].join(' '), options.reference)
      );
    }

    it('should submit form', () =>
      driver.client.submitForm(selectors.create.form)
    );

    if ( typeof options.error === 'string' ) {
      it('Error message', it => {
        it('should be visible', () =>
          driver.isVisible([
            context,
            selectors.create.form,
            selectors.flash.error
          ].join(' '))
        );

        it(`should have an error message saying "${options.error}"`, () =>
          driver.hasText([
            context,
            selectors.create.form,
            selectors.flash.error
          ].join(' '), options.error)
        );
      });
    }
  };
}

export default createItem;
