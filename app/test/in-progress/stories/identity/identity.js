'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from 'syn/../../dist/models/user';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Config                 from 'syn/../../dist/models/config';
import Item                   from 'syn/../../dist/models/item';
import identify               from 'syn/../../dist/test/util/e2e-identify';
import createItem             from 'syn/../../dist/test/util/e2e-create-item';
import selectors              from 'syn/../../selectors.json';
import isItem                 from 'syn/../../dist/test/is/item';
import isEvaluationView       from 'syn/../../dist/test/is/evaluation-view';
import Agent                  from 'syn/../../dist/lib/app/agent';

function test(props) {
  const locals = {};

  return testWrapper(
    'Story -> Identity',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Populate data', it => {
        it('User', it => {
          it('should create user', () =>
            User.lambda().then(user => { locals.user = user })
          )
        });
      });

      it('should go home', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}/`)
      );

      it('should sign in', describe.use(
        () => identify(wrappers.driver.client, locals.user)
      ));

      it('should go to profile', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}/page/profile`)
      );

      it('should see Identity panel', () => wrappers.driver.isVisible(
        selectors.identity.selector, 2500
      ));

      it('should have an uploader', () =>
        wrappers.driver.isVisible(selectors.identity.uploader)
      );

      it('should download image', () => Agent.download(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Tim_Bartel.jpg/196px-Tim_Bartel.jpg',
        '/tmp/syn-test-story-identity.jpg'
      ));

      it('should set it as value', () =>
        wrappers.driver.client.setValue(
          selectors.identity.image.input,
          '/tmp/syn-test-story-identity.jpg'
        )
      );

      it('should see image', () =>
        wrappers.driver.isVisible(selectors.identity.image.preview, 5000)
      );

    }
  );
}

export default test;
