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
    const { position, emitter } = this.props;

    emitter.emit('promote', position);
  }

  render () {
    let { item, criterias, position, other } = this.props;

    if ( ! item ) {
      return ( <div></div> );
    }

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
        <Reference { ...item.references[0] } />
        <Description description={ item.description } />
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
