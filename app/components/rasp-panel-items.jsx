'use strict';

import React from 'react';
import ReactDOM from 'react-dom'
import Accordion from 'react-proactive-accordion';
import ItemStore from '../components/store/item';
import { ReactActionStatePath, ReactActionStatePathClient } from 'react-action-state-path';
import Item from './item';
import publicConfig from '../../public.json'
import PerfectScrollbar from 'react-perfect-scrollbar'

const maxChildren=5;

class InfiniteScroll extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { loading: false, maxHeight: null }
		this.childRef=[];
		this.childElement=[];
		for(var i=0;i<maxChildren;i++){
			this.childRef[i]=this.childRefs.bind(this,i);
		}
		this.lastItemsLength=-1
		this.loadMore=this.loadMore.bind(this)
		this.postScroll={
			length: this.props.items && this.props.items.length || 0,
			count: this.props.count || 0
		}; // this must not change during the life of PerfectScrollBar but you can change what's in it
	}

	loadMore(){
		if(!this.state.loading && this.props.loadMore && this.lastItemsLength<(this.props.items && this.props.items.length || 0)) // loadmore may get called multiple times for the same 'event' due to rerenders
		{
			this.lastItemsLength=this.props.items.length
			this.props.loadMore(1);
		}
	}

	childRefs(i,e){
		if(e) {
			this.childElement[i]=ReactDOM.findDOMNode(e);
		}
	}

	getMaxHeight(){
		let max=0;
		for(var i=0;i<maxChildren;i++){
			if(this.childElement[i]) max+=this.childElement[i].getBoundingClientRect().height;
		}
		this.refs.footer && (max+=this.refs.footer.getBoundingClientRect().height);
		return max;
	}

	componentWillReceiveProps(newProps) {
		this.postScroll.length = this.props.items && this.props.items.length || 0;
		this.postScroll.count = this.props.count || 0;
		if(this.props.rasp.shape !== newProps.rasp.shape )
			this.state.maxHeight=null; // if the shape changes, reset the maxHeight
	}

	render() {
		return (
			<PerfectScrollbar className="ps" options={{useTopAndLeft: true, postScroll: this.postScroll}} ref="ps" onYReachEnd={this.loadMore} style={{ position: 'relative' }}>
				<div style={{position: "relative"}} >
					{React.Children.map(this.props.children,((child,i)=>{
						return React.cloneElement(child,{ref: i<maxChildren ? this.childRef[i]: undefined})
					}))}
					<div ref="footer" style={{textAlign: 'center', display: ((this.props.items.length < this.props.count) || this.state.loading) ? 'block' :'none' }}>{this.props.items.length} of {this.props.count}{this.state.loading ? " ...Loading" : null}</div>
				</div>
			</PerfectScrollbar>
		)
	}

	componentDidUpdate(prevProps){
		// when the values in postScroll change PrefectScroll needs to update it's components
		if(this.refs.ps && ((this.props.count !== prevProps.count) || ((this.props.items && this.props.items.length || 0) !== (prevProps.items && prevProps.items.length || 0)))){
			this.refs.ps.updateScroll()
		}
	}


}

/**************************************************
 * This file was once part of panel-items. It was separated out when I wanted to import RASPPanelItems into panel-questions separate from PanelItems
 * 
 * Whenever I did this, the generated panel-questions.js file would have _panelItems=require('../panel-items'); but the result would  be {default: undefined, RASPPanelItems: undefined}
 * so there would be a runtime error trying to load PanelQuestions.
 * 
 * Separating rasp-panel-items into a separate file fixed this, but I can not figure out what the problem was before.  It would be nice to understand this one day, and to recombine RASPPanelItems into panel-items
 * RASPQSortItems seems to work as intended from qsort-items into qsort-random-items.
 * 
 **************************************************/


export default class RASPPanelItems extends ReactActionStatePathClient {

