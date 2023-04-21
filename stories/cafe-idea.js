import React from 'react';
//import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils'; // ES6

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { specs, describe, it } from 'storybook-addon-specifications'

import {ReactWrapper, mount} from "enzyme";
import expect from "expect";

import Common from "./common"

import { Logger } from 'log4js/lib/logger';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

import CafeIdea from "../app/components/type-components/cafe-idea";
import AskItemWhy from "../app/components/type-components/ask-item-why"
import AskWebRTC from "../app/components/type-components/ask-webrtc"

	storiesOf('Cafe Idea', module)
	.add('Cafe Idea', () => {
		Common.outerSetup();

		const parent = {
			_id: "123456789abcdef123556789",
			subject: "This is the Questions",
			description: "There are questions we need to ask, and respectfully discuss.",
			type: "123456789abcdef123556789"
		}

		const ideaType = {
			"_id": "56ce331e7957d17202e996d6",
			"name": "Intro",
			"harmony": [],
			"id": "9okDr",
			"mediaMethod": "disabled",
			"referenceMethod": 'disabled'
		}

		return <div style={Common.outerStyle}><CafeIdea parent={parent} type={ideaType} minIdeas={1} className="whole-border" /></div>

	})
	.add('Ask Item Why', () => {
		Common.outerSetup();

		var emittedArgs;

		window.socket.emit=(...args)=>{
			emittedArgs=args;
			if(args[0]==="get listo type" && args[1].length===2  && (typeof args[2] === 'function')) { 
				setTimeout(()=>args[2]([whyType,whyNotType]))
			} else {
				console.error("Ask Item Why error", args)
			}
		}

		const parent = {
			_id: "56ce331e7957d17202e00003",
			subject: "This is the Question",
			description: "There are questions we need to ask, and respectfully discuss.",
			type: "123456789abcdef123556789"
		}

		const ideaType = {
			"_id": "56ce331e7957d17202e00000",
			"name": "Intro",
			"harmony": ["56ce331e7957d17202e00001","56ce331e7957d17202e00002"],
			"id": "idea1",
			"mediaMethod": "disabled",
			"referenceMethod": 'disabled',
			"descriptionPlaceholder": 'answer'
		}

		const whyType={
			"_id": "56ce331e7957d17202e00001",
			"name": "why",
			"id": "why01",
			"mediaMethod": "disabled",
			"referenceMethod": 'disabled',
			evaluateQuestion: "Why is this answer important for the whole community to consider?",
			"descriptionPlaceholder": 'explain'
		}
		const whyNotType={
			"_id": "56ce331e7957d17202e00002",
			"name": "why not",
			"id": "why02",
			"mediaMethod": "disabled",
			"referenceMethod": 'disabled',
			evaluateQuestion: "Why should the community disregard this answer?"
		}

		const story=<div style={Common.outerStyle}><AskItemWhy parent={parent} type={ideaType} className="no-border" /></div>
		
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


	.add('Ask WebRTC', () => {
		Common.outerSetup();

		const story=<div style={Common.outerStyle}><AskWebRTC /></div>
		
		const storyTest= async (e)=>{ // do this after the story has rendered
			Common.Wrapper=mount(story,{attachTo: e});
		}
		return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>;

	})