'use strict';

import React from 'react';
import ButtonGroup      from './util/button-group';
import Button           from './util/button';
import Icon               from './util/icon';

class ItemButtons extends React.Component {
  toggle (section) {
    console.info("ItemButtons.toggle", section);
    this.props.toggle(this.props.item._id, section);
  }

  render () {

    const { item, panel, user, buttonstate, upvote } = this.props;

    const buttons = [];

    let promote, details, subtype, harmony;

    console.info("item-buttons", upvote);

    let pursuit = item.upvote.userDidUpvote ? "Pursuing" : "Pursue" ;

    if (buttonstate.promote) {
      promote = (
        <Button small shy success onClick={ this.toggle.bind(this, 'promote') } className="item-promotions">
          <span>{ item.upvote.values['+1'] } pursuit </span>
        </Button>
      );
    } else {
      promote = (
        <Button small shy onClick={ this.toggle.bind(this, 'promote') } className="item-promotions">
          <span>{ item.upvote.values['+1'] } pursuit </span>
        </Button>
      );
    }
    buttons.push(
      <ButtonGroup>
        { promote }
      </ButtonGroup>
    );



    if( user && item.user._id == user.id) {
      if(buttonstate.details) {
        details = (
          <Button small shy success onClick={ this.toggle.bind(this, 'details') } className="toggle-details">
            <span>{ item.popularity.number + '%' } </span>
            <Icon icon="bar-chart" />
          </Button>
        );
      } else {
        details = (
          <Button small shy onClick={ this.toggle.bind(this, 'details') } className="toggle-details">
            <span>{ item.popularity.number + '%' } </span>
            <Icon icon="bar-chart" />
          </Button>
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
            <Button small shy success onClick={ this.toggle.bind(this, 'subtype') } className="subtype-button">
              <span>{ (item.children ? item.children : 0 )} </span>
              <Icon icon="level-down" />
            </Button>
          );
        } else {
            subtype = (
            <Button small shy onClick={ this.toggle.bind(this, 'subtype') } className="subtype-button">
              <span>{ (item.children ? item.children : 0)} </span>
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
