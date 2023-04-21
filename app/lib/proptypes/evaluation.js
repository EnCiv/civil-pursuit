'use strict';

import type from './type';
import item from './item';
import criteria from './criteria';
import PropTypes from 'prop-types';

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool, oneOfType } = PropTypes;

const evaluation         =   shape({
  _id  : string,
  split : bool,
  type : oneOfType([string, type]),
  item : oneOfType([string, item]),
  items : arrayOf(oneOfType({string, item})),
  criterias : arrayOf(oneOfType({string, criteria})),
  position : oneOf(['first', 'last'])
});

export default evaluation;
