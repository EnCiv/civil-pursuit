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
    //    console.info("VSItem constructor");
    if (this.props.uim.toParent) this.props.uim.toParent({ type: 'SET_ACTION_TO_STATE', function: VSItem.actionToState });
  }

  static actionToState(action, uim) { // this function is going to be called by the UIManager, uim is the current UIM state
    var nextUIM;
    if (action.type == "TOGGLE_BUTTON") {
      if (action.button && uim.button) {
        if (action.button === uim.button) { // untoggle button, pop path
          Object.assign(nextUIM, { button: null, shape: 'truncated' });
        } else { // old button off, new button on, state still open
          if (button === 'Subtype') {
            VisualState.path.splice(uim.pathDepth, 2); // take off Subtype/itemId
            Object.assign(nextUIM, { button: null, pathPart: [] });
            // no shape change
          } else {
            Object.assign(nextUIM, { button: null });
            // no shape change
          }
        }
      } else { // toggle button on, open state
        if (button === 'Subtype') {
          Object.assign(nextUIM, uim, { button: button, shape: 'open', pathPart: ['Subtype', action.itemId] });
        } else {
          Object.assign(nextUIM, uim, { button: button, shape: 'open' });
        }
      }
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
    if (!isEqual(this.props.buttonState, newProps.buttonState)) return true;
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
  onClick(button, itemId) {
    this.props.uim.toParent({ type: "TOGGLE_BUTTON", button, itemId })
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
      if (this.props.vs.toParent) this.props.vs.toParent({ type: "CHANGE_SHAPE", shape: 'open' })
    } else {
      if (this.props.vs.toParent) this.props.vs.toParent({ type: "CHANGE_SHAPE", shape: 'truncated' })
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
    const { item, user, buttonState, uim } = this.props;
    const vState = uim ? uim.shape : '';
    const cState = vState ? 'vs-' + vState : '';

    let noReference = true;

    //   console.info("VSItem render");

    if (!item) { return (<div style={{ textAlign: "center" }}>Nothing available at this time.</div>); }

    let referenceLink, referenceTitle;

    if (item.references && item.references.length) {
      referenceLink = item.references[0].url;
      referenceTitle = item.references[0].title;
      noReference = false;
    }


    return (
      <Accordion active={vState !== 'collapsed'} name='item'>
        <article className={ClassNames("item", this.props.className, cState)} ref="item" id={`item-${item._id}`} >
          <Accordion active={vState !== 'ooview'} text={true} >
            <ItemMedia className={cState} onClick={this.readMore.bind(this)}
              item={item}
              ref="media"
            />
            <section className={ClassNames("item-text", cState)} ref='itemText'>
              <section className={ClassNames("item-buttons", cState)} ref='buttons'>
                <ItemStore item={item}>
                  {
                    Object.keys(buttonState).map(button => {
                      return (<ItemComponents component={button} part='button' {...this.props} item={item} active={buttonState[button]} style={{ backgroundColor: bgc }} uim={undefined} onClick={this.onClick.bind(this, button, item._id)} />);
                    })
                  }
                </ItemStore>
              </section>
              <Accordion className={ClassNames("item-truncatable", cState)} onClick={this.readMore.bind(this)} active={vState === 'open'} text={true} onComplete={this.textHint.bind(this)} ref='truncable' style={{ minHeight: this.state.minHeight }}>
                <h4 className={ClassNames("item-subject", cState)} ref='subject'>
                  { /*<Link href={ item.link } then={ this.selectItem.bind(this) }>{ item.subject }</Link> */}
                  {item.subject}
                </h4>
                <h5 className={ClassNames('item-reference', cState, { none: noReference })} ref='reference' >
                  <a href={referenceLink} onClick={this.openURL.bind(this)} ref="link" target="_blank" rel="nofollow"><span>{referenceTitle}</span></a>
                </h5>
                <div className={ClassNames('item-description', 'pre-text', vState === 'truncated' ? (noReference ? 'vs-truncated4' : 'vs-truncated') : cState)} ref='description'>
                  {item.description}
                </div>
                <div className="item-tendency" style={{ display: 'none' }}>
                  {item && item.user && item.user.tendency ? '-' + <DynamicSelector property="tendency" valueOnly info={item.user} /> : ''}
                </div>
              </Accordion>
            </section>
            <div className={ClassNames('item-trunc-hint', { expand: this.state.hint }, cState)}>
              <Icon icon="ellipsis-h" />
            </div>
          </Accordion>
          <section style={{ clear: 'both' }}>
          </section>
          <section className={ClassNames("item-footer", cState)}>
            {
              Object.keys(buttonState).map(button => {
                return (<ItemComponents component={button} part='panel' {...this.props} item={item} active={buttonState[button]} style={{ backgroundColor: bgc }} uim={undefined} />);
              })
            }
          </section>
        </article>
      </Accordion>
    );
  }
}
