const VERTICAL = 'VERTICAL';
const HORIZONTAL = 'HORIZONTAL';

const noOp = () => {};

var acceptedParams = {
  target: true,
  scrollSensitivity: true,
  touchSensitivity: true,
  scrollCb: true,
  touchCb: true,
  scrollPreventDefault: true,
  touchPreventDefault: true,
  touchMoveCb: true,
  touchStartCb: true
};

if (typeof module !== 'undefined') {
  module.exports = ScrollSwipe;
}

function ScrollSwipe(opts) {
  Object.keys(opts).forEach(key => {
    if (acceptedParams[key]) {
      this[key] = opts[key];
      return;
    }

    throw new Error(`unknown options for ScrollSwipe: ${key}`)
  });

  if (!opts.target) {
    throw new Error('must provide DOM target element to ScrollSwipe');
  }

  if (!this.scrollSensitivity || this.scrollSensitivity < 0) {
    this.scrollSensitivity = 0;
  }

  if (!this.touchSensitivity || this.touchSensitivity < 0) {
    this.touchSensitivity = 0;
  }

  this.startTouchEvent = null;
  this.latestTouchEvent = null;
  this.latestTouch = null;

  this.startScrollEvent = null;
  this.latestScrollEvent = null;
  this.latestScroll = null;

  this.intent = 0;
  this.currentDirection = VERTICAL;
  this.touchArr = [];
  this.xArr = [];
  this.yArr = [];
  this.touchArrX = [];
  this.touchArrY = [];

  this.scrollPending = false;

  //these should only init if true
  if (this.scrollCb) {
    this.initScroll();
  }

  if (this.touchCb) {
    this.initTouch();
  }

  return this;
}

ScrollSwipe.prototype.listen = function listen() {
  this.flush();
  this.scrollPending = false;
  return this;
}

ScrollSwipe.prototype.onWheel = function onWheel(e) {  
 if (this.scrollPreventDefault) {
      e.preventDefault();
    }

    if (this.scrollPending) {
      return;
    }

    this.startScrollEvent = e;

    var x = e.deltaX;
    var y = e.deltaY;

    this.addXScroll(x);
    this.addYScroll(y);

    this.scrollFulfilled((fulfilled, direction, intent) => {
      if (!fulfilled) {
        return;
      }

      this.latestScrollEvent = e;

      var result = {
        startEvent: e,
        lastEvent: this.latestScrollEvent,
        scrollPending: this.scrollPending,
        direction,
        intent
      };

      this.scrollCb(result);
    });
}

ScrollSwipe.prototype.initScroll = function initScroll() {  
  this.newOnWheel = this.onWheel.bind(this);
  this.target.addEventListener('wheel', this.newOnWheel, false);
  return this;
}

ScrollSwipe.prototype.touchMove = function touchMove(e) {
  if (this.touchPreventDefault) {
      e.preventDefault();
    }

    if(!this.touchArrX.length && this.touchStartCb) this.touchStartCb();

    var changedTouches = e.changedTouches[0];
    var x = changedTouches.clientX;
    var y = changedTouches.clientY;

    this.startTouchEvent = e;
    this.addXTouch(x);
    this.addYTouch(y);
    if(this.touchMoveCb){
      let lx=this.touchArrX.length;
      let ly=this.touchArrY.length;
      var result={
        startEvent: this.startTouchEvent,
        lastEvent: this.lastTouchEvent,
        scrollPending: this.scrollPending,
        deltaX: 0, deltaY: 0
      };
      if(lx>1) result.deltaX=this.touchArrX[lx-1]-this.touchArrX[lx-2];
      if(ly>1) result.deltaY=this.touchArrY[ly-1]-this.touchArrY[ly-2];
      this.touchMoveCb(result)
    }
  }

ScrollSwipe.prototype.touchEnd = function touchEnd(e) {
  let lx=this.touchArrX.length;
  let ly=this.touchArrY.length;
  var deltaX=this.touchArrX[lx-1]-this.touchArrX[lx-2];
  var deltaY=this.touchArrY[ly-1]-this.touchArrY[ly-2];

  this.touchFulfilled(e, (fulfilled, direction, intent) => {
    if (!fulfilled) {
      return;
    }

    var result = {
      startEvent: this.startTouchEvent,
      lastEvent: this.latestTouchEvent,
      scrollPending: this.scrollPending,
      direction,
      intent,
      deltaX,
      deltaY
    };

    this.touchCb(result);
  });
}

ScrollSwipe.prototype.initTouch = function initTouch() {
  this.newTouchMove = this.touchMove.bind(this);
  this.newTouchEnd = this.touchEnd.bind(this);
  this.target.addEventListener('touchmove', this.newTouchMove, {passive: false});
  this.target.addEventListener('touchend', this.newTouchEnd, {passive: false});
  return this;
}

