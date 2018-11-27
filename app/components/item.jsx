'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ItemMedia from './item-media';
import Icon from './util/icon';
import Accordion from 'react-proactive-accordion';
import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import RASP from "react-action-state-path";
import { ReactActionStatePathClient } from 'react-action-state-path';
import ItemStore from './store/item';
import ItemComponent from './item-component';
import ItemSubject from './item-subject';
import ItemReference from './item-reference';
import ItemDescription from './item-description';
import injectSheet from 'react-jss'
import publicConfig from '../../public.json'
import ObjectID from 'bson-objectid';


//Item 
// Render the Item with buttons and subpanels. This item starts out truncated, if the user clicks the text, the item opens.
// When the text is truncated, a hint is shown
// If the user clicks on a button, the corresponding sub panel expands
//

// item -- the item to render
// buttons - list of buttons, can be component names, or can be objects with component.name. If visualMethod is edit, buttons defaults to Post
// user -- passed on to buttons and panels
// rasp
// style -- is passed as style to panels opened by buttons
// parent -- not used
// visualMethod
// min - true indicates to show the minimum height
// position - if set to left or right means the item is being displayed in two or more columns, so don't honor min in order to keep spacing consistent
// className
//
//

class Item extends React.Component {
    render() {
        //logger.trace("Item render");
        return (
            <RASP {... this.props} >
                <RASPItem />
            </RASP>
        );
    }
}

const styles = {
    item: {
        border: "1px solid #666",
        "margin-top": "0px",
        padding: `${publicConfig.itemVisualGap} 0 0 ${publicConfig.itemVisualGap}`,
        "border-right": "none",
        "margin-right": 0, /* -1px;border on top of border*/
        "margin-bottom": 0, /* -2px; border on top of border */
        "background-color": "inherit",
        "position": "relative", /* otherwise things that are relative will obscure this when they move around */

        "&div, &section, &article": {
            "background-color": "inherit",  // any div, section, or article under Item should inherit the background color from above rather than setting to rgb(0,0,0,0), unless otherwise specified. 
        },

        '&$title, &$peek': {
            'border': 'none',
            'padding-top': 0,
            'padding-bottom': 0
        },
          
       '&$ooview': {
            border: 'none',
            padding: 0
        },

        '&$whole-border': {
            border: '1px solid #666'
        }
    },
    "item-buttons": {
        "float": "right",
        "text-align": "right",
        "margin-top": `calc( -1 * ( ${publicConfig.itemVisualGap} - 2px ) )`, /** @item-visual-gap is not working here **/
        "margin-right": `-${publicConfig.itemVisualGap}`, /** move it to the right negating the padding of the item-text **/
        "&$collapsed, &$minified, &$title, &$peek": {
            display: "none"
        }
    },
    "item-text": {
        padding: 0,
        'padding-right': `${publicConfig.itemVisualGap}`,
        'background-color': 'transparent!important', /* so it doesn't cover up the image and the buttons */
        transition: 'height 0.5s linear'
    },
    'item-truncatable': {
        'min-height': '6.9em', /* 1.375 for subject + .5 * .5 for padding + 1.375 for reference or 1 line + 1.375 * 3 for 3 more lines  */
        'max-height': '7em',
        overflow: 'hidden',
        margin: 0,
        'margin-bottom': '0.6em', /* space below the text before the border. */

        cursor: 'pointer',
        transition: 'height 0.5s linear',

        'div:empty': {
            height: '1em'
        },

        '&$title, &$peek': {
            'padding-top': 0,
            'padding-bottom': '0.25em',
            'font-size': '1rem',
            'min-height': '1.25rem', // the height of the subject with a little space for the line below
            'color': '#888',
            'margin-bottom': 0
        },
        '&$edit': {
            'max-height': 'none',
            'overflow': 'hidden !important' // need to override accordion when it is expanded
        }
    },
    "item-trunc-hint": {
        display: 'none',
        position: 'absolute',
        left: "calc( 50% - 1.5em)", /* representing half the width of the ellipsis */
        bottom: '-1em', /* relative to the bottom of the outer border make the bottom on the bottom (not the top on the bottom)*/
        'font-size': '1rem',
        padding: 0,
        'background-color': 'rgba(255,255,255,0.5)!important', // a transparent white background    

        '&$untruncate': {
            display: 'inline'
        },
        '&$untruncate&$ooview': {
            display: 'none'
        },
        '&$ooview': {
            display: 'none'
        },
        '&$untruncate&$collapsed': {
            display: 'none'
        }
    },
    "item-footer": {
        'margin-right': '0px',
        'margin-bottom': `${publicConfig.itemVisualGap}`
    },
    'edit': {},
    'open': {},
    'peek': {},
    'truncated': {},
    'ooview': {},
    'title': {},
    'collapsed': {},
    'minified': {},
    'untruncate': {},
    'whole-border': {},
    'error-message': {
        color: 'red',
        'text-align': 'center'
    }
}

