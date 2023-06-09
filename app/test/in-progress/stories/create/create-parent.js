'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from '../../../../models/user';
import signOut                from '../../../util/e2e-sign-out';
import testWrapper            from '../../../../lib/app/test-wrapper';
import Config                 from '../../../../models/config';
import Item                   from '../../../../models/item';
import identify               from '../../../util/e2e-identify';
import createItem             from '../../../util/e2e-create-item';
import selectors              from '../../../../../selectors.json';
import isItem                 from '../../../is/item';
import isEvaluationView       from '../../../is/evaluation-view';

function test(props) {
  const locals = {
    subject : 'This is a subject',
    description : 'This is a description'
  };

  return testWrapper(
    'Story -> Create -> Parent item',
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

      describe.pause(1500)(it);

      it('should click on toggle button', () => wrappers.driver.click(
        selectors.create.toggle
      ));

      it('should create item', describe.use(() => createItem(
        wrappers.driver,
        null,
        {
          subject : locals.subject,
          description : locals.description
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

        it('should be an item', describe.use(() => isItem(locals.item)));
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
