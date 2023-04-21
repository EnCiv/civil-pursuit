'use strict';

import PropTypes from 'prop-types';

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool } = PropTypes;

const criteria         =   shape({
  _id  : string,
  name : string,
  description : string
});

export default criteria;
