'use strict';

import describe                           from 'redtea';
import should                             from 'should';
import reset                              from '../../bin/reset';
import User                               from '../../models/user';
import Type                               from '../../models/type';
import Item                               from '../../models/item';
import signOut                            from '../.test/util/e2e-sign-out';
import identify                           from '../.test/util/e2e-identify';
import isItem                             from 'syn/../../dist/test/is/item';
import isItemView                         from 'syn/../../dist/test/is/item-view';

function test(props) {
  const panel   =   '#top-level-panel > .syn-panel';
  const heading =   `${panel} > .syn-panel-heading`;
  const body    =   `${panel} > .syn-panel-body`;
  const form    =   `${body} > .syn-accordion:first-child form[name="creator"]`;

  const locals      =   {
    toggle          :   `${heading} > .toggle-creator`,
    join            :   `form[name="join"]`,
    form,
    subject         :   `${form} input[name="subject"]`,
    description     :   `${form} textarea[name="description"]`,
    failure         :   `${form} .syn-flash--error`
  };

  const { driver } = props;
  const { client } = props.driver;

  console.log(describe.version);

  return describe('E2E Create item', it => {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should reset items', () => reset('item'));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should go to home page', () => client.url(`http://localhost:${props.port}`));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('If user not logged in, clicking on Create Button should show Join', it => {

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('should click on create button', () => client.click(locals.toggle));

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('should show join form', () => driver.waitForVisible(locals.join, 1000));

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('should not show create item form', () => driver.isInvisible(`${body} > .syn-accordion:first-child`));


    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('identify', describe.use(() => identify(client)));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    for ( let i = 0; i < 1; i ++ ) {

      const subject = `E2E - Create item - parent - ${i}`;

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('should click create item button', () => client.click(locals.toggle));

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('should show create item form', () => driver.waitForVisible(locals.form, 1000));

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('Invalid form', [ it => {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('No subject', [ it => {

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('should submit form', () => client.submitForm(locals.form));

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('should see error message', () => driver.waitForVisible(locals.failure, 1000));

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('error message should say "Subject can not be left empty"', () => driver.compareText(locals.failure, "Subject can not be left empty"));

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        }]);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('No description', [ it => {

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('should fill subject', () => client.setValue(locals.subject, subject));

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('should submit form', () => client.submitForm(locals.form));

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('should see error message', () => driver.waitForVisible(locals.failure, 1000));

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('error message should say "Description can not be left empty"', () => driver.compareText(locals.failure, "Description can not be left empty"));

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          it('should fill description', () => client.setValue(locals.description, 'Hey hey! I am a cool description'));

          //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        }]);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      }]);

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      if ( i === 0 ) {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('should submit form',

          () => client.submitForm(locals.form)

        );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('form should hide',

          () => client.waitForVisible(locals.form, 3000, true)

        );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('should have created item in DB',

          () => Item.findOne({ subject })
            .then(item => { locals.item = item })

        );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('should be an item',

          describe.use(() => isItem(locals.item, { subject }))

        );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('should have new item in UI',

          () => { driver.waitForExisting(`#item-${locals.item._id}`, 2500) }

        );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        it('should be an item view',

          describe.use(() => isItemView(driver, locals.item))

        );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      }

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Leave', [ it => {
      it('should sign out', describe.use(() => signOut(client)));
    }]);



  });
}

export default test;
