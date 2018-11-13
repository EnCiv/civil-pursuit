'use strict';

import item from './item';
import type from './type';
import user from './user';

import PropTypes from 'prop-types';

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool } = PropTypes;

const panelItem     =   shape({
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
  parent            :   string,
  from              :   string,
  user              :   user.isRequired,
  promotions        :   number.isRequired,
  views             :   number.isRequired,
  popularity        :   shape({
    number          :   number.isRequired,
    promotions      :   number.isRequired,
    views           :   number.isRequired,
    ok              :   bool.isRequired
  }),
  link              :   string.isRequired,
  lineage           :   arrayOf(item),
  subtype           :   type,
  votes             :   number.isRequired,
  children          :   number.isRequired,
  harmony           :   shape({
    harmony         :   number
  }).isRequired,
  profiles          :   arrayOf(string),
  new_location      :   string
});

export default panelItem;
