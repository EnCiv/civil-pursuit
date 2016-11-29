'use strict';

import React from 'react';
import ItemMedia        from './item-media';
import Icon               from './util/icon';
import Accordion          from './util/accordion';
import ClassNames          from 'classnames';

class Item extends React.Component {

  state = { truncated: false,
            hint: true,
          };

truncateState=0;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  checkTruncate(item) {
    if ( ! this.state.truncated ) {
        let description   =   item.querySelector('.item-description');
        description.classList.add(this.props.item.references.length ? 'truncated' : 'truncated4');
        this.setState({truncated: true});
        this.trunced=true;
      } else {
        this.trunced=false;
      }
  }

  componentWillReceiveProps(newProps) {
    let truncateState=newProps.truncateState || 0;
    if(this.truncateState !== truncateState){
      this.truncateState = truncateState;
      if(this.state.truncated) {
       this.setState({truncated: true});
      }
    }
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  componentDidMount () {
    if ( this.refs.item ) {
      
      const item = this.refs.item;
      this.checkTruncate(item);

    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  textHint(active) {
    if(this.state.hint === active) { this.setState({ hint: !active } ); }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  readMore (e) {
    e.preventDefault();
    e.stopPropagation();
      let item = this.refs.item;
      if (this.state.truncated) {
        this.setState({truncated: false, hint: false});
        this.props.toggle(this.props.item._id, 'harmony');
      } else {
        this.props.toggle(this.props.item._id, 'harmony');
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
              <Accordion className="item-truncatable" onClick={ this.readMore.bind(this) } active={ ! this.state.truncated } textShadow= { true } onComplete={ this.textHint.bind(this) } >  
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
