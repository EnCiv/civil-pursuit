'use strict';

import React from 'react';

const { PropTypes } =   React;

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool } = PropTypes;

let type;

type                =   shape({
  _id               :   string.isRequired,
  id                :   string.isRequired,
  name              :   string.isRequired,
  harmony           :   arrayOf(string),
  parent            :   string,
  createMethod		: 	string,
  promoteMethod		: 	string,
  promoteButtonLabel: 	shape({
  	inactive		: 	string.isRequired,
  	active         	:   string.isRequired
  	}),
  evaluateQuestion	: 	string,
  instruction	: 	string
});

export default type;
