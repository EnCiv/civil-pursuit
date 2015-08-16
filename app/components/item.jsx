'use strict';

import React            from 'react';
import Row              from './util/row';
import Column           from './util/column';
import Button           from './util/button';
import Accordion        from './util/accordion';
import Icon             from './util/icon';
import ItemMedia        from './item-media';
import Promote          from './promote';
import Details          from './details';
import Subtype          from './subtype';
import Harmony          from './harmony';
import ButtonGroup      from './util/button-group';
import Join             from './join';

class Item extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static spanify (text) {
    let lines = [];

    text.split(/\n/).forEach(line => {
      lines.push(line.split(/\s+/));
    });

    lines = lines.map(line => {
      if ( line.length === 1 && ! line[0] ) {
        return [];
      }
      return line;
    });

    return lines;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static paint (container, limit) {
    let lines = Item.spanify(container.textContent)
    container.innerHTML = '';

    let whiteSpace = () => {
      let span = document.createElement('span');
      span.appendChild(document.createTextNode(' '));
      return span;
    }

    lines.forEach(line => {
      let div = document.createElement('div');
      container.appendChild(div);
      line.forEach(word => {
        let span = document.createElement('span');
        span.appendChild(document.createTextNode(word));
        span.classList.add('word');
        div.appendChild(span);
        div.appendChild(whiteSpace());
        let offset = span.offsetTop;

        if ( offset > limit ) {
          span.classList.add('hide');
        }
      });
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props)

    this.expanded = false;

    this.state = {
      showPromote : this.props.new ? 1 : 0,
      showDetails : 0,
      showSubtype : 0,
      showHarmony : 0,
      item        : this.props.item
    };

    this.listeners();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  listeners () {
    if ( typeof window !== 'undefined' ) {
      if ( this.state.item ) {
        window.socket.on(`item image uploaded ${this.props.item._id}`, this.updateItem.bind(this));
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  updateItem (item) {
    this.setState({ item });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillUnmount () {
    window.socket.removeListener(`item image uploaded ${this.props.item._id}`, this.updateItem.bind(this));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  hideOthers () {
    let item = React.findDOMNode(this.refs.item);
    let itemAccordions = item.querySelectorAll('.syn-accordion-wrapper.show');

    for ( let i = 0; i < itemAccordions.length; i ++ ) {
      itemAccordions[i].classList.remove('show');
    }

    let panel = item.closest('.syn-panel');

    let creator = panel.querySelector('.syn-panel-body > .syn-accordion .syn-accordion-wrapper.show');

    if ( creator ) {
      creator.classList.remove('show');
    }

    let otherItems = panel.querySelectorAll('.item .syn-accordion-wrapper.show');

    for ( let i = 0; i < otherItems.length; i ++ ) {
      otherItems[i].classList.remove('show');
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  togglePromote () {
    if ( this.props.user ) {
      this.hideOthers();
      this.setState({ showPromote : this.state.showPromote + 1 });
    }
    else {
      Join.click();
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleDetails () {
    this.hideOthers();
    this.setState({ showDetails : this.state.showDetails + 1 });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleSubtype () {
    this.hideOthers();
    this.setState({ showSubtype : this.state.showSubtype + 1 });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleHarmony () {
    this.hideOthers();
    this.setState({ showHarmony : this.state.showHarmony + 1 });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    let media;

    let image = React
      .findDOMNode(this.refs.media)
      .querySelector('img');

    let video = React
      .findDOMNode(this.refs.media)
      .querySelector('iframe');

    if ( video ) {
      media = React
       .findDOMNode(this.refs.media)
       .querySelector('.video-container');
    }
    else {
      media = image;
    }

    let item = React
      .findDOMNode(this.refs.item);

    let more = React.findDOMNode(this.refs.more);

    let truncatable   =   item.querySelector('.item-truncatable');
    let subject       =   item.querySelector('.item-subject');
    let description   =   item.querySelector('.item-description');
    let reference     =   item.querySelector('.item-reference a');
    let buttons       =   item.querySelector('.item-buttons');

    let onLoad = () => {
      let mediaHeight = ( media.offsetTop + media.offsetHeight - 40 );

      console.log({ mediaHeight, media, item: this.props.item.subject })

      let limit;

      if ( ! buttons ) {
        limit = mediaHeight;
      }

      else {
        let buttonsHeight = ( buttons.offsetTop + buttons.offsetHeight - 40 );

        if ( mediaHeight >= buttonsHeight  ) {
          limit = mediaHeight;
        }

        else {
          limit = buttonsHeight;
        }
      }

      Item.paint(subject, limit);
      Item.paint(reference, limit);
      Item.paint(description, limit);

      if ( ! item.querySelector('.word.hide') ) {
        more.style.display = 'none';
      }

      if ( this.props.new ) {
        this.setState({ showPromote: true });
      }
    };

    if ( image ) {
      image.addEventListener('load', onLoad);
    }
    else {
      video.addEventListener('load', onLoad);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  readMore () {
    let truncatable =  React.findDOMNode(this.refs.item)
      .querySelector('.item-truncatable');

    truncatable.classList.toggle('expand');

    this.expanded = ! this.expanded;

    let text = React.findDOMNode(this.refs.readMoreText);

    if ( this.expanded ) {
      text.innerText = 'less';
    }
    else {
      text.innerText = 'more';
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { item } = this.state;

    let buttons,
      referenceLink,
      referenceTitle,
      textSpan = 50,
      promote,
      details,
      subtype,
      harmony;

    if ( this.props.buttons !== false ) {
      buttons = (
        <section className="item-buttons">
          <ButtonGroup>
            <Button small shy onClick={ this.togglePromote.bind(this) }>
              <span>{ item.promotions } </span>
              <Icon icon="bullhorn" />
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button small shy onClick={ this.toggleDetails.bind(this) }>
              <span>{ item.popularity.number + '%' } </span>
              <Icon icon="signal" />
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button small shy onClick={ this.toggleSubtype.bind(this) }>
              <span>{ item.promotions } </span>
              <Icon icon="fire" />
            </Button>

            <Button small shy onClick={ this.toggleHarmony.bind(this) }>
              <span>{ item.popularity.number + '%' } </span>
              <Icon icon="music" />
            </Button>
          </ButtonGroup>
        </section>
      );
    }
    else {
      textSpan = 75;
    }

    if ( this.props.promote !== false ) {
      promote = (
        <Accordion poa={ this.refs.item } show={ this.state.showPromote } name="promote" { ...this.props }>
          <Promote item={ this.props.item } show={ this.state.showPromote } />
        </Accordion>
      );
    }

    if ( this.props.details !== false ) {
      details =(
        <Accordion poa={ this.refs.item } show={ this.state.showDetails } name="details" { ...this.props }>
          <Details item={ this.props.item } show={ this.state.showDetails } />
        </Accordion>
      );
    }

    if ( this.props.subtype !== false ) {
      subtype = (
        <Accordion show={ this.state.showSubtype } name="subtype" poa={ this.refs.item } { ...this.props }>
          <Subtype { ...this.props } item={ this.props.item } show={ this.state.showSubtype } />
        </Accordion>
      );
    }

    if ( this.props.harmony !== false ) {
      harmony = (
        <Accordion show={ this.state.showHarmony } name="harmony" { ...this.props } poa={ this.refs.item }>
          <Harmony { ...this.props } item={ this.props.item } show={ this.state.showHarmony } />
        </Accordion>
      );
    }

    if ( item.references.length ) {
      referenceLink = item.references[0].url;
      referenceTitle = item.references[0].title;
    }

    return (
      <article id={ `item-${item._id}` } className="item" ref="item">
        <ItemMedia item={ item } ref="media" />

        { buttons }

        <section className="item-text">
          <div className="item-truncatable">
            <h4 className="item-subject">{ item.subject }</h4>
            <h5 className="item-reference">
              <a href={ referenceLink } target="_blank" rel="nofollow">{ referenceTitle }</a>
            </h5>
            <div className="item-description pre-text">{ item.description }</div>
            <div className="item-read-more" ref="more">
              <a href="#" onClick={ this.readMore.bind(this) }>Read <span ref="readMoreText">more</span></a>
            </div>
          </div>
        </section>

        <section style={ { clear : 'both' }}></section>

        <section>
          { promote }

          { details }

          { subtype }

          { harmony }
        </section>
      </article>
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default Item;
