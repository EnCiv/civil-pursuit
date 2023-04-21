'use strict';

import PropTypes from 'prop-types';

const instruction   =   PropTypes.shape({
  element           :   PropTypes.string.isRequired,
  step              :   PropTypes.number.isRequired,
  title             :   PropTypes.string.isRequired,
  description       :   PropTypes.string.isRequired,
  in                :   PropTypes.bool,
  click             :   PropTypes.string,
  wait              :   PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  listen            :   PropTypes.string
});

export default instruction;
