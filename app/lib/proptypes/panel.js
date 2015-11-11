'use strict';

import React from 'react';
import type from './type';
import item from './item';

const { PropTypes } =   React;

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool } = PropTypes;

const panel         =   shape({
  panel             :   shape({
    type,
    parent          :   item
  }),
  items             :   arrayOf(item)
});

export default panel;
