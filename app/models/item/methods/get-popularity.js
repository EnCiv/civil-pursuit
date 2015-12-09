'use strict';

import Popularity from '../../../lib/app/popularity';

function getPopularity () {
  return new Popularity(this.views, this.promotions);
}

export default getPopularity;
