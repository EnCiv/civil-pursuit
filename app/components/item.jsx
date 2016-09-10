'use strict';

import React from 'react';
import ItemMedia        from './item-media';

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
      let media;

      const image = React
        .findDOMNode(this.refs.media)
        .querySelector('img');

      const video = React
        .findDOMNode(this.refs.media)
        .querySelector('iframe');

      if ( video ) {
        media = React
         .findDOMNode(this.refs.media)
         .querySelector('.video-container');
      }
      else if (image) {
        media = image;
      }

      const item = React
        .findDOMNode(this.refs.item);

      if ( ! this.truncated ) {
        const more = React.findDOMNode(this.refs.more);

        let truncatable   =   item.querySelector('.item-truncatable');
        // let subject       =   item.querySelector('.item-subject a');
        let subject       =   item.querySelector('.item-subject');
        let description   =   item.querySelector('.item-description');
        let reference     =   item.querySelector('.item-reference a');
        let buttons       =   item.querySelector('.item-buttons');
        let tendency      =   item.querySelector('.item-tendency');

        console.info("item.ComponentDidMount", truncatable.style, truncatable.style.minHeight);

        let onLoad = () => {

          let limit = truncatable.offsetTop + truncatable.style.minHeight;

          Item.paint(subject, limit,'div');
          Item.paint(description, limit,'div');
          Item.paint(reference, limit,'span');

          Item.paint(tendency, limit,'span');

          if ( ! item.querySelector('.word.hide') ) {
            more.style.display = 'none';
          }

          if ( this.props.new ) {
            this.setState({ showPromote: true });
          }
        };

        if ( image ) {
          if ( image.complete && image.naturalWidth ) {
            onLoad();
          }

          else {
            image.addEventListener('load', onLoad);
          }
        }
        else {
          onLoad();
          // video.addEventListener('load', onLoad);
        }

        this.truncated = true;
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  readMore (e) {
    e.preventDefault();

    let item = React.findDOMNode(this.refs.item);

    let truncatable =  item.querySelector('.item-truncatable');

    let tendency    =  item.querySelector('.item-tendency');

    truncatable.classList.toggle('expand');

    this.expanded = ! this.expanded;

    let text = React.findDOMNode(this.refs.readMoreText);

    if ( this.expanded ) {
      text.innerText = 'less';
      tendency.style.display='block';
    }
    else {
      text.innerText = 'more';
      tendency.style.display='none';
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
            <div className="item-truncatable" onClick={ this.readMore.bind(this) }>
              <h4 className="item-subject">
                { /*<Link href={ item.link } then={ this.selectItem.bind(this) }>{ item.subject }</Link> */ }
                { item.subject }
              </h4>
              <h5 className="item-reference" style={ item.references && item.references.length ? { display : 'inline' } : { display : 'none' } } >
                <a href={ referenceLink } onClick={ this.openURL.bind(this) } ref="reference" target="_blank" rel="nofollow"><span>{ referenceTitle }</span></a>
              </h5>
              <div className="item-description pre-text">{ item.description }</div>
              <div className="item-tendency" style={{display: 'none'}}>
                { tendencyChoice && item && item.user && item.user.tendency ? tendencyChoice[item.user.tendency]  :  '' }
              </div>
              <div className="item-read-more" ref="more">
                <a href="#" onClick={ this.readMore.bind(this) }>Read <span ref="readMoreText">more</span></a>
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
            <div className="item-truncatable" onClick={ this.readMore.bind(this) }>  
              <h4 className="item-subject">
                { /*<Link href={ item.link } then={ this.selectItem.bind(this) }>{ item.subject }</Link> */ }
                { item.subject }
              </h4>
              <h5 className="item-reference" style={ item.references && item.references.length ? { display : 'inline' } : { display : 'none' } } >
                <a href={ referenceLink } onClick={ this.openURL.bind(this) } ref="reference" target="_blank" rel="nofollow"><span>{ referenceTitle }</span></a>
              </h5>
              <div className="item-description pre-text">{ item.description }</div>
              <div className="item-tendency" style={{display: 'none'}}>
                   { tendencyChoice && item && item.user && item.user.tendency ? '-' + tendencyChoice[item.user.tendency]  :  '' }
              </div>
              <div className="item-read-more" ref="more">
                <a href="#" onClick={ this.readMore.bind(this) }>Read <span ref="readMoreText">more</span></a>
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
