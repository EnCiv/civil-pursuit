'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Icon from '../util/icon';
import Accordion          from '../util/accordion';
import Harmony from '../harmony';


exports.button = class HarmonyButton extends React.Component {

  render() {
    const { active, item, onClick } = this.props;
    var success=false;
    var title=null;

    if ( item.type && item.type.harmony && item.type.harmony.length ) {
      if(active) {
          success=true;
          title="Close the deliberation view and return to the list";
      } else {
          success=false;
          title="Disect this topic through two sided deliberation";
      }
      return(
        <ButtonGroup>
            <span className="civil-button-info">{ item.harmony.harmony + '%' } </span>
            <Button
                small
                shy
                success={success}
                onClick={onClick}
                title={title}
                className   =   "harmony-button"         
            >
                <span className="civil-button-text">Dissect</span>
            </Button>
        </ButtonGroup>
      );
    } else return null;
  }
}

exports.panel = class HarmonyPanel extends React.Component {
  mounted = false;
  render() {
    if (!this.mounted && !this.props.active) return null; // don't render this unless it's active, or been rendered before
    else {
      this.mounted = true;
      return (
        <div className="toggler harmony">
          <Accordion
            active={this.props.active}
            style={this.props.style}
          >
            <Harmony
              {...this.props}
            />
          </Accordion>
        </div>
      )
    }
  }
}