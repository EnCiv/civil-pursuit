import React from 'react';

import VerticalScrollbar from './vertical-scrollbar';
import HorizontalScrollbar from './horizontal-scrollbar';

function trim(max, min, val){
  let tmax = (val > max) ? max : val;
  let tmin = (tmax < min) ? min : tmax;
  return tmin;
};

class ScrollWrapper extends React.Component {

  constructor() {
    super();
    this.state = {
      ready: false,
      scrollY: null,
      scrollX: null,
      top: 0,
      left: 0,
      scrollAreaHeight: null,
      scrollAreaWidth: null,
      scrollWrapperHeight: null,
      scrollWrapperWidth: null,
      verticalHeight: null,
      vMovement: 0,
      hMovement: 0,
      dragging: false,  // note: dragging - fake pseudo class
      scrolling: false, // changes: scrolling (new fake pseudo class)
      reset: false, // changes: change state without rendering
      start: { y: 0, x: 0 },
      topBarHeight: null
    };

    this.touchable=false;
    this.updateSize = this.calculateSize.bind(this,null);
    this.calculateSize = this.calculateSize.bind(this);
    this.scroll = this.scroll.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    this.handleChangePosition = this.handleChangePosition.bind(this);
    this.handleScrollbarDragging = this.handleScrollbarDragging.bind(this);
    this.handleScrollbarStopDrag = this.handleScrollbarStopDrag.bind(this);
    if(typeof window!== 'undefined') {
      this.htmlElement=document.getElementsByTagName("html")[0];
      this.htmlElement.style.position='fixed';
      this.htmlElement.style.overflowX='hidden';
      window.Synapp.ScrollFocus=this.ScrollFocus.bind(this);
      this.scrollWrapper=this.htmlElement; //using the root as the wrapper
    } else 
      this.htmlElement = null;
  }

 /* scrollToTarget(target, duration){ // duration not used
    if(!target) return;
    let newTop=(this.state.top+target.getBoundingClientRect().top-this.state.topBarHeight);
    this.scrollToY(newTop);
  }*/

  ScrollFocus(target, duration=500){
    if(!target) return;
    var html=this.htmlElement;
    var bannerHeight=this.state.topBarHeight;
    var start=new Date().getTime();
    var stepPeriod=25;
  
    var stepper= ()=>{
      let now=new Date().getTime();
  
      let top=parseFloat(html.style.top);
      let tRect=target.getBoundingClientRect(); // target Rect
      let newTop=-(-top + tRect.top -bannerHeight);
      let extent=this.props.extent;
      const lowerEnd = this.state.scrollAreaHeight-extent; /*- this.state.scrollWrapperHeight*/;

      // if bottom of target is above the top of the wrapper, then hyperjump (old)top to the position just before it is visible.
      if(tRect.bottom< bannerHeight){
        top= -(-top + -tRect.top)
      }
  
      if(now-start >duration){
        newTop = -trim(lowerEnd, -extent, -newTop);
        html.style.top=newTop+'px';
        this.setState({top: -newTop});
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
      nextTop = -trim(lowerEnd, -extent, -newTop);
      html.style.top=nextTop+'px'; // set the new top
      setTimeout(stepper,stepPeriod);
    }
    setTimeout(stepper, stepPeriod) // kick off the stepper
  }

  componentDidMount() {
    this.updateSize();

    // Attach The Event for Responsive View~
    window.addEventListener('resize', this.updateSize, {passive: false});
    this.scrollWrapper.addEventListener('touchstart', this.startDrag, {passive: true});
    this.scrollWrapper.addEventListener('touchmove', this.onDrag, {passive: false});
    this.scrollWrapper.addEventListener('touchend', this.stopDrag, {passive: false});
    this.observer = new MutationObserver(this.mutations.bind(this));
  }

  componentDidUpdate() {
    this.observer.observe(this.scrollArea, { attributes: true, childList: true, subtree: true });
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  mutations(mutations) {
    this.updateSize();
  }

// changes: update scrollbars when parent resizing
  componentWillReceiveProps() {
    this.updateSize();
  }

// changes: reset settings without rerendering (need for scrolling state)
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.reset) {
      this.setState({ reset: false });
      return false;
    }
    return true;
  }


  componentWillUnmount() {
    // Remove Event
    window.removeEventListener('resize', this.updateSize);
    this.observer.disconnect();
  }

  onDrag(event) {
    if (this.state.dragging) {
      event.preventDefault();
      const e = event.changedTouches ? event.changedTouches[0] : event;

      // Invers the Movement
      const yMovement = this.state.start.y - e.clientY;
      const xMovement = this.state.start.x - e.clientX;

      // Update the last e.client
      this.setState({ start: { y: e.clientY, x: e.clientX } });

      // The next Vertical Value will be
      const nextY = this.state.top + yMovement;
      const nextX = this.state.left + xMovement;

      this.normalizeVertical(nextY);
      this.normalizeHorizontal(nextX);
    }
  }

