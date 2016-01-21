'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from 'syn/../../dist/models/user';
import signOut                from 'syn/../../dist/test/util/e2e-sign-out';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Config                 from 'syn/../../dist/models/config';
import Item                   from 'syn/../../dist/models/item';
import identify               from 'syn/../../dist/test/util/e2e-identify';
import createItem             from 'syn/../../dist/test/util/e2e-create-item';
import selectors              from 'syn/../../selectors.json';
import isItem                 from 'syn/../../dist/test/is/item';
import isEvaluationView       from 'syn/../../dist/test/is/evaluation-view';

function test(props) {
  const locals = {
    subject : 'This is a subject',
    description : 'This is a description'
  };

  return testWrapper(
    'Story -> Create -> Create item with reference',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Populate data', it => {
        it('User', it => {
          it('should create user', () =>
            User.lambda().then(user => { locals.user = user })
          )
        });
      });

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      it('should sign in', describe.use(
        () => identify(wrappers.driver.client, locals.user)
      ));

      it('should close training', () => wrappers.driver.click(selectors.training.close, 2500));

      it('should click on toggle button', () => wrappers.driver.click(
        selectors.create.toggle
      ));

      it('should set reference with a value that does not begin by http://', () => wrappers.driver.client
        .setValue([
          selectors.create.form,
          selectors.create.reference
        ].join(' '), 'not an url')
      );

      it('should not show the loading icon', () => wrappers.driver.isNotVisible(
        `${selectors.create.form} ${selectors.create.looking.up.icon}`
      ));

      it('should set reference with a value that does begin by http://', () => wrappers.driver.client
        .setValue([
          selectors.create.form,
          selectors.create.reference
        ].join(' '), 'http://google.com')
      );

      it('should blur input', () => wrappers.driver.client.click(`${selectors.create.form} ${selectors.create.subject}`));

      it('should show the loading icon', () => wrappers.driver.isVisible(
        `${selectors.create.form} ${selectors.create.looking.up.icon}`
      ));

      it('should see the edit again icon', () => wrappers.driver.isVisible(
        `${selectors.create.form} ${selectors.create.edit.again.icon}`, 5000
      ));

      it('should have the title of the url', () =>
        wrappers.driver.hasValue(`${selectors.create.form} ${selectors.create.title}`, 'Google')
      );

      it('should click on the edit again icon', () => wrappers.driver.client.click(
        `${selectors.create.form} ${selectors.create.edit.again.icon}`
      ));

      it('should not show the loading icon', () => wrappers.driver.isNotVisible(
        `${selectors.create.form} ${selectors.create.looking.up.icon}`
      ));

      it('should not see the edit again icon', () => wrappers.driver.isNotVisible(
        `${selectors.create.form} ${selectors.create.edit.again.icon}`, 5000
      ));

      it('should not see title', () =>
        wrappers.driver.isNotVisible(`${selectors.create.form} ${selectors.create.title}`)
      );

      it('shoul show the url', () => {
        wrappers.driver.hasValue(`${selectors.create.form} ${selectors.create.reference}`, 'http://google.com')
      });

      it('should create item', describe.use(() => createItem(
        wrappers.driver,
        null,
        {
          subject : locals.subject,
          description : locals.description,
          reference : 'http://google.com'
        }
      )));

      it('Create form', it => {
        it('should have disappeared', () =>
          wrappers.driver.isNotVisible([
            selectors.topLevelPanel,
            selectors.accordion.main + `:first-child`
          ].join(' '), 2500)
        );
      });

      it('Get new item from DB', it => {
        it('should get item', () =>
          Item.findOne({ subject : locals.subject })
            .then(item => { locals.item = item })
        );

        it('should be an item', describe.use(() => isItem(locals.item, { references : [{ url : 'http://google.com', title : 'Google' }]})));
      });

      it('Evaluation', it => {
        it('should be an evaluation view',
          describe.use(() => isEvaluationView(
            wrappers.driver,
            locals.item,
            {
              cursor : 1,
              limit : 1
            }
          ))
        );
      });

    }
  );
}

export default test;
