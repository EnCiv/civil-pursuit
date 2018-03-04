'use strict';

import React from 'react';

const { PropTypes } =   React;

const { shape, string, arrayOf, any, number, instanceOf, object, oneOf, bool } = PropTypes;

let type;

type                =   shape({
  _id               :   string.isRequired,
  id                :   string.isRequired,
  name              :   string,
  harmony           :   arrayOf(string),
  parent            :   string,
  createMethod		  : 	string,
  promoteMethod		  : 	string,
  promoteButtonLabel: 	shape({
  	inactive		    : 	string.isRequired,
  	active          :   string.isRequired
  }),
  feedbackMethod		: 	string,
  visualMethod		  : 	string,
  evaluateQuestion  :   string,
  instruction	      :   string,
  component         :   any,
  min               :   number,
  buttonName        :   string,
  buttonTitle: 	shape({
  	inactive		    : 	string.isRequired,
  	active          :   string.isRequired
  	}),
  mediaMethod		    : 	string,
  referenceMethod   :   string,
  subjectPlaceHolder :  string,
  buttons           :   any
});

export default type;
