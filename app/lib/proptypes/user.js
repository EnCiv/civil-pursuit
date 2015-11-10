'use strict';

import React from 'react';

const { PropTypes } =   React;

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool } = PropTypes;

const user          =   shape({
  _id               :   string,
  email             :   string.isRequired,
  image             :   string,
  preferences       :   arrayOf[shape({
    name            :   string,
    value           :   any
  })],
  twitter           :   string,
  facebook          :   string,
  first_name        :   string,
  middle_name       :   string,
  last_name         :   string,
  gps               :   arrayOf(number),
  'gps validated'   :   instanceOf(Date),
  activation_key    :   string,
  activation_token  :   string,
  race              :   arrayOf(string),
  gender            :   oneOf(['M', 'F', 'O']),
  married           :   string,
  education         :   string,
  employment        :   string,
  citizenship       :   arrayOf(string),
  dob               :   instanceOf(Date),
  registered_voter  :   bool,
  party             :   string,
  city              :   string,
  state             :   string,
  zip               :   string,
  zip4              :   string
});

export default user;
