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

  function verifyItem (pos, views, promotions, feedback) {
    return it => {
      it('Verify item #' + (pos + 1), it => {
        it('should get item from DB', ()=>
          Item.findById(locals.dataItems.split(',')[pos])
            .then(item => { locals.thisItem = item })
        );

        it('should have view ' + views, () => {
          locals.thisItem.views.should.be.exactly(views);
        });

        it('should have promotions ' + promotions, () => {
          locals.thisItem.promotions.should.be.exactly(promotions);
        });

        it('Feedback', it => {
          it('Get feedback', () => Feedback.find({ item : locals.thisItem })
            .then(feedback => { locals.feedback = feedback })
          );

          it('has no feedback', () => locals.feedback.should.have.length(feedback));
        });
      });
    };
  }

  return testWrapper(
    'Story -> Evaluation -> View -> 4 items',
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

          it('Item #3', it => {
            it('should create item', () =>
              Item.lambda({ type : locals.topLevelType, subject : 'Item #3' })
                .then(item => { locals.items.push(item) })
            );
          });

          it('Item #4', it => {
            it('should create item', () =>
              Item.lambda({ type : locals.topLevelType, subject : 'Item #4' })
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

      describe.pause(1000)(it);

      it('Data items', it => {
        it('should get data items', () => wrappers.driver.client.getAttribute(
          selectors.evaluation.id.prefix + locals.items[0]._id,
          'data-items'
        ).then(items => { locals.dataItems = items }));

        it('should have 4 items', () => {
          locals.dataItems.split(',').should.have.length(4)
        });
      });

      it('1st cycle', it => {
        it('should be an evaluation view',
          describe.use(() => isEvaluationView(
            wrappers.driver,
            locals.items[0],
            {
              cursor : 1,
              limit : 3,
              button : 'Neither'
            }
          ))
        );

        it('Verify item #1', describe.use(() => verifyItem(0, 1, 0, 0)));

        it('Verify item #2', describe.use(() => verifyItem(1, 1, 0, 0)));

        it('Verify item #3', describe.use(() => verifyItem(2, 0, 0, 0)));

        it('Verify item #4', describe.use(() => verifyItem(3, 0, 0, 0)));

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
        });

        it('Click on Neither', () => wrappers.driver.click(
          selectors.evaluation.button
        ));

        describe.pause(1000)(it);
      });

      it('2nd cycle', it => {
        it('should be an evaluation view',
          describe.use(() => isEvaluationView(
            wrappers.driver,
            locals.items[0],
            {
              cursor : 3,
              limit : 3,
              button : 'Finish'
            }
          ))
        );

        it('Verify item #1', describe.use(() => verifyItem(0, 1, 0, 0)));

        it('Verify item #2', describe.use(() => verifyItem(1, 1, 0, 0)));

        it('Verify item #3', describe.use(() => verifyItem(2, 1, 0, 0)));

        it('Verify item #4', describe.use(() => verifyItem(3, 1, 0, 0)));

        it('Left item', it => {
          it('get left item id', () => wrappers.driver.client.getAttribute(
            selectors.evaluation.id.prefix + locals.items[0]._id +
            ' [data-screen="phone-and-up"] .item-subject.left',
            'id'
          ).then(id => { locals.leftId = id.split('-')[2] }));

          it('should match data items', () => {
            locals.leftId.should.be.exactly(locals.dataItems.split(',')[2]);
          });
        });

        it('Right item', it => {
          it('get right item id', () => wrappers.driver.client.getAttribute(
            selectors.evaluation.id.prefix + locals.items[0]._id +
            ' [data-screen="phone-and-up"] .item-subject.right',
            'id'
          ).then(id => { locals.rightId = id.split('-')[2] }));

          it('should match data items', () => {
            locals.rightId.should.be.exactly(locals.dataItems.split(',')[3]);
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
    }
  );
}

export default test;
