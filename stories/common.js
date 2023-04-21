import React from "react"
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


export const outerStyle={maxWidth: 980, margin: 'auto'};

export const outerDiv=(<div id="story" style={outerStyle}></div>);

export const dummyEvent={
	preventDefaults: ()=>{},
	stopPropagation: ()=>{}, 
	nativeEvent: {	stopImmediatePropagation: ()=>{}
	}
}

var FakeEmitter=[];
var Wrapper;
export function outerSetup(){
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
	if(this.Wrapper) {
		this.Wrapper.unmount();
		this.Wrapper=undefined;
	}else{
		this.Wrapper=null;
	}
    window.Synapp={fontSize: 13};
    return this.Wrapper;
}

export function asyncSleep(mSec){
	return new Promise((ok,ko)=>setTimeout(()=>ok(),mSec))
}

export function asyncEvent (node, eventName) {
	var p= new Promise((ok,ko)=>{
		const listener=(e)=>{node.removeEventListener(eventName,listener), ok(e);}
		node.addEventListener(eventName,listener)
	})
	node[eventName]();
	return p;
}

export function getAsyncSemaphore(){
	var result={};
	result.p=new Promise((ok,ko)=>{
		result.ok=ok;
		result.ko=ko;
	}) 
	result.p.catch(err=>console.error("getAsyncSemaphore catch"));
	return result;
}

export function RenderStory (props){
	return <div style={outerStyle} ref={e=>{e && setTimeout(()=>props.testFunc(e))}} />;
}

export default {
    RenderStory: RenderStory,
    getAsyncSemaphore: getAsyncSemaphore,
    asyncEvent: asyncEvent,
    asyncSleep: asyncSleep,
    outerSetup: outerSetup,
    Wrapper: Wrapper,
    dummyEvent: dummyEvent,
    outerStyle: outerStyle,
    outerDiv: outerDiv
}

