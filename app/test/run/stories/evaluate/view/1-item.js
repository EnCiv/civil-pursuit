'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from 'syn/../../dist/models/user';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Item                   from 'syn/../../dist/models/item';
import Config                 from 'syn/../../dist/models/config';
import createItem             from 'syn/../../dist/test/util/e2e-create-item';
import selectors              from 'syn/../../selectors.json';
import isItem                 from 'syn/../../dist/test/is/item';
import identify               from 'syn/../../dist/test/util/e2e-identify';
import isEvaluationView       from 'syn/../../dist/test/is/evaluation-view';
import isDetailsView          from 'syn/../../dist/test/is/details-view';
import Feedback               from 'syn/../../dist/models/feedback';

function test(props) {
  const locals = {};

  return testWrapper(
    'Story -> Evaluation -> View -> 1 item',
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
            Item.lambda({ type : locals.topLevelType })
              .then(item => { locals.item = item })
          );

          it('should evaluate item', () =>
            Item.evaluate(locals.user, locals.item)
              .then(evaluation => { locals.evaluation = evaluation })
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

      it('should see item', () =>
        wrappers.driver.isVisible(
          `${selectors.item.id.prefix}${locals.item._id}`, 2500
        )
      );

      it('should click on evaluation toggler', () =>
        wrappers.driver.client.click([
          `${selectors.item.id.prefix}${locals.item._id}`,
          selectors.item.togglers.evaluation
        ].join(' '))
      );

      it('should be an evaluation view',
        describe.use(() => isEvaluationView(
          wrappers.driver,
          locals.item,
          {
            cursor : 1,
            limit : 1,
            left : locals.item,
            button : 'Finish'
          }
        ))
      );

      it('Verify item', it => {
        it('should get item from DB', ()=>
          Item.findById(locals.item).then(item => { locals.item = item })
        );

        it('should have view 0', () => {
          locals.item.views.should.be.exactly(0);
        });

        it('should have promotions 0', () => {
          locals.item.promotions.should.be.exactly(0);
        });

        it('Feedback', it => {
          it('Get feedback', () => Feedback.find({ item : locals.item})
            .then(feedback => { locals.feedback = feedback })
          );

          it('has no feedback', () => locals.feedback.should.have.length(0));
        });
      });

      it('Click on Finish', () => wrappers.driver.click(
        selectors.evaluation.button
      ));

      it('Shows details view', describe.use(() => isDetailsView(
        wrappers.driver, locals.item
      )));

    }
  );
}

export default test;
