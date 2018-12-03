import React from 'react';
//import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils'; // ES6

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { specs, describe, it } from 'storybook-addon-specifications'

import {ReactWrapper, mount} from "enzyme";
import expect from "expect";

ReactWrapper.prototype.getComputedStyle=function(attr){
	return window.getComputedStyle(this.getDOMNode(),null)[attr];
}

ReactWrapper.prototype.findDOMByAttrRegex=function(attr,regex){
	function deepTest(instance){
		if(!instance.getAttribute) return new Error("Maybe it's not ready yet:", instance);
		if(regex.test(instance.getAttribute(attr))) return instance;
		if(!instance.children || !instance.children.length) return false; 
		var result;
		for(let child of instance.children) {
			if((result=deepTest(child)))
				return result;
		}
		return false;
	}
	return deepTest(this.getDOMNode())
}

expect.extend({printItOut(received,argument){
	console.info('received', received);
	return {pass: true, message: ()=>{}}
}})

import Item from "../app/components/item"
import { Logger } from 'log4js/lib/logger';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

const outerStyle={maxWidth: 980, margin: 'auto'};

const outerDiv=(<div id="story" style={outerStyle}></div>);

const dummyEvent={
	preventDefaults: ()=>{},
	stopPropagation: ()=>{}, 
	nativeEvent: {	stopImmediatePropagation: ()=>{}
	}
}

var FakeEmitter=[];
function outerSetup(){
	window.socket = {
		on: (...args)=>console.info("socket.io.on", ...args),
		off: (...args)=>console.info("socket.io.off", ...args),
		emit: (...args)=>FakeEmitter.push(args)
	};
	window.logger={
		info: console.info,
		error: console.error,
		trace: ()=>{}
	}
	if(Wrapper) {
		Wrapper.unmount();
		Wrapper=undefined;
	}
}

function asyncSleep(mSec){
	return new Promise((ok,ko)=>setTimeout(()=>ok(),mSec))
}

function asyncEvent (node, eventName) {
	var p= new Promise((ok,ko)=>{
		const listener=(e)=>{node.removeEventListener(eventName,listener), ok(e);}
		node.addEventListener(eventName,listener)
	})
	node[eventName]();
	return p;
}

function getAsyncSemaphore(){
	var result={};
	result.p=new Promise((ok,ko)=>{
		result.ok=ok;
		result.ko=ko;
	}) 
	result.p.catch(err=>console.error("getAsyncSemaphore catch"));
	return result;
}

function RenderStory (props){
	return <div style={outerStyle} ref={e=>{e && setTimeout(()=>props.testFunc(e))}} />;
}

const testType = {
	"_id": "56ce331e7957d17202e996d6",
	"name": "Intro",
	"harmony": [],
	"id": "9okDr"
}

var Wrapper;

