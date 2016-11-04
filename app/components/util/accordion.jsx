'use strict';

import React from 'react';

class Accordion extends React.Component {
  // C(losed) O(pen) B(usy)

  static propTypes  =   {
    active          :   React.PropTypes.bool
  };

  counter           =   0;
  height            =   null;
  visibility        =   false;
  id                =   null;

  state             =   {
    attr            :   'hide'
  };

  constructor (props) {
    super(props);

    if ( this.props.active === true ) {
      this.state.attr = 'show';
    }
    else if ( this.props.active === false ) {
      this.state.attr = 'hide';
    }
  }

  componentWillReceiveProps (props = {}) {
    if ( props.active === true ) {
      if(this.state.attr==='hide') {
        this.setState({ attr : 'show' });
      }
    }
    else if ( props.active === false ) {
      if (this.state.attr==='show') {
          this.smoothClose();
      }
    }
  }

  componentDidMount() {
    if(this.state.attr==='show') {
        this.smoothOpen();
    }
  }

  componentWillUnmount() {
    if(this.state.attr==='show') {
        this.smoothClose();
    }
  }

  smoothOpen() {
    // set an interval to update scrollTop attribute every 25 ms

    let accordion = React.findDOMNode(this.refs.accordion);
    let shadow = React.findDOMNode(this.refs.shadow);

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
      let lmaxHeight = parseInt(accordion.style.maxHeight,10) || 0;
      let lheight= accordion.clientHeight;
      if( lmaxHeight <= lheight ){
        accordion.style.maxHeight = (lmaxHeight + 7) + 'px';
        shadow.style.minHeight = Math.max((parseInt(shadow.style.minHeight) - 7), 0) + 'px';
      } else {
      // end interval if the scroll is completed
        clearInterval(timer);
        accordion.style.maxHeight="none";
        accordion.style.overflow="visible";
        accordion.style.zIndex= 1;
        shadow.style.minHeight= 0;
      }
    }, 250);
  }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  smoothClose() {
    // set an interval to update scrollTop attribute every 25 ms
    let accordion = React.findDOMNode(this.refs.accordion);
    let shadow = React.findDOMNode(this.refs.shadow);

    let maxHeight = parseInt(accordion.style.maxHeight,10) || 0;
    let height= accordion.clientHeight;
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
      let lmaxHeight = parseInt(accordion.style.maxHeight,10) || 0;
      let lheight= accordion.clientHeight;
      if( lmaxHeight >= lheight ){ //it's still shrinking
        accordion.style.maxHeight =  (((lmaxHeight - 7) > 0) ? (lmaxHeight - 7) : 0 ) + 'px';
        //shadow.style.minHeight = (window.innerHeight - shadow.getBoundingClientRect().top) + 'px'; 
      } else {
      // end interval if the scroll is completed
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
    return (
      <section>
        <section className={ `syn-accordion` } ref="accordion">
              { this.props.children }
        </section>
        <div className="syn-accordion-shadow" ref="shadow">''</div>
      </section>
    );
  }
}

export default Accordion;