class RASPItem extends ReactActionStatePathClient {
    state = { hint: false, minHeight: null }; //
    constructor(props) {
        super(props, 'button');
        if (props.item && props.item.subject) { this.title = props.item.subject; this.props.rasp.toParent({ type: "SET_TITLE", title: this.title }); }
        let visMeth = this.props.visualMethod || this.props.item && this.props.item.type && this.props.item.type.visualMethod || 'default';
        if (!(this.vM = this.visualMethods[visMeth])) {
            console.error("RASPItem.constructor visualMethod unknown:", visMeth)
            this.vM = this.visualMethods['default'];
        }
        this.onChange = this.onChange.bind(this);
        this.onDirty=this.onDirty.bind(this);
        this.readMore = this.readMore.bind(this);
        //onsole.info("RASPItem.constructor");

        if (this.props.visualMethod === 'edit' && this.props.item && this.props.item.type && !this.props.item._id) // if we are creating a new item
            this.props.item._id= (new ObjectID()).toHexString();

        this.getTruncableDOM=this.getTruncableDOM.bind(this);
    }

    getTruncableDOM(e){
        if(e)
            this.truncableDOM=ReactDOM.findDOMNode(e);
    }

    someButton(part) {
        var button = null;
        const buttons=this.props.buttons || visualMethod==='edit' && ['Post'] || null;
        buttons.some(b => {
            if (typeof b === 'string') {
                if (b[0] === part) { button = b; return true }
            } else if (typeof b === 'object') {
                if (b.component && b.component[0] === part) { button = b.component; return true }
            } else return false;
        })
        return button;
    }

