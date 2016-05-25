'use strict';

import React            from 'react';
import item             from './item';
import user             from './user';

const { PropTypes } =   React;

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool, oneOfType } = PropTypes;

const upvote        =   shape({
  _id             :   string,
  item            :   oneOfType([string, item]),
  user            :   oneOfType([string, user]),
  value           :   number,
  date            :   oneOfType([string, instanceOf(Date)]).isRequired,
});

export default upvote;
