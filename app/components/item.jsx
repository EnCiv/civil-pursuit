'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ItemMedia from './item-media';
import Icon from './util/icon';
import Accordion          from 'react-proactive-accordion';
import ClassNames from 'classnames';
import isEqual from 'lodash/isEqual';
import has from 'lodash/has';
import DynamicSelector from './dynamic-selector';
import ReactActionStatePath from "react-action-state-path";
import { ReactActionStatePathClient } from 'react-action-state-path';
import ItemStore from './store/item';
import ItemComponent from './item-component';

//Item 
// Render the Item with buttons and subpanels. This item starts out truncated, if the user clicks the text, the item opens.
// When the text is truncated, a hint is shown
// If the user clicks on a button, the corresponding sub panel expands
//

class Item extends React.Component {
  render() {
    logger.trace("Item render");
    return (
      <ReactActionStatePath {... this.props} >
        <RASPItem />
      </ReactActionStatePath>
    );
  }
}
export default Item;


class RASPItem extends ReactActionStatePathClient {
  state = { hint: false, minHeight: null}; //
  constructor(props) {
    //var raspProps = { rasp: props.rasp };
    super(props, 'button');
    if (props.item && props.item.subject) { this.title = props.item.subject; this.props.rasp.toParent({ type: "SET_TITLE", title: this.title }); }
    let visMeth=this.props.visualMethod || this.props.item && this.props.item.type && this.props.item.type.visualMethod || 'default';
    if(!(this.vM= this.visualMethods[visMeth])) {
      console.error("RASPItem.constructor visualMethod unknown:",visMeth)
      this.vM=this.visualMethods['default'];
    }
    console.info("RASPItem.constructor");
  }

  someButton(part){
    var button=null;
    this.props.buttons.some(b => {
            if(typeof b === 'string') {
              if (b[0] === part) { button = b; return true }
            } else if(typeof b === 'object') {
              if (b.component && b.component[0] === part) { button = b.component; return true } 
            } else return false; 
          })
    return button;
  }

