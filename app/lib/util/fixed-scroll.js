'use strict';
var ScrollSwipe = require('./ScrollSwipe'); //or just use the global window.ScrollDirect if using this on the client;

class FixedScroll{
	constructor() {
        this.target=document.getElementsByTagName("html")[0];
        let w=this.target.getBoundingClientRect().width;
        this.target.style.top="0px";
        this.target.style.width=w+'px';
		this.target.style.position="fixed";

		return this;
	}

	touchMoveCb(){
		return this.touchMove.bind(this);
	}

	touchCb(){
		return this.touch.bind(this);
	}

	touchMove(data) {
		if(this.inDecelerate) {
			clearTimeout(this.decelerator);
			this.inDecelerate=false;
		}
		let {deltaX, deltaY}=data;
        let top=parseFloat(this.target.style.top) || 0;
        let b=this.target.getBoundingClientRect();
        top+=deltaY;
        if(top<(-b.height))top= (-b.height);
        else if (top>0) top=0;
		this.target.style.top=top+'px';
	}

	touch(data){
		if(this.inDecelerate) {
			clearTimeout(this.decelerator);
			this.inDecelerate=false;
		}
		let {deltaX, deltaY}=data;
		var top=parseFloat(this.target.style.top) || 0;
		if(Math.abs(deltaY)>2){
			this.decelerate(top, deltaY);
		}
		ss.listen();
	}

	scrollCb(){
		return this.scroll.bind(this);
	}

	scroll(data){
		let deltaY=data.lastEvent.deltaY;
        var top=parseFloat(this.target.style.top) || 0;
        top=top-deltaY;
        let b=this.target.getBoundingClientRect();
        if(top<(-b.height))top= (-b.height);
        else if (top>0) top=0;
		this.target.style.top=(top)+'px';
		ss.listen();
	}

	touchStartCb(){
		this.touchStart.bind(this);
	}

	touchStart(){
		if(this.inDecelerate) {
			clearTimeout(this.decelerator)
			this.inDecelerate=false;
		}
	}

	decelerate(top,deltaY){
		this.inDecelerate=true;

        top=top+deltaY;
        
        let b=this.target.getBoundingClientRect();
        if(top<(-b.height))top= (-b.height);
        else if (top>0) top=0;

		this.target.style.top=top+'px';

		if(Math.abs(deltaY)>2) { this.decelerator=setTimeout(()=>this.decelerate(top,deltaY*.95),10); return }
		else if(deltaY<0) { this.decelerator=setTimeout(()=>{this.target.style.top=Math.ceil(top)-1+'px';this.inDecelerate=false;},10); return}
		else { this.decelerator=setTimeout(()=>{this.target.top=Math.ceil(top)+'px';this.inDecelerate=false},10); return}
	}
}

if(typeof window!== 'undefined'){
var fS = fS=new FixedScroll();
var ss = new ScrollSwipe({
        target: document.getElementsByTagName("html")[0], // can be a div, or anything else you want to track scroll/touch events on
        scrollSensitivity: 0, // the lower the number, the more sensitive
        touchSensitivity: 0, // the lower the number, the more senitive,
        scrollPreventDefault: true, // prevent default option for scroll events
        touchPreventDefault: true, // prevent default option for touch events
        scrollCb: fS.scrollCb(),
        touchCb: fS.touchCb(),
		touchMoveCb: fS.touchMoveCb(),
		touchStartCb: fS.touchStartCb()
	});
if(!window.Synapp) window.Synapp={};
window.Synapp.ScrollFocus=(target, duration=500)=>{
	var html=document.getElementsByTagName("html")[0];
	var bannerHeight=document.getElementsByClassName("syn-top_bar-wrapper")[0].getBoundingClientRect().height;
	var start=new Date().getTime();
	var stepPeriod=25;

	var stepper= ()=>{
		let now=new Date().getTime();

		let top=parseFloat(html.style.top);
		let newTop=-(-top+target.getBoundingClientRect().top-bannerHeight);

		if(now-start >duration){
			html.style.top=newTop+'px';
			return;
		}

		let timeRemaining = duration - (now - start);
		let stepsRemaining = Math.max(1, Math.round(timeRemaining / stepPeriod)); // less than one step is one step
		let distanceRemaining = newTop - top;  // could be a positive or negative number
		let nextStepDistance=distanceRemaining/stepsRemaining;
		if(nextStepDistance===0 && stepsRemaining===1) return setTimeout(stepper, timeRemaining); 
		else if(nextStepDistance===0) return setTimeout(stepper,stepPeriod);
		else if((nextStepDistance>0 && nextStepDistance<=1) || (nextStepDistance>-1 && nextStepDistance<0)) { // steps are less than 1 pixel at this rate
		  stepPeriod=Math.ceil(timeRemaining/distanceRemaining); // time between pixels
		  var shortStepPeriod=stepPeriod;
		  if(nextStepDistance>0 && nextStepDistance<0.5) {
			shortStepPeriod=Math.max(stepPeriod, Math.ceil((1-nextStepDistance)*stepPeriod)); // time to the next pixel but at least something
			setTimeout(stepper,shortStepPeriod); // come back later and less often
			return;
		  }
		  if(nextStepDistance>-0.5 && nextStepDistance<0) {
			shortStepPeriod=Math.max(stepPeriod, Math.ceil((1+nextStepDistance)*stepPeriod)); // time to the next pixel but at least something
			setTimeout(stepper,shortStepPeriod); // come back later and less often
			return;
		  }
		}
		let nextTop = top + nextStepDistance; // top of the next step
		html.style.top=nextTop+'px'; // set the new top
		setTimeout(stepper,stepPeriod);
	  }
	  setTimeout(stepper, stepPeriod) // kick off the stepper
	}
};

function fixedScroll(){
    return;
}

export default fixedScroll;