  getSize() {
    // The Elements
    const $scrollArea = this.scrollArea;
    const $scrollWrapper = this.scrollWrapper;
    const topBarHeight= (this.props.topBar && this.props.topBar.getBoundingClientRect().height) || 0;
    // Get new Elements Size
    const elementSize = {
      // Scroll Area Height and Width

      // changes: support margin and no one child
      scrollAreaHeight: $scrollArea.getBoundingClientRect().height,
      scrollAreaWidth: $scrollArea.children[0].clientWidth, // fixme: not working same way

      // Scroll Wrapper Height and Width
      scrollWrapperHeight: $scrollWrapper.clientHeight,
      scrollWrapperWidth: $scrollWrapper.clientWidth,

      topBarHeight: topBarHeight

    };
    elementSize.scrollWrapperHeight-=topBarHeight;

    return elementSize;
  }

  stopDrag() {
    this.setState({ dragging: false });
  }

  scrollToY(pos) {
    const maxVal = this.state.scrollAreaHeight - this.state.scrollWrapperHeight;
    let val = pos;
    if (typeof pos === 'string') {
      const valK = parseInt(pos.match(/-?[\d]*%$/)[0], 10) / 100;
      val = valK * maxVal;
    }

    if (val < 0) {
      val = maxVal + val;
    }
    this.normalizeVertical(val);
  }

  scrollToX(pos) {
    const maxVal = this.state.scrollAreaWidth - this.state.scrollWrapperWidth;
    let val = pos;
    if (typeof pos === 'string') {
      const valK = parseInt(pos.match(/-?[\d]*%$/)[0], 10) / 100;
      val = valK * maxVal;
    }

    if (val < 0) {
      val = maxVal + val;
    }
    this.normalizeHorizontal(val);
  }


  normalizeVertical(nextPos, nextState) {
    // Vertical Scrolling
    // Max Scroll Down
    // Max Scroll Up
    let extent=this.props.extent;
    const lowerEnd = this.state.scrollAreaHeight-extent; /*- this.state.scrollWrapperHeight*/;
    const next = trim(lowerEnd, -extent, nextPos);

    // Update the Vertical Value
    this.htmlElement.style.top=(-next)+'px';
    this.setState({
      top: next,
      vMovement: (next / this.state.scrollAreaHeight) * 100,
    }, () => this.setState({ ...nextState })); // changes: update state after operation
  }

  normalizeHorizontal(nextPos, nextState) {
    // Horizontal Scrolling
    const rightEnd = this.state.scrollAreaWidth - this.state.scrollWrapperWidth;

    // Max Scroll Right
    // Max Scroll Right
    const next = trim(rightEnd, 0, nextPos);

    // Update the Horizontal Value
    this.setState({
      left: next,
      hMovement: (next / this.state.scrollAreaWidth) * 100,
    }, () => this.setState({ ...nextState })); // changes: update state after operation
  }

  handleChangePosition(movement, orientation) {
    // Make sure the content height is not changed
    this.calculateSize(() => {
      // Convert Percentage to Pixel
      const next = movement / 100;
      if (orientation === 'vertical') this.normalizeVertical(next * this.state.scrollAreaHeight);
      if (orientation === 'horizontal') this.normalizeHorizontal(next * this.state.scrollAreaWidth);
    });
  }

  handleScrollbarDragging() {
    this.setState({ dragging: true });
  }

  handleScrollbarStopDrag() {
    this.setState({ dragging: false });
  }

  calculateSize(cb) {
    const elementSize = this.getSize();

    if (elementSize.scrollWrapperHeight !== this.state.scrollWrapperHeight ||
        elementSize.scrollWrapperWidth !== this.state.scrollWrapperWidth ||
        elementSize.scrollAreaHeight !== this.state.scrollAreaHeight ||
        elementSize.scrollAreaWidth !== this.state.scrollAreaWidth) {
      // Set the State!
      let top=this.state.top;
      let extent=this.props.extent;
      if(top <= -(elementSize.scrollAreaHeight-extent)) top=-(elementSize.scrollAreaHeight-extent);
      if(top >= (elementSize.scrollWrapperHeight-extent)) top=elementSize.scrollWrapperHeight-extent;
      this.setState({
        top,

        topBarHeight: elementSize.topBarHeight,
        
        // Scroll Area Height and Width
        scrollAreaHeight: elementSize.scrollAreaHeight,
        scrollAreaWidth: elementSize.scrollAreaWidth,

        // Scroll Wrapper Height and Width
        scrollWrapperHeight: elementSize.scrollWrapperHeight,
        scrollWrapperWidth: elementSize.scrollWrapperWidth,

        // Make sure The wrapper is Ready, then render the scrollbar
        ready: true,
      }, cb);
    } else cb && cb();
  }

