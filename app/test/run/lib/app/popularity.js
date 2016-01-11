'use strict';

import describe             from 'redtea';
import Popularity           from 'syn/../../dist/lib/app/popularity';
import isPopularity         from 'syn/../../dist/test/is/popularity';

function testPopularity (props) {
  const locals = {};

  return describe ( 'Lib/ App / Popularity' , it => {
    it('0 Views, 0 Promotions', describe.use(() => isPopularity(
        new Popularity(0, 0), 0, 0, 0, true, '0%'
      ))
    );

    it('1 Views, 0 Promotions', describe.use(() => isPopularity(
        new Popularity(1, 0), 1, 0, 0, true, '0%'
      ))
    );

    it('1 Views, 1 Promotions', describe.use(() => isPopularity(
        new Popularity(1, 1), 1, 1, 100, true, '100%'
      ))
    );

    it('2 Views, 1 Promotions', describe.use(() => isPopularity(
        new Popularity(2, 1), 2, 1, 50, 0, true, '50%'
      ))
    );

    it('3 Views, 1 Promotions', describe.use(() => isPopularity(
        new Popularity(3, 1), 3, 1, 34, true, '34%'
      ))
    );

    it('3 Views, 2 Promotions', describe.use(() => isPopularity(
        new Popularity(3, 2), 3, 2, 67, true, '67%'
      ))
    );

    it('3 Views, 3 Promotions', describe.use(() => isPopularity(
        new Popularity(3, 3), 3, 3, 100, true, '100%'
      ))
    );

    it('3 Views, 4 Promotions', describe.use(() => isPopularity(
        new Popularity(3, 4), 3, 4, 134, false, Popularity.errorToString
      ))
    );
  } );
}

export default testPopularity;
