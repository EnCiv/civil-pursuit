'use strict';

import type from './type';
import item from './item';

import PropTypes from 'prop-types';

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool } = PropTypes;

const panel         =   shape({
  panel             :   shape({
    type,
    parent          :   item
  }),
  items             :   arrayOf(item)
});

export default panel;