  visualMethods={
    default: {
      // whether or not to show this component
      active: (rasp)=>{
        return (rasp.shape !== 'collapsed');
      },
      // whether or not to show a child
      childActive: (rasp,button)=>{
        return (rasp.button === button)
      },
      // the shape to give a child, when it is initially mounted
      childShape: (rasp, button)=>{
        switch(rasp.shape){
          case 'title':
            if(rasp.button === button) return 'open';
            else return 'truncated';
          case 'open':
            if(rasp.button === button) return 'open'
            else return 'truncated';
          case 'truncated':
            return 'truncated';
          default:
            return rasp.shape;
        }
      },
      childVisualMethod: ()=>undefined,
      // process actions for this visualMethod
      enableHint: ()=>true,
      actionToState: (action, rasp, source, initialRASP, delta)=>{
        if(action.type==="CHILD_SHAPE_CHANGED"){
          if(action.distance>1){
            delta.readMore = false; // if the user is working on stuff further below, close the readmore
            // don't change the shape.
          } else if(action.distance===1 && action.shape==='truncated'){
            // child changed to truncated
            delta.shape='truncated'; 
            delta.button=null; 
            delta.readMore=false;
          }
        } else
          return false;
        return true;
      },
      // derive shape and pathSegment from the other parts of the RASP
      deriveRASP: (rasp, initialRASP)=>{
        if(rasp.button || rasp.readMore){
          rasp.shape= 'open'
        } else 
          rasp.shape='truncated';
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
      active: (rasp)=>{
        return (rasp.shape !== 'collapsed');
      },
      // whether or not to show a child
      childActive: (rasp,button)=>{
        return (rasp.button === button)
      },
      // the shape to give a child, when it is initially mounted
      childShape: (rasp, button)=>{
        switch(rasp.shape){
          case 'title':
            if(rasp.button === button) return 'open';
            else return 'truncated';
          case 'open':
            if(rasp.button === button) return 'open'
            else return 'truncated';
          case 'truncated':
            return 'truncated';
          default:
            return rasp.shape;
        }
      },
      childVisualMethod: ()=>'ooview',
      // process actions for this visualMethod
      enableHint: ()=>{
        return (!this.props.rasp.decendantFocus)
      },
      actionToState: (action, rasp, source, initialRASP, delta)=>{
        if(action.type==="CHILD_SHAPE_CHANGED"){
          if(action.distance>1){
            delta.readMore = false; // if the user is working on stuff further below, close the readmore
            // don't change the shape.
          } else if(action.distance===1 && action.shape==='truncated'){
            // child changed to truncated
            delta.shape='truncated'; 
            delta.button=null; 
            delta.readMore=false;
          }
        } else if (action.type==="DECENDANT_FOCUS") {
          if(action.distance>1)
            delta.decendantFocus=true;
        } else if (action.type==="DECENDANT_UNFOCUS") {
            if(action.distance===1 && rasp.decendantFocus) {
                delta.decendantFocus=false;
                delta.button=null;
                delta.readMore=false;
            }
        } else
          return false;
        return true; 
      },
      // derive shape and pathSegment from the other parts of the RASP
      deriveRASP: (rasp, initialRASP)=>{
        if(rasp.button || rasp.readMore){
          rasp.shape=rasp.decendantFocus ? 'title' : 'open'
        } else 
          rasp.shape='truncated';
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
      active: (rasp)=>{
        return (rasp.shape !== 'collapsed');
      },
      // whether or not to show a child
      childActive: (rasp,button)=>{
        return (rasp.button === button)
      },
      // the shape to give a child, when it is initially mounted
      childShape: (rasp, button)=>{
        switch(rasp.shape){
          case 'title':
            if(rasp.button === button) return 'open';
            else return 'truncated';
          case 'open':
            if(rasp.button === button) return 'open'
            else return 'truncated';
          case 'truncated':
            return 'truncated';
          default:
            return rasp.shape;
        }
      },
      childVisualMethod: ()=>'titleize',
      enableHint: ()=>{
        return (!this.props.rasp.decendantFocus && this.props.rasp.untitleize)
      },
      // process actions for this visualMethod
      actionToState: (action, rasp, source, initialRASP, delta)=>{
        if (action.type==="DECENDANT_FOCUS") {
          if(action.distance>1)
            delta.decendantFocus=true;
        } else if (action.type==="DECENDANT_UNFOCUS") {
            if(action.distance===1 && rasp.decendantFocus) {
                delta.decendantFocus=false;
                delta.button=null;
                delta.readMore=false;
            }
        } else if (action.type==="VM_TITLEIZE_ITEM_TITLEIZE"){
          delta.untitleize=false;
          action.toBeContinuted=true;  // supress messages on shape change
        } else if (action.type==="VM_TITLEIZE_ITEM_UNTITLEIZE"){
          delta.untitleize=true;
          action.toBeContinuted=true;  // supress messages on shape change
        } else
          return false;
        return true; 
      },
      // derive shape and pathSegment from the other parts of the RASP
      deriveRASP: (rasp, initialRASP)=>{
        if(rasp.button || rasp.readMore){
          rasp.shape=rasp.decendantFocus ? (rasp.untitleize? 'truncated': 'title') : 'open'
        } else 
          rasp.shape=  rasp.untitleize ? 'truncated' : 'title';
        // calculate the pathSegment and return the new state
        let parts = [];
        if (rasp.readMore) parts.push('r');
        if (rasp.button) parts.push(rasp.button[0]); // must ensure no collision of first character of item-component names
        if (rasp.decendantFocus) parts.push('d');
        rasp.pathSegment = parts.join(',');
      }
    }
  }

  segmentToState(action,initialRASP) {  //RASP is setting the initial path. Take your pathSegment and calculate the RASPState for it.  Also say if you should set the state before waiting the child or after waiting
    var nextRASP = {};
    let parts = action.segment.split(',');
    let button = null;
    let matched = 0;
    parts.forEach(part => {
      if (part === 'r') {
        nextRASP.readMore = true;
        matched += 1;
      } else if (part==='d'){
        nextRASP.decendantFocus = true;
        matched +=1;
      } else if (button=this.someButton(part)) {
        nextRASP.button = button;
        matched += 1;
      }
    });
    if (!matched || matched < parts.length) logger.error("RASPItem SET_PATH didn't match all pathSegments", { matched }, { parts }, { action });
    this.vM.deriveRASP(nextRASP,initialRASP);
    return { nextRASP, setBeforeWait: true };  //setBeforeWait means set the new state and then wait for the key child to appear, otherwise wait for the key child to appear and then set the new state.
  }

  actionToState(action, rasp, source = 'CHILD', initialRASP) { // this function is going to be called by the RASP manager, rasp is the current RASP state
    logger.trace("RASPItem.actionToState", { action }, { rasp }); // rasp is a pointer to the current state, make a copy of it so that the message shows this state and not the state it is later when you look at it
    var nextRASP = {};
    let delta = {};
    if (action.type === "SET_BUTTON") {
      delta.button = action.button;
      delta.readMore = false; // if turning off a button, close readMore too
    } else if (action.type === "RESET_BUTTON") {
      if(rasp.button === action.button) delta.button=null;
    }else if (action.type === "TOGGLE_BUTTON") {
      delta.button = rasp.button === action.button ? null : action.button; // toggle the button 
      if (action.button && !delta.button) delta.readMore = false; // if turning off a button, close readMore too
      else delta.readMore = rasp.readMore;
      this.qaction(()=>this.props.rasp.toParent({type: delta.button ? "DECENDANT_FOCUS" : "DECENDANT_UNFOCUS" }),0); // user focus is on me
    } else if (action.type === "TOGGLE_READMORE") {
      if(!this.state.hint && !rasp.readMore && rasp.button==='Harmony') { // hint is not showing, readMore is not showing, and Harmony is showing. 
          rasp.button=null;
      } else {
        delta.readMore = !rasp.readMore; // toggle condition;
        if (delta.readMore && !rasp.button && this.props.item.harmony && this.props.item.harmony.types && this.props.item.harmony.types.length) delta.button = 'Harmony';  // open harmony when opening readMore
        else if (!delta.readMore && rasp.button === 'Harmony') delta.button = null;  // turn harmony off when closing readMore
        else delta.button = rasp.button; // othewise keep button the same
      }
      this.qaction(()=>this.props.rasp.toParent({type: delta.readMore ? "DECENDANT_FOCUS" : "DECENDANT_UNFOCUS" }),0); // user focus is on me
    } else if (action.type === "ITEM_DELVE") {
      delta.readMore = true;
      if(this.props.item.subType) delta.button=this.someButton('S');
    } else if (action.type === "FINISH_PROMOTE") {
      if (action.winner && action.winner._id === this.props.item._id) { // if we have a winner, and it's this item
        delta.readMore = true; 
        if(this.props.item.subType) delta.button=this.someButton('S');
      } else if (action.winner) { // we have a winner but it's some other item
        delta.readMore = false;
        delta.button = null;
        this.qaction(() => this.props.rasp.toParent({ type: "OPEN_ITEM", item: action.winner, distance: -1 }));
      } else { // there wasn't a winner but we finish the promote
        delta.readMore = 'false';
        delta.button = null;
      }
    } else if (action.type === "CHANGE_SHAPE") {
      delta.shape=action.shape;
      if (action.shape === 'open') {
        delta.readMore = true;
        if (this.props.item.harmony && this.props.item.harmony.types && this.props.item.harmony.types.length) delta.button = 'Harmony';  // open harmony when opening readMore
      } 
    } else if (this.vM.actionToState(action, rasp, source, initialRASP, delta)) {
        ; // do nothing - it's already been done
    }else 
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
    if (!isEqual(this.props.rasp, newProps.rasp)) return true;
    //if (!isEqual(this.props.buttons, newProps.buttons)) return true;  the buttons don't change
    if (this.state.hint !== newState.hint) return true;
    if (this.state.minHeight !== newState.minHeight) return true;
    if (this.props.item && newProps.item) {
      if (this.props.item.subject !== newProps.item.subject) return true;
      if (this.props.item.description !== newProps.item.description) return true;
    }
    logger.trace("Item.shouldComponentUpdate", this.props.rasp.depth, this.title, "no", this.props, newProps, this.state, newState);
    return false;
  }
  /***/

  componentWillReceiveProps(newProps) {
    this.textHint();
    setTimeout(this.textHint.bind(this), 500); // this sucks but double check the hint in 500Ms in case the environment has hanged - like you are within a double wide that's collapsing
    if (newProps.item && newProps.item.subject && newProps.item.subject !== this.title) { this.title = newProps.item.subject; this.props.rasp.toParent({ type: "SET_TITLE", title: this.title }); }
    let visMeth=newProps.visualMethod || newProps.item && newProps.item.type && newProps.item.type.visualMethod || 'default';
    if(!(this.vM= this.visualMethods[visMeth])) {
      console.error("RASPItem.componentWillReceiveProps visualMethod unknown:", visMeth)
      this.vM=this.visualMethods['default'];
    }
  }


  // when the user clicks on an item's button
  onClick(button) {
    this.props.rasp.toParent({ type: "TOGGLE_BUTTON", button })
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  textHint() {
    //called on mount and completion of Accordion collapse / expand
    //active when the accordion has completed open, not active when accordion has completed close. But that doesn't matter here. Parent is the master of the state.
    //console.info("textHint before", this.state, this.props.vs.state);
    if (!(this.refs.buttons && this.refs.media && this.refs.truncable)) return; // too early

    if (!(this.props.rasp && this.props.rasp.readMore) && this.vM.enableHint()) {
      let truncable = ReactDOM.findDOMNode(this.refs.truncable);
      let innerChildR = truncable.children[0].getBoundingClientRect(); // first child of according is a div which wraps around the innards and is not constrained by min/max height
      let truncableR = truncable.getBoundingClientRect();

      if(Math.round(innerChildR.bottom) > Math.ceil(truncableR.bottom)) { // the innards are bigger than the trunkable agrea, so truncate them 
        this.setState({hint: true});
      } else {
        var nextState={};
        if(this.state.hint) nextState.hint=false;
        if(this.props.min && !this.props.position) { // do we need put in a smaller minHeight because there is not enough to fill the minimum

          let buttonsR = this.refs.buttons.getBoundingClientRect();
          let mediaR = ReactDOM.findDOMNode(this.refs.media).getBoundingClientRect();
          let bottomLine = Math.max(buttonsR.bottom, mediaR.bottom, innerChildR.bottom);

          let minHeight=Math.ceil(innerChildR.top - bottomLine);

          if(this.state.minHeight !== minHeight) nextState.minHeight=minHeight;
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
    if (this.props.rasp.readMore) { // if readMore is on and we are going to turn it off
      this.setState({ hint: false });  // turn off the hint at the beginning of the sequence
    }
    if (this.props.rasp.toParent) this.props.rasp.toParent({ type: "TOGGLE_READMORE" })
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  openURL(e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (!this.props.rasp.readMore) { return this.readMore(e); }

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
    const { item, user, buttons, rasp, style } = this.props;
    const shape = rasp ? rasp.shape : '';
    const classShape = shape ? 'vs-' + shape : '';
    const readMore = (rasp && rasp.readMore);
    const truncShape = shape !== 'collapsed' && readMore ? 'vs-open' : 'vs-'+shape;
    let noReference = true;

    console.info("RASPItem render", this.props.rasp.depth, this.title, this.props);

    if (!item) { return (<div style={{ textAlign: "center" }}>Nothing available at this time.</div>); }

    let referenceLink, referenceTitle;

    if (item.references && item.references.length) {
      referenceLink = item.references[0].url;
      referenceTitle = item.references[0].title;
      noReference = false;
    }

    // a button could be a string, or it could be an object which must have a property component
    var renderPanel = (button) => {
      if(typeof button==='string')
        return (<ItemComponent {...this.props} component={button} part={'panel'} key={item._id + '-' + button}
          rasp={this.childRASP(this.vM.childShape(rasp,button),button)}
          visualMethod={this.vM.childVisualMethod()}
          item={item} active={this.vM.childActive(rasp, button)} style={style} />);
      else if (typeof button==='object')
        return (<ItemComponent {...this.props}  part={'panel'} key={item._id + '-' + button.component}
          rasp={this.childRASP(this.vM.childShape(rasp,button),button)}
          visualMethod={this.vM.childVisualMethod()}
          item={item} active={this.vM.childActive(rasp, button.component)} style={style} {...button} />);
    }

    // a button could be a string, or it could be an object which must have a property component
    var renderButton = (button) => {
      if(typeof button === 'string')
        return ( <ItemComponent {...this.props} 
                         component={button} part={'button'} active={this.vM.childActive(rasp, button)} 
                         rasp={rasp} visualMethod={this.vM.childVisualMethod()}
                         onClick={this.onClick.bind(this, button, item._id, item.id)} key={item._id + '-' + button} 
          />);
      else if (typeof button === 'object')
        return ( <ItemComponent {...this.props} {...button}
                         part={'button'} active={this.vM.childActive(rasp, button.component)} 
                         rasp={rasp} visualMethod={this.vM.childVisualMethod()}
                         onClick={this.onClick.bind(this, button.component, item._id, item.id)} key={item._id + '-' + button.component}
        />);
    }

    return (
      <article className={ClassNames("item", this.props.className, classShape)} ref="item" id={`item-${item._id}`} >
        <Accordion active={this.vM.active(rasp)} text={true} >
          <ItemMedia className={classShape} onClick={this.readMore.bind(this)}
            item={item}
            ref="media"
          />
          <section className={ClassNames("item-text", classShape)} ref='itemText'>
            <section className={ClassNames("item-buttons", classShape)} ref='buttons'>
              <ItemStore item={item}>
                {buttons ? buttons.map(button => renderButton(button)) : null}
              </ItemStore>
            </section>
            <Accordion className={ClassNames("item-truncatable", truncShape)} onClick={this.readMore.bind(this)} active={readMore} text={true} onComplete={this.textHint.bind(this)} ref='truncable' style={{ minHeight: this.props.rasp.readMore || !this.state.minHeight ? null : this.state.minHeight+'px' }}>
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
          {buttons ? buttons.map(button => renderPanel(button)) : null}
        </section>
      </article>
    );
  }
}