storiesOf('Item', module)
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
		const storyTest=async (e)=>{
			Wrapper=mount(story,{attachTo: e})
			await asyncSleep(1000)
			const originalHeight=parseFloat(Wrapper.getComputedStyle('height'))
			const fontSize=parseFloat(Wrapper.getComputedStyle('font-size'))
			Wrapper.find('a').simulate('click',dummyEvent)
			const preTest=()=>it(`Item should be truncated`, ()=>{
				expect(originalHeight).toBeLessThan(8.5*fontSize)
			})
			specs(()=>
				describe('before clicked', ()=>
					preTest()
				)
			)				
			await asyncSleep(600);
			specs(()=>
				describe('clicked', ()=>{
					preTest();
					it(`Item should be open and height should be greater than ${originalHeight}`, ()=>{
						expect(parseFloat(Wrapper.getComputedStyle('height'))).toBeGreaterThan(originalHeight)
					})
				})
			)
		}
		return <RenderStory testFunc={storyTest}></RenderStory>;
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
			Wrapper=mount(story,{attachTo: document.getElementById('story')});
			setTimeout(()=>{ // now wait for that to render
				specs(() => describe('Item titleize', ()=>{
					it('Only the title shoudl be shown', function () {
						let fontSize=parseFloat(Wrapper.getComputedStyle('font-size'));
						return expect(parseFloat(Wrapper.getComputedStyle('height'))).toBeLessThan(2*fontSize);
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
			Wrapper=mount(story,{attachTo: document.getElementById('story')});
			setTimeout(()=>{ // now wait for that to render
				specs(() => describe('Item ooview', ()=>{
					it('Item should open in truncated state', function () {
						let fontSize=parseFloat(Wrapper.getComputedStyle('font-size'));
						return expect(parseFloat(Wrapper.getComputedStyle('height'))).toBeGreaterThan(4*fontSize);
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
			Wrapper=mount(story,{attachTo: document.getElementById('story')});
			Wrapper.find('RASPItem').instance().toMeFromChild(null,{type: "DESCENDANT_FOCUS", distance: 0}); // kick off state change for next state
			setTimeout(()=>{ // now wait for that to render
				specs(() => describe('Item ooview', ()=>{
					it('Item should open in truncated state', function () {
						let fontSize=parseFloat(Wrapper.getComputedStyle('font-size'));
						return expect(parseFloat(Wrapper.getComputedStyle('height'))).toBeGreaterThan(4*fontSize);
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
			Wrapper=mount(story,{attachTo: document.getElementById('story')});
			setTimeout(()=>{ // let the item finish it's transition
				Wrapper.find('RASPItem').instance().toMeFromChild(null,{type: "DESCENDANT_FOCUS", distance: 3}); // kick off state change for next state
				setTimeout(()=>{ // now wait for that to render
					specs(() => describe('Item ooview', ()=>{
						it('Only the title should be shown', function () {
							let fontSize=parseFloat(Wrapper.getComputedStyle('font-size'));
							expect(parseFloat(Wrapper.getComputedStyle('height'))).toBeLessThan(2*fontSize);
						});
					}));
				},600)
			},1000)
		})
		return outerDiv;
	})

	.add('Item VM: edit shape: edit', ()=>{
		outerSetup();

		const testItem = {
			type: testType
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;

		const storyTest=async (e)=>{ // do this after the story has rendered
			Wrapper=mount(story,{attachTo: e});
			await asyncSleep(600);
			specs(()=>describe('Test the initial state of the Creator', ()=>{
				it(`It should not have any error messages`, ()=>{
					const errorMessages=Wrapper.findDOMByAttrRegex('class', /Item-error-message[-|/d]+/);
					expect(errorMessages).toBe(false)
				})
				it('It should have a Post button', ()=>{
					expect(!!Wrapper.find('button[title="click to post this"]')).toBe(true)
				})
			}))
		}
		return <RenderStory testFunc={storyTest}></RenderStory>;
	})

	.add('Create an Item Subject', () => {
		outerSetup();

		const testItem = {
			type: testType
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;

		const storyTest= async (e)=>{ // do this after the story has rendered
			Wrapper=mount(story,{attachTo: e});
			let textInput=Wrapper.find('TextInput[name="subject"]')
			textInput.instance().select();
			textInput.simulate('change',Object.assign({},dummyEvent, {target: {value: 'A'}}))
			var inputNode=Wrapper.find('input[name="subject"]').getDOMNode()
			const blurE = await asyncEvent(inputNode, 'blur');
			specs(()=>describe('Item Subject should have the input', ()=>{
				let _id=Wrapper.find('Item').instance().props.item._id;
				it(`Item should have a unique ObjectId. Found ${_id}`, function () {
					expect(_id.length).toBe(24);
				});
				it('Item should have an A in the input', function () {
					expect(Wrapper.find('input[name="subject"]').instance().value).toBe('A');
				});
				it('Item should have an A in the TextInput', function () {
					expect(Wrapper.find("ItemSubject").find('TextInput').instance().value).toBe('A')
				});
				it('Item should have an A in the ItemSubject', function () {
					expect(Wrapper.find("ItemSubject").instance().state.subject).toBe('A')
				});
				it('Item should have an A in the Item', function () {
					expect(Wrapper.find("Item").instance().props.item.subject).toBe('A')
				});
			}))
		}
		return <RenderStory testFunc={storyTest}></RenderStory>;
	})

	.add('Create an Item Description', () => {
		outerSetup();

		const testItem = {
			type: testType
		}

		const description="This is a description of an item"

		const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;

		const storyTest= async (e)=>{ // do this after the story has rendered
			Wrapper=mount(story,{attachTo: e});
			await asyncSleep(600);
			let textInput=Wrapper.find('textarea[name="description"]')
			textInput.instance().select();
			textInput.simulate('change',Object.assign({},dummyEvent, {target: {value: description}}))
			var inputNode=Wrapper.find('textarea[name="description"]').getDOMNode()
			const blurE = await asyncEvent(inputNode, 'blur');
			specs(()=>describe('Item Description should have the input', ()=>{
				let _id=Wrapper.find('Item').instance().props.item._id;
				it(`Item should have a unique ObjectId. Found ${_id}`, function () {
					expect(_id.length).toBe(24);
				});
				it(`Item should have "${description}" as the textarea`, ()=>{
					expect(Wrapper.find('textarea[name="description"]').instance().value).toBe(description);
				});
				it(`Item should have "${description}" as Textarea`, ()=>{
					expect(Wrapper.find("ItemDescription").find('Textarea').instance().value).toBe(description)
				});
				it(`Item should have "${description}" as the ItemDescription`, ()=>{
					expect(Wrapper.find("ItemDescription").instance().state.description).toBe(description)
				});
				it(`Item should have "${description}" in the Item`, ()=>{
					expect(Wrapper.find("Item").instance().props.item.description).toBe(description)
				});
			}))
		}
		return <RenderStory testFunc={storyTest}></RenderStory>;
	})

	.add("Can't creat an Item without a description", () => {
		outerSetup();

		const testItem = {
			subject: "A Test Item",
			type: testType
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;

		const storyTest=async (e)=>{ // do this after the story has rendered
			Wrapper=mount(story,{attachTo: e});
			await asyncSleep(600);
			await asyncEvent(Wrapper.find('button[title="click to post this"]').getDOMNode(),'click');
			await asyncSleep(0);

			specs(()=>describe('It should say description is required, in red', ()=>{
				var result=Wrapper.findDOMByAttrRegex('class', /Item-error-message[-|/d]+/);
				it('It should have an error message', ()=>{
					expect(result.innerText).toBe("Description is required")
				});
				it('The color should be red', ()=>{
					expect(window.getComputedStyle(result).color).toBe("rgb(255, 0, 0)")
				});
			}))
		}
		return <RenderStory testFunc={storyTest}></RenderStory>;
	})

	
	.add("Can't creat an Item without a subject", () => {
		outerSetup();

		const testItem = {
			description: "A Test Item",
			type: testType
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;

		setTimeout(()=>{ // do this after the story has rendered
			Wrapper=mount(story,{attachTo: document.getElementById('story')});
			setTimeout(()=>{ // give uses a chance to see the original state before we change it
				const preTestResult=Wrapper.findDOMByAttrRegex('class', /Item-error-message[-|/d]+/);

				Wrapper.find('button[title="click to post this"]').simulate('click',dummyEvent);

				setTimeout(()=>
					specs(()=>describe('It should say subject is required, in red', ()=>{
						it(`It should not have an error message to begin with`, ()=>{
							expect(preTestResult).toBe(false)
						})
						let result=Wrapper.findDOMByAttrRegex('class', /Item-error-message[-|/d]+/);
						it('It should have an error message', ()=>{
							expect(result.innerText).toBe("Subject is required")
						});
						it('The color should be red', ()=>{
							expect(window.getComputedStyle(result).color).toBe("rgb(255, 0, 0)")
						});
					}))
				,600)

			},1000)
		})
		return outerDiv;
	})

	.add("Creating an Item Reference", () => {
		outerSetup();

		const testItem = {
			subject: "A Test Subject",
			description: "A Test Item",
			type: testType
		}

		const testURL="https://www.civilpursuit.com"
		const testTitle="URL Title Test Succeeded!"
		const testMessage="get url title"

		const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;
		var emittedArgs;

		window.socket.emit=(...args)=>{
			emittedArgs=args;
			if(args[0]===testMessage && args[1]===testURL  && (typeof args[2] === 'function')) { 
				args[2](testTitle)
			}
		}

		setTimeout(()=>{ // do this after the story has rendered
			Wrapper=mount(story,{attachTo: document.getElementById('story')});
			let textInput=Wrapper.find('TextInput[name="reference"]')
			textInput.instance().select();
			textInput.simulate('change',Object.assign({},dummyEvent, {target: {value: testURL}}))
			var inputNode=Wrapper.find('TextInput[name="reference"]').getDOMNode()
			inputNode.blur();
			setTimeout(()=>{ // give user a chance to see the original state before we change it
				specs(()=>describe(`It should say ${testTitle}`, ()=>{
					it('The socket should have received a message',()=>{
						expect(!!emittedArgs).toBe(true)
					})
					it(`the message api should have been: ${testMessage}`,()=>{
						expect(emittedArgs[0]).toBe(testMessage)
					})
					it(`the message parameter should have been: ${testURL}`,()=>{
						expect(emittedArgs[1]).toBe(testURL)
					})
					it(`there should have been a callback function`,()=>{
						expect(typeof emittedArgs[2]).toBe('function')
					})
					it(`The input should say ${testTitle}`, ()=>{
						expect(Wrapper.find('input[name="url-title"]').instance().value).toBe(testTitle)
					})
					it(`The Item should have a references array`,()=>{
						expect(testItem.references).toEqual([{url: testURL, title: testTitle}])
					})
					it(`should show an edit-url icon (Pencil)`,()=>{
						expect(!!Wrapper.findDOMByAttrRegex('class', /.ItemReference-edit-url[-|/d]+/)).toBe(true);
					})
				}))
			},1000)
		})
		return outerDiv;
	})

	.add("Edit an Item Reference", () => {
		outerSetup();

		const testURL="https://www.civilpursuit.com"
		const testTitle="URL Title Test Succeeded!"
		const testMessage="get url title"

		const testItem = {
			subject: "A Test Subject",
			description: "A Test Item",
			type: testType,
			references: [{url: testURL, title: testTitle}]
		}

		var emittedArgs;

		window.socket.emit=(...args)=>{
			emittedArgs=args;
			if(args[0]===testMessage && args[1]===testURL  && (typeof args[2] === 'function')) { 
				args[2](testTitle)
			}
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;

		const storyTest= async (e)=>{ // do this after the story has rendered
			Wrapper=mount(story,{attachTo: e});
			await asyncSleep(1000);
			let editButton=Wrapper.findDOMByAttrRegex('class', /.ItemReference-edit-url[-|\d]+/);
			editButton.click();
			specs(()=>describe(`It should say`, ()=>{
				it('The text input field should be present',()=>{
					expect(!!Wrapper.find('TextInput[name="reference"]')).toBe(true)
				})
				it('The url input field should not be hidden', ()=>{
					expect(!!Wrapper.findDOMByAttrRegex('class', /.ItemReference-edit-url[-|\d]+\s.ItemReference-hide[-|\d]+/)).toBe(false);
				})
			}))

		}
		return <RenderStory testFunc={storyTest}></RenderStory>;
	})
