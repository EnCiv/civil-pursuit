'use strict';

import selectors              from 'syn/../../selectors.json';
import Criteria               from 'syn/../../dist/models/criteria';
import Vote                   from 'syn/../../dist/models/vote';
import Popularity             from 'syn/../../dist/lib/app/popularity';

function isDetailsView (driver, item) {
  const locals = {
    element : selectors.details.id.prefix + item._id
  }

  return it => {
    it('should have a details view for item', () =>
      driver.exists(locals.element)
    );

    it('Popularity', it => {
      it('should get popularity', () => {
        locals.popularity = new Popularity(item.views, item.promotions)
      });

      it('should have popularity bar', () => driver.exists(
        locals.element + ' ' + selectors.popularity
      ));

      it('should be the right value', () => driver.hasText(
        locals.element + ' ' + selectors.popularity,
        locals.popularity.toString()
      ));
    });

    it('Votes', it => {
      it('should get criterias', () =>
        Criteria.find().then(criterias => { locals.criterias = criterias })
      );

      it('should get votes', () => Vote.getAccumulation(item)
        .then(votes => { locals.votes = votes })
      );

      it('each criterias are in view', () =>
        Promise.all(locals.criterias.map(criteria => driver.isVisible([
          locals.element,
          `${selectors.vote.id.prefix}${criteria._id}`
        ].join(' '))))
      );

      it('each criterias have the correct number of votes', it => {
        for ( let criteria in locals.votes ) {
          it('should have the right votes', () => driver.hasText([
            locals.element,
            `${selectors.vote.id.prefix}${criteria}`,
            selectors.vote.label.legend
          ].join(' '), locals.votes[criteria].total + ' vote(s)'));
        }
      });
    });
  };
}

export default isDetailsView;