    visualMethods = {
        default: {
            // whether or not to show this component
            active: (rasp) => {
                return (rasp.shape !== 'collapsed');
            },
            // whether or not to show a child
            childActive: (rasp, button) => {
                return (rasp.button === button)
            },
            // the shape to give a child, when it is initially mounted
            childShape: (rasp, button) => {
                switch (rasp.shape) {
                    case 'title':
                        if (rasp.button === button) return 'open';
                        else return 'truncated';
                    case 'open':
                        if (rasp.button === button) return 'open'
                        else return 'truncated';
                    case 'truncated':
                        return 'truncated';
                    default:
                        return rasp.shape;
                }
            },
            childVisualMethod: () => undefined,
            // process actions for this visualMethod
            enableHint: () => true,
            actionToState: (action, rasp, source, initialRASP, delta) => {
                if (action.type === "DESCENDANT_FOCUS" && action.distance > 1) {
                    delta.readMore = false; // if the user is working on stuff further below, close the readmore
                } else if (action.type === "DESCENDANT_UNFOCUS" && !action.itemUnfocused) {
                    // child changed to truncated
                    action.itemUnfocused = 1; // let items up the chain know that an item has unfocused
                    delta.shape = 'truncated';
                    delta.button = null;
                    delta.readMore = false;
                    setTimeout(() => Synapp.ScrollFocus(this.refs.item, 500), 500);  // it would be better if this were a chained event but for now ...
                } else if (action.type === "ITEM_DELVE") {
                    delta.readMore = true;
                    if (this.props.item.subType) delta.button = this.someButton('S');
                } else if (action.type === "UNFOCUS_STATE") {
                    delta.readMore = false;
                    delta.button = null;
                } else if (action.type === "FOCUS_STATE") {
                    delta.readMore = true;
                } else
                    return false;
                return true;
            },
            // derive shape and pathSegment from the other parts of the RASP
            deriveRASP: (rasp, initialRASP) => {
                if (rasp.button || rasp.readMore) {
                    rasp.shape = 'open'
                } else
                    rasp.shape = 'truncated';
                // calculate the pathSegment and return the new state
                let parts = [];
                if (rasp.readMore) parts.push('r');
                if (rasp.button) parts.push(rasp.button[0]); // must ensure no collision of first character of item-component names
                if (rasp.decendantFocus) parts.push('d');
                rasp.pathSegment = parts.join(',');
            }
        },
        edit: {
            // whether or not to show this component
            active: (rasp) => {
                return (rasp.shape !== 'collapsed');
            },
            // whether or not to show a child
            childActive: (rasp, button) => {
                return false;
            },
            // the shape to give a child, when it is initially mounted
            childShape: (rasp, button) => {
                return 'edit';
            },
            childVisualMethod: () => 'edit',
            // process actions for this visualMethod
            enableHint: () => false,
            actionToState: (action, rasp, source, initialRASP, delta) => {
                return false;
            },
            // derive shape and pathSegment from the other parts of the RASP
            deriveRASP: (rasp, initialRASP) => {
                let parts=[];
                if (rasp.button==='Posted') rasp.shape=rasp.readMore ? 'open' : 'truncated';
                else if (rasp.button==='Editing') rasp.shape='edit';
                else rasp.shape='edit';
                if (rasp.button) parts.push(rasp.button[0]); // must ensure no collision of first character of item-component names
                rasp.pathSegment = parts.join(',');
            }
        },
        defaultNoScroll: {
            // whether or not to show this component
            active: (rasp) => {
                return (rasp.shape !== 'collapsed');
            },
            // whether or not to show a child
            childActive: (rasp, button) => {
                return (rasp.button === button)
            },
            // the shape to give a child, when it is initially mounted
            childShape: (rasp, button) => {
                switch (rasp.shape) {
                    case 'title':
                        if (rasp.button === button) return 'open';
                        else return 'truncated';
                    case 'open':
                        if (rasp.button === button) return 'open'
                        else return 'truncated';
                    case 'truncated':
                        return 'truncated';
                    default:
                        return rasp.shape;
                }
            },
            childVisualMethod: () => 'defaultNoScroll',
            // process actions for this visualMethod
            enableHint: () => true,
            actionToState: (action, rasp, source, initialRASP, delta) => {
                if (action.type === "DESCENDANT_FOCUS" && action.distance > 1) {
                    delta.readMore = false; // if the user is working on stuff further below, close the readmore
                } else if (action.type === "DESCENDANT_UNFOCUS" && !action.itemUnfocused) {
                    // child changed to truncated
                    action.itemUnfocused = 1; // let items up the chain know that an item has unfocused
                    delta.shape = 'truncated';
                    delta.button = null;
                    delta.readMore = false;
                } else if (action.type === "ITEM_DELVE") {
                    delta.readMore = true;
                    if (this.props.item.subType) delta.button = this.someButton('S');
                } else if (action.type === "UNFOCUS_STATE") {
                    delta.readMore = false;
                    delta.button = null;
                } else if (action.type === "FOCUS_STATE") {
                    delta.readMore = true;
                } else
                    return false;
                return true;
            },
            // derive shape and pathSegment from the other parts of the RASP
            deriveRASP: (rasp, initialRASP) => {
                if (rasp.button || rasp.readMore) {
                    rasp.shape = 'open'
                } else
                    rasp.shape = 'truncated';
                // calculate the pathSegment and return the new state
                let parts = [];
                if (rasp.readMore) parts.push('r');
                if (rasp.button) parts.push(rasp.button[0]); // must ensure no collision of first character of item-component names
                if (rasp.decendantFocus) parts.push('d');
                rasp.pathSegment = parts.join(',');
            }
        },
        ooview: {
            // whether or not to show this component
            active: (rasp) => {
                return (rasp.shape !== 'collapsed');
            },
            // whether or not to show a child
            childActive: (rasp, button) => {
                return (rasp.button === button)
            },
            // the shape to give a child, when it is initially mounted
            childShape: (rasp, button) => {
                switch (rasp.shape) {
                    case 'title':
                        if (rasp.button === button) return 'open';
                        else return 'truncated';
                    case 'open':
                        if (rasp.button === button) return 'open'
                        else return 'truncated';
                    case 'truncated':
                        return 'truncated';
                    default:
                        return rasp.shape;
                }
            },
            childVisualMethod: () => 'ooview',
            // process actions for this visualMethod
            enableHint: () => {
                return (!this.props.rasp.decendantFocus)
            },
            actionToState: (action, rasp, source, initialRASP, delta) => {
                if (action.type === "DESCENDANT_FOCUS" && action.distance > 0) {
                    delta.readMore = false;
                    delta.decendantFocus = true;
                } else if (action.type === "DESCENDANT_UNFOCUS" && !action.itemUnfocused) {
                    action.itemUnfocused = 1;
                    delta.shape = 'truncated';
                    delta.button = null;
                    delta.readMore = false;
                    delta.decendantFocus = false;
                } else if (action.type === "ITEM_DELVE") {
                    delta.readMore = true;
                    if (this.props.item.subType) delta.button = this.someButton('S');
                } else if (action.type === "UNFOCUS_STATE") {
                    delta.decendantFocus = false;
                    delta.readMore = false;
                    delta.button = null;
                } else if (action.type === "FOCUS_STATE") {
                    delta.decendantFocus = false;
                    delta.readMore = true;
                } else
                    return false;
                return true;
            },
            // derive shape and pathSegment from the other parts of the RASP
            deriveRASP: (rasp, initialRASP) => {
                if (rasp.button || rasp.readMore) {
                    rasp.shape = rasp.decendantFocus ? 'title' : 'open'
                } else
                    rasp.shape = rasp.decendantFocus ? 'title' : 'truncated';
                // calculate the pathSegment and return the new state
                let parts = [];
                if (rasp.readMore) parts.push('r');
                if (rasp.button) parts.push(rasp.button[0]); // must ensure no collision of first character of item-component names
                if (rasp.decendantFocus) parts.push('d');
                rasp.pathSegment = parts.join(',');
            }
        },
        titleize: {  // same as ooView 
            // whether or not to show this component
            active: (rasp) => {
                return (rasp.shape !== 'collapsed');
            },
            // whether or not to show a child
            childActive: (rasp, button) => {
                return (rasp.button === button)
            },
            // the shape to give a child, when it is initially mounted
            childShape: (rasp, button) => {
                switch (rasp.shape) {
                    case 'title':
                        if (rasp.button === button) return 'open';
                        else return 'truncated';
                    case 'open':
                        if (rasp.button === button) return 'open'
                        else return 'truncated';
                    case 'truncated':
                        return 'truncated';
                    default:
                        return rasp.shape;
                }
            },
            childVisualMethod: () => 'titleize',
            enableHint: () => {
                return (!this.props.rasp.decendantFocus && this.props.rasp.focus)
            },
            // process actions for this visualMethod
            actionToState: (action, rasp, source, initialRASP, delta) => {
                if (action.type === "DESCENDANT_FOCUS" /*&& action.distance>1*/) {
                    delta.decendantFocus = true;
                    if (action.distance === 1)
                        setTimeout(() => Synapp.ScrollFocus(this.refs.footer, 500), 500);  // it would be better if this were a chained event but for now ...
                } else if (action.type === "DESCENDANT_UNFOCUS" && !action.itemUnfocused) {
                    action.itemUnfocused = 1;
                    delta.decendantFocus = false;
                    delta.button = null;
                    delta.readMore = false;
                    setTimeout(() => Synapp.ScrollFocus(this.refs.item, 500), 500);  // it would be better if this were a chained event but for now ...
                } else if (action.type === "UNFOCUS_STATE") {
                    delta.decendantFocus = false;
                    delta.focus = false;
                    delta.readMore = false;
                    delta.button = null;
                } else if (action.type === "FOCUS_STATE") {
                    delta.focus = true;
                } else if (action.type === "ITEM_DELVE") {
                    ; // do nothing, consume the action
                } else
                    return false;
                return true;
            },
            // derive shape and pathSegment from the other parts of the RASP
            deriveRASP: (rasp, initialRASP) => {
                if (rasp.button || rasp.readMore) {
                    rasp.shape = rasp.decendantFocus ? (rasp.focus ? 'truncated' : 'title') : 'open'
                } else
                    rasp.shape = rasp.focus ? 'truncated' : 'title';
                // calculate the pathSegment and return the new state
                let parts = [];
                if (rasp.readMore) parts.push('r');
                if (rasp.button) parts.push(rasp.button[0]); // must ensure no collision of first character of item-component names
                if (rasp.decendantFocus) parts.push('d');
                rasp.pathSegment = parts.join(',');
            }
        }
    }

