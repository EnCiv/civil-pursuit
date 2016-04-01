'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from '../../../../models/user';
import testWrapper            from '../../../../lib/app/test-wrapper';
import Item                   from '../../../../models/item';
import Config                 from '../../../../models/config';
import Feedback               from '../../../../models/feedback';
import createItem             from '../../../util/e2e-create-item';
import selectors              from '../../../../../selectors.json';
import isItem                 from '../../../is/item';

function test(props) {
  const locals = {};

  return testWrapper(
    'Story -> Details -> Feedback',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Populate data', it => {
        it('Top Level Type', it => {
          it('should get top level type from config', () =>
            Config.get('top level type')
              .then(type => { locals.topLevelType = type })
          )
        });

        it('Item', it => {
          it('should create item', () =>
            Item.lambda({ type : locals.topLevelType })
              .then(item => { locals.item = item })
          );

          it('should get item details', () =>
            Item.getDetails(locals.item)
              .then(details => { locals.details = details })
          );
        });
      });

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      it('should close training', () =>
        wrappers.driver.click(selectors.training.close, 2500)
      );

      it('should see item', () =>
        wrappers.driver.isVisible(
          `${selectors.item.id.prefix}${locals.item._id}`, 2500
        )
      );

      it('should click on details toggler', () =>
        wrappers.driver.client.click([
          `${selectors.item.id.prefix}${locals.item._id}`,
          selectors.item.togglers.details
        ].join(' '))
      );

      it('should see item details', () =>
        wrappers.driver.isVisible(
          `${selectors.details.id.prefix}${locals.item._id}`
        )
      );

      it('should not see details feedback', () =>
        wrappers.driver.isNotVisible([
          `${selectors.details.id.prefix}${locals.item._id}`,
          selectors.feedback.wrapper
        ].join(' '))
      );

      it('inserts new feedback', () => Feedback.insert({
        item : locals.item,
        user : locals.item.user,
        feedback : "This is amazing, yet I disagree!"
      }).then(document => { locals.document = document }));

      it('should see details feedback', () =>
        wrappers.driver.isVisible([
          `${selectors.details.id.prefix}${locals.item._id}`,
          selectors.feedback.wrapper
        ].join(' '), 2500)
      );

      it('should say 1 feedback', () => wrappers.driver.hasText([
          `${selectors.details.id.prefix}${locals.item._id}`,
          selectors.feedback.number
        ].join(' '), '1 feedback'
      ));

      it('should scroll to feedback', () => wrappers.driver.client.scroll([
          `${selectors.details.id.prefix}${locals.item._id}`,
          selectors.feedback.wrapper
        ].join(' ')));

      it('should get feedback from DOM', () => wrappers.driver.client
        .getText([
          `${selectors.details.id.prefix}${locals.item._id}`,
          selectors.feedback.entry
        ].join(' '))
        .then(feedback => { locals.feedback = feedback })
      );

      it('should have 1 feedback', () =>
        locals.feedback.should.be.a.String()
          .and.is.exactly(locals.document.feedback)
      );
    }
  );
}

export default test;
