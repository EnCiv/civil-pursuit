'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ItemMedia from './item-media';
import Icon from './util/icon';
import Accordion from './util/accordion';
import ClassNames from 'classnames';
import isEqual from 'lodash/isEqual';
import has from 'lodash/has';
import DynamicSelector from './dynamic-selector';
import {UserInterfaceManager, UserInterfaceManagerClient} from './user-interface-manager';
import ItemStore from './store/item';
import ItemComponent from './item-component';

//Item Visual State - lets other components change the visual state of an item. 
// For example 'collapsed' is a visual state.  But as we grow the use of Item we find that there are more visual states and we even want to change the visual state of an item based on it's depth.

class Item extends React.Component {
  constructor(props){
    super();
    let shape=props.uim.shape;
    let readMore=shape==='open';
    let button = (props.item && props.item.harmony && props.item.harmony.types && props.item.harmony.types.length) ? 'Harmony' : null;
    let parts=[];
    if(readMore) parts.push('r');
    if(button) parts.push(button[0]);
    let pathPart=parts.join(',');
    //this.initialUIM={shape, readMore, button, pathPart: [pathPart]};
  }
  render() {
    //   console.info("Item render");
    return (
      <UserInterfaceManager {... this.props} initialUIM={this.initialUIM}>
        <UIMItem />
      </UserInterfaceManager>
    );
  }
}
export default Item;


class UIMItem extends UserInterfaceManagerClient {
  state = { hint: false, minHeight: null }; //
  constructor(props){
    var uimProps={uim: props.uim};
    super(uimProps, 'button');
    if(props.item && props.item.subject) {  this.title=props.item.subject; this.props.uim.toParent({type: "SET_TITLE", title: this.title});}
  }

  setPath(action){  //UIM is setting the initial path. Take your pathPart and calculate the UIMState for it.  Also say if you should set the state before waiting the child or after waiting
    var nextUIM={shape: 'truncated', pathPart: [action.part]};
    let parts=action.part.split(',');
    let button=null;
    let matched=0;
    parts.forEach(part=>{
      if(part==='r'){
        nextUIM.readMore=true;
        matched+=1;
        nextUIM.shape='open';
      }else if(this.props.buttons.some(b=>{if(b[0]===part){button=b; return true} else return false;})) {
        nextUIM.button=button;
        matched+=1;
        nextUIM.shape='open';
      }
    });
    if(!matched || matched<parts.length) logger.error("UIMItem SET_PATH didn't match all pathParts", {matched}, {parts}, {action}); 
    return {nextUIM, setBeforeWait: true};  //setBeforeWait means set the new state and then wait for the key child to appear, otherwise wait for the key child to appear and then set the new state.
  }

