'use strict';

import React from 'react';
import ItemMedia        from './item-media';
import Icon               from './util/icon';
import Accordion          from './util/accordion';

class Item extends React.Component {

  state = { truncated: false};
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

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  checkTruncate(item) {
    if ( ! this.state.truncated ) {
//      const more = this.refs.more;

 //     let media = item.querySelector('.item-media');
 //     let truncatable   =   item.querySelector('.item-truncatable');
 //     let truncHint   =   item.querySelector('.item-trunc-hint');


      // let subject       =   item.querySelector('.item-subject a');
//      let subject       =   item.querySelector('.item-subject');
        let description   =   item.querySelector('.item-description');
//      let reference     =   item.querySelector('.item-reference');
 //     let tendency      =   item.querySelector('.item-tendency');

 //     console.info("item.checkTruncate", description.style);

 //     this.lineLimit = 3;
 //     if(reference.offsetHeight == 0) { 
 //       this.lineLimit++;
 //     }

 //     let mediaHeight = media ? media.offsetHeight : subject.offsetHeight * (5 + 5/12); // media is 7em + 0.5 padding subject is 1.375em 

 //     console.info("item.checkTruncate", description.offsetHeight, mediaHeight, subject.offsetHeight, reference.offsetHeight);

 //     if( description.offsetHeight > (mediaHeight - subject.offsetHeight - reference.offsetHeight) ) {

        description.classList.add(this.props.item.references.length ? 'truncated' : 'truncated4');
        this.setState({truncated: true});
        this.trunced=true;
      } else {
        this.trunced=false;
      }
  //  }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  componentDidMount () {
    if ( this.refs.item ) {
      
      const item = this.refs.item;
      this.checkTruncate(item);

      if ( this.props.new ) {
        this.setState({ showPromote: true });
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 

  componentDidUpdate() {
    if ( this.refs.item ) {
      const item = this.refs.item;
      console.info("item.componenDidUpdate",this,item);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  smoothOpen(target, item, shadow) {
    // set an interval to update scrollTop attribute every 25 ms

    let timerMax=1000;

    let maxHeight = parseInt(target.style.maxHeight,10) || 0;
    let height= target.clientHeight;
    if (maxHeight < height) {
      target.style.maxHeight= height + 'px';
    }

    shadow.style.width = item.offsetWidth + 'px';
    let rect=shadow.getBoundingClientRect();
    shadow.style.minHeight= (window.innerHeight - rect.top) + 'px';
//    item.style.position='relative';
//    item.style.zIndex= -2;

    target.style.overflow= 'visible';

    const timer = setInterval( () => {
      if(--timerMax == 0 ){ clearInterval(timer); console.error("item.smoothOpen timer overflow");}
      let lmaxHeight = parseInt(target.style.maxHeight,10) || 0;
      let lheight= target.clientHeight;
      if( lmaxHeight <= lheight ){
        target.style.maxHeight = (lmaxHeight + 7) + 'px';
        shadow.style.minHeight = Math.max((parseInt(shadow.style.minHeight) - 7), 0) + 'px';
      } else {
      // end interval if the scroll is completed
        clearInterval(timer);
        target.style.overflow="visible";
        //item.style.position='static';
 //       item.style.zIndex= 1;
        shadow.style.minHeight= 0;
      }
    }, 25);
  }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  smoothClose(target, item, shadow) {
    // set an interval to update scrollTop attribute every 25 ms

    let maxHeight = parseInt(target.style.maxHeight,10) || 0;
    let height= target.clientHeight;

    shadow.style.width = item.offsetWidth + 'px';
    let rect=shadow.getBoundingClientRect();
    shadow.style.minHeight= (window.innerHeight  - rect.top -7) + 'px';
    console.info("smoothClose", window.innerHeight - rect.top);
//    item.style.position='relative';
//    item.style.zIndex= -2;
    target.style.overflow= 'visible';
    let timerMax=1000;


    const timer = setInterval( () => {
      if(--timerMax == 0 ){ clearInterval(timer); console.error("item.smoothOpen timer overflow");}
      let lmaxHeight = parseInt(target.style.maxHeight,10) || 0;
      let lheight= target.clientHeight;
      if( lmaxHeight >= lheight ){ //it's still shrinking
        target.style.maxHeight =  (((lmaxHeight - 7) > 0) ? (lmaxHeight - 7) : 0 ) + 'px';
        shadow.style.minHeight = (window.innerHeight - shadow.getBoundingClientRect().top) + 'px'; 
      } else {
      // end interval if the scroll is completed
        clearInterval(timer);
        target.style.overflow= 'hidden';
        shadow.style.minHeight= 0;
//        item.style.position='static';
//        item.style.zIndex= 'auto';
        this.setState({truncated: true});
      }
    }, 25);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  readMore (e) {
    console.info("readmore",e);
    e.preventDefault();
    e.stopPropagation();
    //e.nativeEvent.stopImmediatePropagation();

 //   if( this.trunced) {

      let item = this.refs.item;
      let subject =  item.querySelector('.item-subject');
      let reference =  item.querySelector('.item-reference');
      let truncatable =  this.refs.truncatable;
      let description =  item.querySelector('.item-description');
      let truncHint =  item.querySelector('.item-trunc-hint');
      let shadow = this.refs.shadow;
          console.info("readMore", shadow, item.querySelector('.item-truncatable-shadow'));


      console.info("item.readMore",this.props);

      if (this.state.truncated) {
//        description.classList.remove(this.lineLimit > 3 ? 'truncated4' : 'truncated');
//        truncHint.classList.remove('expand');
//        subject.classList.add('expand');
//        reference.classList.add('expand');
        this.setState({truncated: false});
        this.props.toggle(this.props.item._id, 'harmony');
        console.info("item.readMore trunc", truncatable);
        this.smoothOpen(truncatable, item, shadow);
      } else {
//        truncHint.classList.add('expand');
//       subject.classList.remove('expand');
//        reference.classList.remove('expand');
        this.props.toggle(this.props.item._id, 'harmony');
        this.smoothClose(truncatable, item, shadow);
      }
//    } else {
//      this.props.toggle(this.props.item._id, 'harmony');
//    }
  }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  openURL (e) {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if(this.truncated) { return this.readMore(e); }

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
          <article className="item" ref="item" id={ `item-${item._id}` } >
            <ItemMedia onClick={ this.readMore.bind(this) }
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
                <div className={`item-description pre-text ${this.state.truncated ? (this.lineLimit > 3 ? 'truncated4' : 'truncated') : ''} ` }>
                  { item.description }
                </div>
                <div className={ `item-trunc-hint ${this.state.truncated ? 'expand' : ''}`}>
                  <Icon icon="ellipsis-h" />
                </div>
                <div className="item-tendency" style={{display: 'none'}}>
                     { tendencyChoice && item && item.user && item.user.tendency ? '-' + tendencyChoice[item.user.tendency]  :  '' }
                </div>
              </div>
              <div className="item-truncatable-shadow" ref='shadow'>{false}</div>
            </section>

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