  // DRAG EVENT JUST FOR TOUCH DEVICE~
  startDrag(event) {
    //event.preventDefault();
    //event.stopPropagation();

    const e = event.changedTouches ? event.changedTouches[0] : event;
    if(event.changedTouches && event.changedTouches.length) this.touchable=true;

    // Make sure the content height is not changed
    this.calculateSize(() => {
      // Prepare to drag
      this.setState({
        dragging: true,
        start: { y: e.pageY, x: e.pageX },
      });
    });
  }

  scroll(e) {
    e.preventDefault();

    // Make sure the content height is not changed
    this.calculateSize(() => {
      // Set the wheel step
      const num = this.props.speed;

      // DOM events
      const shifted = e.shiftKey;
      const scrollY = e.deltaY > 0 ? num : -(num);
      let scrollX = e.deltaX > 0 ? num : -(num);

      // Fix Mozilla Shifted Wheel~
      if (shifted && e.deltaX === 0) scrollX = e.deltaY > 0 ? num : -(num);

      // Next Value
      const nextY = this.state.top + scrollY;
      const nextX = this.state.left + scrollX;

      // Is it Scrollable?
      const canScrollY = (this.state.scrollAreaHeight > this.state.scrollWrapperHeight) || (this.state.top !== 0);
      const canScrollX = this.state.scrollAreaWidth > this.state.scrollWrapperWidth;

      // changes: Set scrolling state before changing position
      this.setState({ scrolling: true }, () => {
        // Vertical Scrolling
        if (canScrollY && !shifted) {
          this.normalizeVertical(nextY, { scrolling: false, reset: true });
        }

        // Horizontal Scrolling
        if (shifted && canScrollX) {
          this.normalizeHorizontal(nextX, { scrolling: false, reset: true });
        }
      });
    });
  }

  render() {
    const className = (base, name, pos, isDrg, isScr) => [
      base + name,
      base + name + pos,
      isDrg ? `${base + name}:dragging` : '',
      isDrg ? `${base + name + pos}:dragging` : '',
      isScr ? `${base + name}:scrolling` : '',
      isScr ? `${base + name + pos}:scrolling` : '',
    ].join(' ');

    var style={...this.props.style, position: 'relative'};
    var verticalStyle={};
    if(!style.height && this.state.scrollWrapperHeight) {
      verticalStyle.height=style.height=(this.state.scrollWrapperHeight /*- this.state.topBarHeight*/)+'px';
      verticalStyle.top=this.state.topBarHeight;
    }

    

    return (
      <div
        onClick={this.updateSize}
        className={this.props.className}
        ref={this.updateSize}
        style={style}
      >

        <div
          className={
            className('-reactjs-scrollbar', '-area', '', this.state.dragging, this.state.scrolling)
          }
          ref={(c) => { if(c) this.scrollArea = c; }}
          onWheel={this.scroll}
          onChange={this.updateSize}
          style={{ marginLeft: `${this.state.left * -1}px` }}
        >

          { this.props.children }

          { (!this.touchable && (this.state.ready  || this.state.top)) ?

            <VerticalScrollbar
              style={verticalStyle}
              area={{ height: this.state.scrollAreaHeight }}
              wrapper={{ height: this.state.scrollWrapperHeight }}
              scrolling={this.state.vMovement}
              draggingFromParent={this.state.dragging}
              onChangePosition={this.handleChangePosition}
              onDragging={this.handleScrollbarDragging}
              onStopDrag={this.handleScrollbarStopDrag}
            />

          : null }


          { (false && this.state.ready) ?

            <HorizontalScrollbar
              area={{ width: this.state.scrollAreaWidth }}
              wrapper={{ width: this.state.scrollWrapperWidth }}
              scrolling={this.state.hMovement}
              draggingFromParent={this.state.dragging}
              onChangePosition={this.handleChangePosition}
              onDragging={this.handleScrollbarDragging}
              onStopDrag={this.handleScrollbarStopDrag}
            />

          : null }

        </div>
      </div>

    );
  }

}

// The Props
ScrollWrapper.propTypes = {
  speed: React.PropTypes.number,
  className: React.PropTypes.string,
  style: React.PropTypes.shape(),
  children: React.PropTypes.node,
  extent: React.PropTypes.number
};

ScrollWrapper.defaultProps = {
  speed: 27,
  className: 'react-scrollbar-default',
  style: { },
  children: null,
  extent: 100
};

export default ScrollWrapper;