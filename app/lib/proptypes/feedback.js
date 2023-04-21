'use strict';

import item                           from './item';
import user                           from './user';

import PropTypes from 'prop-types';

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool, oneOfType } = PropTypes;

const feedback         =   shape({
  _id  : string,
  item : oneOfType([string, item]),
  user : oneOfType([string, user]),
  feedback : string,
  created : oneOfType([instanceOf(Date), string])
});

export default feedback;
