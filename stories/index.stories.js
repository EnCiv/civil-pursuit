import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { specs, describe, it } from 'storybook-addon-specifications'

import {mount} from "enzyme";
import expect from "expect";

import Item from "../app/components/item"
import { Logger } from 'log4js/lib/logger';

const outerStyle={maxWidth: 980, margin: 'auto'}
function outerSetup(){
	window.socket = {
		on: (...args)=>console.info("socket.io.on", ...args),
		off: (...args)=>console.info("socket.io.off", ...args),
	};
	window.logger={
		info: console.info,
		error: console.error,
		trace: ()=>{}
	}
}

storiesOf('Item', module)
	.add('without image or reference', () => {
		outerSetup();
		const testType = {
			"_id": "56ce331e7957d17202e996d6",
			"name": "Intro",
			"harmony": [],
			"id": "9okDr"
		}

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			type: testType
		}

		return <div style={outerStyle}><Item item={testItem} className="whole-border" /></div>

	})
	.add('with Image no reference', () => {
		outerSetup();

		const testType = {
			"_id": "56ce331e7957d17202e996d6",
			"name": "Intro",
			"harmony": [],
			"id": "9okDr"
		}

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			type: testType
		}

		return <div style={outerStyle}><Item item={testItem} className="whole-border" /></div>

	})
	.add('with Image and reference and click', () => {
		outerSetup();

		const testType = {
			"_id": "56ce331e7957d17202e996d6",
			"name": "Intro",
			"harmony": [],
			"id": "9okDr"
		}

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			references: [{url: 'https://www.civilpursuit.com', title: 'Civil Pursuit'}],
			type: testType
		}

		const story= <div id='story' style={outerStyle}><Item item={testItem} className="whole-border" /></div>;
		setTimeout(()=>{
			let a=document.getElementsByTagName('a')[0];
			var originalRect=document.getElementById('story').getBoundingClientRect();
			a.click();
			setTimeout(()=>
				specs(()=>
					describe('clicked', ()=>
						it(`Item should be open and height should be greater than ${originalRect.height}`, ()=>{
							let rect=document.getElementById('story').getBoundingClientRect();
							return rect.height > originalRect.height;
						})
					)
				)
			,600)
		},600)
		return story;
	})
	.add('with Edit Button', () => {
		outerSetup();

		const testType = {
			"_id": "56ce331e7957d17202e996d6",
			"name": "Intro",
			"harmony": [],
			"id": "9okDr"
		}

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			type: testType
		}

		return <div style={outerStyle}><Item item={testItem} className="whole-border" visualMethod="edit" /></div>

	})

