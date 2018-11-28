import React from 'react';
import ReactDOM from 'react-dom';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { specs, describe, it } from 'storybook-addon-specifications'

import {ReactWrapper, mount} from "enzyme";
import expect from "expect";

ReactWrapper.prototype.getComputedStyle=function(attr){
	return window.getComputedStyle(this.getDOMNode(),null)[attr];
}

expect.extend({printItOut(received,argument){
	console.info('received', received);
	return {pass: true, message: ()=>{}}
}})

import Item from "../app/components/item"
import { Logger } from 'log4js/lib/logger';

const outerStyle={maxWidth: 980, margin: 'auto'};

const outerDiv=(<div id="story" style={outerStyle}></div>);

const dummyEvent={
	preventDefaults: ()=>{},
	stopPropagation: ()=>{}, 
	nativeEvent: {	stopImmediatePropagation: ()=>{}
	}
}

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
	if(output) {
		output.unmount();
		output=undefined;
	}
}

const testType = {
	"_id": "56ce331e7957d17202e996d6",
	"name": "Intro",
	"harmony": [],
	"id": "9okDr"
}

var output;

storiesOf('Item', module)
	.add('Hello World', function () {
		if (output)
			output.unmount();
		const story =
			<button onClick={action('Hello World')}>
				Hello World
			</button>;

		setTimeout(() => { // execute this after Storybook has rendered the simple div returned by this story
			output = mount(story, { attachTo: document.getElementById('story') }) // mount the story in enzyme and in the browser
			specs(() => describe('Hello World', function () {
				it('Should have the Hello World label', function () {
					expect(output.text()).toContain('Hello World');
				});
			}));
		})

		return <div id='story'></div>;
	})
	.add('without image or reference', () => {
		outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			type: testType
		}

		return <div style={outerStyle}><Item item={testItem} className="whole-border" /></div>

	})
	.add('with Image no reference', () => {
		outerSetup();

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

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			references: [{url: 'https://www.civilpursuit.com', title: 'Civil Pursuit'}],
			type: testType
		}

		const story= <div id='story' style={outerStyle}><Item item={testItem} className="whole-border" /></div>;
		setTimeout(()=>{
			output=mount(story,{attachTo: document.getElementById('story')})
			setTimeout(()=>{
				const originalHeight=parseFloat(output.getComputedStyle('height'))
				const fontSize=parseFloat(output.getComputedStyle('font-size'))
				output.find('a').simulate('click',dummyEvent)
				const preTest=()=>it(`Item should be truncated`, ()=>{
					expect(originalHeight).toBeLessThan(8.5*fontSize)
				})
				specs(()=>
					describe('before clicked', ()=>
						preTest()
					)
				)				
				setTimeout(()=>
					specs(()=>
						describe('clicked', ()=>{
							preTest();
							it(`Item should be open and height should be greater than ${originalHeight}`, ()=>{
								expect(parseFloat(output.getComputedStyle('height'))).toBeGreaterThan(originalHeight)
							})
						})
					)
				,600)
			},1000)
		})
		return outerDiv;
	})
	.add('with Edit Button', () => {
		outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			type: testType
		}

		return <div style={outerStyle}><Item item={testItem} className="whole-border" visualMethod="edit" /></div>

	})
	.add('titleized', () => {
		outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			type: testType
		}

		const story=<div style={outerStyle}><Item item={testItem} className="whole-border" visualMethod="titleize" rasp={{shape: 'title'}} /></div>

		setTimeout(()=>{ // do this after the story has rendered
			output=mount(story,{attachTo: document.getElementById('story')});
			setTimeout(()=>{ // now wait for that to render
				specs(() => describe('Item titleize', ()=>{
					it('Only the title shoudl be shown', function () {
						let fontSize=parseFloat(output.getComputedStyle('font-size'));
						return expect(parseFloat(output.getComputedStyle('height'))).toBeLessThan(2*fontSize);
					});
				}));
			},600)
		})

		return outerDiv
	})
	.add('Item with VisualMethod ooview', () => {
		outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			type: testType
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="ooview" rasp={{shape: 'open'}} />;

		setTimeout(()=>{ // do this after the story has rendered
			output=mount(story,{attachTo: document.getElementById('story')});
			setTimeout(()=>{ // now wait for that to render
				specs(() => describe('Item ooview', ()=>{
					it('Item should open in truncated state', function () {
						let fontSize=parseFloat(output.getComputedStyle('font-size'));
						return expect(parseFloat(output.getComputedStyle('height'))).toBeGreaterThan(4*fontSize);
					});
				}));
			},600)
		})
		return outerDiv
	})
	.add('Item with VisualMethod ooview after immediate descendant takes focus', () => {
		outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			type: testType
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="ooview" rasp={{shape: 'open'}} />;

		setTimeout(()=>{ // do this after the story has rendered
			output=mount(story,{attachTo: document.getElementById('story')});
			output.find('RASPItem').instance().toMeFromChild(null,{type: "DESCENDANT_FOCUS", distance: 0}); // kick off state change for next state
			setTimeout(()=>{ // now wait for that to render
				specs(() => describe('Item ooview', ()=>{
					it('Item should open in truncated state', function () {
						let fontSize=parseFloat(output.getComputedStyle('font-size'));
						return expect(parseFloat(output.getComputedStyle('height'))).toBeGreaterThan(4*fontSize);
					});
				}));
			},600)
		})
		return outerDiv
	})

	.add('ooview after distant descendant focus', () => {
		outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			type: testType
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="ooview" rasp={{shape: 'open'}} />;

		setTimeout(()=>{ // do this after the story has rendered
			output=mount(story,{attachTo: document.getElementById('story')});
			setTimeout(()=>{ // let the item finish it's transition
				output.find('RASPItem').instance().toMeFromChild(null,{type: "DESCENDANT_FOCUS", distance: 3}); // kick off state change for next state
				setTimeout(()=>{ // now wait for that to render
					specs(() => describe('Item ooview', ()=>{
						it('Only the title should be shown', function () {
							let fontSize=parseFloat(output.getComputedStyle('font-size'));
							expect(parseFloat(output.getComputedStyle('height'))).toBeLessThan(2*fontSize);
						});
					}));
				},600)
			},1000)
		})
		return outerDiv;
	})

