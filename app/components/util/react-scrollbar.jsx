import React from 'react';
import PropTypes from 'prop-types';

import VerticalScrollbar from './vertical-scrollbar';
import HorizontalScrollbar from './horizontal-scrollbar';

function trim(max, min, val) {
	let tmax = (val > max) ? max : val;
	let tmin = (tmax < min) ? min : tmax;
	return tmin;
};

class ScrollWrapper extends React.Component {

	constructor(props) {
		super(props);
		if (typeof window !== 'undefined' && this.props.topBar)
			this.topBar = this.props.topBar;
		let topBarHeight = (this.topBar && this.topBar.getBoundingClientRect().height) || 0;
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

		this.touchable = false;
		this.updateSize = this.calculateSize.bind(this, null);
		this.calculateSize = this.calculateSize.bind(this);
		this.scroll = this.scroll.bind(this);
		this.startDrag = this.startDrag.bind(this);
		this.onDrag = this.onDrag.bind(this);
		this.stopDrag = this.stopDrag.bind(this);
		this.handleChangePosition = this.handleChangePosition.bind(this);
		this.handleScrollbarDragging = this.handleScrollbarDragging.bind(this);
		this.handleScrollbarStopDrag = this.handleScrollbarStopDrag.bind(this);
		this.transitionEnd = this.transitionEnd.bind(this);
		if (typeof window !== 'undefined') {
			this.htmlElement = document.getElementsByTagName("html")[0];
			this.htmlElement.style.position = 'fixed';
			this.htmlElement.style.overflowX = 'hidden';
			this.htmlElement.style.transition = null;
			this.htmlElement.style.top = -this.state.top + 'px';
			window.Synapp.ScrollFocus = this.ScrollFocus.bind(this);
			this.scrollWrapper = this.htmlElement; //using the root as the wrapper
		} else
			this.htmlElement = null;
		this.accumulateScrollX = 0;
		this.accumulateScrollY = 0;
		this.scrollAnimationFrame = 0;
		this.lastScrollTimeStamp = 0;
		this.overlay = React.createRef();
	}

	ScrollFocus(target, duration = 500) {
		if (!target) return;
		var html = this.htmlElement;
		var bannerHeight = this.state.topBarHeight;
		var start = null;
		var last = null;
		var that = this;
		var extent = this.props.extent || 0;

		function stepper(now) {
			if (!start) {
				start = now; // now is milliseconds not seconds
				last = now;
				window.requestAnimationFrame(stepper);
				return;
			}

			let top = parseFloat(html.style.top);
			let tRect = target.getBoundingClientRect(); // target Rect
			let newTop = -(-top + tRect.top /*-bannerHeight*/);
			let lowerEnd = that.state.scrollAreaHeight - (that.state.scrollWrapperHeight - extent); /*- this.state.scrollWrapperHeight*/;



			// if bottom of target is above the top of the wrapper, then hyperjump (old)top to the position just before it is visible.
			//if(tRect.bottom< bannerHeight){
			//  top= -(-top + -tRect.top)
			//}
			if (lowerEnd < 0)
				newTop = 0;
			else
				newTop = -trim(lowerEnd, -extent, -newTop);

			if (now - start > duration) {
				html.style.transition = null;
				//html.style.top=newTop+'px';
				//that.setState({top: -newTop});
				that.calculateSize(() => {
					that.normalizeVertical(-newTop);
				});
				return;
			}

			let timeRemaining = duration - (now - start);
			let stepsRemaining = Math.max(1, Math.round(timeRemaining / (now - last))); // less than one step is one step
			let distanceRemaining = newTop - top;  // could be a positive or negative number
			let nextStepDistance = distanceRemaining / stepsRemaining;
			if (nextStepDistance > -1 && nextStepDistance < 1) { // the next step isnt'a full pixel - don't step yet
				return window.requestAnimationFrame(stepper);
			}
			let nextTop = top + nextStepDistance; // top of the next step
			nextTop = -trim(lowerEnd, -extent, -nextTop);
			html.style.transition = null;
			html.style.top = nextTop + that.state.topBarHeight + 'px'; // set the new top
			last = now;
			window.requestAnimationFrame(stepper);
		}

		window.requestAnimationFrame(stepper);
	}

