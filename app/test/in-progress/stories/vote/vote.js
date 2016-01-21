'use strict';

import describe               from 'redtea';
import testWrapper            from 'syn/../../dist/lib/app/test-wrapper';
import Item                   from 'syn/../../dist/models/item';
import User                   from 'syn/../../dist/models/user';
import Vote                   from 'syn/../../dist/models/vote';
import Config                 from 'syn/../../dist/models/config';
import Criteria               from 'syn/../../dist/models/criteria';
import selectors              from 'syn/../../selectors.json';
import identify               from 'syn/../../dist/test/util/e2e-identify';
import evaluateItem           from 'syn/../../dist/test/util/e2e-evaluate-item';
import isDetailsView          from 'syn/../../dist/test/is/details-view';

function test (props = {}) {
  const locals = {
    firstPass : [1, 0, -1, 1],
    secondPass : [0, 1, -1, 1],
    average : []
  };

  return testWrapper(
    'Story -> Vote',
    {
      mongodb : true,
      http : { verbose : true },
      driver : true
    },
    wrappers => it => {
      it('Populate data', it => {
        it('should get top level type', () =>
          Config.get('top level type').then(type => { locals.type = type })
        );

        it('should create item', () =>
          Item.lambda({ type : locals.type })
          .then(item => { locals.item = item })
        );

        it('should create user', () =>
          User.lambda().then(user => { locals.user = user })
        );

        it('should get criterias', () =>
          Criteria.find().then(criterias => { locals.criterias = criterias })
        );
      });

      it('should go to home page', () =>
        wrappers.driver.client
          .url(`http://localhost:${wrappers.http.app.get('port')}`)
      );

      it('should sign in', it => {
        identify(wrappers.driver.client, locals.user)(it)
      });

      it('should close training', () => wrappers.driver.click(
        selectors.training.close, 5000
      ));

      it('1st pass', it => {
        it('should evaluate', describe.use(() => evaluateItem(
          wrappers.driver,
          locals.item,
          { votes : locals.firstPass }
        )));

        it('Verify votes', it => {
          it('should get votes', () => Vote.find({ item : locals.item })
            .then(votes => { locals.votes = votes })
          );

          it('there should be 4 votes', () => {
            locals.votes.should.have.length(4);
          });

          for ( let i of [0, 1, 2, 3] ) {
            it(`vote should ${locals.firstPass[i]}`, () => {
              locals.votes[i].value.should.be.exactly(locals.firstPass[i]);
            });
          }

          it('has the right details', describe.use(() => isDetailsView(wrappers.driver, locals.item)));
        });
      });

      it('2nds pass', it => {
        it('should evaluate', describe.use(() => evaluateItem(
          wrappers.driver,
          locals.item,
          { votes : locals.secondPass }
        )));

        it('Verify votes', it => {
          it('should get votes', () => Vote.count({ item : locals.item })
            .then(count => { locals.count = count })
          );

          it('there should be 8 votes', () => {
            locals.count.should.be(8);
          });

          it('should get accumulation', () => Vote.getAccumulation(locals.item)
            .then(votes => { locals.votes = votes })
          );

          for ( let i of locals.criterias ) {
            it('should have the correct values for -1', () => {
              let iterations = 0;

              if ( locals.firstPass[i] === -1 ) {
                iterations ++;
              }

              if ( locals.secondPass[i] === -1 ) {
                iterations ++;
              }

              locals.votes[i].values['-1'].should.be.exactly(iterations);
            });
          }

          it('has the right details', describe.use(() => isDetailsView(wrappers.driver, locals.item)));
        });
      });

      describe.pause(1599999)(it);
    }
  );
}

export default test;
