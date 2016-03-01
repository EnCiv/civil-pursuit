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
    'Story -> Evaluation -> Increment view',
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
          for ( let i = 0; i < 7; i ++ ) {
            it(`Item #${ i + 1 }`, it => {
              it('should create item', () =>
                Item.lambda({
                  type : locals.topLevelType,
                  subject : `Item #${ i + 1 }`
                })
                .then(item => { locals.items.push(item) })
              );
            });
          }
        });
      });

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      it('should sign in', describe.use(
        () => identify(wrappers.driver.client, locals.user)
      ));

      describe.pause(2000)(it)

      it('should close training', () => wrappers.driver.client.click(
        selectors.training.close
      ));

      it('should see item 6', () =>
        wrappers.driver.isVisible(
          `${selectors.item.id.prefix}${locals.items[5]._id}`, 2500
        )
      );

      it('should click on evaluation toggler of 1st item in list', () =>
        wrappers.driver.client.click([
          `${selectors.item.id.prefix}${locals.items[5]._id}`,
          selectors.item.togglers.evaluation
        ].join(' '))
      );

      it('should see evaluation', () => wrappers.driver.exists(
        `${selectors.evaluation.id.prefix}${locals.items[5]._id}`, 2000
      ));

      it('should scroll to finish button', it => {
        for ( let i = 0; i < 18; i ++ ) {
          it('should hit tab', () => wrappers.driver.client.keys(['\uE004']));
        }
      });

      for ( let i = 0; i < 3; i ++ ) {
        it('Left item ' + (i + 1), it => {
          it('should get item id', () =>
            wrappers.driver.client.getAttribute(
              selectors.evaluation.id.prefix + locals.items[5]._id +
                ' [data-screen="phone-and-up"] .promote-left ' +
                selectors.evaluation.promote,
              'id'
            )
            .then(id => { locals.promoted = id.split('-')[3] })
          );

          it(`should have 1 view`, it => {
            it('should get item from db', () => Item
              .findById(locals.promoted)
              .then(item => { locals.views = item.views })
            );

            it('views should be ' + 1, () =>
              locals.views.should.be.exactly(1)
            );
          });
        });

        it('Right item ' + (i + 1), it => {
          it('should get item id', () =>
            wrappers.driver.client.getAttribute(
              selectors.evaluation.id.prefix + locals.items[5]._id +
                ' [data-screen="phone-and-up"] .promote-right ' +
                selectors.evaluation.promote,
              'id'
            )
            .then(id => { locals.promoted = id.split('-')[3] })
          );

          it(`should have 1 view`, it => {
            it('should get item from db', () => Item
              .findById(locals.promoted)
              .then(item => { locals.views = item.views })
            );

            it('views should be ' + 1, () =>
              locals.views.should.be.exactly(1)
            );
          });
        });

        it('should press button', () =>
          wrappers.driver.client.keys(['\uE007'])
        );
      }
    }
  );
}

export default test;
