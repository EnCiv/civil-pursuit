'use strict';

import React from 'react';
import ButtonGroup      from './util/button-group';
import Button           from './util/button';
import Icon               from './util/icon';

class ItemButtons extends React.Component {
  toggle (section) {
    this.props.toggle(this.props.item._id, section);
  }

  render () {

    const { item, panel } = this.props;

    const buttons = [
      (
        <ButtonGroup>
          <Button small shy onClick={ this.toggle.bind(this, 'promote') } className="item-promotions">
            <span>{ item.promotions } </span>
            <Icon icon="thumbs-o-up" />
          </Button>
        </ButtonGroup>
      )
    ];

    let details, subtype, harmony;

    console.log('this.props.user:'+this.props.user);
    console.log('this.props.synuser:'+this.props.synuser)

    if( item.user == this.props.user) {
      details = (
        <ButtonGroup>
          <Button small shy onClick={ this.toggle.bind(this, 'details') } className="toggle-details">
            <span>{ item.popularity.number + '%' } </span>
            <Icon icon="bar-chart" />
          </Button>
        </ButtonGroup>
      );
      buttons.push(
        <ButtonGroup>
        { details}
        </ButtonGroup>
      );
    }

    if ( item.type && item.type.harmony && item.type.harmony.length ) {
      harmony = (
        <Button
          small
          shy
          onClick     =   { this.toggle.bind(this, 'harmony') }
          className   =   "harmony-button"
          >
          <span>{ item.harmony.harmony + '%' } </span>
          <Icon icon="music" />
        </Button>
       );
        buttons.push(
        <ButtonGroup>
          { harmony } 
        </ButtonGroup>
      );
    }

    if ( item.subtype ) {
      if (item.promotions > 2) {
        subtype = (
          <Button small shy onClick={ this.toggle.bind(this, 'subtype') } className="subtype-button">
            <span>{ item.children } </span>
            <Icon icon="level-down" />
          </Button>
        );
      } else
      {
        subtype = (
          <Button small shy inactive className="subtype-button">
            <Icon icon="lock" />
            <Icon icon="level-down" />
          </Button>
        );
      }
      buttons.push(
        <ButtonGroup>
          {subtype}
        </ButtonGroup>
        );
    }

    return (<section>{ buttons }</section>);
  }
}

export default ItemButtons;
