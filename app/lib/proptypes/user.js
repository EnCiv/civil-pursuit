'use strict';

import React from 'react';

const { PropTypes } =   React;

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool } = PropTypes;

const user          =   shape({
  _id               :   string,
  email             :   string,
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
  citizenship       :   string,
  dualcitizenship   :   string,
  dob               :   instanceOf(Date),
  registered_voter  :   bool,
  party             :   string,
  tendency          :   string,
  city              :   string,
  state             :   string,
  zip               :   string,
  zip4              :   string,
  neighborhood      :   string,
  member_type       :   string,
  gun_type          :   string,
  starting_bloc_type:   string,
  year_of_birth     :   number,
  street_address    :   any
});

export default user;
