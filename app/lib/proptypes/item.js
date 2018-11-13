'use strict';

import type from './type';
import user from './user';

import PropTypes from 'prop-types';

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool, oneOfType } = PropTypes;

const item          =   shape({
  _id               :   string,
  id                :   string.isRequired,
  image             :   string,
  references        :   arrayOf[shape({
    url             :   string.isRequired,
    title           :   string
  })],
  subject           :   string.isRequired,
  description       :   string.isRequired,
  type              :   type.isRequired,
  subtype           :   type,
  parent            :   string,
  from              :   string,
  user              :   user.isRequired,
  promotions        :   number.isRequired,
  views             :   number.isRequired,
  profiles          :   arrayOf(string),
  new_location      :   string
});

export default item;
