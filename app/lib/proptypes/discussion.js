'use strict';

import user from './user';
import PropTypes from 'prop-types';

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool, oneOfType } = PropTypes;

let discussion;

discussion          =   shape({
  _id               :   string.isRequired,
  subject           :   string.isRequired,
  description       :   string.isRequired,
  deadline          :   oneOfType([string, instanceOf(Date)]).isRequired,
  starts            :   oneOfType([string, instanceOf(Date)]).isRequired,
  goal              :   number.isRequired,
  registered        :   arrayOf(oneOfType([user, string])).isRequired
});

export default discussion;
