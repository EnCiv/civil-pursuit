'use strict';

import React            from 'react';
import item             from './item';
import criteria         from './criteria';
import user             from './user';

const { PropTypes } =   React;

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool, oneOfType } = PropTypes;

const vote        =   shape({
  _id             :   string,
  item            :   oneOfType([string, item]),
  user            :   oneOfType([string, user]),
  criteria        :   oneOfType([string, criteria]),
  value           :   number
});

export default vote;
