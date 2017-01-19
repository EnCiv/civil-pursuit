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
import TypeComponent      from './type-component';
import config             from '../../public.json';

class PanelItems extends React.Component {

  static propTypes  =   {
    panel           :   panelType
  };

  new = null;

  mountedItems = {};

  state = { active : { item : null, section : null } };


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    this.props.emitter.on('show', this.show.bind(this));
    if(this.props.vs.toParent){
      this.props.vs.toParent({toChild: this.toMeFromParent.bind(this)})
    }
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

    // window.Dispatcher.emit('get items', this.props.panel);
  }

  toChild=[];
  lastItem=null;

  toMeFromParent(vs){
    const itemId=vs.itemId || null;
    if(vs.state=='truncated' && active.item){
      if(this.toChild[active.item]){this.toChild[active.item](vs)} // notify child of state change
      return this.setState({ active : { item : null, section : null } }); // change the state here
    }
  }

  toMeFromChild(vs) {
        console.info("PanelItem.toMeFromChild",vs);
        
        if (vs.toChild && vs.itemId) { this.toChild[vs.itemId] = vs.toChild }  // child is passing up her func
        
        const itemId=vs.itemId || null;  // note it might not be an item belonging to this panel
        if(vs.state=='open'){
          if(vs.itemId) return this.setState({ active : { item : itemId, section : 'harmony' } });
        }
        else {
          return this.setState({ active : { item : null, section : null } });
        }
        if(vs.state && vs.itemId && this.toChild[vs.itemId]) { this.toChild[vs.itemId](Object.assign({},vs))}
        if(lastItem && this.toChild[lastItem]) { this.toChild[lastItem](Object.assign({},vs,{state: truncated}))}
        lastItem=null;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggle (itemId, section) {

    if(section == 'harmony' && (!this.props.panel.type.harmony || this.props.panel.type.harmony.length == 0)) { return true;} // don't toggle harmony on items that don't have it

    if ( ( this.state.active.item === itemId || ! itemId ) && this.state.active.section === section) {
        //current section of current item is active, so unactivate it
        if(this.props.focusAction) { this.props.focusAction(false)}
        //if all items are inactive, the visual state of the panel is 'truncated'
        if(this.props.vs && this.props.vs.toParent) this.props.vs.toParent({state: 'truncated', distance: 0});
        return this.setState({ active : { item : null, section : null } });
    }

    if ( (section === 'creator' || section === 'promote' ) && ! this.props.user ) {
      return Join.click();
    }

    if ( itemId ) {
      if ( ! this.mountedItems[itemId] ) {
        this.mountedItems[itemId] = {};
      }

      this.mountedItems[itemId][section] = true;
      // if one item is active, then the visual state of the panel is open
      if(this.props.vs && this.props.vs.toParent) this.props.vs.toParent({state: 'open', distance: 0});
    }
    if(this.props.focusAction) { this.props.focusAction(true)}
    this.setState({ active : { item : itemId, section }});

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  show (item, section) {
    this.toggle(item, section);
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {

    const { active } = this.state;

    const { panel, count, user, emitter } = this.props;

    let title = 'Loading items', name, loaded = false, content, loadMore,
      type, parent, creator;

    if ( panel ) {
      loaded = true;

      type = panel.type;
      parent = panel.parent;

      if(type) {
        name = `syn-panel-${type._id}`;
      } else
      { name = 'syn-panel-no-type';
      }

      if ( parent ) {
        name += `-${parent._id || parent}`;
      }

//      title = (
//        <Link
//          href        =   { `/items/${type._id}/${parent || ""}` }
//          then        =   { this.unFocus.bind(this) }
//          >
//          <Icon icon="angle-double-left" />
//          <span> </span>
//          { type.name }
//        </Link>
//      )

      title = type.name;

      if ( ! panel.items.length ) {
        content = (
          <div className="gutter text-center">
            <a href="#" onClick={ this.toggle.bind(this, null, 'creator') } className="click-to-create">
              Click the + to be the first to add something here
            </a>
          </div>
        );
      }

      else {
        content = panel.items
          .map(item => {
            let promote, details, subtype, editItem, harmony, buttonstate={promote: false, details: false, subtype: false, harmony: false};

            if ( this.mountedItems[item._id] && this.mountedItems[item._id].promote ) {
              buttonstate.promote=(active.item === item._id && active.section === 'promote');
              promote = (
                <div className="toggler promote">
                  <Accordion
                    poa     =   { this.refs.item }
                    name    =   "promote"
                    active  =   { (active.item === item._id && active.section === 'promote') }
                    >
                    <EvaluationStore
                      item-id     =   { item._id }
                      toggle      =   { this.toggle.bind(this, item._id) }
                      active      =   { active }
                      emitter     =   { emitter }
                      >
                      <Promote
                        ref       =   "promote"
                        show      =   { (active.item === item._id && active.section === 'promote') }
                        panel     =   { panel }
                        user    =     { user }
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
              const subPanel={
                parent: item,
                type: item.subtype,
                skip      :   0,
                limit     :   config['navigator batch size'],
              };
              subtype = (
                <div className="toggler subtype">
                  <Accordion
                    poa     =   { this.refs.item }
                    name    =   "subtype"
                    active  =   { (active.item === item._id && active.section === 'subtype') }
                    >
                    <TypeComponent
                      panel = { subPanel }
                      ref     =   "subtype"
                      user    =   { user }
                      active  =   { (active.item === item._id && active.section === 'subtype') }
                      />
                  </Accordion>
                </div>
              );
            }

            if ( this.mountedItems[item._id] && this.mountedItems[item._id].harmony ) {
              buttonstate.harmony= (active.item === item._id && active.section === 'harmony');
              harmony = (
                <div className="toggler harmony">
                  <Accordion
                    poa     =   { this.refs.item }
                    name    =   "harmony"
                    active  =   { (active.item === item._id && active.section === 'harmony') }
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
            var iVs={state: 'collapsed', depth: 0}; // item Visual State
            if(this.props.vs && this.props.vs.depth) iVs.depth=this.props.vs.depth + 1;
            if(item) {
              iVs.toParent= this.toMeFromChild.bind(this);
              iVs.state='truncated'; // items are usually truncated, except one, if it is active
              iVs.itemId = item._id; // adding this as a parameter in the state
              if(this.state.active.item && this.state.active.item === item._id && this.state.active.section==='harmony') iVs.state='open';  // if there is one and this is the active item, then it should be open
              if(panel.items.length==1) iVs.state='open';  // if there is only on item in the list, then it's open
            }
            return (
              <ItemStore item={ item } key={ `item-${item._id}` }>
                <Item
                  item    =   { item }
                  user    =   { user }
                  buttons =   { (
                    <ItemStore item={ item }>
                      <ItemButtons
                        item    =   { item }
                        user    =   { user }
                        toggle  =   { this.toggle.bind(this) }
                        buttonstate = { buttonstate }
                        panel = { panel }
                        />
                    </ItemStore>
                  ) }

                  footer  =   { [
                    promote, details, subtype, editItem, harmony
                    ]
                  }

                  vs = {iVs}
                  toggle  =   { this.toggle.bind(this) }
                  focusAction={this.props.focusAction}
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

        creatorPanel = (
          <Creator
            type    =   { type }
            parent  =   { parent }
            toggle  =   { this.toggle.bind(this, null, 'creator') }
            />
        );

      creator = (
        <Accordion
          active    =   { (active.section === 'creator') }
          poa       =   { this.refs.panel }
          name      = 'creator'
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
            ( <h4>{ title }</h4> ), ( type && type.createMethod=="hidden" ) ? (null) : 
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
