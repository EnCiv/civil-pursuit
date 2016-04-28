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

    const { item, panel, user, buttonstate } = this.props;

    console.info(this);

    console.log("buttonstate.promote=", buttonstate.promote);

    const buttons = [];

    let promote, details, subtype, harmony;

    if (buttonstate.promote) {
      promote = (
        <ButtonGroup>
          <Button small shy success onClick={ this.toggle.bind(this, 'promote') } className="item-promotions">
            <span>{ item.promotions } </span>
            <Icon icon="thumbs-o-up" />
          </Button>
        </ButtonGroup>
      );
    } else {
      promote = (
        <ButtonGroup>
          <Button small shy onClick={ this.toggle.bind(this, 'promote') } className="item-promotions">
            <span>{ item.promotions } </span>
            <Icon icon="thumbs-o-up" />
          </Button>
        </ButtonGroup>
      );
    }
    buttons.push(
        { promote }
    );



    if( user && item.user._id == user.id) {
      if(buttonstate.details) {
        details = (
          <ButtonGroup>
            <Button small shy success onClick={ this.toggle.bind(this, 'details') } className="toggle-details">
              <span>{ item.popularity.number + '%' } </span>
              <Icon icon="bar-chart" />
            </Button>
          </ButtonGroup>
        );
      } else {
        details = (
          <ButtonGroup>
            <Button small shy onClick={ this.toggle.bind(this, 'details') } className="toggle-details">
              <span>{ item.popularity.number + '%' } </span>
              <Icon icon="bar-chart" />
            </Button>
          </ButtonGroup>
        );
      }
      buttons.push(
        <ButtonGroup>
        { details}
        </ButtonGroup>
      );
    }

    if ( item.type && item.type.harmony && item.type.harmony.length ) {
      if(buttonstate.harmony) {
      harmony = (
        <Button
          small
          shy
          success
          onClick     =   { this.toggle.bind(this, 'harmony') }
          className   =   "harmony-button"
          >
          <span>{ item.harmony.harmony + '%' } </span>
          <Icon icon="music" />
        </Button>
       );
    } else {
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
    }
        buttons.push(
        <ButtonGroup>
          { harmony } 
        </ButtonGroup>
      );
    }

    if ( item.subtype ) {
      if (item.promotions > 2) {
        if (buttonstate.subtype) {
          subtype = (
            <Button small shy onClick={ this.toggle.bind(this, 'subtype') } className="subtype-button">
              <span>{ item.children } </span>
              <Icon icon="level-down" />
            </Button>
          );
        } else {
            subtype = (
            <Button small shy onClick={ this.toggle.bind(this, 'subtype') } className="subtype-button">
              <span>{ item.children } </span>
              <Icon icon="level-down" />
            </Button>
          );
        } 
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
