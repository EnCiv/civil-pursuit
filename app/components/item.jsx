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

    this.truncated = false;

    if ( typeof window !== 'undefined' && this.props.item ) {

      let parent = this.props.item.lineage[0];

      if ( parent ) {
        parent = parent._id;
      }

      this.panelId = makePanelId({ type : this.props.item.type, parent });
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

  componentWillUnmount () {
    // window.socket.removeListener(`item image uploaded ${this.props.item._id}`, this.updateItem.bind(this));
    //
    // window.socket.removeListener(`item changed ${this.props.item._id}`, this.updateItem.bind(this));
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

  componentWillReceiveProps (props) {
    // this.setState({ ping : this.state.ping + 1 });
    // console.info('item is receiving props', props);
    // if ( 'panel' in props ) {
    //   if ( props.panel.state.active === 'creator' ) {
    //     this.setState({ active : null });
    //   }
    //   else if ( props.panel.state.active && this.props.item ) {
    //     if ( props.panel.state.active !== this.props.item._id ) {
    //       this.setState({ active : null });
    //     }
    //   }
    // }
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

    // console.warn(item.subject);

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
            <Button small shy onClick={ this.toggle.bind(this, 'promote') }>
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

          <ButtonGroup>
            <Button small shy onClick={ this.toggle.bind(this, 'subtype') }>
              <span>{ item.children } </span>
              <Icon icon="fire" />
            </Button>

            <Button small shy onClick={ this.toggle.bind(this, 'harmony') }>
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

    if ( this.props.promote !== false && this.panelId ) {
      let promoteIsActive = this.props.panels[this.panelId].active === `${this.props.item._id}-promote`;

      promote = (
        <div className="toggler promote">
          <Accordion
            poa     = { this.refs.item }
            active  = { promoteIsActive }
            name    = "promote"
            { ...this.props }
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
            poa       =   { this.refs.item }
            active    =   { detailsIsActive }
            name      =   "details"
            { ...this.props }
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

    if ( this.props.subtype !== false && this.panelId ) {
      let subtypeIsActive = this.props.panels[this.panelId].active === `${this.props.item._id}-subtype`;

      subtype = (
        <div className="toggler subtype">
        <Accordion
          poa       =   { this.refs.item }
          active    =   { subtypeIsActive }
          name      =   "subtype"
          { ...this.props }
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
      harmony = (
        <div className="toggler harmony">
          <Accordion active={ this.state.active === 'harmony' } name="harmony" { ...this.props } poa={ this.refs.item }>
            <Harmony { ...this.props } item={ this.props.item } show={ this.state.showHarmony } />
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
        </section>
      </article>
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default Item;
