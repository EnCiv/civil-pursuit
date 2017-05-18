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
import UserInterfaceManager from './user-interface-manager';
import ItemStore from './store/item';
import ItemComponent from './item-component';

//Item Visual State - lets other components change the visual state of an item. 
// For example 'collapsed' is a visual state.  But as we grow the use of Item we find that there are more visual states and we even want to change the visual state of an item based on it's depth.

class Item extends React.Component {
  render() {
    //   console.info("Item render");
    return (
      <UserInterfaceManager {... this.props}>
        <UIMItem />
      </UserInterfaceManager>
    );
  }
}
export default Item;

class UserInterfaceManagerClient extends React.Component {

  constructor() {
    super();
    logger.info("UserInterfaceManagerClient.constructor", this.props);
    this.toChild = [];
    this.keyField = 'key'; // the default key field, can be overridden by children to make their code easier to read
    if (this.props.uim.toParent) {
      this.props.uim.toParent({ type: 'SET_ACTION_TO_STATE', function: this.actionToState.bind(this) });
      this.props.uim.toParent({ type: "SET_TO_CHILD", function: this.toMeFromParent.bind(this), name: "Items" })
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is a one to many pattern for the user interface manager,insert yourself between the UIM and each child
  // send all unhandled actions to the parent UIM
  //
  toMeFromChild(key, action) {
    logger.info(" UserInterfaceManagerClient.toMeFromChild", this.props.uim && this.props.uim.depth, key, action);
    if (action.type === "SET_TO_CHILD") { // child is passing up her func
      this.toChild[key] = action.function; // don't pass this to parent
      if (this.waitingOn) {
        if (this.waitingOn.action) {
          let actn = this.waitingOn.action; // don't overload action
          logger.info("UserInterfaceManagerClient.toMeFromChild got waitingOn action", actn);
          this.waitingOn = null;
          setTimeout(() => this.toChild[key](actn), 0);
        } else if (this.waitingOn.nextUIM) {
          let nextUIM = this.waitingOn.nextUIM;
          if (key === nextUIM[this.keyField] && this.toChild[key]) {
            logger.info("UserInterfaceManagerClient.toMeFromParent got waitingOn nextUIM", nextUIM);
            this.waitingOn = null;
            setTimeout(() => this.props.uim.toParent({ type: "SET_STATE_AND_CONTINUE", nextUIM: nextUIM, function: this.toChild[key] }), 0);
          }
        }
      } else if (this.props.uim && this.props.uim.toParent) {
        action[this.keyField] = button; // actionToState may need to know the child's id
        return (this.props.uim.toParent(action));
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // this is a one to many pattern for the user Interface Manager, handle each action  appropriatly
  //
  toMeFromParent(action) {
    logger.info("UserInterfaceManagerClient.toMeFromParent", this.props.uim && this.props.uim.depth, action);
    if (action.type === "ONPOPSTATE") {
      var { shape } = action.event.state.stateStack[this.props.uim.depth - 1];  // the button was passed to the parent UIManager by actionToState
      var key = action.event.state.stateStack[this.props.uim.depth - 1][this.keyField];
      if ((action.event.state.stateStack.length > (this.props.uim.depth))) {
        let sent = false;
        Object.keys(this.toChild).forEach(child => { // only child panels with UIM managers will have entries in this list. 
          if (child === key) { sent = true; this.toChild[child](action); }
          else this.toChild[child]({ type: "CHANGE_SHAPE", shape: shape === 'open' ? 'truncated' : shape }); // only one button panel is open, any others are truncated (but inactive)
        });
        if (key && !sent) logger.error("UserInterfaceManagerClient.toMeFromParent ONPOPSTATE more state but child not found", { depth: this.props.uim.depth }, { action });
      }
      return null;// this was the end of the line
    } else if (action.type === "GET_STATE") {
      key = this.props.uim[this.keyField] || null;
      if (key && this.toChild[key]) return this.toChild[key](action); // pass the action to the child
      else return null; // end of the line
    } else if (action.type === "CLEAR_PATH") {  // clear the path and reset the UIM state back to what the const
      Object.keys(this.toChild).forEach(child => { // send the action to every child
        this.toChild[child](action)
      });
    } else if (action.type === "SET_PATH") {
      const { nextUIM, setBeforeWait } = this.setPath(action);
      if (nextUIM[this.keyField]) {
        let key = nextUIM[keyField];
        if (this.toChild[key]) this.props.uim.toParent({ type: 'SET_STATE_AND_CONTINUE', nextUIM: nextUIM, function: this.toChild[key] }); // note: toChild of button might be undefined becasue ItemStore hasn't loaded it yet
        else if (setBeforeWait) {
          this.props.uim.toParent({
            type: 'SET_STATE_AND_CONTINUE', nextUIM: nextUIM, function: (action) => {
              if (this.toChild[this.props.uim[this.keyField]]) this.toChild[this.props.uim[this.keyField]](action)
              else this.waitingOn = action;
            }
          });
        } else {
          logger.info("UserInterfaceManagerClient.toMeFromParent SET_PATH waitingOn", nextUIM);
          this.waitingOn = nextUIM;
        }
      } else {
        this.props.uim.toParent({ type: 'SET_STATE_AND_CONTINUE', nextUIM: nextUIM, function: null });
      }
    } else logger.error("UserInterfaceManagerClient.toMeFromParent action type unknown not handled", action)
  }
}


class UIMItem extends UserInterfaceManagerClient {

  state = { hint: false, minHeight: null }; //
  constructor(){
    super();
    logger.info("UIMItem.constructor", this.props)
    this.keyField='button';
  }

  setPath(action){  //UIM is setting the initial path. Take your pathPart and calculate the UIMState for it.  Also say if you should set the state before waiting the child or after waiting
    let nextUIM={shape: 'truncated', pathPart: [action.part]};
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

  actionToState(action, uim) { // this function is going to be called by the UIManager, uim is the current UIM state
    logger.info("UIMItem.actionToState",{action},{uim}); // uim is a pointer to the current state, make a copy of it so that the message shows this state and not the state it is later when you look at it
    var nextUIM={};
    var delta={};
    if (action.type === "TOGGLE_BUTTON") {
      delta.button= uim.button === action.button ? null : action.button; // toggle the button 
      delta.shape= delta.button || uim.readMore ? 'open' : 'truncated';  // open if button or readMore is active, otherwise truncated. (if collapsed this should be irrelevant)
      var parts=[];
      if(uim.readMore)parts.push('r');
      if(delta.button)parts.push(delta.button[0]); // must ensure no collision of first character of item-component names
      delta.pathPart=[parts.join(',')];
      Object.assign(nextUIM, uim, delta);
      return nextUIM;
    } else  if (action.type === "TOGGLE_READMORE") {
      delta.readMore = !uim.readMore; // toggle condition;
      delta.shape= uim.button || delta.readMore ? 'open' : 'truncated';  // open if button or readMore is active, otherwise truncated. (if collapsed this should be irrelevant)
      var parts=[];
      if(delta.readMore)parts.push('r');
      if(uim.button)parts.push(uim.button[0]); // must ensure no collision of first character of item-component names
      delta.pathPart=[parts.join(',')];
      Object.assign(nextUIM, uim, delta);
      return nextUIM;
    } else return null;  // if you don't handle the type, let the default handlers prevail
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
    //   console.info("item shouldn't update");
    return false;
  }
  /***/

  componentWillReceiveProps(newProps) {
    this.textHint();
    setTimeout(this.textHint.bind(this), 500); // this sucks but double check the hint in 500Ms in case the environment has hanged - like you are within a double wide that's collapsing
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

    console.info("UIMItem render", this.props.uim.depth, this.props);

    if (!item) { return (<div style={{ textAlign: "center" }}>Nothing available at this time.</div>); }

    let referenceLink, referenceTitle;

    if (item.references && item.references.length) {
      referenceLink = item.references[0].url;
      referenceTitle = item.references[0].title;
      noReference = false;
    }
    var renderButtons=null, renderPanels=null;

    if(shape!=='collapsed'){ // render the buttons if this item is visible
      renderButtons = buttons ? buttons.map(button => {
                          return (<ItemComponent {...this.props} component={button} part={'button'}  active={uim.button===button} onClick={this.onClick.bind(this, button, item._id, item.id)} />);
                        })
                      : null;

      renderPanels = buttons ? buttons.map(button => {
                  return (<ItemComponent {...this.props} component={button} part={'panel'} 
                  uim={{depth: uim.depth, shape: (uim.button===button && shape==='open') ? 'open' : 'truncated', toParent: this.toMeFromChild.bind(this,button)}} 
                  item={item} active={uim.button===button && shape==='open'} style={style} />);
                })
                : null;
    }

    logger.info("UIMItem.render rendered buttons and panels");

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
                  { renderButtons }
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
            { renderPanels }
          </section>
        </article>
    );
  }
}
