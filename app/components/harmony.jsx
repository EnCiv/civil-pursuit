'use strict';

import React                        from 'react';
import Loading                      from './util/loading';
import Row                          from './util/row';
import Column                       from './util/column';
import PanelItems                   from './panel-items';
import makePanelId                  from '../lib/app/make-panel-id';
import itemType                     from '../lib/proptypes/item';
import panelType                    from '../lib/proptypes/panel';
import PanelStore                   from './store/panel';
import DoubleWide                   from './util/double-wide';

class Harmony extends React.Component {

  state = {
    expandedLeft: false,
    expandedRight: false,
    resetLeftView: 0,
    resetRightView: 0
  };

//**********************************************************
  focusLeft(focused) {
    if(focused) {
      if(this.state.expandedRight) { this.setState({expandedLeft: true, expandedRight: false}) }
      else { this.setState({expandedLeft: true}) }
    } else {
      if(this.state.expandedRight) { 
        this.setState({expandedLeft: false, expandedRight: false});
        if(this.toChildRight){toChildRight({state: 'truncated', distance: 0})}
        if(this.toChildLeft){toChildLeft({state: 'truncated', distance: 0})}
      }
      else { 
        this.setState({expandedLeft: false});
        if(this.toChildRight){toChildLeft({state: 'truncated', distance: 0})}
      }
    }
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  focusRight(focused) {
    if(focused) {
      if(this.state.expandedLeft) { this.setState({expandedRight: true, expandedLeft: false}) }
      else { this.setState({expandedRight: true}) }
    } else {
      if(this.state.expandedLeft) { 
        this.setState({expandedLeft: false, expandedRight: false});
        if(this.toChildRight){toChildRight({state: 'truncated', distance: 0})}
        if(this.toChildLeft){toChildLeft({state: 'truncated', distance: 0})}
      }
      else { this.setState({expandedRight: false}) 
             if(this.toChildRight){toChildRight({state: 'truncated', distance: 0})}}
    }
  }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.status = 'iddle';

    const { harmony } = this.props.item;

    this.leftId = null;
    this.rightId = null;

    if ( harmony.types && harmony.types.length ) {
      this.leftId = makePanelId( { type : harmony.types[0], parent : this.props.item._id });

      this.rightId = makePanelId( { type : harmony.types[1], parent : this.props.item._id });
    }
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillReceiveProps (props) {
    if ( this.status === 'iddle' && props.active ) {
      this.status = 'ready';

      if ( props.panels ) {
        if ( ! props.panels[this.leftId] ) {

          window.Dispatcher.emit('get items', {
            type        :   props.item.harmony.types[0],
            parent      :   props.item._id
          });
        }

        if ( ! props.panels[this.rightId] ) {
          window.Dispatcher.emit('get items', {
            type        :   props.item.harmony.types[1],
            parent      :   props.item._id
          });
        }
      }
    }
  }

  toChildLeft=null;
  toChildRight=null;

  toMeFromChildLeft(vs) {
        if (vs.toChild) { this.toChildLeft = vs.toChild }  // child is passing up her func
  }

  toMeFromChildRight(vs) {
      if (vs.toChild) { this.toChildRight = vs.toChild }  // child is passing up her func
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { active, item, user } = this.props;

    let contentLeft = ( <Loading message="Loading" /> );

    let contentRight = ( <Loading message="Loading" /> );

      contentLeft = (
        <DoubleWide className="harmony-pro" left expanded={this.state.expandedLeft}>
          <PanelStore type={ item.harmony.types[0] } parent={ item }>
            <PanelItems user={ user } focusAction={this.focusLeft.bind(this)} vs={{state: 'truncated', toParent: this.toMeFromChildLeft.bind()}} />
          </PanelStore>
        </DoubleWide>
      );

      contentRight = (
        <DoubleWide className="harmony-con" right expanded={this.state.expandedRight} >
          <PanelStore type={ item.harmony.types[1] } parent={ item }>
            <PanelItems user={ user } focusAction={this.focusRight.bind(this)} vs={{state: 'truncated', toParent: this.toMeFromChildRight.bind()}} />
          </PanelStore>
        </DoubleWide>
      );

    return (
      <section className={`item-harmony ${this.props.className}`}>
        { contentLeft }
        { contentRight }
      </section>
    );
  }
}

export default Harmony;
