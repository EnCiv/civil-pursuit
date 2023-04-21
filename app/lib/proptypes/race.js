'use strict';

import PropTypes from 'prop-types';

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool } = PropTypes;

const race         =   shape({
  _id  : string,
  name : string
});

export default race;
