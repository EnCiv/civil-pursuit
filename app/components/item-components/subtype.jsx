'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Icon from '../util/icon';
import Accordion from '../util/accordion';
import TypeComponent from '../type-component';

var Subtype = { button: SubtypeButton, panel= SubtypePanel }
export default Subtype;

class SubtypeButton extends React.Component {

  donothing() {
    return false;
  }

  render() {
    const { buttonState, item } = this.props;
    if (!item.subtype) return null;
    else{
      const buttonName = item.subtype.buttonName || "Delve";
      const min = item.subtype.min || 2;
      const buttonTitle = item.subtype.buttonTitle || {
        active: "Delve into a deeper level of this discussion",
        success: "Return to the higher level of this discusion",
        inactive: "After 2 people Upvote this, the discussion can continue at a deeper level"
      };
      var number = buttonName === 'Start Here' ? ' ' : (item.children ? item.children : 0);
      var success = false, inactive = false;
      var title = "";
      var onClick = this.props.onClick;

      if (item.promotions >= min) {
        if (buttonstate.subtype) {
          success = true;
          title = buttonTitle.success;
        } else {
          title = buttonTitle.active;
        }
      } else {
        inactive = true;
        onClick = this.donothing.bind(this);
        title = buttonTitle.inactive;
      }

      return
      (
        <ButtonGroup>
          <span className="civil-button-info">{number} </span>
          <Button small shy success={success} inactive={inactive} title={title} onClick={onClick} className="subtype-button" title={title}>
            <span className="civil-button-text">{buttonName}</span>
          </Button>
        </ButtonGroup>
      );
    }
  }
}


class SubtypePanel extends React.Component {
  mounted = false;
  render() {
    if (!mounted && !this.props.active) return null; // don't render this unless it's active, or been rendered before
    else {
      this.mounted = true;
      return (
        <div className="toggler subtype">
          <Accordion
            active={this.props.active}
            style={this.props.style}
          >
            <TypeComponent
              {...this.props}
              panel={{ parent: item, type: item.subtype, skip: 0, limit: config['navigator batch size'] }}
              component={'Subtype'}
            />
          </Accordion>
        </div>
      )
    }
  }
}