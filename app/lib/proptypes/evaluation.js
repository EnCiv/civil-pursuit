'use strict';

import React from 'react';
import type from './type';
import item from './item';
import criteria from './criteria';

const { PropTypes } =   React;

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
