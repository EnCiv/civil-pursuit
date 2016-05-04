'use strict';

import React              from 'react';
import Panel              from './panel';
import Loading            from './util/loading';
import Link               from './util/link';
import panelType          from '../lib/proptypes/panel';
import makePanelId        from '../lib/app/make-panel-id';
import Join               from './join';
import Accordion          from './util/accordion';
import Promote            from './promote';
import EvaluationStore    from './store/evaluation';
import ItemButtons        from './item-buttons';
import Icon               from './util/icon';
import Creator            from './creator';
import ItemStore          from '../components/store/item';
import Details            from './details';
import DetailsStore       from './store/details';
import EditAndGoAgain     from './edit-and-go-again';
import Harmony            from './harmony';

class PanelItems extends React.Component {

  static propTypes  =   {
    panel           :   panelType
  };

  new = null;

  mountedItems = {};

  state = { active : null , itemhide : null };


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    this.props.emitter.on('show', this.show.bind(this));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillUnmount () {
    this.props.emitter.removeListener('show', this.show.bind(this));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidUpdate () {
    if ( this.props.new ) {
      if ( this.props.new._id !== this.new ) {
        this.new = this.props.new._id;
        this.toggle(this.props.new._id, 'promote');
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  loadMore (e) {
    e.preventDefault();

    window.Dispatcher.emit('get more items', this.props.panel.panel);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggle (itemId, section) {



    if (
      this.state.active &&
      ( this.state.active.item === itemId || ! itemId ) &&
      this.state.active.section === section ) {
        this.collapseAroundItem (false);
        return this.setState({ active : { item : itemId, section : null } });
    }

    if ( (section === 'creator' || section === 'promote' ) && ! this.props.user ) {
      return Join.click();
    }

    if ( itemId ) {
      if ( ! this.mountedItems[itemId] ) {
        this.mountedItems[itemId] = {};
      }

      this.mountedItems[itemId][section] = true;
      this.collapseAroundItem(itemId);
    }

    console.info("toggle", itemId, section, "mountedItems", Object.keys(this.mountedItems).length, Object.keys(this.mountedItems));

    this.setState({ active : { item : itemId, section }});


  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  collapseAroundItem (itemId) {
    console.info("collapseArroundItem", itemId, this.props, this.state);
    
    if(!this.state.itemhide) {
      for ( let itm in this.props.items ) {
          this.setState( { itemhide : { item: itm._id, false} } ); // so unhide it
        }
      }
    }


    if (!itemId) // turn all items on
    { for ( let itm in this.props.items ) {
        if (this.state.itemhide[itm._id]==true) { // this item was previously hidden
           this.setState( { itemhide : { item: itm._id, false} } ); // so unhide it
        }
      }
    } else {
      for ( let itm in this.props.items ) { 
        if ( itm._id == itemId ) {  //this item should not be hidden
          if( this.state.itemhide[itm._id]==false) { //this item was previously not hidden
            ; // no need to do anything
          } else if (this.state.itemhide[itm._id]==true) { // this item was previously hidden
             this.setState( { itemhide : {item: itm._id, false} } ); // so unhide it
          }
        } else  { // this item should be hidden
          if (this.state.itemhide[itm._id] == false ) { // this is not hidden
            this.setState( { itemhide: {item: itm._id, true} } );
          } else { // this item is already hidden
              ;
          }
        }
      }
    }
    console.info("collapseArroundItem after", itemId, this.props, this.state);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  show (item, section) {
    this.toggle(item, section);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  unFocus () {
    // window.Dispatcher.emit('refresh');
    // const panelId = makePanelId(this.props.panel.panel);
    // const hidden = document.querySelectorAll(`.syn-panel-${panelId} > .syn-panel-body > .item-hidden`);
    //
    // for ( let i = 0; i < hidden.length; i++ ) {
    //   hidden[i].classList.remove('item-hidden');
    // }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {

    const { active } = this.state;

    const { panel, count, items, user, emitter } = this.props;

    let title = 'Loading items', name, loaded = false, content, loadMore,
      type, parent, creator;

    console.info("panel-items.render", this.props, this.state);

    if ( panel ) {
      loaded = true;

      type = panel.type;
      parent = panel.parent;

      name = `syn-panel-${type._id}`;

      if ( parent ) {
        name += `-${parent._id || parent}`;
      }

      title = (
        <Link
          href        =   { `/items/${type.id}/${parent || ""}` }
          then        =   { this.unFocus.bind(this) }
          >
          <Icon icon="angle-double-left" />
          <span> </span>
          { type.name }
        </Link>
      )

      title = type.name;

      if ( ! items.length ) {
        content = (
          <div className="gutter text-center">
            <a href="#" onClick={ this.toggle.bind(this, null, 'creator') } className="click-to-create">
              Click the + to be the first to add something here
            </a>
          </div>
        );
      }

      else {
        content = items
          .map(item => {
            let promote, details, subtype, editItem, harmony, buttonstate={promote: false, details: false, subtype: false, harmony: false};

            if ( this.mountedItems[item._id] && this.mountedItems[item._id].promote ) {
              buttonstate.promote=(active && active.item === item._id && active.section === 'promote');
              promote = (
                <div className="toggler promote">
                  <Accordion
                    poa     =   { this.refs.item }
                    name    =   "promote"
                    active  =   { (active && active.item === item._id && active.section === 'promote') }
                    >
                    <EvaluationStore
                      item-id     =   { item._id }
                      toggle      =   { this.toggle.bind(this, item._id) }
                      active      =   { active }
                      emitter     =   { emitter }
                      >
                      <Promote
                        ref       =   "promote"
                        show      =   { (active && active.item === item._id && active.section === 'promote') }
                        />
                    </EvaluationStore>
                  </Accordion>
                </div>
              );
            }

            if ( this.mountedItems[item._id] && this.mountedItems[item._id].details ) {
              buttonstate.details= (active && active.item === item._id && active.section === 'details') ;
              details = (
                <div className="toggler details">
                  <Accordion
                    poa     =   { this.refs.item }
                    name    =   "details"
                    active  =   { (active && active.item === item._id && active.section === 'details') }
                    >
                    <DetailsStore item={ item }>
                      <Details />
                    </DetailsStore>
                  </Accordion>
                </div>
              );
            }

            if ( this.mountedItems[item._id] && this.mountedItems[item._id].subtype ) {
              buttonstate.subtype= (active && active.item === item._id && active.section === 'subtype');
              subtype = (
                <div className="toggler subtype">
                  <Accordion
                    poa     =   { this.refs.item }
                    name    =   "subtype"
                    active  =   { (active && active.item === item._id && active.section === 'subtype') }
                    >
                    <Subtype
                      type    =   { item.subtype }
                      parent  =   { item }
                      ref     =   "subtype"
                      user    =   { user }
                      active  =   { (active && active.item === item._id && active.section === 'subtype') }
                      />
                  </Accordion>
                </div>
              );
            }

            if ( this.mountedItems[item._id] && this.mountedItems[item._id].harmony ) {
              buttonstate.harmony= (active && active.item === item._id && active.section === 'harmony');
              harmony = (
                <div className="toggler harmony">
                  <Accordion
                    poa     =   { this.refs.item }
                    name    =   "harmony"
                    active  =   { (active && active.item === item._id && active.section === 'harmony') }
                    >
                    <Harmony
                      item    =   { item }
                      ref     =   "harmony"
                      user    =   { user }
                      active  =   { (active && active.item === item._id && active.section === 'harmony') }
                      />
                  </Accordion>
                </div>
              );
            }

            if ( this.mountedItems[item._id] && this.mountedItems[item._id].editItem ) {
              editItem = ( <EditAndGoAgain item={ item } /> );
            }

            return (
              <ItemStore item={ item } key={ `item-${item._id}` }>
                <Item
                  item    =   { item }

                  buttons =   { (
                    <ItemStore item={ item }>
                      <ItemButtons
                        item    =   { item }
                        user    =   { user }
                        toggle  =   { this.toggle.bind(this) }
                        buttonstate = { buttonstate }
                        />
                    </ItemStore>
                  ) }

                  footer  =   { [
                    promote, details, subtype, editItem, harmony
                    ] }

//                  collapsed = { this.state.itemhide ? this.state.itemhide[item._id] : false }
                    collapsed =  { false }
                  />
              </ItemStore>
            );
          });

        const { skip, limit } = panel;

        const end = skip + limit;

        if ( count > limit ) {
          loadMore = (
            <h5 className="gutter text-center">
              <a href="#" onClick={ this.loadMore.bind(this) }>Show more</a>
            </h5>
          );
        }
      }

      let creatorPanel;

      if ( active && active.section === 'creator' ) {
        creatorPanel = (
          <Creator
            type    =   { type }
            parent  =   { parent }
            toggle  =   { this.toggle.bind(this, null, 'creator') }
            />
        );
      }

      creator = (
        <Accordion
          active    =   { (active && active.section === 'creator') }
          poa       =   { this.refs.panel }
          >
          { creatorPanel }
        </Accordion>
      );
    }

    return (
      <section id               =     "syn-panel-items">
        <Panel
          className   =   { name }
          ref         =   "panel"
          heading     =   {[
            ( <h4>{ title }</h4> ),
            (
              <Icon
                icon        =   "plus"
                className   =   "toggle-creator"
                onClick     =   { this.toggle.bind(this, null, 'creator') }
              />
            )
          ]}
          >
          { creator }
          { content }
          { loadMore }
        </Panel>
      </section>
    );
  }
}

export default PanelItems;

import Item from './item';
import Subtype from './subtype';
