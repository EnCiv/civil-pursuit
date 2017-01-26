'use strict';

import React from 'react';
import ButtonGroup      from './util/button-group';
import Button           from './util/button';
import Icon               from './util/icon';

class ItemButtons extends React.Component {
  toggle (section, e) {
    e.preventDefault();
    this.props.toggle(this.props.item._id, section);
  }

  donothing() {
    return false;
  }

  render () {

    const { item, panel, user, buttonstate, upvote } = this.props;

    const buttons = [];

    let promote, details, subtype, harmony;

    let promoteButtonLabel;

    console.info("ItemButtons");

    if( panel && panel.type && panel.type.promoteButtonLabel) {
      promoteButtonLabel = item.upvote.userDidUpvote ? panel.type.promoteButtonLabel.active : panel.type.promoteButtonLabel.inactive;
    } else {
     promoteButtonLabel = item.upvote.userDidUpvote ? "Upvoted" : "Upvote" ;
    }

    if(item.type && item.type.promoteMethod!="hidden") {
      if(user){
        if (buttonstate.promote) {
          promote = (
            <Button small shy success onClick={ this.toggle.bind(this, 'promote') } className="item-promotions" title="End upvote without a choice">

              <span className="civil-button-text">{ promoteButtonLabel }</span>
            </Button>
          );
        } else {
          if ( item.upvote.userDidUpvote) {
            promote = (
              <Button small shy inactive className="item-promotions" title="Yea! you've upvoted this one">
                <span className="civil-button-text">{ promoteButtonLabel }</span>
              </Button>
            );
          } else {
            promote = (
              <Button small shy onClick={ this.toggle.bind(this, 'promote') } className="item-promotions" title="Upvote this">
                <span className="civil-button-text">{ promoteButtonLabel }</span>
              </Button>
            );
          }
        }
      } else {
          promote = (
            <Button small shy inactive className="item-promotions" title="Join so you can upvote this discussion">
              <span className="civil-button-text">{ promoteButtonLabel }</span>
            </Button>
          );
      }
      buttons.push(
        <ButtonGroup>
          <span className="civil-button-info">{ item.promotions }</span>
          { promote }
        </ButtonGroup>
      );
    }


    if( user && item.user && item.user._id == user.id) {
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

{/*
    if ( item.type && item.type.harmony && item.type.harmony.length ) {
      if(buttonstate.harmony) {
        harmony = (
          <Button
            small
            shy
            success
            onClick     =   { this.toggle.bind(this, 'harmony') }
            className   =   "harmony-button"
            title       =   "Close the deliberation view and return to the list"
            >
            <span className="civil-button-text">Dissect</span>
          </Button>
         );
      } else {
        harmony = ( 
          <Button
          small
          shy
          onClick     =   { this.toggle.bind(this, 'harmony') }
          className   =   "harmony-button"
          title       =   "Disect this topic through two sided deliberation"
          >
            <span className="civil-button-text">Dissect</span>
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
*/}
    if ( item.subtype ) {
      var buttonName=item.subtype.buttonName || "Delve";
      var min=item.subtype.min || 2;
      var buttonTitle=item.subtype.buttonTitle || {active: "Delve into a deeper level of this discussion",
                                                   inactive: "After 2 people Upvote this, the discussion can continue at a deeper level" };

      if (item.promotions >= min) {
        if (buttonstate.subtype) {
          subtype = (
            <Button small shy success onClick={ this.toggle.bind(this, 'subtype') } title="Return to the higher level of this discusion" className="subtype-button">
              <span className="civil-button-text">{buttonName}</span>
            </Button>
          );
        } else {
            subtype = (
            <Button small shy onClick={ this.toggle.bind(this, 'subtype')} title={buttonTitle.active} className="subtype-button">
              <span className="civil-button-text">{buttonName}</span>
            </Button>
          );
        } 
      } else
      {
        subtype = (
          <Button small shy inactive onClick={ this.donothing.bind(this)} className="subtype-button" title={buttonTitle.inactive}>
            <span className="civil-button-text">{buttonName}</span>
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
