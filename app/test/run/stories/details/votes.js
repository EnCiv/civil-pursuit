'use strict';

import describe               from 'redtea';
import should                 from 'should';
import User                   from '../../../../models/user';
import testWrapper            from '../../../../lib/app/test-wrapper';
import Item                   from '../../../../models/item';
import Vote                   from '../../../../models/vote';
import Config                 from '../../../../models/config';
import Criteria               from '../../../../models/criteria';
import createItem             from '../../../util/e2e-create-item';
import selectors              from '../../../../../selectors.json';
import isItem                 from '../../../is/item';

function test(props) {
  const locals = {};

  return testWrapper(
    'Story -> Details -> Votes',
    { mongodb : true, http : { verbose : true }, driver : true },
    wrappers => it => {

      it('Populate data', it => {
        it('Criterias', it => {
          it('should get criterias', () =>
            Criteria.find()
              .then(criterias => { locals.criterias = criterias })
          );
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

      it('should see votes', () =>
        wrappers.driver.isVisible([
          `${selectors.details.id.prefix}${locals.item._id}`,
          selectors.votes
        ].join(' '))
      );

      it('should have 0 votes', it => {
        locals.criterias.forEach(criteria => {
          it(`Criteria ${criteria.name} should have 0 votes`, () =>
            wrappers.driver.hasText([
              `${selectors.details.id.prefix}${locals.item._id}`,
              selectors.votes,
              selectors.vote.id.prefix + criteria._id,
              selectors.vote.label.legend
            ].join(' '), '0 vote(s)')
          );

          it('Bar of -1 is 0', () => new Promise((ok, ko) => {
            wrappers.driver.client
              .getAttribute([
                `${selectors.details.id.prefix}${locals.item._id}`,
                selectors.votes,
                selectors.vote.id.prefix + criteria._id,
                selectors.vote.minus1
              ].join(' '), 'd')
              .then(d => {
                console.log({ d });
                /L30\.2,25/.test(d).should.be.true();
                ok();
              })
              .catch(ko);
          }));
        });
      });

      it('should add votes of -1 for all', () => Promise.all(
        locals.criterias.map(criteria => Vote.create({
          item : locals.item,
          criteria,
          user : locals.item.user,
          value: -1
        }))
      ));

      it('should have 1 votes', it => {
        locals.criterias.forEach(criteria => {
          it(`Criteria ${criteria.name} should have 1 votes`, () =>
            wrappers.driver.hasText([
              `${selectors.details.id.prefix}${locals.item._id}`,
              selectors.votes,
              selectors.vote.id.prefix + criteria._id,
              selectors.vote.label.legend
            ].join(' '), '1 vote(s)')
          );

          it('Bar of -1 is 0', () => new Promise((ok, ko) => {
            wrappers.driver.client
              .getAttribute([
                `${selectors.details.id.prefix}${locals.item._id}`,
                selectors.votes,
                selectors.vote.id.prefix + criteria._id,
                selectors.vote.minus1
              ].join(' '), 'd')
              .then(d => {
                console.log({ d });
                /L30\.2,0\.757575757575756/.test(d).should.be.true();
                ok();
              })
              .catch(ko);
          }));
        });
      });
    }
  );
}

export default test;
