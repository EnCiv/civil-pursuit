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
    'Story -> Create -> Create item with missing fields',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      function usecase (createItemOptions = {}) {
        return it => {
          it('should create item', describe.use(() => createItem(
            wrappers.driver,
            null,
            createItemOptions
          )));

          it('Create form', it => {
            it('should still be here', () =>
              wrappers.driver.isVisible([
                selectors.topLevelPanel,
                selectors.accordion.main + `:first-child`
              ].join(' '))
            );
          });

          it('No new item in DB', it => {
            it('should attempt to get item', () =>
              Item.findOne({ subject : locals.subject })
                .then(item => { locals.item = item })
            );

            it('should be null', () => {
              should(locals.item).be.undefined();
            });
          });

          it('Evaluation', it => {
            it('should not be an evaluation view', () =>
              wrappers.driver.doesNotExist(selectors.evaluation.className)
            );
          });
        };
      }

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

      it('should click on toggle button', () => wrappers.driver.client.click(
        selectors.create.toggle
      ));

      it('Empty form', describe.use(() => usecase({
        error : 'Subject can not be left empty'
      })));

      it('Form only has subject', describe.use(() => usecase({
        subject : 'subject - test story create item with missing fields',
        error : 'Description can not be left empty'
      })));

      it('Form only has description', describe.use(() => usecase({
        description : 'description - test story create item with missing fields',
        error : 'Subject can not be left empty'
      })));

    }
  );
}

export default test;
