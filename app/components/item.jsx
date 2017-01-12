'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ItemMedia        from './item-media';
import Icon               from './util/icon';
import Accordion          from './util/accordion';
import ClassNames          from 'classnames';

class Item extends React.Component {


  constructor(props){
    super(props);
    this.state={truncated: false};
    this.state.hint = this.props.startUntruncated ? false : true;
  }

truncateState=0;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  checkTruncate(item) {
    if ( ! this.state.truncated || this.itemDidChange ) {
        let description   =   item.querySelector('.item-description');
        description.classList.add((this.props.item.references && this.props.item.references.length) ? 'truncated' : 'truncated4');
        if(! this.props.startUntruncated) this.setState({truncated: true});
        this.trunced=true;
      } else {
        this.trunced=false;
        this.setState({truncated: false});
      }
  }

  componentWillReceiveProps(newProps) {
    let truncateItems=newProps.truncateItems || 0;
    if(this.truncateItems !== truncateItems){
      this.truncateItems = truncateItems;
      if(this.trunced && !this.state.truncated & !this.props.startUntruncated) {
       this.setState({truncated: true});
      }
    }
    if(newProps.Item && this.props.item !== newProps.item) { /* the item has changed */
      this.itemDidChange=true;
    }
  }



  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  componentDidMount () {
    if ( this.refs.item ) {
      
      const item = this.refs.item;
      this.checkTruncate(item);

    }
    truncable=ReactDOM.findDOMNode(this.refs.truncable);
    truncable.addEventListener('mouseover', (e) => {e.preventDefault();}, false);
  }

  componentDidUpdate () {
    if(this.itemDidChange)
      if ( this.refs.item ) {
        const item = this.refs.item;
        let description   =   item.querySelector('.item-description');
        description.classList.remove('truncated','truncated4');
        this.checkTruncate(item);
    }
    this.itemDidChange= false;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  textHint(active) {
    if(this.state.truncated && this.state.hint === active) { this.setState({ hint: !active } ); }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  readMore (e) {
   e.preventDefault(); // stop the default event processing of a div which is to stopPropogation
   // e.stopPropagation(); // do not stop propogation so this event will propogate to the item-button
      let item = this.refs.item;
      if (this.state.truncated) {
        this.setState({truncated: false, hint: false});
        if(this.props.focusAction){this.props.focusAction(true)}
        this.props.toggle(this.props.item._id, 'harmony');
      } else {
        this.props.toggle(this.props.item._id, 'harmony');
        if(this.props.focusAction){this.props.focusAction(false)}
        this.setState({truncated: true});
      }
  }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  openURL (e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if(this.state.truncated) { return this.readMore(e); }

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
    const { item, user, buttons, footer, collapsed } = this.props;

    if(!item) {return ({});}

    const tendencyChoice = null;

    var itemClass = ClassNames("item", this.props.className);


    if(typeof window !== 'undefined' ) {
        window.Synapp.tendencyChoice
    };

    let rendereditem = {};

    let referenceLink, referenceTitle;

    if ( item.references && item.references.length ) {
      referenceLink = item.references[0].url;
      referenceTitle = item.references[0].title;
    }

      rendereditem = (
        <Accordion active={!collapsed} name='item'>
          <article className={itemClass} ref="item" id={ `item-${item._id}` } >
            <ItemMedia onClick={ this.readMore.bind(this) }
              item      =   { item }
              ref       =   "media"
            />
            <section className="item-buttons">
              { buttons }
            </section>
            <section className="item-text">
              <Accordion className="item-truncatable" onClick={ this.readMore.bind(this) } active={ ! this.state.truncated } text={ true } onComplete={ this.textHint.bind(this) } ref='truncable' >  
                <h4 className="item-subject">
                  { /*<Link href={ item.link } then={ this.selectItem.bind(this) }>{ item.subject }</Link> */ }
                  { item.subject }
                </h4>
                <h5 className={`item-reference ${this.state.truncated ? 'truncated' : ''}`} style={ item.references && item.references.length ? { display : 'block' } : { display : 'none' } } >
                  <a href={ referenceLink } onClick={ this.openURL.bind(this) } ref="reference" target="_blank" rel="nofollow"><span>{ referenceTitle }</span></a>
                </h5>
                <div className={`item-description pre-text ${this.state.truncated ? (this.lineLimit > 3 ? 'truncated4' : 'truncated') : ''} ` }>
                  { item.description }
                </div>
                <div className="item-tendency" style={{display: 'none'}}>
                     { tendencyChoice && item && item.user && item.user.tendency ? '-' + tendencyChoice[item.user.tendency]  :  '' }
                </div>
              </Accordion>
            </section>
            <div className={ `item-trunc-hint ${this.state.hint ? 'expand' : ''}`}>
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

export default Item;
