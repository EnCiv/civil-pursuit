'use strict';

import React from 'react';

const { PropTypes } =   React;

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool } = PropTypes;

let type;

type                =   shape({
  _id               :   string.isRequired,
  name              :   string.isRequired,
  harmony           :   arrayOf(type),
  parent            :   type
});

export default type;
