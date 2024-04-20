'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TypeComponent from '../type-component';
import { ReactActionStatePath, ReactActionStatePathMulti } from 'react-action-state-path';
import PanelHeading from '../panel-heading';
import RASPFocusHere from '../rasp-focus-here';
import enterDiscussion from '../../api-wrapper/enter-discussion';

class PanelList extends React.Component {
	initialRASP = { currentPanel: 0 };
	render() {
		const type=this.props.componentType || this.props.type || this.props.panel.type;
		return (
			<ReactActionStatePath {...this.props} type={type} initialRASP={this.initialRASP}>
				<RASPFocusHere filterTypes={['COMPONENT_DID_MOUNT', { type: "DECENDANT_UNFOCUS", distance: 1 }]}>
					<PanelHeading cssName={'syn-panel-list'} panelButtons={['Instruction']} items={[]} >
						<RASPPanelList />
					</PanelHeading>
				</RASPFocusHere>
			</ReactActionStatePath>
		);
	}
}

class RASPPanelList extends ReactActionStatePathMulti {

	constructor(props) {
		console.log("RASPPanelList.constructor", props);
		super(props, 'currentPanel', 0);
		this.panelStatus = [];
		this.createDefaults();
	}

	actionToState(action, rasp, source, initialRASP, delta) {
		//find the section that the itemId is in, take it out, and put it in the new section
		var nextRASP = {};
		var panelStatus = this.panelStatus;
		if (action.type === "NEXT_PANEL") {
			const { currentPanel, status = 'done', results } = action;
			if (panelStatus[currentPanel] !== status) { panelStatus[currentPanel] = status; }
			if (status !== 'done' && currentPanel < (panelStatus.length - 1)) {  // if the panel is not done, mark all existing forward panels as that
				for (let i = currentPanel + 1; i < panelStatus.length; i++) if (panelStatus[i] !== status) { panelStatus[i] = status; }
			}
			if (results) Object.assign(this.shared, results);
			// advance to next panel if this was called by the current panel and it is done - other panels might call this with done
			if (status === 'done' && currentPanel === rasp.currentPanel && rasp.currentPanel < (this.state.typeList.length - 1)) {
				delta.currentPanel = rasp.currentPanel + 1;
				if(this.toChild[delta.currentPanel]) setTimeout(()=>this.toChild[delta.currentPanel]({type: 'FOCUS'})); // if child has already been rendered it may need to know that it's panel has come in focus again
				this.smoothHeight();  // adjust height
			}
		} else if (action.type === "RESULTS") {
			const { currentPanel, results } = action;
			if (panelStatus[currentPanel] !== "done") { panelStatus[currentPanel] = "done"; }
			if (results) Object.assign(this.shared, results);
			if (this.waitingOnResults && this.waitingOnResults.currentPanel===currentPanel && this.waitingOnResults.nextFunc) {
				var nextFunc = this.waitingOnResults.nextFunc;
				this.waitingOnResults = null;
				setTimeout(() => nextFunc(), 0);
			}
		} else if (action.type === "ISSUES") {
			const { currentPanel } = action;
			if (panelStatus[currentPanel] !== "issues") { panelStatus[currentPanel] = "issues"; }
			if (currentPanel < (panelStatus.length - 1)) {  // if the panel is not done, mark all existing forward panels as that
				for (let i = currentPanel + 1; i < panelStatus.length; i++) if (panelStatus[i] !== "issues") { panelStatus[i] = "issues"; }
			}
		} else if (action.type === "PANEL_BUTTON") {
			const { nextPanel } = action;
			if (nextPanel === 0 || panelStatus[nextPanel] === 'done' || panelStatus[nextPanel - 1] === 'done') {
				delta.currentPanel = nextPanel;
				delta.shape = 'open';
			}
			if(this.toChild[delta.currentPanel]) setTimeout(()=>this.toChild[delta.currentPanel]({type: 'FOCUS'})); // if child has already been rendered it may need to know that it's panel has come in focus again
			this.queueFocus(action);
		} else if (action.type === "RESET_TO_BUTTON") {
			const { nextPanel } = action;
			if (nextPanel === 0 || panelStatus[nextPanel] === 'done' || panelStatus[nextPanel - 1] === 'done') {
				delta.currentPanel = nextPanel;
				delta.shape = 'open';
				let i = this.panelList.length - 1;
				while (i >= nextPanel) {
					this.toChild[i]({ type: "RESET" })
					panelStatus[i] = "issues";
					i--;
				}
			}
			this.queueFocus(action);
		} else if (action.type === "PANEL_LIST_CLOSE") {
			delta.shape = 'truncated';
			Object.keys(this.toChild).forEach(child => { // send the action to every child
				this.toChild[child]({ type: "CLEAR_PATH" })
			});
		} else if (action.type === "TOGGLE_FOCUS" && rasp.shape === 'open') {
			delta.shape = "truncated";
		} else if (action.type === "TOGGLE_FOCUS" && rasp.shape !== 'open') {
			this.queueUnfocus(action);
		} else if (action.type === "UNFOCUS_STATE") {
			delta.shape = "truncated";
		} else if (action.type === "FOCUS_STATE") {
			delta.shape = "open";
			let nextPanel = action.currentPanel;
			if (typeof nextPanel === 'number' && (nextPanel === 0 || panelStatus[nextPanel] === 'done' || panelStatus[nextPanel - 1] === 'done')) {
				detla.currentPanel = nextPanel;
			}
		} else if ((action.type === "DESCENDANT_UNFOCUS") && !action.itemUnfocused && (action.distance > 0)) {
			delta.shape = "truncated";
			action.itemUnfocused = 1;
		} else if (Object.keys(delta).length) {
			;
		} else return null;
		Object.assign(nextRASP, initialRASP, rasp, delta);
		this.deriveRASP(nextRASP);
		return nextRASP;
	}

