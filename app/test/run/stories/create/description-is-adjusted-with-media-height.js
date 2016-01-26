'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from 'syn/../../dist/models/user';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Config                 from 'syn/../../dist/models/config';
import Item                   from 'syn/../../dist/models/item';
import identify               from 'syn/../../dist/test/util/e2e-identify';
import selectors              from 'syn/../../selectors.json';

function test(props) {
  const locals = {};

  return testWrapper(
    'Story -> Create -> Description is adjusted with media height',
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

      it('should close training', () => wrappers.driver.click(
        selectors.training.close, 2500
      ));

      it('should click on toggle button', () => wrappers.driver.click(
        selectors.create.toggle
      ));

      it('should see description', () => wrappers.driver.isVisible(
        selectors.create.description, 2500
      ));

      it('should get description\'s height', () =>
        wrappers.driver.client
          .getElementSize(
            selectors.create.description
          )
          .then(size => { locals.height = size.height })
      );

      it('should be 100 pixels', () => {
        locals.height.should.be.exactly(100);
      });

    }
  );
}

export default test;
