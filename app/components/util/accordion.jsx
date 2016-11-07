'use strict';

import React from 'react';
import ReactCollapse from 'react-collapse';

class Accordion extends React.Component {
  // C(losed) O(pen) B(usy)

  static propTypes  =   {
    active          :   React.PropTypes.bool
  };

  state             =   {
    attr            :   'hide',
  };

  mounted = false;

  constructor (props) {
    super(props);
    this.mounted = false;
  }

  componentWillReceiveProps (props = {}) {
      console.info("accordion.componentWillReceiveProps", this.mounted ? 'mounted' : 'not mounted', props.active, this.state.attr);
      if(this.mounted) {
        if ( this.props.active === true ) {
          if(this.state.attr!=='show') {
            this.setState({ attr : 'show' });
          }
        } else if ( this.props.active === false ) {
          if (this.state.attr!=='hide') {
              this.setState({attr : 'hide'});
          }
        }
      }
  }

  componentDidMount() {
    console.info("accordion.componentDidMount", this.state.attr, this.mounted)
    this.mounted=true;
    if ( this.props.active === true ) {
      if(this.state.attr!=='show') {
        this.setState({ attr : 'show' });
      }
    } 
    else if ( this.props.active === false ) {
      if (this.state.attr!=='hide') {
          this.setState({attr : 'hide'});
      }
    }
  }

  componentWillUnmount() {
    this.mounted=false;
    console.info("accordion.componentWillUnmount", this.state.attr);
 //   if(this.state.attr==='show') {
 //       this.smoothClose();
 //   }
  }

  inOpen='inactive';
  smoothOpen() {
    // set an interval to update scrollTop attribute every 25 ms

    this.inOpen='active';
    if(this.inClose!=="inactive") {this.inClose='abort'}
    let accordion = this.refs.accordion;
    let shadow = this.refs.shadow;

    let timerMax=1000;

    let maxHeight = parseInt(accordion.style.maxHeight,10) || 0;
    let height= accordion.clientHeight;
    if (maxHeight < height) {
      accordion.style.maxHeight= height + 'px';
    }

    shadow.style.width = accordion.offsetWidth + 'px';
    let rect=shadow.getBoundingClientRect();
    shadow.style.minHeight= (window.innerHeight - rect.top) + 'px';
    //accordion.style.position='relative';
    //accordion.style.zIndex= -2;
    //accordion.style.overflow= 'visible';

    const timer = setInterval( () => {
      if(--timerMax == 0 ){ clearInterval(timer); console.error("accordion.smoothOpen timer overflow");}
      if(this.inOpen==='abort'){ clearInterval(timer); this.inOpen='inactive'; return; }
      let lmaxHeight = parseInt(accordion.style.maxHeight,10) || 0;
      let lheight= accordion.clientHeight;
      if( lmaxHeight <= lheight ){
        accordion.style.maxHeight = (lmaxHeight + 7) + 'px';
        shadow.style.minHeight = Math.max((parseInt(shadow.style.minHeight) - 7), 0) + 'px';
      } else {
      // end interval if the scroll is completed
        this.inOpen='inactive';
        clearInterval(timer);
        accordion.style.maxHeight="none";
        accordion.style.overflow="visible";
        accordion.style.zIndex= 1;
        shadow.style.minHeight= 0;
      }
    }, 17);
  }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


  inClose='inactive'
  smoothClose() {
    // set an interval to update scrollTop attribute every 25 ms

    this.inClose='active';
    if(this.inOpen!='inactive') { this.inOpen='abort';}

    let accordion = this.refs.accordion;
    let shadow = this.refs.shadow;

    let maxHeight = parseInt(accordion.style.maxHeight,10) || 0;
    let height= accordion.clientHeight;
    console.info("accordion.smoothClose", height)
    accordion.style.maxHeight= height + 'px';

    //shadow.style.width = accordion.offsetWidth + 'px';
    //let rect=shadow.getBoundingClientRect();
    //shadow.style.minHeight= (window.innerHeight  - rect.top -7) + 'px';
    //console.info("smoothClose", window.innerHeight - rect.top);
    //accordion.style.position='relative';
    //accordion.style.zIndex= -2;
    accordion.style.overflow= 'hidden';
    let timerMax=1000;


    const timer = setInterval( () => {
      if(--timerMax == 0 ){ clearInterval(timer); console.error("accordion.smoothOpen timer overflow");}
      if(this.inClose==='abort'){ clearInterval(timer); this.inClose='inactive'; return; }
      let lmaxHeight = parseInt(accordion.style.maxHeight,10) || 0;
      let lheight= accordion.clientHeight;
      if( lmaxHeight >= lheight ){ //it's still shrinking
        accordion.style.maxHeight =  (((lmaxHeight - 7) > 0) ? (lmaxHeight - 7) : 0 ) + 'px';
        //shadow.style.minHeight = (window.innerHeight - shadow.getBoundingClientRect().top) + 'px'; 
      } else {
      // end interval if the scroll is completed
        this.inClose='inactive';
        clearInterval(timer);
        this.setState({ attr : 'hide' });
        //accordion.style.overflow= 'hidden';
        //accordion.style.minHeight= 0;
        //accordion.style.position='static';
        //accordion.style.zIndex= 'auto';
        //shadow.style.minHeight= 0;
      }
    }, 25);
  }

  render () {
    console.info("accordion attr", this.mounted, this.state.attr);
    return (
      <section className="accordion">
        <ReactCollapse isOpened={this.state.attr==='show'} springConfig={{stiffness: 16, damping: 12}} keepCollapsedContent= {true} >
              { this.props.children }
        </ReactCollapse>
      </section>
    );
  }
}

export default Accordion;
