'use strict';

import React from 'react';
import ClassNames          from 'classnames';

class Accordion extends React.Component {

  static propTypes  =   {
    active          :   React.PropTypes.bool,
    text            :   React.PropTypes.bool,
    onComplete      :   React.PropTypes.func
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

    const stepMaxDuration= props.maxDuration || 1000; //* maximum time allowed for a scroll if it were full screen in mSec
    this.stepSize= Math.round(((height * this.stepRate) / stepMaxDuration ) );  //needs to be an int
  }

  componentWillReceiveProps (nextProps) {
      if(this.props.active!==nextProps.active) {
        if(!nextProps.active) {
          this.smoothClose();
        } else { 
          this.smoothOpen(); 
        }
     }
  }

 transparentEventListener= {};
 transparent(e){
   e.preventDefault(); console.info("accordionWrapper event", e.type);
 }

  componentDidMount() {
    const el=this.refs.accordionWrapper;
    // the wrapper, a div, should not intercept events and prevent them from propogating up. It should be 'transparent' to events
    this.transparentEventListener=this.transparent.bind(this);
    el.addEventListener('mouseover', this.transparentEventListener, false);
    el.addEventListener('click', this.transparentEventListener, false);


    if(this.props.active) {
      let maxHeight = parseInt(this.refs.accordion.style.maxHeight,10) || 0;
      if(el.clientHeight >= maxHeight) { 
        console.info("Accordion componentDidMount smooth Open");
        if( typeof window !== 'undefined') {  
          this.smoothOpen(); 
        } else {
            this.setState( { attr : 'expanded'} );
        }
      }
    }
  }

  componentWillUnmount(){
    const el=this.refs.accordionWrapper;
    // the wrapper, a div, should not intercept events and prevent them from propogating up. It should be 'transparent' to events
      el.removeEventListener('mouseover', this.transparentEventListener);
      el.removeEventListener('click', this.transparentEventListener);

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

    this.setState( { attr : 'expanding'} );

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
          this.setState( { attr : 'expanded'} );
          accordion.style.maxHeight=null;
          if(this.props.onComplete) { this.props.onComplete(true); }
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

    //let maxHeight = parseInt(accordion.style.maxHeight,10) || 0;
    let height= accordion.clientHeight;
    accordion.style.maxHeight= height + 'px';

    this.setState( { attr : 'collapsing' } );
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
        if(this.props.onComplete) { this.props.onComplete(false); }
      }
    }, this.stepRate);
  }

  render () {
    var classes = ClassNames( 
            this.props.className, 
            'accordion',
            {   
              'text': this.props.text,
            },
            this.state.attr
    );
    return (
      <section className={ classes } ref='accordion' style={ this.props.style } onClick={this.props.onClick} >
        <div ref='accordionWrapper' >
          { this.props.children }
        </div>
      </section>
    );
  }
}

export default Accordion;
