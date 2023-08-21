import React from 'react';
import { storiesOf } from '@storybook/react';

// import { specs, describe, it } from 'storybook-addon-specifications'
const specs=()=>{}
const describe=()=>{}
const it=()=>{}

import {ReactWrapper, mount} from "enzyme";
import expect from "expect";

import Common from "./common"

import Item from "../app/components/item"

import { Logger } from 'log4js/lib/logger';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';


const testType = {
	"_id": "56ce331e7957d17202e996d6",
	"name": "Intro",
	"harmony": [],
	"id": "9okDr"
}

storiesOf('Item', module)
	.add('without image or reference', () => {
		Common.outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			type: testType
		}

		return <div style={Common.outerStyle}><Item item={testItem} className="whole-border" /></div>

	})
	.add('with Image no reference', () => {
		Common.outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			type: testType
		}

		return <div style={Common.outerStyle}><Item item={testItem} className="whole-border" /></div>

	})
	.add('with Image and reference and click', () => {
		Common.outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			references: [{url: 'https://www.civilpursuit.com', title: 'Civil Pursuit'}],
			type: testType
		}

		const story= <div id='story' style={Common.outerStyle}><Item item={testItem} className="whole-border" /></div>;
		const storyTest=async (e)=>{
			Common.Wrapper=mount(story,{attachTo: e})
			await Common.asyncSleep(1000)
			const originalHeight=parseFloat(Common.Wrapper.getComputedStyle('height'))
			const fontSize=parseFloat(Common.Wrapper.getComputedStyle('font-size'))
			Common.Wrapper.find('a').simulate('click',Common.dummyEvent)
			const preTest=()=>it(`Item should be truncated`, ()=>{
				expect(originalHeight).toBeLessThan(8.5*fontSize)
			})
			specs(()=>
				describe('before clicked', ()=>
					preTest()
				)
			)				
			await Common.asyncSleep(600);
			specs(()=>
				describe('clicked', ()=>{
					preTest();
					it(`Item should be open and height should be greater than ${originalHeight}`, ()=>{
						expect(parseFloat(Common.Wrapper.getComputedStyle('height'))).toBeGreaterThan(originalHeight)
					})
				})
			)
		}
		return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;
	})
	.add('with Edit Button', () => {
		Common.outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			type: testType
		}

		return <div style={Common.outerStyle}><Item item={testItem} className="whole-border" visualMethod="edit" /></div>

	})
	.add('titleized', () => {
		Common.outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			type: testType
		}

		const story=<div style={Common.outerStyle}><Item item={testItem} className="whole-border" visualMethod="titleize" rasp={{shape: 'title'}} /></div>

		setTimeout(()=>{ // do this after the story has rendered
			Common.Wrapper=mount(story,{attachTo: document.getElementById('story')});
			setTimeout(()=>{ // now wait for that to render
				specs(() => describe('Item titleize', ()=>{
					it('Only the title shoudl be shown', function () {
						let fontSize=parseFloat(Common.Wrapper.getComputedStyle('font-size'));
						return expect(parseFloat(Common.Wrapper.getComputedStyle('height'))).toBeLessThan(2*fontSize);
					});
				}));
			},600)
		})

		return Common.outerDiv
	})
	.add('Item with VisualMethod ooview', () => {
		Common.outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			type: testType
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="ooview" rasp={{shape: 'open'}} />;

		setTimeout(()=>{ // do this after the story has rendered
			Common.Wrapper=mount(story,{attachTo: document.getElementById('story')});
			setTimeout(()=>{ // now wait for that to render
				specs(() => describe('Item ooview', ()=>{
					it('Item should open in truncated state', function () {
						let fontSize=parseFloat(Common.Wrapper.getComputedStyle('font-size'));
						return expect(parseFloat(Common.Wrapper.getComputedStyle('height'))).toBeGreaterThan(4*fontSize);
					});
				}));
			},600)
		})
		return Common.outerDiv
	})
	.add('Item with VisualMethod ooview after immediate descendant takes focus', () => {
		Common.outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			type: testType
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="ooview" rasp={{shape: 'open'}} />;

		setTimeout(()=>{ // do this after the story has rendered
			Common.Wrapper=mount(story,{attachTo: document.getElementById('story')});
			Common.Wrapper.find('RASPItem').instance().toMeFromChild(null,{type: "DESCENDANT_FOCUS", distance: 0}); // kick off state change for next state
			setTimeout(()=>{ // now wait for that to render
				specs(() => describe('Item ooview', ()=>{
					it('Item should open in truncated state', function () {
						let fontSize=parseFloat(Common.Wrapper.getComputedStyle('font-size'));
						return expect(parseFloat(Common.Wrapper.getComputedStyle('height'))).toBeGreaterThan(4*fontSize);
					});
				}));
			},600)
		})
		return Common.outerDiv
	})

	.add('ooview after distant descendant focus', () => {
		Common.outerSetup();

		const testItem = {
			subject: "Test Item Subject",
			description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
			image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
			type: testType
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="ooview" rasp={{shape: 'open'}} />;

		setTimeout(()=>{ // do this after the story has rendered
			Common.Wrapper=mount(story,{attachTo: document.getElementById('story')});
			setTimeout(()=>{ // let the item finish it's transition
				Common.Wrapper.find('RASPItem').instance().toMeFromChild(null,{type: "DESCENDANT_FOCUS", distance: 3}); // kick off state change for next state
				setTimeout(()=>{ // now wait for that to render
					specs(() => describe('Item ooview', ()=>{
						it('Only the title should be shown', function () {
							let fontSize=parseFloat(Common.Wrapper.getComputedStyle('font-size'));
							expect(parseFloat(Common.Wrapper.getComputedStyle('height'))).toBeLessThan(2*fontSize);
						});
					}));
				},600)
			},1000)
		})
		return Common.outerDiv;
	})

	.add('Item VM: edit shape: edit', ()=>{
		Common.outerSetup();

		const testItem = {
			type: testType
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;

		const storyTest=async (e)=>{ // do this after the story has rendered
			Common.Wrapper=mount(story,{attachTo: e});
			await Common.asyncSleep(600);
			specs(()=>describe('Test the initial state of the Creator', ()=>{
				it(`It should not have any error messages`, ()=>{
					const errorMessages=Common.Wrapper.findDOMByAttrRegex('class', /Item-error-message[-|/d]+/);
					expect(errorMessages).toBe(false)
				})
				it('It should have a Post button', ()=>{
					expect(!!Common.Wrapper.find('button[title="click to post this"]')).toBe(true)
				})
			}))
		}
		return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;
	})

	.add('Create an Item Subject', () => {
		Common.outerSetup();

		const testItem = {
			type: testType
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;

		const storyTest= async (e)=>{ // do this after the story has rendered
			Common.Wrapper=mount(story,{attachTo: e});
			let textInput=Common.Wrapper.find('Input[name="subject"]')
			textInput.instance().select();
			textInput.simulate('change',Object.assign({},Common.dummyEvent, {target: {value: 'A'}}))
			var inputNode=Common.Wrapper.find('input[name="subject"]').getDOMNode()
			const blurE = await Common.asyncEvent(inputNode, 'blur');
			specs(()=>describe('Item Subject should have the input', ()=>{
				let _id=Common.Wrapper.find('Item').instance().props.item._id;
				it(`Item should have a unique ObjectId. Found ${_id}`, function () {
					expect(_id.length).toBe(24);
				});
				it('Item should have an A in the input', function () {
					expect(Common.Wrapper.find('input[name="subject"]').instance().value).toBe('A');
				});
				it('Item should have an A in the Input', function () {
					expect(Common.Wrapper.find("ItemSubject").find('Input').instance().value).toBe('A')
				});
				it('Item should have an A in the ItemSubject', function () {
					expect(Common.Wrapper.find("ItemSubject").instance().state.subject).toBe('A')
				});
				it('Item should have an A in the Item', function () {
					expect(Common.Wrapper.find("Item").instance().props.item.subject).toBe('A')
				});
			}))
		}
		return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;
	})

	.add('Create an Item Description', () => {
		Common.outerSetup();

		const testItem = {
			type: testType
		}

		const description="This is a description of an item"

		const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;

		const storyTest= async (e)=>{ // do this after the story has rendered
			Common.Wrapper=mount(story,{attachTo: e});
			await Common.asyncSleep(600);
			let textInput=Common.Wrapper.find('textarea[name="description"]')
			textInput.instance().select();
			textInput.simulate('change',Object.assign({},Common.dummyEvent, {target: {value: description}}))
			var inputNode=Common.Wrapper.find('textarea[name="description"]').getDOMNode()
			const blurE = await Common.asyncEvent(inputNode, 'blur');
			specs(()=>describe('Item Description should have the input', ()=>{
				let _id=Common.Wrapper.find('Item').instance().props.item._id;
				it(`Item should have a unique ObjectId. Found ${_id}`, function () {
					expect(_id.length).toBe(24);
				});
				it(`Item should have "${description}" as the textarea`, ()=>{
					expect(Common.Wrapper.find('textarea[name="description"]').instance().value).toBe(description);
				});
				it(`Item should have "${description}" as Textarea`, ()=>{
					expect(Common.Wrapper.find("ItemDescription").find('Textarea').instance().value).toBe(description)
				});
				it(`Item should have "${description}" as the ItemDescription`, ()=>{
					expect(Common.Wrapper.find("ItemDescription").instance().state.description).toBe(description)
				});
				it(`Item should have "${description}" in the Item`, ()=>{
					expect(Common.Wrapper.find("Item").instance().props.item.description).toBe(description)
				});
			}))
		}
		return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;
	})

	.add("Can't creat an Item without a description", () => {
		Common.outerSetup();

		const testItem = {
			subject: "A Test Item",
			type: testType
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;

		const storyTest=async (e)=>{ // do this after the story has rendered
			Common.Wrapper=mount(story,{attachTo: e});
			await Common.asyncSleep(600);
			await Common.asyncEvent(Common.Wrapper.find('button[title="click to post this"]').getDOMNode(),'click');
			await Common.asyncSleep(0);

			specs(()=>describe('It should say description is required, in red', ()=>{
				var result=Common.Wrapper.findDOMByAttrRegex('class', /Item-error-message[-|/d]+/);
				it('It should have an error message', ()=>{
					expect(result.innerText).toBe("Description is required")
				});
				it('The color should be red', ()=>{
					expect(window.getComputedStyle(result).color).toBe("rgb(255, 0, 0)")
				});
			}))
		}
		return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;
	})

	
	.add("Can't creat an Item without a subject", () => {
		Common.outerSetup();

		const testItem = {
			description: "A Test Item",
			type: testType
		}

		const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;

		setTimeout(()=>{ // do this after the story has rendered
			Common.Wrapper=mount(story,{attachTo: document.getElementById('story')});
			setTimeout(()=>{ // give uses a chance to see the original state before we change it
				const preTestResult=Common.Wrapper.findDOMByAttrRegex('class', /Item-error-message[-|/d]+/);

				Common.Wrapper.find('button[title="click to post this"]').simulate('click',Common.dummyEvent);

				setTimeout(()=>
					specs(()=>describe('It should say subject is required, in red', ()=>{
						it(`It should not have an error message to begin with`, ()=>{
							expect(preTestResult).toBe(false)
						})
						let result=Common.Wrapper.findDOMByAttrRegex('class', /Item-error-message[-|/d]+/);
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
		return Common.outerDiv;
	})

	.add("Creating an Item Reference", () => {
		Common.outerSetup();

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
			Common.Wrapper=mount(story,{attachTo: document.getElementById('story')});
			let textInput=Common.Wrapper.find('Input[name="reference"]')
			textInput.instance().select();
			textInput.simulate('change',Object.assign({},Common.dummyEvent, {target: {value: testURL}}))
			var inputNode=Common.Wrapper.find('Input[name="reference"]').getDOMNode()
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
						expect(Common.Wrapper.find('input[name="url-title"]').instance().value).toBe(testTitle)
					})
					it(`The Item should have a references array`,()=>{
						expect(testItem.references).toEqual([{url: testURL, title: testTitle}])
					})
					it(`should show an edit-url icon (Pencil)`,()=>{
						expect(!!Common.Wrapper.findDOMByAttrRegex('class', /.ItemReference-edit-url[-|/d]+/)).toBe(true);
					})
				}))
			},1000)
		})
		return Common.outerDiv;
	})

	.add("Creating an Item Reference without the https://", () => {
		Common.outerSetup();

		const testItem = {
			subject: "A Test Subject",
			description: "A Test Item",
			type: testType
		}

		const inputURL="www.civilpursuit.com"
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
			Common.Wrapper=mount(story,{attachTo: document.getElementById('story')});
			let textInput=Common.Wrapper.find('Input[name="reference"]')
			textInput.instance().select();
			textInput.simulate('change',Object.assign({},Common.dummyEvent, {target: {value: inputURL}}))
			var inputNode=Common.Wrapper.find('Input[name="reference"]').getDOMNode()
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
						expect(Common.Wrapper.find('input[name="url-title"]').instance().value).toBe(testTitle)
					})
					it(`The Item should have a references array`,()=>{
						expect(testItem.references).toEqual([{url: testURL, title: testTitle}])
					})
					it(`should show an edit-url icon (Pencil)`,()=>{
						expect(!!Common.Wrapper.findDOMByAttrRegex('class', /.ItemReference-edit-url[-|/d]+/)).toBe(true);
					})
				}))
			},1000)
		})
		return Common.outerDiv;
	})

	.add("Creating an Item Reference that fails", () => {
		Common.outerSetup();

		const testItem = {
			subject: "A Test Subject",
			description: "A Test Item",
			type: testType
		}

		const testURL="civilpursuit"
		const testTitle=undefined;
		const testMessage="get url title"

		const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;
		var emittedArgs;

		window.socket.emit=(...args)=>{
			emittedArgs=args;
			if(args[0]===testMessage && (args[1]===testURL)  && (typeof args[2] === 'function')) { 
				args[2](testTitle)
			}
		}

		setTimeout(()=>{ // do this after the story has rendered
			Common.Wrapper=mount(story,{attachTo: document.getElementById('story')});
			let textInput=Common.Wrapper.find('Input[name="reference"]')
			textInput.instance().select();
			textInput.simulate('change',Object.assign({},Common.dummyEvent, {target: {value: testURL}}))
			var inputNode=Common.Wrapper.find('Input[name="reference"]').getDOMNode()
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
						expect(Common.Wrapper.find('input[name="url-title"]').instance().value).toBe(testTitle)
					})
					it(`The Item should have a references array`,()=>{
						expect(testItem.references).toEqual([{url: testURL, title: testTitle}])
					})
					it(`should show an edit-url icon (Pencil)`,()=>{
						expect(!!Common.Wrapper.findDOMByAttrRegex('class', /.ItemReference-edit-url[-|/d]+/)).toBe(true);
					})
				}))
			},1000)
		})
		return Common.outerDiv;
	})

	.add("Edit an Item Reference", () => {
		Common.outerSetup();

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
			Common.Wrapper=mount(story,{attachTo: e});
			await Common.asyncSleep(1000);
			let editButton=Common.Wrapper.findDOMByAttrRegex('class', /.ItemReference-edit-url[-|\d]+/);
			editButton.click();
			specs(()=>describe(`It should say`, ()=>{
				it('The text input field should be present',()=>{
					expect(!!Common.Wrapper.find('Input[name="reference"]')).toBe(true)
				})
				it('The url input field should not be hidden', ()=>{
					expect(!!Common.Wrapper.findDOMByAttrRegex('class', /.ItemReference-edit-url[-|\d]+\s.ItemReference-hide[-|\d]+/)).toBe(false);
				})
			}))

		}
		return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;
	})

	.add('headline description first', () => {
		Common.outerSetup();

		const testItem = {
			type: testType
		}

		const description="This is a description of an item"

		const story=<Item item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;

		const storyTest= async (e)=>{ // do this after the story has rendered
			Common.Wrapper=mount(story,{attachTo: e});
		}
		return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;
	})

	.add('headlineAfterEdit', () => {
		Common.outerSetup();

		const testItem = {
			type: testType
		}

		const description="This is a description of an item"

		const story=<Item headlineAfter item={testItem} className="whole-border" visualMethod="edit" rasp={{shape: 'edit'}} />;

		const storyTest= async (e)=>{ // do this after the story has rendered
			Common.Wrapper=mount(story,{attachTo: e});
			await Common.asyncSleep(600);
			let textInput=Common.Wrapper.find('textarea[name="description"]')
			textInput.instance().select();
			textInput.simulate('change',Object.assign({},Common.dummyEvent, {target: {value: description}}))
			var inputNode=Common.Wrapper.find('textarea[name="description"]').getDOMNode()
			const blurE = await Common.asyncEvent(inputNode, 'blur');
			specs(()=>describe('Item Description should have the input', ()=>{
				let _id=Common.Wrapper.find('Item').instance().props.item._id;
				it(`Item should have a unique ObjectId. Found ${_id}`, function () {
					expect(_id.length).toBe(24);
				});
				it(`Item should have "${description}" as the textarea`, ()=>{
					expect(Common.Wrapper.find('textarea[name="description"]').instance().value).toBe(description);
				});
				it(`Item should have "${description}" as Textarea`, ()=>{
					expect(Common.Wrapper.find("ItemDescription").find('Textarea').instance().value).toBe(description)
				});
				it(`Item should have "${description}" as the ItemDescription`, ()=>{
					expect(Common.Wrapper.find("ItemDescription").instance().state.description).toBe(description)
				});
				it(`Item should have "${description}" in the Item`, ()=>{
					expect(Common.Wrapper.find("Item").instance().props.item.description).toBe(description)
				});
			}))
		}
		return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;
	})

