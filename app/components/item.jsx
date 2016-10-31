'use strict';

import React from 'react';
import ItemMedia        from './item-media';
import Icon               from './util/icon';

class Item extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /**
   *  @description      Break a given text into lines, themselves into words
   *  @arg              {String} text
   *  @return           [[String]]
  */
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static wordify (text) {
    let lines = [];

    text.split(/\n/).forEach(line => lines.push(line.split(/\s+/)));

    lines = lines.map(line => {
      if ( line.length === 1 && ! line[0] ) {
        return [];
      }
      return line;
    });

    return lines;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /**
   *  @description      Put all words into spans, hidding the ones who are below limit
   *  @arg              {HTMLElement} container
   *  @arg              {Number} limit
   *  @return           null
  */
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static paint (container, limit, tag) {

    const lines           =   Item.wordify(container.textContent);
    container.innerHTML   =   '';

    const whiteSpace      =   () => {
      const span          =   document.createElement('span');

      span.appendChild(document.createTextNode(' '));

      return span;
    }

    lines.forEach(line => {
      const div = document.createElement(tag);

      container.appendChild(div);

      line.forEach(word => {
        const span = document.createElement('span');

        span.appendChild(document.createTextNode(word));

        span.classList.add('word');

        div.appendChild(span);

        div.appendChild(whiteSpace());

        const offset = span.offsetTop;

        if ( offset > limit ) {
          span.classList.add('hide');
        }
      });
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  componentDidMount () {
    if ( this.refs.item ) {
      
      const item = React
        .findDOMNode(this.refs.item);

      if ( ! this.truncated ) {
        const more = React.findDOMNode(this.refs.more);

        let media = item.querySelector('.item-media');
        let truncatable   =   item.querySelector('.item-truncatable');
        let truncHint   =   item.querySelector('.item-trunc-hint');


        // let subject       =   item.querySelector('.item-subject a');
        let subject       =   item.querySelector('.item-subject');
        let description   =   item.querySelector('.item-description');
        let reference     =   item.querySelector('.item-reference');
        let tendency      =   item.querySelector('.item-tendency');

        console.info("item.ComponentDidMount", description.style);

        this.lineLimit = 3;
        if(reference.offsetHeight == 0) { 
          this.lineLimit++;
        }

        let mediaHeight = media ? media.offsetHeight : subject.offsetHeight * (5 + 5/12); // media is 7em + 0.5 padding subject is 1.375em 

        if( description.offsetHeight > (mediaHeight - subject.offsetHeight - reference.offsetHeight) ) {
          description.classList.add(this.lineLimit > 3 ? 'truncated4' : 'truncated');
          truncHint.classList.add('expand');
          this.trunced=true;
          this.truncated = true;
        } else {
          this.truncated=false;
          this.trunced=false;
        }


        if ( this.props.new ) {
            this.setState({ showPromote: true });
          }
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 

  componentDidUpdate() {
    if ( this.refs.item ) {
      const item = React.findDOMNode(this.refs.item);
      let truncatable   =   React.findDOMNode(this.refs.truncatable);
      console.info("item.componenDidUpdate",this,item,truncatable);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  smoothOpen(target) {
    // set an interval to update scrollTop attribute every 25 ms

    let maxHeight = parseInt(target.style.maxHeight,10) || 0;
    let height= target.clientHeight;
    if (maxHeight < height) {
      target.style.maxHeight= height + 'px';
    }
    console.info("item.smoothOpen maxHeight", target.style.maxHeight, maxHeight);
    console.info("item.smoothOpen height", target.clientHeight);

    const timer = setInterval( () => {
      console.info("item.smoothOpen maxHeight", target.style.maxHeight);
      console.info("item.smoothOpen height", target.clientHeight);
      let lmaxHeight = parseInt(target.style.maxHeight,10) || 0;
      let lheight= target.clientHeight;
      console.info("item.smoothOpen2 maxHeight", lmaxHeight);
      console.info("item.smoothOpen2 height", lheight);
      if( lmaxHeight <= lheight ){
        target.style.maxHeight = (lmaxHeight + 7) + 'px';
      } else {
      // end interval if the scroll is completed
        clearInterval(timer);
        console.info("item.smoothOpen timer cleared");
      }
    }, 500);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  readMore (e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    if( this.trunced) {

      let item = React.findDOMNode(this.refs.item);
      let subject =  item.querySelector('.item-subject');
      let reference =  item.querySelector('.item-reference');
      let truncatable =  React.findDOMNode(this.refs.truncatable);
      let description =  item.querySelector('.item-description');
      let truncHint =  item.querySelector('.item-trunc-hint');

      console.info("item.readMore",this.props);

      if (this.truncated) {
        description.classList.remove(this.lineLimit > 3 ? 'truncated4' : 'truncated');
        truncHint.classList.remove('expand');
        subject.classList.add('expand');
        reference.classList.add('expand');
        this.truncated=false;
        this.props.toggle(this.props.item._id, 'harmony');
        console.info("item.readMore trunc", truncatable);
        this.smoothOpen(truncatable);
      } else {
        description.classList.add(this.lineLimit > 3 ? 'truncated4' : 'truncated');
        truncHint.classList.add('expand');
        subject.classList.remove('expand');
        reference.classList.remove('expand');
        this.truncated=true;
        this.props.toggle(this.props.item._id, 'harmony');
      }
    } else {
      this.props.toggle(this.props.item._id, 'harmony');
    }
  }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  openURL (e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    let win = window.open(this.refs.reference.props.href, this.refs.reference.props.target);
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

    if(typeof window !== 'undefined' ) {
        window.Synapp.tendencyChoice
    };

    let rendereditem = {};

    let referenceLink, referenceTitle;

    if ( item.references && item.references.length ) {
      referenceLink = item.references[0].url;
      referenceTitle = item.references[0].title;
    }

    if(collapsed==true) {
      rendereditem = (
        <article className="item" ref="item" id={ `item-${item._id}` }  style={{ display : 'none' }} >
          <ItemMedia
            item      =   { item }
            ref       =   "media"
            />

          <section className="item-buttons">
            { buttons }
          </section>

          <section className="item-text">
            <div className="item-truncatable" onClick={ this.readMore.bind(this) } ref="truncatable">
              <h4 className="item-subject">
                { /*<Link href={ item.link } then={ this.selectItem.bind(this) }>{ item.subject }</Link> */ }
                { item.subject }
              </h4>
              <h5 className="item-reference" style={ item.references && item.references.length ? { display : 'block' } : { display : 'none' } } >
                <a href={ referenceLink } onClick={ this.openURL.bind(this) } ref="reference" target="_blank" rel="nofollow"><span>{ referenceTitle }</span></a>
              </h5>
              <div className="item-description pre-text">
                { item.description }
                <div className="item-trunc-hint">
                  <Icon icon="ellipsis-h" />
                </div>
              </div>
              <div className="item-tendency" style={{display: 'none'}}>
                { tendencyChoice && item && item.user && item.user.tendency ? tendencyChoice[item.user.tendency]  :  '' }
              </div>
            </div>
          </section>

          <section style={ { clear : 'both' }}></section>

          <section style={{ marginRight : '0px' }}>
            { footer }
          </section>
        </article>
      );
    } else {
      rendereditem = (
        <article className="item" ref="item" id={ `item-${item._id}` }>
          <ItemMedia
            item      =   { item }
            ref       =   "media"
            />

          <section className="item-buttons">
            { buttons }
          </section>

          <section className="item-text">
            <div className="item-truncatable" onClick={ this.readMore.bind(this) } ref="truncatable">  
              <h4 className="item-subject">
                { /*<Link href={ item.link } then={ this.selectItem.bind(this) }>{ item.subject }</Link> */ }
                { item.subject }
              </h4>
              <h5 className="item-reference" style={ item.references && item.references.length ? { display : 'block' } : { display : 'none' } } >
                <a href={ referenceLink } onClick={ this.openURL.bind(this) } ref="reference" target="_blank" rel="nofollow"><span>{ referenceTitle }</span></a>
              </h5>
              <div className="item-description pre-text">
                { item.description }
                <div className="item-trunc-hint">
                  <Icon icon="ellipsis-h" />
                </div>
              </div>
              <div className="item-tendency" style={{display: 'none'}}>
                   { tendencyChoice && item && item.user && item.user.tendency ? '-' + tendencyChoice[item.user.tendency]  :  '' }
              </div>
            </div>
          </section>

          <section style={ { clear : 'both' }}></section>

          <section style={{ marginRight : '0px' }}>
            { footer }
          </section>
        </article>
      );
    }
    return (  rendereditem );
  }
}

export default Item;