    segmentToState(action, initialRASP) {  //RASP is setting the initial path. Take your pathSegment and calculate the RASPState for it.  Also say if you should set the state before waiting the child or after waiting
        var nextRASP = {};
        let parts = action.segment.split(',');
        let button = null;
        let matched = 0;
        parts.forEach(part => {
            if (part === 'r') {
                nextRASP.readMore = true;
                matched += 1;
            } else if (part === 'd') {
                nextRASP.decendantFocus = true;
                matched += 1;
            } else if (button = this.someButton(part)) {
                nextRASP.button = button;
                matched += 1;
            }
        });
        if (!matched || matched < parts.length) logger.error("RASPItem SET_PATH didn't match all pathSegments", { matched }, { parts }, { action });
        this.vM.deriveRASP(nextRASP, initialRASP);
        return { nextRASP, setBeforeWait: true };  //setBeforeWait means set the new state and then wait for the key child to appear, otherwise wait for the key child to appear and then set the new state.
    }

    actionToState(action, rasp, source = 'CHILD', initialRASP, delta) { // this function is going to be called by the RASP manager, rasp is the current RASP state
        //logger.trace("RASPItem.actionToState", { action }, { rasp }); // rasp is a pointer to the current state, make a copy of it so that the message shows this state and not the state it is later when you look at it
        var nextRASP = {};
        if (action.type === 'POST_ITEM' && action.distance==0) {
            if (ReactActionStatePath.thiss.findIndex(it=>it && it.client===this) <0) {
                logger.error("Item.actionToState item is not mounted", rasp.id, this );
            }else{
                Object.assign(this.props.item,action.item); // this items is posted, but copy it here to avoid propagation delay
                delta.button='Posted';
                if(rasp.errors) delta.errors=null;
                action.duration=1; // the parent of this RASP should know of the post too.
                this.queueUnfocus(action); 
            }
        } if (action.type === 'POST_ERROR' && action.distance==0) {
            delta.errors=action.errors;
        }else if (action.type === 'EDIT_ITEM'){
            delta.button='Editing';
            this.queueFocus(action);
        } else if (action.type === "SET_BUTTON") {
            delta.button = action.button;
            delta.readMore = false; // if turning off a button, close readMore too
        } else if (action.type === "RESET_BUTTON") {
            if (rasp.button === action.button) delta.button = null;
        } else if (action.type === "TOGGLE_BUTTON") {
            delta.button = rasp.button === action.button ? null : action.button; // toggle the button 
            if (action.button && !delta.button) delta.readMore = false; // if turning off a button, close readMore too
            else delta.readMore = rasp.readMore;
            if (delta.button) this.queueFocus(action);
            else this.queueUnfocus(action)
            if (rasp.button && this.toChild[rasp.button]) this.toChild[rasp.button]({ type: "UNFOCUS_STATE" }); // turning off a button, tell child to unfocus
            if (delta.button && this.toChild[delta.button]) this.toChild[delta.button]({ type: "FOCUS_STATE" }); // turning on a button, tell child to focus
        } else if (action.type === "TOGGLE_READMORE") {
            if (!this.state.hint && !rasp.readMore && rasp.button === 'Harmony') { // hint is not showing, readMore is not showing, and Harmony is showing. 
                rasp.button = null;
            } else {
                delta.readMore = !rasp.readMore; // toggle condition;
                if (delta.readMore && !rasp.button && this.props.item.harmony && this.props.item.harmony.types && this.props.item.harmony.types.length) delta.button = 'Harmony';  // open harmony when opening readMore
                else if (!delta.readMore && rasp.button === 'Harmony') delta.button = null;  // turn harmony off when closing readMore
                else delta.button = rasp.button; // othewise keep button the same
            }
            //if(delta.readMore) this.queueFocus(action); 
            //else this.queueUnfocus(action)
        } else if (action.type === "FINISH_PROMOTE") {
            if (action.winner && action.winner._id === this.props.item._id) { // if we have a winner, and it's this item
                delta.readMore = true;
                if (this.props.item.subType) delta.button = this.someButton('S');
            } else if (action.winner) { // we have a winner but it's some other item
                delta.readMore = false;
                delta.button = null;
                this.queueAction({ type: "OPEN_ITEM", item: action.winner, distance: -1 });
            } else { // there wasn't a winner but we finish the promote
                delta.readMore = 'false';
                delta.button = null;
            }
        } else if (action.type === "CHANGE_SHAPE") {
            delta.shape = action.shape;
            if (action.shape === 'open') {
                delta.readMore = true;
                if (this.props.item.harmony && this.props.item.harmony.types && this.props.item.harmony.types.length) delta.button = 'Harmony';  // open harmony when opening readMore
            }
        } else if (action.type === "CHILD_UPDATE") {
            if (action.shortId === this.props.item.id && action.item) {
                Object.assign(this.props.item, action.item);
                delta.forceUpdate = (rasp.forceUpdate || 0) + 1; // cause a state change resulting in a rerender
            }
        } else if (this.vM.actionToState(action, rasp, source, initialRASP, delta)) {
            ; // do nothing - it's already been done
        } else if (Object.keys(delta).length) {
            ; // no need to do anything, but do continue to calculate nextRASP
        } else
            return null;  // if you don't handle the type, let the default handlers prevail
        //calculate the shape based on button and readMore
        Object.assign(nextRASP, rasp, delta);
        this.vM.deriveRASP(nextRASP, initialRASP);
        return nextRASP;
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    transparentEventListener = {};
    transparent(e) {
        e.preventDefault();
    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    componentDidMount() {

        this.transparentEventListener = this.transparent.bind(this);
        var truncable = this.truncableDOM;
        if (truncable) { // if item is null, only a simple div is returned.
            truncable.addEventListener('mouseover', this.transparentEventListener, false);
            truncable.addEventListener('click', this.transparentEventListener, false);
            this.textHint(); //see if we need to give a hint
        }
    }

    componentWillUnmount() { // if item is null, only a simple div is returned.
        var truncable = this.truncableDOM;
        if (truncable) {
            truncable.removeEventListener('mouseover', this.transparentEventListener);
            truncable.removeEventListener('click', this.transparentEventListener);
        }
    }

    /*** This is working well, but be vigilent about making sure what needs to be tested is tested ****/
    shouldComponentUpdate(newProps, newState) {
        if (!isEqual(this.props.rasp, newProps.rasp)) return true;
        if (this.state.hint !== newState.hint) return true;
        if (this.state.minHeight !== newState.minHeight) return true;
        if (this.props.item && newProps.item) {
            if (this.props.item.subject !== newProps.item.subject) return true;
            if (this.props.item.description !== newProps.item.description) return true;
        }
        //logger.trace("Item.shouldComponentUpdate", this.props.rasp.depth, this.title, "no", this.props, newProps, this.state, newState);
        return false;
    }
    /***/

    componentWillReceiveProps(newProps) {
        this.textHint();
        setTimeout(this.textHint.bind(this), 500); // this sucks but double check the hint in 500Ms in case the environment has hanged - like you are within a double wide that's collapsing
        if (newProps.item && newProps.item.subject && newProps.item.subject !== this.title) { this.title = newProps.item.subject; this.props.rasp.toParent({ type: "SET_TITLE", title: this.title }); }
        let visMeth = newProps.visualMethod || newProps.item && newProps.item.type && newProps.item.type.visualMethod || 'default';
        if (!(this.vM = this.visualMethods[visMeth])) {
            console.error("RASPItem.componentWillReceiveProps visualMethod unknown:", visMeth)
            this.vM = this.visualMethods['default'];
        }
    }


    // when the user clicks on an item's button
    onClick(button, _id, id, func) {
        if(typeof func === 'function') 
            func.call(this);
        else
            this.props.rasp.toParent({ type: "TOGGLE_BUTTON", button });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    textHint() {
        //called on mount and completion of Accordion collapse / expand
        //active when the accordion has completed open, not active when accordion has completed close. But that doesn't matter here. Parent is the master of the state.
        //console.info("textHint before", this.state, this.props.vs.state);
        if (!(this.refs.buttons && this.refs.media && this.truncableDOM)) return; // too early

        if (!this.props.rasp.readMore && this.vM.enableHint()) {
            let truncable = this.truncableDOM;
            let innerChildR = truncable.children[0].getBoundingClientRect(); // first child of according is a div which wraps around the innards and is not constrained by min/max height
            let truncableR = truncable.getBoundingClientRect();

            if (Math.round(innerChildR.bottom) > Math.ceil(truncableR.bottom)) { // the innards are bigger than the trunkable agrea, so truncate them 
                this.setState({ hint: true });
            } else {
                var nextState = {};
                if (this.state.hint) nextState.hint = false;
                if (this.props.min && !this.props.position) { // do we need put in a smaller minHeight because there is not enough to fill the minimum

                    let buttonsR = this.refs.buttons.getBoundingClientRect();
                    let mediaR = ReactDOM.findDOMNode(this.refs.media).getBoundingClientRect();
                    let bottomLine = Math.max(buttonsR.bottom, mediaR.bottom, innerChildR.bottom);

                    let minHeight = Math.ceil(innerChildR.top - bottomLine);

                    if (this.state.minHeight !== minHeight) nextState.minHeight = minHeight;
                }
                this.setState(nextState);
            }
        } else { // if this is not the truncated state, make sure the hint is off
            if (this.state.hint) this.setState({ hint: false, minHeight: null }); // if open, turn off the hint
        }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    readMore(e) {
        e.preventDefault(); // stop the default event processing of a div which is to stopPropogation
        if (this.props.rasp.shape === 'edit') return;
        if (this.props.rasp.readMore) { // if readMore is on and we are going to turn it off
            this.setState({ hint: false });  // turn off the hint at the beginning of the sequence
        }
        if (this.props.rasp.toParent) this.props.rasp.toParent({ type: "TOGGLE_READMORE" })
        //setTimeout(()=>Synapp.ScrollFocus(this.refs.item,500),500);  // it would be better if this were a chained event but for now ...
    }

    onChange(obj) {
        if (obj.value) {
            if(Object.keys(obj.value).some(key=>obj.value[key]!==this.props.item[key])) {  // only if something has really changed
                Object.assign(this.props.item, obj.value);
                this.qaction(()=>this.props.rasp.toParent({type: "ITEM_CREATOR_DIRTY", dirty: true})); // let the ancestors know that this item is being edited
            }
        }
    }

    onDirty(dirty){
        this.qaction(()=>this.props.rasp.toParent({type: "ITEM_CREATOR_DIRTY", dirty})); // let the ancestors know that this item is being edited
    }

    getEditWidth(){
        let buttons = this.refs.buttons;
        let truncable = this.truncableDOM;
        if(buttons && truncable)
            return buttons.getBoundingClientRect().x-truncable.getBoundingClientRect().x + 'px';
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {
        const { classes, visualMethod, item, user, rasp, style, parent, className, ...otherProps } = this.props;
        const shape = rasp ? rasp.shape : '';
        const readMore = rasp.readMore;
        const buttons=this.props.buttons || visualMethod==='edit' && ['Post'] || null;
        const truncShape=((this.vM.active(rasp) && readMore) ? 'open' : shape);
        let noReference = true;
        var cxs=[];

        if(className){
            if(className==='whole-border'){
                cxs.push(classes['whole-border']);
            }else{
                console.error("Item: ignoring unsupported className:",className);
            }
        }

        //onsole.info("RASPItem render", this.props.rasp.depth, this.title, this.props);

        if (!item) { return (<div style={{ textAlign: "center" }}>Nothing available at this time.</div>); }

        if (item.references && item.references.length)
            noReference = false;

        const childProps = { item, truncShape, noReference, onChange: this.onChange, onDirty: this.onDirty, rasp };

        // a button could be a string, or it could be an object which must have a property component
        var renderPanel = (button) => {
            if (typeof button === 'string')
                return (<ItemComponent {...otherProps} component={button} part={'panel'} key={item._id + '-panel-' + button}
                    rasp={this.childRASP(this.vM.childShape(rasp, button), button)}
                    visualMethod={this.vM.childVisualMethod()}
                    item={item} active={this.vM.childActive(rasp, button)} style={style}
                    user={user} />);
            else if (typeof button === 'object')
                return (<ItemComponent {...otherProps} part={'panel'} key={item._id + '-panel-' + (button.buttonName || button.component)}
                    rasp={this.childRASP(this.vM.childShape(rasp, button.component), button.component)}
                    visualMethod={this.vM.childVisualMethod()}
                    user={user}
                    item={item} active={this.vM.childActive(rasp, button.component)} style={style} {...button} />);
        }

        // a button could be a string, or it could be an object which must have a property component
        var renderButton = (button) => {
            if (typeof button === 'string')
                return (<ItemComponent {...otherProps}
                    component={button} part={'button'} active={this.vM.childActive(rasp, button)}
                    rasp={rasp} visualMethod={this.vM.childVisualMethod()}
                    user={user}
                    onClick={this.onClick.bind(this, button, item._id, item.id)} key={item._id + '-button-' + button}
                />);
            else if (typeof button === 'object')
                return (<ItemComponent {...otherProps} {...button}
                    part={'button'} active={this.vM.childActive(rasp, button.component)}
                    rasp={rasp} visualMethod={this.vM.childVisualMethod()}
                    user={user}
                    onClick={this.onClick.bind(this, button.component, item._id, item.id)} key={item._id + '-panel-' + (button.buttonName || button.component)}
                />);
        }

        return (
            <article className={cx(classes["item"], cxs, classes[shape])} ref="item" id={'item-' + item._id} >
                <Accordion active={this.vM.active(rasp)} text={true} >
                    <ItemMedia {...childProps} shape={shape} onClick={this.readMore}
                        ref="media"
                    />
                    <section className={cx(classes["item-text"], classes[shape])} ref='itemText'>
                        <section className={cx(classes["item-buttons"], classes[shape])} ref='buttons'>
                            <ItemStore item={item}>
                                {buttons ? buttons.map(button => renderButton(button)) : null}
                            </ItemStore>
                        </section>
                        <Accordion className={cx(classes["item-truncatable"], classes[truncShape])} onClick={this.readMore} active={readMore || visualMethod==='edit'} text={true} onComplete={this.textHint.bind(this)} ref={this.getTruncableDOM} style={{ minHeight: this.props.rasp.readMore || !this.state.minHeight ? null : this.state.minHeight + 'px' }}>
                            <ItemSubject {...childProps} getEditWidth={this.getEditWidth.bind(this)}/>
                            {(rasp.errors && rasp.errors.subject && <div className={classes['error-message']}>{rasp.errors.subject}</div>)}
                            <ItemReference {...childProps} />
                            <ItemDescription {...childProps} />
                            {(rasp.errors && rasp.errors.description && <div className={classes['error-message']}>{rasp.errors.description}</div>)}
                        </Accordion>
                    </section>
                    <div className={cx(classes['item-trunc-hint'], this.state.hint && classes['untruncate'], classes[shape])}>
                        <Icon icon="ellipsis-h" />
                    </div>
                </Accordion>
                <section style={{ clear: 'both' }}>
                </section>
                <section className={cx(classes["item-footer"], classes[shape])} ref="footer">
                    {buttons ? buttons.map(button => renderPanel(button)) : null}
                </section>
            </article>
        );
    }
}

export default injectSheet(styles)(Item);