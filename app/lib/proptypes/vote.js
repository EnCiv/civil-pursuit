'use strict';

import item             from './item';
import criteria         from './criteria';
import user             from './user';

import PropTypes from 'prop-types';

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool, oneOfType } = PropTypes;

const vote        =   shape({
  _id             :   string,
  item            :   oneOfType([string, item]),
  user            :   oneOfType([string, user]),
  criteria        :   oneOfType([string, criteria]),
  value           :   number
});

export default vote;