	constructor(props) {
		super(props, 'shortId', 0);  // shortId is the key for indexing to child RASP functions, debug is on
		if (props.type && props.type.name && props.type.name !== this.title) { this.title = props.type.name; this.props.rasp.toParent({ type: "SET_TITLE", title: this.title }); } // this is for pretty debugging
		let visMeth = this.props.visualMethod || this.props.type && this.props.type.visualMethod || 'default';
		if (!(this.vM = this.visualMethods[visMeth])) {
			console.error("PanelItems.constructor visualMethod unknown:", visMeth)
			this.vM = this.visualMethods['default'];
		}
		this.createDefaults();
	}

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	loadMore(e) {
		e.preventDefault();

		// window.Dispatcher.emit('get items', this.props.panel);
	}

	actionToState(action, rasp, source, defaultRASP, delta) {
		var nextRASP = {};
		//onsole.info("PanelItems.actionToState", this.childName, this.childTitle, ...arguments);
		if (action.type === "TOGGLE_CREATOR") {
			if (rasp.creator) {// it's on so toggle it off
				delta.creator = false;
			} else { // it's off so toggle it on
				delta.creator = true;
				if (rasp.shortId) {//there is an item that's open
					this.toChild[rasp.shortId]({ type: "RESET_SHAPE" });
					delta.shortId = null;
				}
			}
			if (delta.creator) this.queueFocus(action);
			else this.queueUnfocus(action)
		} else if(action.type==="POST_ITEM"){
			if(rasp.creator)
				delta.creator=false;
			if(this.props.PanelCreatItem)
				this.props.PanelCreateItem(action.item);
			if (delta.creator) this.queueFocus(action);
				else this.queueUnfocus(action);
		}else if (this.vM.actionToState(action, rasp, source, defaultRASP, delta)) {
			; //then do nothing - it's been done
		} else if (Object.keys(delta).length > 0) {
			; // then do nothing - it's already beend done but skip over the final else statement
		} else
			return null; // don't know this action, null so the default methods can have a shot at it

		Object.assign(nextRASP, rasp, delta);
		this.vM.deriveRASP(nextRASP, defaultRASP)
		return nextRASP;
	}

	// set the state from the pathSegment. 
	// the shortId is the path segment
	segmentToState(action, initialRASP) {
		var nextRASP = {};
		var parts = action.segment.split(',');
		parts.forEach(part => {
			if (part === 'd') nextRASP.decendantFocus = true;
			else if (part.length === 5) nextRASP.shortId = part;
			else console.error("PanelItems.segmentToState unexpected part:", part);
		})
		this.vM.deriveRASP(nextRASP, initialRASP);
		if (nextRASP.pathSegment !== action.segment) console.error("PanelItems.segmentToAction calculated path did not match", action.pathSegment, nextRASP.pathSegment)
		return { nextRASP, setBeforeWait: true }
	}

	// this is just for debugging, to make the trace output easier to follow - associate the panel name to the output
	componentWillReceiveProps(newProps) {
		if (newProps.type && newProps.type.name && newProps.type.name !== this.title) { this.title = newProps.type.name; this.props.rasp.toParent({ type: "SET_TITLE", title: this.title }); } // this is for pretty debugging
		let oldLength = this.props.items && this.props.items.length || 0;
		if (newProps.items && (newProps.items.length > oldLength)) {  // if the length changes, history needs to be updated
			//onsole.info("PanelItems.componentWillReceiveProps length change", oldLength, "->", newProps.items.length)
			this.qaction(() => {
				this.props.rasp.toParent({ type: "CHILD_STATE_CHANGED", length: newProps.items.length })
			}, 0)
		}
		let visMeth = newProps.visualMethod || newProps.type && newProps.type.visualMethod || 'default';
		if (!(this.vM = this.visualMethods[visMeth])) {
			console.error("PanelItems.componentWillReceiveProps visualMethod unknown:", visMeth)
			this.vM = this.visualMethods['default'];
		}
	}

