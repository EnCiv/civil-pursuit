'use strict';

import React from 'react';
import ReactCollapse from 'react-collapse';
import ReactHeight from '../../lib/app/ReactHeight.js';

class Accordion extends React.Component {
  // C(losed) O(pen) B(usy)

  static propTypes  =   {
    active          :   React.PropTypes.bool
  };

  state             =   {
    attr            :   'hide',
    calculated :  false
  };

  mounted = false;
  stepSize = 7;
  stepRate = 17; //step rate is 17mSec

  constructor (props) {
    super(props);
    console.info("accordion.constructor", this.props);
    this.mounted = false;

    var height;

    if (typeof window !== 'undefined' ) { 
      height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight; 
    } else {
      height=1024; // this is running on the server, guess the height of the screen this will be displayed on
    } 

    const stepMaxDuration= 1; //* maximum time allowed for a scroll if it were full screen in Sec
    this.stepSize= ((height * this.stepRate) / stepMaxDuration ) / 1000 ;

    console.info("accordion.constructior 2", height, this.stepSize);

  }

  componentWillReceiveProps (nextProps) {
      console.info("accordion.componentWillReceiveProps", nextProps, this.props);
      if(this.props.active!==nextProps.active) {
        if(!nextProps.active) {
          this.smoothClose();
        } else if (this.refs.accordionWrapper.clientHeight > this.refs.accordion.clientHeight) { 
          this.smoothOpen(); 
        }
     }
  }

  componentDidMount() {
    console.info("accordion.componentDidMount", this.refs.accordion, this.state.attr, this.props, this.refs.accordionWrapper.clientHeight);
    if(this.props.active) {
      if(this.refs.accordion.clientHeight >= this.refs.accordion.style.maxHeight) { this.smoothOpen(); }
    }
  }

  componentDidUpdate() {
    console.info("accordion.componentDidUpdate", this.refs.accordion, this.state.attr, this.props, this.refs.accordionWrapper.clientHeight);
    if(this.props.active) {
      let maxHeight=parseInt(this.refs.accordion.style.maxHeight,10) || 0 ;
      if(this.refs.accordion.clientHeight >=  maxHeight ) { console.info("componentDidUpdate 1",this.refs.accordion.clientHeight, maxHeight); this.smoothOpen(); }
        else if (this.refs.accordionWrapper.clientHeight > this.refs.accordion.clientHeight) 
        { console.info("componentDidUpdate 2",this.refs.accordionWrapper.clientHeight ,this.refs.accordion.clientHeight );  
          this.smoothOpen(); 
        }
    }
  }

  componentWillUnmount() {
    console.info("accordion.componentWillUnmount", this.state.attr);
 //   if(this.state.attr==='show') {
 //       this.smoothClose();
 //   }
  }

  inOpen='inactive';
  smoothOpen() {
    // set an interval to update scrollTop attribute every 25 ms
    if(this.inOpen==='active') { console.info("smoothOpen stutter return"); return; } // dont't stutter start.
    this.inOpen='active';
    if(this.inClose!=="inactive") {this.inClose='abort'}
    let accordion = this.refs.accordion;
//    let shadow = this.refs.shadow;

    let timerMax=1000;  //just in case
    let waitforit= 1000/this.stepRate;  // wait 1 second to give stuff a chance to appear

    let maxHeight = parseInt(accordion.style.maxHeight,10) || 0;
    let height= accordion.clientHeight;
    if (maxHeight < height) { //minHeight may not be 0
      accordion.style.maxHeight= height + 'px';
    } 

//    shadow.style.width = accordion.offsetWidth + 'px';
//    let rect=shadow.getBoundingClientRect();
//    shadow.style.minHeight= (window.innerHeight - rect.top) + 'px';
    //accordion.style.position='relative';
    //accordion.style.zIndex= -2;
    //accordion.style.overflow= 'visible';

    const timer = setInterval( () => {
      if(--timerMax <= 0 ){ clearInterval(timer); console.error("accordion.smoothOpen timer overflow");}
      if(this.inOpen==='abort'){ clearInterval(timer); this.inOpen='inactive'; return; }
      let lmaxHeight = parseInt(accordion.style.maxHeight,10) || 0;
      let lheight= accordion.clientHeight;
      if( lmaxHeight <= lheight ){
        accordion.style.maxHeight = Math.max((lmaxHeight + this.stepSize), lheight + 1) + 'px';
 //       shadow.style.minHeight = Math.max((parseInt(shadow.style.minHeight) - 7), 0) + 'px';
      } else {
      // end interval if the scroll is completed
        if(--waitforit <= 0) {

          this.inOpen='inactive';
          clearInterval(timer);
          //accordion.style.maxHeight="none";
          //accordion.style.overflow="visible";
          //accordion.style.zIndex= 1;
 //         shadow.style.minHeight= 0;
          this.setState({ attr : 'show' });
        }
      }
    }, this.stepRate);
  }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


  inClose='inactive';
  smoothClose() {
    // set an interval to update scrollTop attribute every 25 ms
    if(this.inClose=='active'){return;} //don't stutter the close
    this.inClose='active';
    if(this.inOpen!='inactive') { this.inOpen='abort';} //override the open with a close

    let accordion = this.refs.accordion;
    //let shadow = this.refs.shadow;

    //let maxHeight = parseInt(accordion.style.maxHeight,10) || 0;
    let height= accordion.clientHeight;
    console.info("smoothClose", height);
    accordion.style.maxHeight= height + 'px';

    //shadow.style.width = accordion.offsetWidth + 'px';
    //let rect=shadow.getBoundingClientRect();
    //shadow.style.minHeight= (window.innerHeight  - rect.top -7) + 'px';
    //console.info("smoothClose", window.innerHeight - rect.top);
    //accordion.style.position='relative';
    //accordion.style.zIndex= -2;
    //accordion.style.overflow= 'hidden';

    let timerMax=1000; //just incase something goes wrong don't leave the timer running

    const timer = setInterval( () => {
      if(--timerMax == 0 ){ clearInterval(timer); console.error("accordion.smoothOpen timer overflow");}
      if(this.inClose==='abort'){ clearInterval(timer); this.inClose='inactive'; return; }
      let lmaxHeight = parseInt(accordion.style.maxHeight,10) || 0;
      let lheight= accordion.clientHeight;
      console.info("smoothClose", lheight);
      if( (lmaxHeight >= lheight) && (lheight > 0)){ //it's still shrinking
        accordion.style.maxHeight =  (((lmaxHeight - this.stepSize) > 0) ? (lmaxHeight - this.stepSize) : 0 ) + 'px';
        //shadow.style.minHeight = (window.innerHeight - shadow.getBoundingClientRect().top) + 'px'; 
      } else {
      // end interval if the scroll is completed
        this.inClose='inactive';
        clearInterval(timer);
        accordion.style.maxHeight=0;
        this.setState({ attr : 'hide' });
        //accordion.style.overflow= 'hidden';
        //accordion.style.minHeight= 0;
        //accordion.style.position='static';
        //accordion.style.zIndex= 'auto';
        //shadow.style.minHeight= 0;
      }
    }, this.stepRate);
  }

  render () {
    return (
      <section className={`accordion ${this.state.attr}`} ref='accordion' >
        <div ref='accordionWrapper' >
          { this.props.children }
        </div>
        <div className="accordion-shadow" ref='shadow'>{false}</div>
      </section>
    );
  }
}

export default Accordion;
