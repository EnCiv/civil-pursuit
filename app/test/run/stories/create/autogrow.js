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
    'Story -> Create -> Autogrow',
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

      it('should get all the size of textara', () =>
        wrappers.driver.client
          .getElementSize(selectors.create.description)
          .then(size => { locals.size = size })
      );

      it('should be 100 pixels high', () => {
        locals.size.height.should.be.exactly(100);
      });

      it('should enter multi lines', () => wrappers.driver.client.setValue(
        selectors.create.description,
        "1\n2\n3\n4\n5\n6\n7\n8\n9\n10"
      ));

      it('should get all the size of textara', () =>
        wrappers.driver.client
          .getElementSize(selectors.create.description)
          .then(size => { locals.size = size })
      );

      it('should be more than 100 pixels high', () => {
        locals.size.height.should.be.above(100);
      });

    }
  );
}

export default test;
