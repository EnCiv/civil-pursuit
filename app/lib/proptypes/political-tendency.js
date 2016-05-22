'use strict';

import React from 'react';

const { PropTypes } =   React;

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool } = PropTypes;

const politicalTendency         =   shape({
  _id  : string,
  name : string
});

export default politicalTendency;
