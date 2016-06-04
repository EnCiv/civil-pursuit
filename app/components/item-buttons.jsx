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

          <span className="civil-button-text">{ pursuit }</span>
        </Button>
      );
    } else {
      if ( item.upvote.userDidUpvote) {
        promote = (
          <Button small shy chosen className="item-promotions">
            <span className="civil-button-text">{ pursuit }</span>
          </Button>
        );
      } else {
        promote = (
          <Button small shy onClick={ this.toggle.bind(this, 'promote') } className="item-promotions">
            <span className="civil-button-text">{ pursuit }</span>
          </Button>
        );
      }
    }
    buttons.push(
      <ButtonGroup>
        <span className="civil-button-info">{ item.upvote.total }</span>
        { promote }
      </ButtonGroup>
    );



    if( user && item.user._id == user.id) {
      if(buttonstate.details) {
        details = (
          <Button small shy success onClick={ this.toggle.bind(this, 'details') } className="toggle-details">
            <span className="civil-button-text">Feedback</span>
          </Button>
        );
      } else {
        details = (
          <Button small shy onClick={ this.toggle.bind(this, 'details') } className="toggle-details">
            <span className="civil-button-text">Feedback</span>
          </Button>
        );
      }
      buttons.push(
        <ButtonGroup>
        <span className="civil-button-info">{ item.popularity.number + '%' }</span>
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
            <span className="civil-button-text">Harmony</span>
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
            <span className="civil-button-text">Harmony</span>
        </Button>
       );
      }
      buttons.push(
        <ButtonGroup>
           <span className="civil-button-info">{ item.harmony.harmony + '%' } </span>
          { harmony } 
        </ButtonGroup>
      );
    }

    if ( item.subtype ) {
      if (item.promotions > 2) {
        if (buttonstate.subtype) {
          subtype = (
            <Button small shy success onClick={ this.toggle.bind(this, 'subtype') } className="subtype-button">
              <span className="civil-button-text">Unravel</span>
            </Button>
          );
        } else {
            subtype = (
            <Button small shy onClick={ this.toggle.bind(this, 'subtype') } className="subtype-button">
              <span className="civil-button-text">Unravel</span>
            </Button>
          );
        } 
      } else
      {
        subtype = (
          <Button small shy inactive className="subtype-button">
            <span className="civil-button-text">Unravel</span>
          </Button>
        );
      }
      buttons.push(
        <ButtonGroup>
         <span className="civil-button-info">{ (item.children ? item.children : 0 )} </span>
          {subtype}
        </ButtonGroup>
        );
    }

    return (<section>{ buttons }</section>);
  }
}

export default ItemButtons;
