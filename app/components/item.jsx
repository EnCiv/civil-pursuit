'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ItemMedia        from './item-media';
import Icon               from './util/icon';
import Accordion          from './util/accordion';
import ClassNames          from 'classnames';
import VisualState     from './visual-state';

//Item Visual State - lets other components change the visual state of an item. 
// For example 'collapsed' is a visual state.  But as we grow the use of Item we find that there are more visual states and we even want to change the visual state of an item based on it's depth.

class Item extends React.Component {
  render(){
    return (
    <VisualState {... this.props}>
      <VSItem />
    </VisualState>
    );
  }
}

class VSItem extends React.Component {  


  constructor(props){
    super(props);
    this.state.hint = (this.props.vs.state==='truncated');
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  transparentEventListener= {};
  transparent(e){
    e.preventDefault();
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  componentDidMount () {

    this.transparentEventListener=this.transparent.bind(this);
    var truncable=ReactDOM.findDOMNode(this.refs.truncable);
    truncable.addEventListener('mouseover', this.transparentEventListener, false);
    truncable.addEventListener('click', this.transparentEventListener, false);
  }

  componentWillUnmount(){
    var truncable=ReactDOM.findDOMNode(this.refs.truncable);
    truncable.removeEventListener('mouseover', this.transparentEventListener);
    truncable.removeEventListener('click', this.transparentEventListener);
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  textHint(active) {
    if(this.props.vs.state==='truncated' && this.state.hint === active) { this.setState({ hint: !active } ); }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  readMore (e) {
   e.preventDefault(); // stop the default event processing of a div which is to stopPropogation
   // e.stopPropagation(); // do not stop propogation so this event will propogate to the item-button
      let item = this.refs.item;
      if (this.props.vs.state==='truncated') {
        this.setState({hint: false});
        if(this.props.focusAction){this.props.focusAction(true)}
        if(this.props.vs.toParent){this.props.vs.toParent({state: 'open', distance: 0})}
        this.props.toggle(this.props.item._id, 'harmony');  // if open show harmony
      } else {
        this.props.toggle(this.props.item._id, 'harmony'); // if closed don't show harmony
        if(this.props.vs.toParent){this.props.vs.toParent({state: 'truncated', distance: 0})}
        if(this.props.focusAction){this.props.focusAction(false)}
      }
  }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  openURL (e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if(this.props.vs.state==='truncated') { return this.readMore(e); }

    let win = window.open(this.refs.reference.href, this.refs.reference.target);
    if (win) {
      //Browser has allowed it to be opened
      win.focus();
    } else {
      //Browser has blocked it
      alert('Please allow popups for this website');
    }
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { item, user, buttons, footer, vs } = this.props;
    const vState=vs.state;
    const cState='vs-'+vs.state;
    let noReference=true;

    if(!item) {return ({});}

    const tendencyChoice = null;

    if(typeof window !== 'undefined' ) {
        window.Synapp.tendencyChoice
    };

    let rendereditem = {};

    let referenceLink, referenceTitle;

    if ( item.references && item.references.length ) {
      referenceLink = item.references[0].url;
      referenceTitle = item.references[0].title;
      noReference=false;
    }

      rendereditem = (
        <Accordion active={vState!=='collapsed'} name='item'>
          <article className={ClassNames("item", this.props.className, cState )} ref="item" id={ `item-${item._id}` } >
            <ItemMedia className={ClassNames('item-media', cState)} onClick={ this.readMore.bind(this) }
              item      =   { item }
              ref       =   "media"
            />
            <section className={ClassNames("item-text", cState)} ref='itemText'>
              <section className={ClassNames("item-buttons", cState)}>
                { buttons }
              </section>
              <Accordion className={ClassNames("item-truncatable", cState)} onClick={ this.readMore.bind(this) } active={ vState==='open' } text={ true } onComplete={ this.textHint.bind(this) } ref='truncable' >  
                <h4 className={ClassNames("item-subject",cState)} >
                  { /*<Link href={ item.link } then={ this.selectItem.bind(this) }>{ item.subject }</Link> */ }
                  { item.subject }
                </h4>
                <h5 className={ClassNames('item-reference', cState, {none: noReference})} >
                  <a href={ referenceLink } onClick={ this.openURL.bind(this) } ref="reference" target="_blank" rel="nofollow"><span>{ referenceTitle }</span></a>
                </h5>
                <div className={ClassNames('item-description', 'pre-text', vState === 'truncated' ? (noReference ? 'vs-truncated4' : 'vs-truncated') : '')}>
                  { item.description }
                </div>
                <div className="item-tendency" style={{display: 'none'}}>
                    { tendencyChoice && item && item.user && item.user.tendency ? '-' + tendencyChoice[item.user.tendency]  :  '' }
                </div>
              </Accordion>
            </section>
            <div className={ClassNames('item-trunc-hint', {expand: this.state.hint})}>
                <Icon icon="ellipsis-h" />
            </div>
            <section style={ { clear : 'both' }}></section>
            <section style={{ marginRight : '0px' }}>
              { footer }
            </section>
          </article>
        </Accordion>
      );
    return (  rendereditem );
  }
}
