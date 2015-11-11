'use strict';

import React from 'react';
import type from './type';
import user from './user';

const { PropTypes } =   React;

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
  parent            :   string,
  from              :   string,
  user              :   user.isRequired,
  promotions        :   number.isRequired,
  views             :   number.isRequired
});

export default item;
