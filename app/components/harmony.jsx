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
    console.info("harmony.focusLeft",focused);
    if(focused) {
      if(this.state.expandedRight) { this.setState({expandedLeft: true, expandedRight: false}) }
      else { this.setState({expandedLeft: true}) }
    } else {
      if(this.state.expandedRight) { 
        this.setState({expandedLeft: false, expandedRight: false});
        if(this.toChildRight){this.toChildRight({state: 'truncated', distance: 0})}
        if(this.toChildLeft){this.toChildLeft({state: 'truncated', distance: 0})}
      }
      else { 
        this.setState({expandedLeft: false});
        if(this.toChildRight){this.toChildLeft({state: 'truncated', distance: 0})}
      }
    }
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  focusRight(focused) {
    console.info("harmony.focusRight",focused);
    if(focused) {
      if(this.state.expandedLeft) { this.setState({expandedRight: true, expandedLeft: false}) }
      else { this.setState({expandedRight: true}) }
    } else {
      if(this.state.expandedLeft) { 
        this.setState({expandedLeft: false, expandedRight: false});
        if(this.toChildRight){this.toChildRight({state: 'truncated', distance: 0})}
        if(this.toChildLeft){this.toChildLeft({state: 'truncated', distance: 0})}
      }
      else { this.setState({expandedRight: false}) 
             if(this.toChildRight){this.toChildRight({state: 'truncated', distance: 0})}}
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
    console.info("harmony.toMeFromChildLeft", vs);
    if (vs.toChild) { this.toChildLeft = vs.toChild }  // child is passing up her func
    if (vs.state == 'open') {
      if (this.state.expandedRight) { 
        if(this.toChildRight){this.toChildRight(Object.assign({},vs, {state:'truncated'} ))}  // notify the other panel of the state change (to truncated)
        this.setState({ expandedLeft: true, expandedRight: false }) 
      }
      else { this.setState({ expandedLeft: true }) }
    } else {
      if (this.state.expandedRight) {
        if(this.toChildRight){this.toChildRight(vs)}  // notify the other panel of the state change (to truncated)
        this.setState({ expandedLeft: false, expandedRight: false });
      }
      else {
        this.setState({ expandedLeft: false });
      }
    }
  }

  toMeFromChildRight(vs) {
    console.info("harmony.toMeFromChildRight", vs);
    if (vs.toChild) { this.toChildRight = vs.toChild }  // child is passing up her func
    if (vs.state == 'open') {
      if (this.state.expandedLeft) { 
        if(this.toChildLeft){this.toChildLeft(Object.assign({},vs, {state:'truncated'} ))}
        this.setState({ expandedRight: true, expandedLeft: false }) 
      }
      else { this.setState({ expandedRight: true }) }
    } else {
      if (this.state.expandedLeft) {
        if(this.toChildLeft){this.toChildLeft(vs)}  // notify the other panel of the state change (to truncated)
        this.setState({ expandedLeft: false, expandedRight: false });
      } else { this.setState({ expandedRight: false }) }
    }
  }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    const { active, item, user } = this.props;
    var vs=Object.assign({},{state: 'collapsed', depth: 0}, this.props.vs)  // initialize vs if not passed

    let contentLeft = ( <Loading message="Loading" /> );

    let contentRight = ( <Loading message="Loading" /> );

      contentLeft = (
        <DoubleWide className="harmony-pro" left expanded={this.state.expandedLeft}>
          <PanelStore type={ item.harmony.types[0] } parent={ item }>
            <PanelItems user={ user } vs={Object.assign({}, vs,  {state: 'truncated', side: 'left', depth: vs.depth +1, toParent: this.toMeFromChildLeft.bind(this)})} />
          </PanelStore>
        </DoubleWide>
      );

      contentRight = (
        <DoubleWide className="harmony-con" right expanded={this.state.expandedRight} >
          <PanelStore type={ item.harmony.types[1] } parent={ item }>
            <PanelItems user={ user } vs={Object.assign({}, vs, {state: 'truncated', side: 'right', depth: vs.depth +1, toParent: this.toMeFromChildRight.bind(this)})} />
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
