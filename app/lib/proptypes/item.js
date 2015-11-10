'use strict';

import React from 'react';

const { PropTypes } =   React;

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool } = PropTypes;

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
  type              :   string.isRequired,
  parent            :   string,
  from              :   string,
  user              :   string.isRequired,
  promotions        :   number.isRequired,
  views             :   number.isRequired
});

export default item;
