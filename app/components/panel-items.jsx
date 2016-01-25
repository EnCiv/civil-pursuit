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
import ItemStore          from 'syn/../../dist/components/store/item';
import Details            from './details';
import DetailsStore       from './store/details';

class PanelItems extends React.Component {

  static propTypes  =   {
    panel           :   panelType
  }

  new = null

  mountedItems = {}

  state = { active : null }

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

    console.log('toggle', itemId, section);

    if (
      this.state.active &&
      ( this.state.active.item === itemId || ! itemId ) &&
      this.state.active.section === section ) {
      return this.setState({ active : { item : itemId, section : null } });
    }

    if ( section === 'creator' && ! this.props.user ) {
      return Join.click();
    }

    if ( itemId ) {
      if ( ! this.mountedItems[itemId] ) {
        this.mountedItems[itemId] = {};
      }

      this.mountedItems[itemId][section] = true;
    }

    this.setState({ active : { item : itemId, section }});
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
    console.log('render panel-items', this.props);
    const { active } = this.state;

    const { panel, count, items, user } = this.props;

    let title = 'Loading items', name, loaded = false, content, loadMore,
      type, parent, creator;

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
            let promote, details, subtype;

            if ( this.mountedItems[item._id] && this.mountedItems[item._id].promote ) {
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
              details = (
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

            return (
              <ItemStore item={ item } key={ `item-${item._id}` }>
                <Item
                    item    =   { item }
                    buttons =   { (
                      <ItemStore item={ item }>
                        <ItemButtons
                          item    =   { item }
                          toggle  =   { this.toggle.bind(this) }
                          />
                      </ItemStore>
                    ) }
                    footer  =   { [ promote, details ] } />
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
    );
  }
}

export default PanelItems;

import Item from './item';
import Subtype from './subtype';
