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
    attr            :   'collapsed',
  };

  stepSize = 7;
  stepRate = 17; //step rate is 17mSec

  constructor (props) {
    super(props);
    var height;

    if (typeof window !== 'undefined' ) { 
      height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight; 
    } else {
      height=1024; // this is running on the server, guess the height of the screen this will be displayed on
    } 

    const stepMaxDuration= props.maxDuration || 1000; //* maximum time allowed for a scroll if it were full screen in Sec
    this.stepSize= Math.round(((height * this.stepRate) / stepMaxDuration ) );  //needs to be an int
  }

  componentWillReceiveProps (nextProps) {
      if(this.props.active!==nextProps.active) {
        if(!nextProps.active) {
          this.smoothClose();
        } else if (this.refs.accordionWrapper.clientHeight > this.refs.accordion.clientHeight) { 
          this.smoothOpen(); 
        }
     }
  }

  componentDidMount() {
    if(this.props.active) {
      if(this.refs.accordion.clientHeight >= this.refs.accordion.style.maxHeight) { this.smoothOpen(); }
    }
  }

  componentDidUpdate() {
    if(this.props.active) {
      let maxHeight=parseInt(this.refs.accordion.style.maxHeight,10) || 0 ;
      if((this.refs.accordion.clientHeight >=  maxHeight) && (this.inOpen!='active'))  { // it's expanded for some reason
          this.smoothOpen(); 
      } else if (this.refs.accordionWrapper.clientHeight > this.refs.accordion.clientHeight) { // what's in the wrapper has grown  
          this.smoothOpen(); 
      }
    }
  }

  inOpen='inactive';
  smoothOpen() {
    if(this.inOpen==='active') { return; } // dont't stutter start.
    this.inOpen='active';
    if(this.inClose!=="inactive") {this.inClose='abort'}
    let accordion = this.refs.accordion;

    let timerMax=1000;  //just in case
    let waitforit= 1000/this.stepRate;  // wait 1 second to give stuff a chance to appear

    let maxHeight = parseInt(accordion.style.maxHeight,10) || 0;
    let height= accordion.clientHeight;
    if (maxHeight < height) { //minHeight may not be 0
      accordion.style.maxHeight= height + 'px';
    } 

    const timer = setInterval( () => {
      if(--timerMax <= 0 ){ clearInterval(timer); console.error("accordion.smoothOpen timer overflow");}
      if(this.inOpen==='abort'){ clearInterval(timer); this.inOpen='inactive'; return; }
      let lmaxHeight = parseInt(accordion.style.maxHeight,10) || 0;
      let lheight= accordion.clientHeight;
      if( lmaxHeight <= lheight ){
        accordion.style.maxHeight = Math.max((lmaxHeight + this.stepSize), lheight + 1) + 'px';
      } else {
      // end interval if the scroll is completed
        if(--waitforit <= 0) {

          this.inOpen='inactive';
          clearInterval(timer);
          this.setState({ attr : 'expanded' });
          accordion.style.maxHeight=null;
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
    accordion.style.maxHeight= height + 'px';

    let timerMax=1000; //just incase something goes wrong don't leave the timer running

    const timer = setInterval( () => {
      if(--timerMax == 0 ){ clearInterval(timer); console.error("accordion.smoothClose timer overflow");}
      if(this.inClose==='abort'){ clearInterval(timer); this.inClose='inactive'; return; }
      let lmaxHeight = parseInt(accordion.style.maxHeight,10) || 0;
      let lheight= accordion.clientHeight;
      if( (lmaxHeight >= lheight) && (lheight > 0)){ //it's still shrinking
        accordion.style.maxHeight =  (((lmaxHeight - this.stepSize) > 0) ? (lmaxHeight - this.stepSize) : 0 ) + 'px';
      } else {
        this.inClose='inactive';
        clearInterval(timer);
        this.setState({ attr : 'collapsed' });
        accordion.style.maxHeight=null;
      }
    }, this.stepRate);
  }

  render () {
    return (
      <section className={`accordion ${this.state.attr}`} ref='accordion' >
        <div ref='accordionWrapper' >
          { this.props.children }
        </div>
      </section>
    );
  }
}

export default Accordion;
