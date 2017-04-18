'use strict';

import React from 'react';
import ButtonGroup      from './util/button-group';
import Button           from './util/button';
import Icon               from './util/icon';


class Delve extends React.Component {
  toggle (section, e) {
    e.preventDefault();
    this.props.toggle(this.props.item._id, section);
  }

  render(){

      var buttonName=item.subtype.buttonName || "Delve";
      var min=item.subtype.min || 2;
      var buttonTitle=item.subtype.buttonTitle || {active: "Delve into a deeper level of this discussion",
                                                   inactive: "After 2 people Upvote this, the discussion can continue at a deeper level" };
      var number=buttonName === 'Start Here' ? ' ' : (item.children ? item.children : 0);

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

      return 
      (
        <ButtonGroup>
         <span className="civil-button-info">{ number } </span>
          {subtype}
        </ButtonGroup>
        );
  }
}