	lastWindowUpdate = 0;
	windowUpdates(now) {
		if ((now - this.lastWindowUpdate) > 66) {
			this.updateSize();
		}
		this.lastWindowUpdate = now;
	}

	componentDidMount() {
		this.updateSize();

		// Attach The Event for Responsive View~
		window.addEventListener('resize', () => window.requestAnimationFrame(this.windowUpdates.bind(this)), { passive: false });
		this.scrollWrapper.addEventListener('touchstart', this.startDrag, { passive: true });
		this.scrollWrapper.addEventListener('touchmove', this.onDrag, { passive: false });
		this.scrollWrapper.addEventListener('touchend', this.stopDrag, { passive: false });
		this.scrollWrapper.addEventListener('transitionend', this.transitionEnd, { passive: true });
		this.observer = new MutationObserver(this.mutations.bind(this));
		this.banerObserver = new MutationObserver(this.topMutations.bind(this));
		if (this.scrollArea) this.observer.observe(this.scrollArea, { attributes: true, childList: true, subtree: true });
		if (this.props.topBar) this.banerObserver.observe(this.props.topBar, { attirbutes: true, childList: true, subtree: true });
	}

	componentDidUpdate() {
		if (this.scrollArea) this.observer.observe(this.scrollArea, { attributes: true, childList: true, subtree: true });
		if (this.props.topBar) this.banerObserver.observe(this.props.topBar, { attirbutes: true, childList: true, subtree: true });
	}
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	mutations(mutations) {
		if (this.mutationAnimationFrame) return;
		var that = this;
		function viewportUpdate(now) {
			that.calculateSize(() => {
				that.normalizeVertical(that.state.top);
				that.mutationAnimationFrame = 0;
			});
		}
		this.mutationAnimationFrame = window.requestAnimationFrame(viewportUpdate);
	}

	topMutations(mutations) {
		if (this.topMutationAnimationFrame) return;
		mutations.map(mut => mut.type === "attributes" && console.info("mutation", mut.attributeName, mut.attributeNameSpace));
		var that = this;
		function viewportUpdate(now) {
			that.calculateSize(() => {
				that.normalizeVertical(that.state.top);
				that.topMutationAnimationFrame = 0;
			});
		}
		this.topMutationAnimationFrame = window.requestAnimationFrame(viewportUpdate);
	}

	transitionEnd(event) {
		event.target.style.transition = null;
	}

