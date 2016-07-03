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

  donothing() {
    return false;
  }

  render () {

    const { item, panel, user, buttonstate, upvote } = this.props;

    const buttons = [];

    let promote, details, subtype, harmony;

    console.info("item-buttons", upvote);

    let pursuit = item.upvote.userDidUpvote ? "Pursuing" : "Pursue" ;



    if (buttonstate.promote) {
      promote = (
        <Button small shy success onClick={ this.toggle.bind(this, 'promote') } className="item-promotions" title="End pursuit without a choice">

          <span className="civil-button-text">{ pursuit }</span>
        </Button>
      );
    } else {
      if ( item.upvote.userDidUpvote) {
        promote = (
          <Button small shy className="item-promotions" title="Yea! you are in pursuit of this one">
            <span className="civil-button-text">{ pursuit }</span>
          </Button>
        );
      } else {
        promote = (
          <Button small shy onClick={ this.toggle.bind(this, 'promote') } className="item-promotions" title="Begin pursuit">
            <span className="civil-button-text">{ pursuit }</span>
          </Button>
        );
      }
    }
    buttons.push(
      <ButtonGroup>
        <span className="civil-button-info">{ item.promotions }</span>
        { promote }
      </ButtonGroup>
    );



    if( user && item.user._id == user.id) {
      if(buttonstate.details) {
        details = (
          <Button small shy success onClick={ this.toggle.bind(this, 'details') } className="toggle-details" title="Close the feedback view">
            <span className="civil-button-text">Feedback</span>
          </Button>
        );
      } else {
        details = (
          <Button small shy onClick={ this.toggle.bind(this, 'details') } className="toggle-details" title="View the feedback on your creation">
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
            title       =   "Close the harmony view"
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
          title       =   "View two sided discussion of this"
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
            <Button small shy success onClick={ this.toggle.bind(this, 'subtype') } title="Close the next level view" className="subtype-button">
              <span className="civil-button-text">Next</span>
            </Button>
          );
        } else {
            subtype = (
            <Button small shy onClick={ this.toggle.bind(this, 'subtype')} title="Continue to the next level" className="subtype-button">
              <span className="civil-button-text">Next</span>
            </Button>
          );
        } 
      } else
      {
        subtype = (
          <Button small shy inactive onClick={ this.donothing.bind(this)} className="subtype-button" title="When 2 more people pursue this, unraveling can begin">
            <span className="civil-button-text">Next</span>
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