  actionToState(action, uim, source='CHILD') { // this function is going to be called by the UIManager, uim is the current UIM state
    logger.trace("UIMItem.actionToState",{action},{uim}); // uim is a pointer to the current state, make a copy of it so that the message shows this state and not the state it is later when you look at it
    var nextUIM={};
    let delta={};
    if (action.type === "TOGGLE_BUTTON") {
      delta.button= uim.button === action.button ? null : action.button; // toggle the button 
      if(action.button && !delta.button) delta.readMore=false; // if turning off a button, close readMore too
      else delta.readMore = uim.readMore;
    } else  if (action.type === "TOGGLE_READMORE") {
      delta.readMore = !uim.readMore; // toggle condition;
      if(delta.readMore && !uim.button && this.props.item.harmony  && this.props.item.harmony.types && this.props.item.harmony.types.length) delta.button='Harmony';  // open harmony when opening readMore
      else if(!delta.readMore && uim.button==='Harmony') delta.button=null;  // turn harmony off when closing readMore
      else delta.button=uim.button; // othewise keep button the same
    } else  if (action.type === "ITEM_DELVE") {
      delta.readMore=true;
      if(this.props.buttons.some(b=>b==='Subtype')) delta.button='Subtype';
      else delta.button=null;
    } else  if (action.type === "FINISH_PROMOTE") {
      if(action.winner && action.winner._id===this.props.item._id) { // if we have a winner, and it's this item
        delta.readMore=true;
        if(this.props.buttons.some(b=>b==='Subtype')) delta.button='Subtype';
        else delta.button=null;
      }else if (action.winner) { // we have a winner but it's some other item
        delta.readMore=false;
        delta.button=null;
        setTimeout(()=>this.props.uim.toParent({type: "OPEN_ITEM", item: action.winner, distance: -1}));
      } else { // there wasn't a winner but we finish the promote
        delta.readMore='false';
        delta.button=null;
      }
    } else if(action.type==="CHANGE_SHAPE"){
      if(action.shape==='open'){
        delta.readMore=true;
        if(this.props.item.harmony && this.props.item.harmony.types && this.props.item.harmony.types.length) delta.button='Harmony';  // open harmony when opening readMore
        else delta.button=uim.button;
      } else if (action.shape==='truncated'){
        delta.readMore=false;
        delta.button=null;
      } 
    } else if(action.type==="CHILD_SHAPE_CHANGED"  && action.distance >= 2){
        delta.readMore=false; // if the user is working on stuff further below, close the readmore
        delta.button=uim.button; // keep the button status
    }
     else 
      return null;  // if you don't handle the type, let the default handlers prevail
    //calculate the shape based on button and readMore
    delta.shape= delta.button || delta.readMore ? 'open' : 'truncated';  // open if button or readMore is active, otherwise truncated. (if collapsed this should be irrelevant)
    // calculate the pathPart and return the new state
    let parts=[];
    if(delta.readMore) parts.push('r');
    if(delta.button) parts.push(delta.button[0]); // must ensure no collision of first character of item-component names
    delta.pathPart=[parts.join(',')];
    Object.assign(nextUIM, uim, delta);
    return nextUIM;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  transparentEventListener = {};
  transparent(e) {
    e.preventDefault();
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  componentDidMount() {

    this.transparentEventListener = this.transparent.bind(this);
    var truncable = ReactDOM.findDOMNode(this.refs.truncable);
    if (truncable) { // if item is null, only a simple div is returned.
      truncable.addEventListener('mouseover', this.transparentEventListener, false);
      truncable.addEventListener('click', this.transparentEventListener, false);
      this.textHint(); //see if we need to give a hint
    }
    //if(this.props.uim.shape==='open' && !this.props.uim.button && !this.props.uim.readMore ) this.props.uim.toParent({type: "CHANGE_SHAPE", shape: 'open'}); // to set the initial state for open
  }

  componentWillUnmount() { // if item is null, only a simple div is returned.
    var truncable = ReactDOM.findDOMNode(this.refs.truncable);
    if (truncable) {
      truncable.removeEventListener('mouseover', this.transparentEventListener);
      truncable.removeEventListener('click', this.transparentEventListener);
    }
  }

  /*** This is working well, but be vigilent about making sure what needs to be tested is tested ****/
  shouldComponentUpdate(newProps, newState) {
    if (!isEqual(this.props.uim, newProps.uim)) return true;
    //if (!isEqual(this.props.buttons, newProps.buttons)) return true;  the buttons don't change
    if (this.state.hint !== newState.hint) return true;
    if (this.state.minHeight != newState.minHeight) return true;
    if (this.props.item && newProps.item) {
      if (this.props.item.subject !== newProps.item.subject) return true;
      if (this.props.item.description !== newProps.item.description) return true;
    }
    console.info("Item.shouldComponentUpdate", this.props.uim.depth, this.title, "no", this.props, newProps, this.state, newState);
    return false;
  }
  /***/

  componentWillReceiveProps(newProps) {
    this.textHint();
    setTimeout(this.textHint.bind(this), 500); // this sucks but double check the hint in 500Ms in case the environment has hanged - like you are within a double wide that's collapsing
    if(newProps.item && newProps.item.subject && newProps.item.subject !== this.title) {  this.title=newProps.item.subject; this.props.uim.toParent({type: "SET_TITLE", title: this.title});}
  }


  // when the user clicks on an item's button
  onClick(button) {
    this.props.uim.toParent({ type: "TOGGLE_BUTTON", button })
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  textHint() {
    //called on mount and completion of Accordion collapse / expand
    //active when the accordion has completed open, not active when accordion has completed close. But that doesn't matter here. Parent is the master of the state.
    //console.info("textHint before", this.state, this.props.vs.state);
    if (!(this.refs.buttons && this.refs.media && this.refs.truncable)) return; // too early

    if (!(this.props.uim && this.props.uim.readMore)) {
      let buttonsR = this.refs.buttons.getBoundingClientRect();
      let mediaR = ReactDOM.findDOMNode(this.refs.media).getBoundingClientRect();
      let truncable = ReactDOM.findDOMNode(this.refs.truncable);
      let innerChildR = truncable.children[0].getBoundingClientRect(); // first child of according is a div which wraps around the innards and is not constrained by min/max height
      let bottomLine = Math.max(buttonsR.bottom, mediaR.bottom);
      let truncableR = truncable.getBoundingClientRect();
      if (((buttonsR.height || mediaR.height) && (innerChildR.bottom < bottomLine)) // there is less text than the bottom of media or button
        || (((!buttonsR.height && !mediaR.height) || this.props.min) && (Math.round(innerChildR.bottom) <= Math.ceil(truncableR.bottom))) // there is no media or buttons and there is less text than or equal to the 'min' height of truncated
      ) {
        if (!this.props.position) {
          // if the actual size of item-text is less than the button group or media, set it to the button group and don't show the hint.
          let minHeight = Math.ceil(innerChildR.height) + 'px';
          if (this.state.minHeight !== minHeight) this.setState({ minHeight: minHeight });  // child hieight might change after data is loaded, set state so component should update.
        }
        if (this.state.hint) this.setState({ hint: false }); // if the hint is on - turn it off
        return;
      } else { // we are in the truncated state and there is so much text that we need to truncate it
        if (!this.state.hint) this.setState({ hint: true }); // if the text is bigger, turn on the hint
      }
    } else { // if this is not the truncated state, make sure the hint is off
      if (this.state.hint) this.setState({ hint: false }); // if open, turn off the hint
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  readMore(e) {
    e.preventDefault(); // stop the default event processing of a div which is to stopPropogation
    if (this.props.uim.readMore) { // if readMore is on and we are going to turn it off
      this.setState({ hint: false });  // turn off the hint at the beginning of the sequence
    } 
    if (this.props.uim.toParent) this.props.uim.toParent({ type: "TOGGLE_READMORE"})
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  openURL(e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (this.props.uim.shape === 'truncated') { return this.readMore(e); }

    let win = window.open(this.refs.link.href, this.refs.link.target);
    if (win) {
      //Browser has allowed it to be opened
      win.focus();
    } else {
      //Browser has blocked it
      alert('Please allow popups for this website');
    }
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const { active, item, user, buttons, uim, style, emitter } = this.props;
    const shape = uim ? uim.shape : '';
    const classShape = shape ? 'vs-' + shape : '';
    const readMore=(uim && uim.readMore);
    const truncShape = shape!=='collapsed' ? readMore ? 'vs-open' : 'vs-truncated' : 'vs-collapsed';

    let noReference = true;

    console.info("UIMItem render", this.props.uim.depth, this.title, this.props);

    if (!item) { return (<div style={{ textAlign: "center" }}>Nothing available at this time.</div>); }

    let referenceLink, referenceTitle;

    if (item.references && item.references.length) {
      referenceLink = item.references[0].url;
      referenceTitle = item.references[0].title;
      noReference = false;
    }
    var renderPanel = (button)=>{
        return (<ItemComponent {...this.props} component={button} part={'panel'} key={item._id+'-'+button}
                    uim={{depth: uim.depth, shape: (uim.button===button && shape==='open') ? 'open' : 'truncated', toParent: this.toMeFromChild.bind(this,button)}} 
                    item={item} active={uim.button===button && shape==='open'} style={style} />);
    }

    var renderButton = (button)=>{
      return (<ItemComponent {...this.props} component={button} part={'button'}  active={uim.button===button} onClick={this.onClick.bind(this, button, item._id, item.id)} />);  
    }

    return (
        <article className={ClassNames("item", this.props.className, classShape)} ref="item" id={`item-${item._id}`} >
          <Accordion active={shape !== 'ooview'} text={true} >
            <ItemMedia className={classShape} onClick={this.readMore.bind(this)}
              item={item}
              ref="media"
            />
            <section className={ClassNames("item-text", classShape)} ref='itemText'>
              <section className={ClassNames("item-buttons", classShape)} ref='buttons'>
                <ItemStore item={item}>
                  { buttons ? buttons.map(button => renderButton(button)) : null }
                </ItemStore>
              </section>
              <Accordion className={ClassNames("item-truncatable", truncShape)} onClick={this.readMore.bind(this)} active={readMore} text={true} onComplete={this.textHint.bind(this)} ref='truncable' style={{ minHeight: this.state.minHeight }}>
                <h4 className={ClassNames("item-subject", truncShape)} ref='subject'>
                  { /*<Link href={ item.link } then={ this.selectItem.bind(this) }>{ item.subject }</Link> */}
                  {item.subject}
                </h4>
                <h5 className={ClassNames('item-reference', truncShape, { none: noReference })} ref='reference' >
                  <a href={referenceLink} onClick={this.openURL.bind(this)} ref="link" target="_blank" rel="nofollow"><span>{referenceTitle}</span></a>
                </h5>
                <div className={ClassNames('item-description', 'pre-text', (!readMore) ? (noReference ? 'vs-truncated4' : 'vs-truncated') : truncShape)} ref='description'>
                  {item.description}
                </div>
                <div className="item-tendency" style={{ display: 'none' }}>
                  {item && item.user && item.user.tendency ? '-' + <DynamicSelector property="tendency" valueOnly info={item.user} /> : ''}
                </div>
              </Accordion>
            </section>
            <div className={ClassNames('item-trunc-hint', { expand: this.state.hint }, classShape)}>
              <Icon icon="ellipsis-h" />
            </div>
          </Accordion>
          <section style={{ clear: 'both' }}>
          </section>
          <section className={ClassNames("item-footer", classShape)}>
            { buttons ? buttons.map(button => renderPanel(button)) : null }
          </section>
        </article>
    );
  }
}