	visualMethods = {
		default: {
			// whether or not to show items in this list.  
			childActive: (rasp, item) => {
				return (rasp.shortId === item.id) || (rasp.shape !== 'open' && rasp.shape !== 'title')
			},
			// the shape to give child items in the Panel
			childShape: (rasp, item) => {
				return (rasp.shortId === item.id ? 'open' : (rasp.shape !== 'open' && rasp.shape !== 'title') ? rasp.shape : 'truncated')
			},
			childVisualMethod: () => undefined,
			// process actions for this visualMethod
			actionToState: (action, rasp, source, initialRASP, delta) => {
				if (action.type === "DESCENDANT_FOCUS" && action.distance === 1) {
					if (action.shortId) { // a child is opening
						if (rasp.shortId && rasp.shortId !== action.shortId) // if a different child is already open, reset the SHAPE of the current child
							this.toChild[rasp.shortId]({ type: "RESET_SHAPE" });
						delta.shortId = action.shortId; // the new child will be open
					}
				} else if (action.type === "DESCENDANT_UNFOCUS" && action.distance === 1) {
					if (rasp.shortId) {
						delta.shortId = false;
					}
				} else if (action.type === "ITEM_DELVE") {
					if (rasp.shortId) {
						var nextFunc = () => this.toChild[rasp.shortId](action);
						if (this.toChild[rasp.shortId]) nextFunc(); // update child before propogating up
						else this.waitingOn = { nextRASP: Object.assign({}, rasp), nextFunc: nextFunc };
					}
				} else if (action.type === "SHOW_ITEM") {
					if (!this.props.items.some(item => item._id === action.item._id)) { // if the new item is not in the list
						this.props.items.push(action.item);
					}
					delta.shortId = action.item.id;
				} else
					return false;
				return true;
			},
			// derive shape and pathSegment from the other parts of the RASP
			deriveRASP: (rasp, initialRASP) => {
				rasp.shape = rasp.shortId ? 'open' : 'truncated';
				let parts = [];
				if (rasp.decendantFocus) parts.push('d');
				if (rasp.shortId) parts.push(rasp.shortId);
				else if(this.props.items && this.props.items.length===1) parts.push(this.props.items[0].id);
				if (rasp.shortId && rasp.shortId.length !== 5) console.error("PanelItems.visualMethod[default].deriveRASP shortId length should be 5, was", rasp.shortId.length);
				if (parts.length) rasp.pathSegment = parts.join(',');
				else rasp.pathSegment = null;
			}
		},
		ooview: {
			childActive: (rasp, item) => {
				return (rasp.shortId === item.id) || (rasp.shape !== 'open' && rasp.shape !== 'title')
			},
			childShape: (rasp, item) => {
				return (rasp.shortId === item.id ? 'open' : (rasp.shape !== 'open' && rasp.shape !== 'title') ? rasp.shape : 'truncated')
			},
			childVisualMethod: () => 'ooview',
			actionToState: (action, rasp, source, initialRASP, delta) => {
				if (action.type === "DESCENDANT_FOCUS" && action.distance === 1) {
					if (!action.shortId) logger.error("PanelItems.actionToState action without shortId", action)
					if (action.shortId) { // a child is opening
						if (rasp.shortId && rasp.shortId !== action.shortId) // if a different child is already open, reset the SHAPE of the current child
							this.toChild[rasp.shortId]({ type: "RESET_SHAPE" });
						delta.shortId = action.shortId; // the new child will be open
					}
				} else if (action.type === "DESCENDANT_FOCUS" && action.distance > 1) {
					delta.decendantFocus = true;
				} else if (action.type === "DESCENDANT_UNFOCUS" && (action.distance === 1 || (action.distance===2 && action.itemUnfocused))) {
					//if(rasp.shortId) this.toChild[rasp.shortId]({type: "RESET_SHAPE"})
					delta.shortId = null;
					delta.decendantFocus = false;
					delta.creator = false;
				} else if (action.type === "DESCENDANT_UNFOCUS" && action.distance === 2) {
					delta.decendantFocus = false;
					delta.creator = false;
				} else if ((action.type === "FOCUS") || (action.type === "FOCUS_STATE")) {
					delta.decendantFocus = false;
					if (rasp.shortId && (action.shortId !== rasp.shortId)) this.toChild[rasp.shortId]({ type: "UNFOCUS_STATE" });
					if (!action.shortId && !rasp.shortId) {
						if (action.type !== "FOCUS_STATE")
							this.queueUnfocus(action);
					} else {
						delta.shortId = action.shortId;
						if (action.type !== "FOCUS_STATE")
							this.queueFocus(action);
					}
				} else if(action.type === "TOGGLE_FOCUS" && !rasp.shortId){ 
					delta.decendantFocus = false;
					this.queueUnfocus(action);
				} else if(action.type === "TOGGLE_FOCUS" && rasp.shortId){ 
					delta.decendantFocus = false;
					if (rasp.shortId) this.toChild[rasp.shortId]({ type: "RESET_SHAPE" });
					delta.shortId=null;
					delta.creator=false;
				}else if ((action.type === "UNFOCUS") || (action.type === "UNFOCUS_STATE")) {
					delta.decendantFocus = false;
					delta.creator = false;
					if (rasp.shortId) this.toChild[rasp.shortId]({ type: "RESET_SHAPE" });
					delta.shortId = null;
					if (action.type !== "UNFOCUS_STATE")
						this.queueUnfocus(action);
				} else if (action.type === "ITEM_DELVE") {
					if (rasp.shortId) {
						var nextFunc = () => this.toChild[rasp.shortId](action);
						if (this.toChild[rasp.shortId]) nextFunc(); // update child before propogating up
						else this.waitingOn = { nextRASP: Object.assign({}, rasp), nextFunc: nextFunc };
					}
				} else if (action.type === "SHOW_ITEM") {
					if (!this.props.items.some(item => item._id === action.item._id)) { // if the new item is not in the list
						this.props.items.push(action.item);
					}
					delta.shortId = action.item.id;
				} else
					return false;
				return true;
			},
			// derive shape and pathSegment from the other parts of the RASP
			deriveRASP: (rasp, initialRASP) => {
				rasp.shape = rasp.shortId ? (rasp.decendantFocus ? 'title' : 'open') : 'truncated';
				let parts = [];
				if (rasp.decendantFocus) parts.push('d');
				if (rasp.shortId) parts.push(rasp.shortId);
				else if(this.props.items && this.props.items.length===1) parts.push(this.props.items[0].id);
				if (rasp.shortId && rasp.shortId.length !== 5) console.error("PanelItems.visualMethods[default].deriveRASP shortId length should be 5, was", rasp.shortId.length);
				if (parts.length) rasp.pathSegment = parts.join(',');
				else rasp.pathSegment = null;
			}
		},
		titleize: {
			childActive: (rasp, item) => {
				return (rasp.shortId === item.id) || (!rasp.shortId)
			},
			childShape: (rasp, item) => {
				return (rasp.shortId === item.id ? 'open' : ((rasp.decendantFocus || rasp.focus) ? 'truncated' : 'title'))
			},
			childVisualMethod: () => 'titleize',
			actionToState: (action, rasp, source, initialRASP, delta) => {
				if (action.type === "DESCENDANT_FOCUS") {
					delta.decendantFocus = true;
					delta.focus = true;
					if (!rasp.focus) {
						this.props.items.forEach(item => this.toChild[item.id]({ type: "FOCUS_STATE" }));
					}
					if (action.shortId) { // a child is opening
						if (rasp.shortId && rasp.shortId !== action.shortId) // if a different child is already open, reset the SHAPE of the current child
							this.toChild[rasp.shortId]({ type: "UNFOCUS_STATE" }); //RESET_SHAPE
						delta.shortId = action.shortId; // the new child will be open
					}
					if (action.distance === 1 || action.distance == 3)
						setTimeout(() => Synapp.ScrollFocus(this.refs.top, 500), 500);
				} else if (action.type === "DESCENDANT_UNFOCUS") {
					if (action.distance === 1 /*&& rasp.decendantFocus*/) {
						//if(rasp.shortId) {
						//  this.toChild[rasp.shortId]({type: "FOCUS_STATE"})
						//  delta.shortId=null;
						//}
						delta.shortId = null;
						delta.decendantFocus = false;
						delta.creator = false;
					}
				} else if ((action.type === "FOCUS") || (action.type === "TOGGLE_FOCUS" && !rasp.focus) || (action.type === "FOCUS_STATE")) {
					delta.focus = true;
					if (!rasp.focus) {
						this.props.items.forEach(item => this.toChild[item.id]({ type: "FOCUS_STATE" }));
					}
					if (action.type !== "FOCUS_STATE") {
						this.queueFocus(action);
					}
				} else if ((action.type === "UNFOCUS") || (action.type === "TOGGLE_FOCUS" && rasp.focus) || (action.type === "UNFOCUS_STATE")) {
					delta.focus = false;
					delta.decendantFocus = false;
					delta.creator = false;
					//if(rasp.focus){
					this.props.items.forEach(item => this.toChild[item.id]({ type: "UNFOCUS_STATE" }));
					//} else if(rasp.shortId) {
					//  this.toChild[rasp.shortId]({type: "UNFOCUS_STATE"}); // RESET_SHAPE
					delta.shortId = null;
					//}
					if (action.type !== "UNFOCUS_STATE")
						this.queueUnfocus(action);
				} else if (action.type === "ITEM_DELVE") {
					; // do nothing and consume the action
				} else if (action.type === "SHOW_ITEM") {
					; // do nothing and consume the action
				} else
					return false; // action has not been processed continute checking
				action.toBeContinued = true; // supress shape_changed events
				return true; // action has been processed
			},
			// derive shape and pathSegment from the other parts of the RASP
			deriveRASP: (rasp, initialRASP) => {
				rasp.shape = rasp.decendantFocus ? (rasp.shortId ? 'open' : 'truncated') : (rasp.focus ? 'truncated' : 'title'); //if something hapens with a decendant, display the list as open or truncated. otherwise it's titleized.
				let parts = [];
				if (rasp.decendantFocus) parts.push('d');
				if (rasp.shortId) parts.push(rasp.shortId);
				else if(this.props.items && this.props.items.length===1) parts.push(this.props.items[0].id);
				if (rasp.shortId && rasp.shortId.length !== 5) console.error("PanelItems.visualMethods[default].deriveRASP shortId length should be 5, was", rasp.shortId.length);
				if (parts.length) rasp.pathSegment = parts.join(',');
				else rasp.pathSegment = null;
			}
		}
	}

	

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	render() {

		const { style, limit, skip, type, parent, items, count, rasp, createMethod, cssName, panel, item, ...otherProps } = this.props; // item must be removed from otherProps

		let title = 'Loading items', name, content;

		var bgStyle = Object.assign({},{backgroundColor: 'white'}, style);

		var buttons = type.buttons || ['Promote', 'Details', 'Harmony', 'Subtype'];

		if(typeof window!=='undefined'){  // InfiniteScroll does not work on server side
			return (
				<section ref="top">
					<InfiniteScroll
						items={items}
						count={count}
						loadMore={this.props.PanelLoadMore}
						rasp={rasp}
					>
					{ items.map(item=> (
						<Accordion active={this.vM.childActive(rasp, item)} name='item' key={item._id + '-panel-item'}>
							<ItemStore item={item} key={`item-${item._id}`}>
								<Item
									{...otherProps}
									parent={parent}
									rasp={this.childRASP(this.vM.childShape(rasp, item), item.id)}
									buttons={buttons}
									style={bgStyle}
									visualMethod={this.vM.childVisualMethod()}
								/>
							</ItemStore>
						</Accordion>
					))}
					</InfiniteScroll>
				</section>
			);
		}else{
			return (
				<section ref="top">
					{ items.map(item=> (
						<Accordion active={this.vM.childActive(rasp, item)} name='item' key={item._id + '-panel-item'}>
							<ItemStore item={item} key={`item-${item._id}`}>
								<Item
									{...otherProps}
									parent={parent}
									rasp={this.childRASP(this.vM.childShape(rasp, item), item.id)}
									buttons={buttons}
									style={bgStyle}
									visualMethod={this.vM.childVisualMethod()}
								/>
							</ItemStore>
						</Accordion>
					))}
				</section>
			);      
		}
	}
}