	segmentToState(action, initialRASP) {
		var parts = action.segment.split(',');
		var shape = parts[0] === 'o' ? 'open' : 'truncated';
		var currentPanel = parseInt(parts[1], 10) || 0;
		var nextRASP = Object.assign({},initialRASP, { shape, currentPanel, pathSegment: action.segment }); // note, initialRASP is not being applied. PanelStatus and results are derived
		this.deriveRASP(nextRASP);
		if(nextRASP.pathSegment !== action.segment) console.error("RASPPanelList.segmentToState derivedRASP didn't math action segment", nextRASP, action)
		return { nextRASP, setBeforeWait: true };  //setBeforeWait means set the new state and then wait for the key child to appear, otherwise wait for the key child to appear and then set the new state.
	}

	deriveRASP(nextRASP) {
		var parts = [];
		if (nextRASP.shape === 'open') { parts.push('o'); parts.push(nextRASP.currentPanel); }
		nextRASP.pathSegment = parts.join(',');
	}

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	state = {
		typeList: [],
		containerWidth: 0
	};

	shared = {};

	stepRate = 25; //ms
	inHeight = 'inactive';
	observer = null

	panelList = [];
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	componentDidMount() {
		var harmony;
		if (typeof window !== 'undefined') {
			if ((this.props.componentType && (harmony = this.props.componentType.harmony))
				|| (this.props.panel && (harmony = this.props.panel.type.harmony)))
				window.socket.emit('get listo type', harmony, this.okGetListoType.bind(this));

			if (this.props.discussionGroup) {
				enterDiscussion(this.props.item._id, this.props.discussionGroup.duration, id => {
					this.props.discussionGroup.id=id;  // id will never change again
					this.forceUpdate();
				})
			}
		}
		this.setState({
			containerWidth: this.refs.panel.getBoundingClientRect().width
		});
		this.observer = new MutationObserver(this.mutations.bind(this));
	}



	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	componentWillUnmount() {
		this.observer.disconnect();
	}

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	mutations(mutations) {
		if (this.inHeight === 'active') return;
		let outer = this.refs.outer;
		if (!this.refs['panel-list-' + this.props.rasp.currentPanel]) return;
		let inner = ReactDOM.findDOMNode(this.refs['panel-list-' + this.props.rasp.currentPanel]);
		if (!(inner)) return;
		let outerHeight = outer.getBoundingClientRect().height;
		let innerHeight = inner.getBoundingClientRect().height;
		let outerMaxHeight = Number.parseFloat(outer.style.maxHeight) || 0;
		if (outerHeight != innerHeight || outerMaxHeight != (Math.ceil(innerHeight))) {
			this.smoothHeight();
		}
	}

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	componentDidUpdate() {
		let containerWidth=this.refs.panel.getBoundingClientRect().width;
		if (this.state.containerWidth !== containerWidth) {  // could be changed by resizing the window
			this.setState({containerWidth});
		}
		this.observer.observe(this.refs.panel, { attributes: true, childList: true, subtree: true });
	}

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	smoothHeight() {
		// set an interval to update scrollTop attribute every 25 ms
		if (this.inHeight == 'active') { return; } //don't stutter the close

		this.inHeight = 'active';

		let outer = this.refs.outer;


		let timerMax = parseInt(2000 / this.stepRate, 10);


		const timer = setInterval(() => {
			if (--timerMax <= 0) { clearInterval(timer); this.inHeight = 'inactive'; return; }
			if (!this.refs['panel-list-' + this.props.rasp.currentPanel]) { // when this happens it's a bug in the parent, but don't let it overload the console with error messages.
				console.error('PanelList.smoothHeight: refs[] does not exist:', 'panel-list-' + this.props.rasp.currentPanel);
				clearInterval(timer); this.inHeight = 'inactive';
				return;
			}
			let inner = ReactDOM.findDOMNode(this.refs['panel-list-' + this.props.rasp.currentPanel]);
			let outerHeight = outer.getBoundingClientRect().height;
			let innerHeight = inner.getBoundingClientRect().height;
			let outerMaxHeight = Number.parseFloat(outer.style.maxHeight) || 0;
			if (outerHeight != innerHeight || outerMaxHeight != (Math.ceil(innerHeight))) {
				outer.style.maxHeight = Math.ceil(innerHeight) + 'px';
			}
		}, this.stepRate);
	}


	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	okGetListoType(typeList) {
		for (let i = 0; i < typeList.length; i++) { this.panelList[i] = { content: null }; }
		this.setState({ typeList: typeList });
	}

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	nextPanel(currentPanel, status, results) {
		return this.props.rasp.toParent({ type: "NEXT_PANEL", currentPanel, status, results });
	}

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	render() {
		//console.info("RASPPanelList.render",this.props);
		let loading;
		let crumbs = [];
		let { typeList } = this.state;
		const { panel, rasp, user } = this.props;

		const currentPanel = rasp.currentPanel;
		const containerWidth = this.state.containerWidth;
		var spaceBetween = containerWidth * 0.25;
		var panelStatus = this.panelStatus; // so this can be accessed by functions

		if (typeof document !== 'undefined') {
			let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
			if (containerWidth + spaceBetween < w) {
				spaceBetween = w - containerWidth;
			}
		}


		var renderCrumbs = () => {
			let index=0;
			return (
				typeList.map((type, i) => {
					let attributes=TypeComponent.attributes(type.component);
					if(attributes.PanelList && attributes.PanelList.notInCrumbs){
						return null;
					}
					if ((typeof type.component === 'string' && type.component === "NextStep") || (typeof type.component === 'object' && type.component.component === "NextStep")) return null; // hack for now 11/13/2017-2/9/2018, need a more generic way to do this.  Don't show NextStep in crumbs
					let visible = ((panelStatus[i] === 'done')
						|| ((i > 0) && panelStatus[i - 1] === 'done'));
					let active = (currentPanel === i);
					let buttonActive = active || visible;
					index+=1;
					return (
						<button onClick={buttonActive ? () => rasp.toParent({ type: "PANEL_BUTTON", nextPanel: i }) : null}
							className={!(active || visible) ? 'inactive' : ''}
							title={type.instruction}
							style={{
								display: "inline",
								padding: "0.5em",
								border: "1px solid #666",
								boxSizing: "border-box",
								backgroundColor: active ? "#000" : visible ? "#fff" : "#fff",
								color: active ? "#fff" : visible ? "#000" : null
							}}
							key={type.name + '-' + i}>
							{index + ': ' + type.name}
						</button>
					)
				})
			)
		}

		crumbs = (
			<div style={{
				display: "block",
				marginBottom: "1em",
				marginTop: "1em",
				textAlign: "center"
			}}>
				{renderCrumbs()}
			</div>
		);

		if (rasp.shape === 'open' && typeList.length) {
			this.panelList[currentPanel].content =
				<TypeComponent component={typeList[currentPanel].component}
					parent={panel.parent}
					type={typeList[currentPanel]}
					user={user}
					next={this.nextPanel.bind(this)}
					shared={this.shared}
					panelNum={rasp.currentPanel}
					limit={panel.limit}
					qbuttons={this.props.qbuttons}
					rasp={{ shape: 'truncated', depth: rasp.depth, toParent: this.toMeFromChild.bind(this, currentPanel) }}
					discussionGroup={this.props.discussionGroup}
				/>
		}

		return (
			<section ref="panel" style={{boxSizing: "border-box"}}>
				{crumbs}
				<div id='panel-list-wide' ref='outer'
					className="syn-panel-list-rotatory"
					style={{
						width: Math.ceil((containerWidth + spaceBetween + 1) * (this.panelList.length || 1)) + 'px', // +1 because of the border on the right, ceil() to ensure Fire Fox doesn't wrap the last panel (eg 14 panels 958.5 wide, )
						left: -currentPanel * (containerWidth + spaceBetween +1) + 'px', //+1 because of the border on the right
					}}
				>
					{this.panelList.map((panelListItem, i) => {
						if (panelListItem.content) {
							return (
								<div id={`panel-list-${i}`}
									ref={`panel-list-${i}`}
									key={typeList[i]._id + '-' + (panel.parent._id || 'none') + '-' + i}
									style={{
										display: rasp.shape === 'open' ? "inline-block" : 'none',
										verticalAlign: 'top',
										marginRight: spaceBetween + 'px',
										width: containerWidth + 'px',
										borderRight: '1px solid #666' // this continues the border that has been chopped up 
									}}
								>
									{panelListItem.content}
								</div>
							);
						} else
							return null;
					})}
				</div>
			</section>
		);
	}
}

export default PanelList;
export { PanelList };