//touch events
ScrollSwipe.prototype.touchFulfilled = function touchFulfilled(e, cb) {
  if (!e) {
    throw new Error('must provide event to touchFulfilled');
  }

  if (!cb) {
    throw new Error('must provide callback to touchFulfilled');
  }

  var { touchSensitivity, touchArrX, touchArrY } = this;

  var bool = (touchArrX.length > touchSensitivity && touchArrY.length > touchSensitivity);

  if (!bool) {
    return cb(false, null);
  }

  var changedTouches = e.changedTouches[0];

  var xStart = touchArrX[0];
  var yStart = touchArrY[0];

  var xEnd = changedTouches.clientX;
  var yEnd = changedTouches.clientY;

  var xIntent = xStart < xEnd ? 0 : 1;
  var yIntent = yStart < yEnd ? 0 : 1;

  var direction = VERTICAL;

  //determine vertical or horizontal based on the greatest difference
  if ( Math.abs(xStart - xEnd) > Math.abs(yStart - yEnd) ) {
    direction = HORIZONTAL;
  }

  const intent = direction === VERTICAL ? yIntent : xIntent;

  swap.call(this, intent, direction);
  this.resetTouches();
  this.scrollPending = true;
  this.latestTouchEvent = e;

  cb(this.scrollPending, this.currentDirection, this.currentIntent);
  return this;
}

ScrollSwipe.prototype.getTouch = function getTouch(idx) {
  return this.touchArr[idx];
}

ScrollSwipe.prototype.addXTouch = function addTouch(touch) {
  if (this.pending()) {
    return this;
  }

  this.latestTouch = touch;
  this.touchArrX.push(touch);
  return this;
}

ScrollSwipe.prototype.addYTouch = function addTouch(touch) {
  if (this.pending()) {
    return this;
  }

  this.latestTouch = touch;
  this.touchArrY.push(touch);
  return this;
}

ScrollSwipe.prototype.resetTouches = function resetTouches() {
  this.touchArrX = [];
  this.touchArrY = [];
  return this;
}

//wheel events
ScrollSwipe.prototype.addXScroll = function addXScroll(s) {
  if (this.pending()) {
    return this;
  }

  this.latestScroll = s;
  this.xArr.push(s);
  return this;
}

ScrollSwipe.prototype.addYScroll = function addYScroll(s) {
  if (this.pending()) {
    return this;
  }

  this.latestScroll = s;
  this.yArr.push(s);
  return this;
}

ScrollSwipe.prototype.getDirection = function getDirection() {
  return this.currentDirection;
}

ScrollSwipe.prototype.resetScroll = function resetScroll() {
  this.xArr = [];
  this.yArr = [];
  return this;
}

ScrollSwipe.prototype.flush = function flush() {
  this.resetScroll();
  this.resetTouches();
  return this;
}

ScrollSwipe.prototype.scrollFulfilled = function scrollFulfilled(cb) {
  if (!cb) {
    throw new Error('must provide callback to scrollFulfilled');
  }

  var { xArr, yArr, scrollSensitivity } = this;

  const bool = (xArr.length > scrollSensitivity && yArr.length > scrollSensitivity);
  const { direction, intent } = this.evalScrollDirection();

  if (bool) {
    swap.call(this, intent, direction);
    this.resetScroll();
    this.scrollPending = true;
  }

  cb(this.scrollPending, this.currentDirection, this.currentIntent);
  return this;
}

ScrollSwipe.prototype.evalScrollDirection = function evalScrollDirection() {
  const { x, y, xIntent, yIntent } = this.getSums();
  const direction = x > y ? HORIZONTAL : VERTICAL;
  const base = direction === VERTICAL ? yIntent : xIntent;

  var intent = 0;

  if (base > 0) {
    intent = 1;
  }

  return { direction, intent };
}

ScrollSwipe.prototype.getSums = function getSums() {
  const { xArr, yArr } = this;

  var xIntent = 0;
  var yIntent = 0;

  var x = xArr.reduce((result, curr) => {
      xIntent = xIntent + curr;
      return result += Math.abs(curr);
    }, 0);

  var y = yArr.reduce((result, curr) => {
      yIntent = yIntent + curr;
      return result += Math.abs(curr);
    }, 0);

  return {x, y, xIntent, yIntent};
}

ScrollSwipe.prototype.getScrollDirection = function getScrollDirection() {
  return this.currentDirection;
}

ScrollSwipe.prototype.pending = function pending() {
  return this.scrollPending;
}

ScrollSwipe.prototype.killScroll = function killScroll() {
  this.target.removeEventListener('wheel', this.newOnWheel, false);  
  return this;
}

ScrollSwipe.prototype.killTouch = function killTouch() {
  this.target.removeEventListener('touchmove', this.newTouchMove, false);
  this.target.removeEventListener('touchend', this.newTouchEnd, false);
  return this;
}

ScrollSwipe.prototype.killAll = function teardown() {
  this.killScroll().killTouch();
  return this;
}

function swap(intent, direction) {
  this.previousIntent = this.currentIntent;
  this.currentIntent = intent;
  this.previousDirection = this.currentDirection;
  this.currentDirection = direction;
}