	// changes: update scrollbars when parent resizing
	componentWillReceiveProps(newProps) {
		if (this.topBar !== newProps.topBar) {
			this.topBar = newProps.topBar;

			// no need to call set state here - we will rerender because of new props
			this.state.topBarHeight = (this.topBar && this.topBar.getBoundingClientRect().height) || 0;
			this.state.top = this.state.top - this.state.topBarHeight;
			this.htmlElement.style.top = -this.state.top + 'px';

			if (this.props.topBar) this.banerObserver.observe(this.topBar, { attirbutes: true, childList: true, subtree: true });
		}
		//this.updateSize();
		this.calculateSize(() => {
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


	getPageFromTouch(e) {
		let pageX, pageY, identifier, touched = false; // safari only supports these to in a changedTouches, not client or screen
		if (e.changedTouches && e.changedTouches.length) {
			identifier = this.touchIdentifier;
			if ((typeof identifier === 'undefined')) this.touchIdentifier = identifier = e.changedTouches[0].identifier;
			for (var i = e.changedTouches.length - 1; i >= 0; i--) {
				if (e.changedTouches[i].identifier === identifier) {
					pageX = e.changedTouches[i].pageX;
					pageY = e.changedTouches[i].pageY;
					touched = true;
				}
			}
		} else {
			pageX = e.pageX;
			pageY = e.pageY;
			touched = true;
		}
		return ({ pageX, pageY, touched })
	}

	onDrag(event) {
		event.preventDefault();
		event.stopPropagation();
		const { pageX, pageY, touched } = this.getPageFromTouch(event);
		if (!touched) return;

		if (this.state.dragging) {
			// Invers the Movement
			const yMovement = this.state.start.y - pageY;  // safari only provides pageY in changedTouches, chrome provides pageY, clientY, screenY
			const xMovement = this.state.start.x - pageX; // safari only provides pageX in changedTouches, chrome provides pageX, clientX, screenX
			const deltaT = event.timeStamp - this.state.start.t;
			if (deltaT) { // deltaT can be 0 when there is more than one touchpoint involved - skip that
				//event.preventDefault();
				this.dragVelocityY = yMovement / deltaT * 1000; // velociy in pixels per second
				this.dragVelocityX = xMovement / deltaT * 1000;
				// Update the last 
				this.setState({ start: { y: pageY, x: pageX, t: event.timeStamp } });

				// The next Vertical Value will be
				const nextY = this.state.top + yMovement;
				const nextX = this.state.left + xMovement;

				this.normalizeVertical(nextY);
				this.normalizeHorizontal(nextX);
			}
		}
	}

	getSize() {
		// The Elements
		const $scrollArea = this.scrollArea;
		const $scrollWrapper = this.scrollWrapper;
		const topBarHeight = (this.topBar && this.topBar.getBoundingClientRect().height) || 0;
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
		elementSize.scrollWrapperHeight -= topBarHeight;

		return elementSize;
	}

	stopDrag(event) {
		const { pageX, pageY, touched } = this.getPageFromTouch(event);
		if (!touched) return;
		this.touchIdentifier = undefined;
		//if(this.state.dragging) event.preventDefault()

		const yMovement = this.dragVelocityY * 0.25;  // how much farther it will go in half a second.
		const xMovement = this.dragVelocityX * 0.25;

		const nextY = this.state.top + yMovement;
		const nextX = this.state.left + xMovement;
		this.htmlElement.style.transition = "top 0.5s ease-out";

		this.normalizeVertical(nextY);
		this.normalizeHorizontal(nextX);
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
		let extent = this.props.extent || 0;
		let next = this.clampTop(nextPos, this.state, extent);
		// Update the Vertical Value
		this.htmlElement.style.top = (-next) + 'px';
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

	/**
	 * clampTop
	 * 
	 * top is a positive number (the negative of html.style.top) that represents the number of pixels above the viewport that the scrollable area starts rendering
	 * es is element size object with
	 * extent is the number of pixels extra that can be visible below the bottom or above the top of the scrollable area
	 */

	clampTop(top, es, extent) {
		var newTop = Math.max(-(es.topBarHeight + extent), top); // how far below the top of the viewport and the top of the scrollable area go
		if (es.scrollAreaHeight < (es.topBarHeight + es.scrollWrapperHeight)) // scroll area is smaller than viewport
			newTop = Math.min(0, newTop); // how far above the top of the viewport can the top of the scrollable area go (0)
		else // scroll area is bigger than viewport
			newTop = Math.min(es.scrollAreaHeight - es.topBarHeight - es.scrollWrapperHeight + extent, newTop);
		return newTop;
	}

	calculateSize(cb) {
		const elementSize = this.getSize();

		if (elementSize.scrollWrapperHeight !== this.state.scrollWrapperHeight ||
			elementSize.scrollWrapperWidth !== this.state.scrollWrapperWidth ||
			elementSize.scrollAreaHeight !== this.state.scrollAreaHeight ||
			elementSize.scrollAreaWidth !== this.state.scrollAreaWidth ||
			elementSize.topBarHeight !== this.state.topBarHeight) {
			// Set the State!
			let top = this.state.top;
			let extent = this.props.extent || 0;
			if (elementSize.topBarHeight !== this.state.topBarHeight)
				top = top - (elementSize.topBarHeight - this.state.topBarHeight)
			top = this.clampTop(top, elementSize, extent)
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
		const { pageX, pageY, touched } = this.getPageFromTouch(event);
		if (!touched) return;

		const start = { y: pageY, x: pageX, t: event.timeStamp }; // need to grab data out of e before it is release by setState (in calculateSize)
		this.dragVelocityX = 0;
		this.dragVelocityY = 0;
		if (event.changedTouches && event.changedTouches.length) this.touchable = true;
		this.htmlElement.style.transition = null; // make sure transition is off when you start

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

		function animate(scrollX, scrollY, shifted, now) {
			// Make sure the content height is not changed
			this.calculateSize(() => {

				// Next Value
				const nextY = this.state.top + scrollY;
				const nextX = this.state.left + scrollX;

				// Is it Scrollable?
				const canScrollY = true; //(this.state.scrollAreaHeight > this.state.scrollWrapperHeight) || (this.state.top !== 0);
				const canScrollX = this.state.scrollAreaWidth > this.state.scrollWrapperWidth;

				// changes: Set scrolling state before changing position
				this.setState({ scrolling: true }, () => {
					// Vertical Scrolling
					this.htmlElement.style.transition = null;
					if (canScrollY && !shifted) {
						this.normalizeVertical(nextY, { scrolling: false, reset: true });
					}

					// Horizontal Scrolling
					if (shifted && canScrollX) {
						this.normalizeHorizontal(nextX, { scrolling: false, reset: true });
					}

					this.scrollAnimationFrame = 0;
					this.lastScrollTimeStamp = (new Event('look')).timeStamp;
				});
			});
		}



		// DOM events
		// need to get the values out of e, because e will be release after setState (in calculateSize) is called

		// Set the wheel step
		const num = this.props.speed;
		const shifted = e.shiftKey; // ??? Need to test the behavior of shifted is accumulation is taking place
		const deltaX = e.deltaX;
		const deltaY = e.deltaY;
		var scrollY = deltaY > 0 ? num : -(num);
		var scrollX = deltaX > 0 ? num : -(num);
		// Fix Mozilla Shifted Wheel~
		if (shifted && deltaX === 0) scrollX = deltaY > 0 ? num : -(num);

		if (this.scrollAnimationFrame) {
			this.accumulateScrollY += scrollY;
			this.accumulateScrollX += scrollX;
			return;
		}

		if ((e.timeStamp - this.lastScrollTimeStamp - 50) < 0) { // scroll events are happening faster than the render
			this.accumulateScrollY += scrollY;
			this.accumulateScrollX += scrollX;
			if (!this.lateScroll) {
				this.lateScroll = setTimeout(() => {
					this.accumulateScrollX = 0;
					this.accumulateScrollY = 0;
					this.scrollAnimationFrame = window.requestAnimationFrame((now) => { animate.call(this, this.accumulateScrollX, this.accumulateScrollY, shifted, now); this.lateScroll = 0 });
				}, 50)
			}
			return;
		} else { // this scroll event came in after the last scroll completed, but there is accumulated scroll
			if (this.lateScroll) {
				clearTimeout(this.lateScroll);
				this.lateScroll = 0;
			}
		}

		scrollX += this.accumulateScrollX;
		scrollY += this.accumulateScrollY;
		this.accumulateScrollX = 0;
		this.accumulateScrollY = 0;
		this.scrollAnimationFrame = window.requestAnimationFrame(animate.bind(this, scrollX, scrollY, shifted));
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

		var style = { ...this.props.style, position: 'relative' };
		var verticalStyle = {};
		if (!style.height && this.state.scrollWrapperHeight) {
			verticalStyle.height = style.height = (this.state.scrollWrapperHeight /*- this.state.topBarHeight*/) + 'px';
			verticalStyle.top = this.state.topBarHeight;
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
					ref={(c) => { if (c) this.scrollArea = c; }}
					onWheel={this.scroll}
					onChange={this.updateSize}
					style={{ marginLeft: `${this.state.left * -1}px` }}
				>

					{this.props.children}

					{(!this.touchable && (this.state.ready || this.state.top)) ?

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

						: null}


					{(false && this.state.ready) ?

						<HorizontalScrollbar
							area={{ width: this.state.scrollAreaWidth }}
							wrapper={{ width: this.state.scrollWrapperWidth }}
							scrolling={this.state.hMovement}
							draggingFromParent={this.state.dragging}
							onChangePosition={this.handleChangePosition}
							onDragging={this.handleScrollbarDragging}
							onStopDrag={this.handleScrollbarStopDrag}
						/>

						: null}

				</div>
			</div>

		);
	}

}

// The Props
ScrollWrapper.propTypes = {
	speed: PropTypes.number,
	className: PropTypes.string,
	style: PropTypes.shape(),
	children: PropTypes.node,
	extent: PropTypes.number
};

ScrollWrapper.defaultProps = {
	speed: 27,
	className: 'react-scrollbar-default',
	style: {},
	children: null,
	extent: 0
};

export default ScrollWrapper;