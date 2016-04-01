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
  const locals = {
    items : []
  };

  return testWrapper(
    'Story -> Evaluation -> View -> 2 items',
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
          it('Item #1', it => {
            it('should create item', () =>
              Item.lambda({ type : locals.topLevelType, subject : 'Item #1' })
                .then(item => { locals.items.push(item) })
            );
          });

          it('Item #2', it => {
            it('should create item', () =>
              Item.lambda({ type : locals.topLevelType, subject : 'Item #2' })
                .then(item => { locals.items.push(item) })
            );
          });
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

      it('item #1', it => {
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

        it('should be an evaluation view',
          describe.use(() => isEvaluationView(
            wrappers.driver,
            locals.items[0],
            {
              cursor : 1,
              limit : 1,
              left : locals.items[1],
              right : locals.items[0],
              button : 'Finish'
            }
          ))
        );

        it('Data items', it => {
          it('should get data items', () => wrappers.driver.client.getAttribute(
            selectors.evaluation.id.prefix + locals.items[0]._id,
            'data-items'
          ).then(items => { locals.dataItems = items }));

          it('should have 2 items', () => {
            locals.dataItems.split(',').should.have.length(2)
          });
        });

        it('Verify item', it => {
          it('should get item from DB', ()=>
            Item.findById(locals.items[0])
              .then(item => { locals.items[0] = item })
          );

          it('should have view 1', () => {
            locals.items[0].views.should.be.exactly(1);
          });

          it('should have promotions 0', () => {
            locals.items[0].promotions.should.be.exactly(0);
          });

          it('Feedback', it => {
            it('Get feedback', () => Feedback.find({ item : locals.items[0] })
              .then(feedback => { locals.feedback = feedback })
            );

            it('has no feedback', () => locals.feedback.should.have.length(0));
          });
        });

        it('Left item', it => {
          it('get left item id', () => wrappers.driver.client.getAttribute(
            selectors.evaluation.id.prefix + locals.items[0]._id +
            ' [data-screen="phone-and-up"] .item-subject.left',
            'id'
          ).then(id => { locals.leftId = id.split('-')[2] }));

          it('should match data items', () => {
            locals.leftId.should.be.exactly(locals.dataItems.split(',')[0]);
          });
        });

        it('Right item', it => {
          it('get right item id', () => wrappers.driver.client.getAttribute(
            selectors.evaluation.id.prefix + locals.items[0]._id +
            ' [data-screen="phone-and-up"] .item-subject.right',
            'id'
          ).then(id => { locals.rightId = id.split('-')[2] }));

          it('should match data items', () => {
            locals.rightId.should.be.exactly(locals.dataItems.split(',')[1]);
          });

          it('should be the evaluee', () => locals.rightId.should.be.exactly(locals.items[0]._id.toString()));
        });

        it('Click on Finish', () => wrappers.driver.click(
          selectors.evaluation.button
        ));

        it('Shows details view', describe.use(() => isDetailsView(
          wrappers.driver, locals.items[0]
        )));
      });

      it('Item #2', it => {
        it('should see item 2', () =>
          wrappers.driver.isVisible(
            `${selectors.item.id.prefix}${locals.items[1]._id}`
          )
        );
      });

    }
  );
}

export default test;
