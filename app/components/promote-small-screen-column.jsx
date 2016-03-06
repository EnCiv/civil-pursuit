'use strict';

import React              from 'react';
import PromoteButton      from './promote-button';
import Column             from './util/column';
import ItemStore          from './store/item';
import Subject            from './promote-item-subject';
import Description        from './promote-item-description';
import Sliders            from './sliders';
import Feedback           from './promote-feedback';
import EditAndGoAgain     from './promote-edit-and-go-again-button';
import ItemMedia          from './item-media';
import Reference          from './promote-reference';

class PromoteSmallScreenColumn extends React.Component {
  next () {
    let { item, position, evaluated } = this.props;

    let view = React.findDOMNode(this.refs.view);

    let parent = view.closest('.item-promote');

    window.Dispatcher.emit('promote item', item, position, evaluated, parent);
  }

  render () {
    let { item, criterias, position, other, descid } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

    let h5id = (position == 'left')? 'h5_left': 'h5_right';
    let promoteMe = (
      <PromoteButton { ...item } onClick={ this.next.bind(this) } className="gutter-bottom" />
    );

    if ( ! other ) {
      promoteMe = ( <div></div> );
    }

    return (
      <Column span="50" className={ `promote-${position}` } ref="view">
        <ItemStore item={ item }>
          <ItemMedia />
        </ItemStore>
        <Subject subject={ item.subject } position={ position } id={ item._id } />
        <Reference itemid={h5id} { h5_position, ...item.references[0] } />
        <Description itemid={descid} description={ item.description } />
        <div style={{ clear: 'both' }} />
        <Sliders criterias={ criterias } className="promote-sliders" />
        <Feedback className="gutter-top" />
        <div className="gutter-top">
          <div className={`promote-item-${position}`}>
            { promoteMe }
          </div>
          <EditAndGoAgain { ...this.props } panel-id={ this.props['panel-id'] } item={ item } />
        </div>
      </Column>
    );
  }
}

export default PromoteSmallScreenColumn;
