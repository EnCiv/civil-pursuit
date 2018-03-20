import React from 'react';

import VerticalScrollbar from './vertical-scrollbar';
import HorizontalScrollbar from './horizontal-scrollbar';

function trim(max, min, val){
  let tmax = (val > max) ? max : val;
  let tmin = (tmax < min) ? min : tmax;
  return tmin;
};

class ScrollWrapper extends React.Component {

  constructor(props) {
    super(props);
    if(typeof window !== 'undefined' && this.props.topBar)
      this.topBar=this.props.topBar;
    let topBarHeight= (this.topBar && this.topBar.getBoundingClientRect().height) || 0;
    this.state = {
      ready: false,
      scrollY: null,
      scrollX: null,
      top: topBarHeight,
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
      start: { y: 0, x: 0, t: 0 },
      topBarHeight: topBarHeight
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
    this.transitionEnd=this.transitionEnd.bind(this);
    if(typeof window!== 'undefined') {
      this.htmlElement=document.getElementsByTagName("html")[0];
      this.htmlElement.style.position='fixed';
      this.htmlElement.style.overflowX='hidden';
      this.htmlElement.style.transition=null;
      this.htmlElement.style.top=this.state.top+'px';
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
    var start=null;
    var last=null;
    var that=this;
    var extent=this.props.extent;

    function stepper(now){
      if(!start) {
        start = now; // now is milliseconds not seconds
        last=now;
        window.requestAnimationFrame(stepper);
        return;
      }

      let top=parseFloat(html.style.top);
      let tRect=target.getBoundingClientRect(); // target Rect
      let newTop=-(-top + tRect.top /*-bannerHeight*/);
      let lowerEnd = that.state.scrollAreaHeight-(that.state.scrollWrapperHeight-extent); /*- this.state.scrollWrapperHeight*/;

      

      // if bottom of target is above the top of the wrapper, then hyperjump (old)top to the position just before it is visible.
      //if(tRect.bottom< bannerHeight){
      //  top= -(-top + -tRect.top)
      //}
      if(lowerEnd<0)
        newTop=0;
      else
        newTop = -trim(lowerEnd, -extent, -newTop);
  
      if(now-start >duration){
        html.style.transition=null;
        //html.style.top=newTop+'px';
        //that.setState({top: -newTop});
        that.calculateSize(()=>{
          that.normalizeVertical(-newTop);
        });
        return;
      }
  
      let timeRemaining = duration - (now - start);
      let stepsRemaining = Math.max(1, Math.round(timeRemaining / (now-last))); // less than one step is one step
      let distanceRemaining = newTop - top;  // could be a positive or negative number
      let nextStepDistance=distanceRemaining/stepsRemaining;
      if(nextStepDistance>-1 && nextStepDistance<1){ // the next step isnt'a full pixel - don't step yet
        return window.requestAnimationFrame(stepper);
      }
      let nextTop = top + nextStepDistance; // top of the next step
      nextTop = -trim(lowerEnd, -extent, -nextTop);
      html.style.transition=null;
      html.style.top=nextTop+that.state.topBarHeight+'px'; // set the new top
      last=now;
      window.requestAnimationFrame(stepper);
    }

    window.requestAnimationFrame(stepper);
  }

  componentDidMount() {
    this.updateSize();

    // Attach The Event for Responsive View~
    window.addEventListener('resize', this.updateSize, {passive: false});
    this.scrollWrapper.addEventListener('touchstart', this.startDrag, {passive: true});
    this.scrollWrapper.addEventListener('touchmove', this.onDrag, {passive: false});
    this.scrollWrapper.addEventListener('touchend', this.stopDrag, {passive: false});
    this.scrollWrapper.addEventListener('transitionend', this.transitionEnd, {passive: true});
    this.observer = new MutationObserver(this.mutations.bind(this));
    this.banerObserver= new MutationObserver(this.topMutations.bind(this));
  }

  componentDidUpdate() {
    this.observer.observe(this.scrollArea, { attributes: true , childList: true , subtree: true });
    if(this.props.topBar) this.banerObserver.observe(this.props.topBar, {attirbutes: true, childList: true, subtree: true});
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  mutations(mutations) {
    if(this.mutationAnimationFrame) return;
    var that=this;
    function viewportUpdate(now){
      that.calculateSize(()=>{
        that.normalizeVertical(that.state.top);
        that.mutationAnimationFrame=0;
      });
    }
    this.mutationAnimationFrame=window.requestAnimationFrame(viewportUpdate);
  }

  topMutations(mutations) {
    if(this.topMutationAnimationFrame) return;
    mutations.map(mut=>mut.type==="attributes" && console.info("mutation",mut.attributeName, mut.attributeNameSpace));
    var that=this;
    function viewportUpdate(now){
      that.calculateSize(()=>{
        that.normalizeVertical(that.state.top);
        that.topMutationAnimationFrame=0;
      });
    }
    this.topMutationAnimationFrame=window.requestAnimationFrame(viewportUpdate);
  }

  transitionEnd(event){
    event.target.style.transition=null;
  }

// changes: update scrollbars when parent resizing
  componentWillReceiveProps(newProps) {
    if(newProps.topBar){
       this.topBar=newProps.topBar;
       this.banerObserver.observe(this.topBar, {attirbutes: true, childList: true, subtree: true});
    }
    //this.updateSize();
    this.calculateSize(()=>{
      this.normalizeVertical(this.state.top);
    });
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
      const deltaT=event.timeStamp - this.state.start.t;
      this.dragVelocityY=yMovement/deltaT*1000; // velociy in pixels per second
      this.dragVelocityX=xMovement/deltaT*1000;
      // Update the last e.client
      this.setState({ start: { y: e.clientY, x: e.clientX, t: event.timeStamp } });

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
    const topBarHeight= (this.topBar && this.topBar.getBoundingClientRect().height) || 0;
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

  stopDrag(event) {
    if(event.changedTouches && event.changedTouches.length){
      const e=event.changedTouches[0];
      const yMovement=this.dragVelocityY*0.25;  // how much farther it will go in half a second.
      const xMovement=this.dragVelocityX*0.25;

      const nextY = this.state.top + yMovement;
      const nextX = this.state.left + xMovement;
      this.htmlElement.style.transition="top 0.5s ease-out";

      this.normalizeVertical(nextY);
      this.normalizeHorizontal(nextX);
    }

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
    const lowerEnd = this.state.scrollAreaHeight-(this.state.scrollWrapperHeight-extent); /*- this.state.scrollWrapperHeight*/;
    let next;
    if(lowerEnd <0)
      next = 0; /*trim(Math.max(-lowerEnd,this.state.topBarHeight-extent), -extent, nextPos);*/
    else
      next = -trim(extent, -lowerEnd, -nextPos);

    // Update the Vertical Value
    this.htmlElement.style.top=(-next)+this.state.topBarHeight+'px';
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
    const start={y: e.pageY, x: e.pageX, t: event.timeStamp}; // need to grab data out of e before it is release by setState (in calculateSize)
    this.dragVelocityX=0;
    this.dragVelocityY=0;
    if(event.changedTouches && event.changedTouches.length) this.touchable=true;
    this.htmlElement.style.transition=null; // make sure transition is off when you start

    // Make sure the content height is not changed
    this.calculateSize(() => {
      // Prepare to drag
      this.setState({
        dragging: true,
        start,
      });
    });
  }

  scroll(e) {
    e.preventDefault();

    // DOM events
    // need to get the values out of e, because e will be release after setState (in calculateSize) is called

    // Set the wheel step
    const num = this.props.speed;
    const shifted = e.shiftKey;
    const deltaX = e.deltaX;
    const deltaY = e.deltaY;
    const scrollY = deltaY > 0 ? num : -(num);
    var scrollX = deltaX > 0 ? num : -(num);
    // Fix Mozilla Shifted Wheel~
    if (shifted && deltaX === 0) scrollX = deltaY > 0 ? num : -(num);

    // Make sure the content height is not changed
    this.calculateSize(() => {

      // Next Value
      const nextY = this.state.top + scrollY;
      const nextX = this.state.left + scrollX;

      // Is it Scrollable?
      const canScrollY = (this.state.scrollAreaHeight > this.state.scrollWrapperHeight) || (this.state.top !== 0);
      const canScrollX = this.state.scrollAreaWidth > this.state.scrollWrapperWidth;

      // changes: Set scrolling state before changing position
      this.setState({ scrolling: true }, () => {
        // Vertical Scrolling
        this.htmlElement.style.transition=null;
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
  extent: 10
};

export default ScrollWrapper;