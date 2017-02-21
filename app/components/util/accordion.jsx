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

  componentDidMount() {
    if(this.props.active) {
      let maxHeight = parseInt(this.refs.accordion.style.maxHeight,10) || 0;
      if(this.refs.accordionWrapper.clientHeight >= maxHeight) { 
        console.info("Accordion componentDidMount smooth Open");
        if( typeof window !== 'undefined') {  
          this.smoothOpen(); 
        } else {
            this.setState( { attr : 'expanded'} );
        }
      }
    }
  }


  inOpen='inactive';

  openStart=null;

  smoothOpen(durationMS) {
    if(!this.openStart) this.openStart= new Date().getTime();
    else return; // don't stutter start
    if(this.inOpen==='active') { return; } // dont't stutter start.
    this.inOpen='active';
    if(this.inClose!=="inactive") {this.inClose='abort'}
    var duration = durationMS || 500;
    let accordion = this.refs.accordion;

    let timerMax=1000;  //just in case

    let maxHeight = parseInt(accordion.style.maxHeight,10) || 0;
    let height= accordion.clientHeight;
    if (maxHeight < height) { //minHeight may not be 0
      accordion.style.maxHeight= height + 'px';
    } 

    this.setState( { attr : 'expanding'} );
    const timer = setInterval( () => {
      if(--timerMax <= 0 ){ clearInterval(timer); this.openStart=null;  console.error("accordion.smoothOpen timer overflow");}
      if(this.inOpen==='abort'){ clearInterval(timer); this.openStart=null; this.inOpen='inactive'; console.error("accordion.smoothOpen abort due to subsiquent close"); return; }
      let now=new Date().getTime();
      if((now - this.openStart)>duration) { // time is up
            this.inOpen='inactive';
            clearInterval(timer);
            this.openStart=null;
            this.setState( { attr : 'expanded'} );
            accordion.style.maxHeight=null;
            if(this.props.onComplete) { this.props.onComplete(true); }
            return;
      }
      let lmaxHeight = parseInt(accordion.style.maxHeight,10) || 0;
      let lheight= accordion.clientHeight;
      let wheight=this.refs.accordionWrapper ? this.refs.accordionWrapper.clientHeight : 0;
      console.info("accordion wheight", lheight, wheight );

      if((wheight-lheight) > this.stepSize ){  // wrapper has a significant height
            // calculate the percent of the scroll duration that has been completed. 100% max
            let step = Math.min(1, (now - this.openStart) / duration);
            let distance = Math.max(wheight - lheight, 1); // distance to go, but not negative
            let newMax = lheight + (step * distance); // top of the next step
            accordion.style.maxHeight=newMax+'px';
            console.info("accordion maxHeight", step, distance, newMax, now-this.openStart);
      } else {  // we don't know the height of the wrapper, the data is not populated yet
          if( lmaxHeight <= lheight ){  // if maxheight is equal to (or somehow less) increment the maxHeight another step
            accordion.style.maxHeight = Math.max((lmaxHeight + this.stepSize), lheight + 1) + 'px';
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
      if(this.inClose==='abort'){ clearInterval(timer); this.inClose='inactive'; console.error("accordion.smoothClose abort due to subsiquent open"); return; }
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
