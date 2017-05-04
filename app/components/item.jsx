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

class UIMItem extends React.Component {

  state = { hint: false, minHeight: null }; //

  constructor(props) {
    super(props);
    //    console.info("UIMItem constructor");
    if (this.props.uim.toParent) this.props.uim.toParent({ type: 'SET_ACTION_TO_STATE', function: UIMItem.actionToState });
  }

  static actionToState(action, uim) { // this function is going to be called by the UIManager, uim is the current UIM state
    var nextUIM={};
    if (action.type === "TOGGLE_BUTTON") {
      let button=action.button;
      if (uim.button) { // the button is on
        if (button === uim.button) { // untoggle button
          if (button === 'Subtype') { // untoggle the subtype button and pop the path
            Object.assign(nextUIM, { button: null, shape: 'truncated', pathPart: [] });
          }else          
            Object.assign(nextUIM, { button: null, shape: 'truncated' });
        } else { // old button off, new button on, state still open
          if (button === 'Subtype') {
            Object.assign(nextUIM, { button: button, pathPart: ['Subtype', action.shortId] });
            // no shape change
          } else {
            Object.assign(nextUIM, { button: null });
            // no shape change
          }
        }
      } else { // the button is off, toggle it, open state
        if (button === 'Subtype') { // its that subtype button so add to path
          Object.assign(nextUIM, uim, { button: button, shape: 'open', pathPart: ['Subtype', action.shortId] });
        } else {
          Object.assign(nextUIM, uim, { button: button, shape: 'open' });
        }
      }
      return nextUIM;
    }else if(action.type ==="CHANGE_SHAPE"){
      Object.assign(nextUIM, uim);
      return nextUIM;
    } else return uim;
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
    if (!isEqual(this.props.buttons, newProps.buttons)) return true;
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
  onClick(button, itemId, shortId) {
    this.props.uim.toParent({ type: "TOGGLE_BUTTON", button, itemId, shortId })
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  textHint() {
    //called on mount and completion of Accordion collapse / expand
    //active when the accordion has completed open, not active when accordion has completed close. But that doesn't matter here. Parent is the master of the state.
    //console.info("textHint before", this.state, this.props.vs.state);
    if (!(this.refs.buttons && this.refs.media && this.refs.truncable)) return; // too early

    if (this.props.uim.shape === 'truncated') {
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
    if (this.props.uim.shape === 'truncated') {
      this.setState({ hint: false });  // turn off the hint at the beginning of the sequence
      if (this.props.uim.toParent) this.props.uim.toParent({ type: "CHANGE_SHAPE", shape: 'open' })
    } else {
      if (this.props.uim.toParent) this.props.uim.toParent({ type: "CHANGE_SHAPE", shape: 'truncated' })
    }
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
    const { item, user, buttons, uim, style } = this.props;
    const shape = uim ? uim.shape : '';
    const classShape = shape ? 'vs-' + shape : '';

    let noReference = true;

    console.info("UIMItem render", this.props);

    if (!item) { return (<div style={{ textAlign: "center" }}>Nothing available at this time.</div>); }

    let referenceLink, referenceTitle;

    if (item.references && item.references.length) {
      referenceLink = item.references[0].url;
      referenceTitle = item.references[0].title;
      noReference = false;
    }

    var renderButtons = buttons ? buttons.map(button => {
                        return (<ItemComponent component={button} part={'button'} {...this.props} active={uim.button===button} onClick={this.onClick.bind(this, button, item._id, item.id)} />);
                      })
                    : null;

    console.info("UIMItem.render rendered buttons");

    var renderPanels = buttons ? buttons.map(button => {
                return (<ItemComponent component={button} part={'panel'} {...this.props} item={item} active={uim.button===button} style={style} />);
              })
              : null;

    logger.info("UIMItem.render rendered buttons and panels");

    return (
      <Accordion active={shape !== 'collapsed'} name='item'>
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
              <Accordion className={ClassNames("item-truncatable", classShape)} onClick={this.readMore.bind(this)} active={shape === 'open'} text={true} onComplete={this.textHint.bind(this)} ref='truncable' style={{ minHeight: this.state.minHeight }}>
                <h4 className={ClassNames("item-subject", classShape)} ref='subject'>
                  { /*<Link href={ item.link } then={ this.selectItem.bind(this) }>{ item.subject }</Link> */}
                  {item.subject}
                </h4>
                <h5 className={ClassNames('item-reference', classShape, { none: noReference })} ref='reference' >
                  <a href={referenceLink} onClick={this.openURL.bind(this)} ref="link" target="_blank" rel="nofollow"><span>{referenceTitle}</span></a>
                </h5>
                <div className={ClassNames('item-description', 'pre-text', shape === 'truncated' ? (noReference ? 'vs-truncated4' : 'vs-truncated') : classShape)} ref='description'>
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
      </Accordion>
    );
  }
}
