import React from 'react';
//import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils'; // ES6

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';


import {ReactWrapper, mount} from "enzyme";
import expect from "expect";

import Common from "./common"

import KitchenSink from "../app/components/kitchen-sink"

import { Logger } from 'log4js/lib/logger';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

const testType = {
	"_id": "56ce331e7957d17202e996d6",
	"name": "Intro",
	"harmony": [],
	"id": "9okDr"
}

	storiesOf('Kitchen Sink', module)
	.add('Kitchen Sink', () => {
		Common.outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			type: testType
		}

		return <div style={Common.outerStyle}><KitchenSink /></div>

	})

