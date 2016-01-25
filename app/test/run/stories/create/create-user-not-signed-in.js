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
    'Story -> Create -> User not signed-in',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      // describe.pause(3000)(it);

      it('should close training', () => wrappers.driver.click(
        selectors.training.close, 2500
      ));

      it('should click on toggle button', () => wrappers.driver.client.click(
        selectors.create.toggle
      ));

      it('Create form', it => {
        it('should not have appeared', () =>
          wrappers.driver.isNotVisible([
            selectors.topLevelPanel,
            selectors.accordion.main + `:first-child`
          ].join(' '))
        );
      });

      it('Join form', it => {
        it('should have appeared', () =>
          wrappers.driver.isVisible([
            selectors.join.form
          ].join(' '))
        );

        it('should close', () =>
          wrappers.driver.client.click(selectors.join.close)
        );
      });

      it('Click to create', it => {

        describe.pause(1000)(it);

        it('should click on create link', () => wrappers.driver.client.click(
          selectors.panel.createLink
        ));

        it('should click on create link', () => wrappers.driver.client.click(
          selectors.panel.createLink
        ));

        // it('should click on create link', () => wrappers.driver.client.click(
        //   selectors.panel.createLink
        // ));

        it('should show join form', () =>
          wrappers.driver.isVisible([
            selectors.join.form
          ].join(' '), 2500)
        );
      });

    }
  );
}

export default test;
