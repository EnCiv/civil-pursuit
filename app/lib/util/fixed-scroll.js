'use strict';
var ScrollSwipe = require('scroll-swipe'); //or just use the global window.ScrollDirect if using this on the client;

class FixedScroll{
	constructor() {
		this.target=document.getElementsByTagName("html")[0];
		this.target.style.position="fixed";
		this.target.style.top="0px";
		return this;
	}

	touchMoveCb(){
		return this.touchMove.bind(this);
	}

	touchCb(){
		return this.touch.bind(this);
	}

	touchMove(data) {
		let {deltaX, deltaY}=data;
        let top=parseFloat(this.target.style.top) || 0;
        let b=this.target.getBoundingClientRect();
        top+=deltaY;
        if(top<(-b.height))top= (-b.height);
        else if (top>0) top=0;
		this.target.style.top=top+deltaY+'px';
	}

	touch(data){
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

	decelerate(top,deltaY){
        top=top+deltaY;
        
        let b=this.target.getBoundingClientRect();
        if(top<(-b.height))top= (-b.height);
        else if (top>0) top=0;

		this.target.style.top=top+'px';

		if(Math.abs(deltaY)>2) return setTimeout(()=>this.decelerate(top,deltaY*.9),20)
		else if(deltaY<0) return setTimeout(()=>this.target.style.top=Math.ceil(top)-1+'px',20)
		else return setTimeout(()=>this.target.top=Math.ceil(top)+'px',20)
	}
}


function fixedScroll(){
    var fS=new FixedScroll();

    var ss = new ScrollSwipe({
        target: document.body, // can be a div, or anything else you want to track scroll/touch events on
        scrollSensitivity: 0, // the lower the number, the more sensitive
        touchSensitivity: 0, // the lower the number, the more senitive,
        scrollPreventDefault: true, // prevent default option for scroll events
        touchPreventDefault: true, // prevent default option for touch events
        scrollCb: fS.scrollCb(),
        touchCb: fS.touchCb(),
        touchMoveCb: fS.touchMoveCb()
    });
}

export default fixedScroll;


