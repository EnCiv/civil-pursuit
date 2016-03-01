'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from '../../../../models/user';
import testWrapper            from '../../../../lib/app/test-wrapper';
import Item                   from '../../../../models/item';
import Config                 from '../../../../models/config';
import createItem             from '../../../util/e2e-create-item';
import selectors              from '../../../../../selectors.json';
import isItem                 from '../../../is/item';
import identify               from '../../../util/e2e-identify';
import isEvaluationView       from '../../../is/evaluation-view';
import isDetailsView          from '../../../is/details-view';
import Feedback               from '../../../../models/feedback';
import isFeedback             from '../../../is/feedback';

function test(props) {
  const locals = {
    items : []
  };

  return testWrapper(
    'Story -> Edit And Go Again -> Promoted item Rgeular Screen Right',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Populate data', it => {
        it('User', it => {
          it('should create user', () =>
            User.lambda().then(user => { locals.user = user })
          )
        });

        it('Top Level Type', it => {
          it('should get top level type from config', () =>
            Config.get('top level type')
              .then(type => { locals.topLevelType = type })
          )
        });

        it('Item', it => {
          it('should create item', () =>
            Item.lambda({ type : locals.topLevelType, subject : 'Item #1' })
              .then(item => { locals.items.push(item) })
          );

          it('should create item', () =>
            Item.lambda({ type : locals.topLevelType, subject : 'Item #2' })
              .then(item => { locals.items.push(item) })
          );
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
        selectors.training.close, 5000
      ));

      it('should see item 1', () =>
        wrappers.driver.isVisible(
          `${selectors.item.id.prefix}${locals.items[0]._id}`, 2500
        )
      );

      it('should click on evaluation toggler', () =>
        wrappers.driver.client.click([
          `${selectors.item.id.prefix}${locals.items[0]._id}`,
          selectors.item.togglers.evaluation
        ].join(' '))
      );

      it('should see evaluation', () => wrappers.driver.exists(
        `${selectors.evaluation.id.prefix}${locals.items[0]._id}`, 2000
      ));

      it('should click edit and go again button', () =>
        wrappers.driver.click([
          `${selectors.evaluation.id.prefix}${locals.items[0]._id}`,
          '[data-screen="phone-and-up"]',
          '.promote-left',
          selectors.evaluation['edit-and-go-again']
        ].join(' '))
      );

      it('should see editor', () =>
        wrappers.driver.isVisible(
          `${selectors.item.id.prefix}${locals.items[1]._id} ${selectors.edit}`,
          2500
        )
      );
    }
  );
}

export default test;
