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
import EditAndGoAgain   from './edit-and-go-again';
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

    this.truncated = false;

    if ( typeof window !== 'undefined' && this.props.item ) {

      let parent = this.props.item.lineage[this.props.item.lineage.length - 1];

      if ( parent ) {
        parent = parent._id;
      }

      this.panelId = makePanelId({ type : this.props.item.type, parent });

      if ( this.props.panels && ! this.props.panels[this.panelId] ) {
        console.error('Panel not found', this.panelId, this.props.item);
      }
    }

    this.state = {
      active      : null,
      item        : this.props.item,
      ping : 0
    };

    // this.listeners();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  listeners () {
    if ( typeof window !== 'undefined' ) {
      if ( this.state.item ) {
        window.socket.on(`item image uploaded ${this.props.item._id}`, this.updateItem.bind(this));

        window.socket.on(`item changed ${this.props.item._id}`, this.updateItem.bind(this));
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  updateItem (item) {
    this.setState({ item });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggle (toggler) {
    if ( toggler === 'promote' && ! this.props.user ) {
      Join.click();

      return;
    }

    if ( this.props.item ) {
      window.Dispatcher.emit('set active', this.panelId, `${this.props.item._id}-${toggler}`);
    }
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

    if ( ! this.truncated ) {
      let more = React.findDOMNode(this.refs.more);

      let truncatable   =   item.querySelector('.item-truncatable');
      let subject       =   item.querySelector('.item-subject');
      let description   =   item.querySelector('.item-description');
      let reference     =   item.querySelector('.item-reference a');
      let buttons       =   item.querySelector('.item-buttons');

      let onLoad = () => {
        let mediaHeight = ( media.offsetTop + media.offsetHeight - 40 );

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

      this.truncated = true;
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
    let { item } = this.props;

    let buttons,
      referenceLink,
      referenceTitle,
      textSpan = 50,
      promote,
      details,
      subtype,
      harmony,
      editAndGoAgain;

    if ( this.props.buttons !== false ) {

      let subtypeGroup, harmonyGroup;

      if ( this.props.item.subtype ) {
        subtypeGroup = <Button small shy onClick={ this.toggle.bind(this, 'subtype') } className="subtype-button">
          <span>{ item.children } </span>
          <Icon icon="fire" />
        </Button>;
      }

      if ( this.props.item.type.harmony.length ) {
        harmonyGroup = <Button small shy onClick={ this.toggle.bind(this, 'harmony') } className="harmony-button">
          <span>{ item.harmony } </span>
          <Icon icon="music" />
        </Button>;
      }

      let childrenGroup = <ButtonGroup>
        { subtypeGroup }
        { harmonyGroup }
      </ButtonGroup>;

      buttons = (
        <section className="item-buttons">
          <ButtonGroup>
            <Button small shy onClick={ this.toggle.bind(this, 'promote') } className="item-promotions">
              <span>{ item.promotions } </span>
              <Icon icon="bullhorn" />
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <Button small shy onClick={ this.toggle.bind(this, 'details') } className="toggle-details">
              <span>{ item.popularity.number + '%' } </span>
              <Icon icon="signal" />
            </Button>
          </ButtonGroup>

          { childrenGroup }
        </section>
      );
    }
    else {
      textSpan = 75;
    }

    if ( this.props.promote !== false && this.panelId ) {
      let promoteIsActive = this.props.panels[this.panelId].active === `${this.props.item._id}-promote`;

      promote = (
        <div className="toggler promote">
          <Accordion
            { ...this.props }
            poa     = { this.refs.item }
            active  = { promoteIsActive }
            name    = "promote"
            >
            <Promote
              item      =   { this.props.item }
              { ...this.props }
              active    =   { promoteIsActive }
              ref       =   "promote"
              panel-id  =   { this.panelId }
              />
          </Accordion>
        </div>
      );
    }

    if ( this.props.details !== false && this.panelId ) {
      let detailsIsActive = this.props.panels[this.panelId].active === `${this.props.item._id}-details`;

      details =(
        <div className="toggler details">
          <Accordion
            { ...this.props }
            poa       =   { this.refs.item }
            active    =   { detailsIsActive }
            name      =   "details"
            >
            <Details
              item    = { this.props.item }
              { ...this.props }
              active  = { detailsIsActive }
              ref     = "details" />
          </Accordion>
        </div>
      );
    }

    if ( this.props.subtype !== false && this.panelId && this.props.item.subtype ) {
      let subtypeIsActive = this.props.panels[this.panelId].active === `${this.props.item._id}-subtype`;

      subtype = (
        <div className="toggler subtype">
        <Accordion
          { ...this.props }
          poa       =   { this.refs.item }
          active    =   { subtypeIsActive }
          name      =   "subtype"
          >
          <Subtype
            item    = { this.props.item }
            { ...this.props }
            active  = { subtypeIsActive }
            ref     = "subtype" />
        </Accordion>
        </div>
      );
    }

    if ( this.props.harmony !== false ) {
      let harmonyIsActive = this.props.panels[this.panelId].active === `${this.props.item._id}-harmony`;

      harmony = (
        <div className="toggler harmony">
          <Accordion
            { ...this.props }
            active    =   { harmonyIsActive }
            name      =   "harmony"
            poa       =   { this.refs.item }>
            <Harmony
              { ...this.props }
              item    =   { this.props.item }
              active  =   { harmonyIsActive } />
          </Accordion>
        </div>
      );
    }

    if ( this.props['edit-and-go-again'] !== false ) {
      let editAndGoAgainIsActive = this.props.panels[this.panelId].active === `${this.props.item._id}-edit-and-go-again`;

      editAndGoAgain = (
        <div className="toggler editAndGoAgain">
          <Accordion
            { ...this.props }
            active    =   { editAndGoAgainIsActive }
            name      =   "editAndGoAgain"
            poa       =   { this.refs.item }>
            <EditAndGoAgain
              { ...this.props }
              item    =   { this.props.item }
              active  =   { editAndGoAgainIsActive } />
          </Accordion>
        </div>
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

        <section style={{ marginRight : '-10px' }}>
          { promote }

          { details }

          { subtype }

          { harmony }

          { editAndGoAgain }
        </section>
      </article>
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default Item;
