'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Icon from '../util/icon';
import Accordion from '../util/accordion';
import TypeComponent from '../type-component';
import config from '../../../public.json';
import PanelStore from '../store/panel';


exports.button = class TotalsButton extends React.Component {

  donothing() {
    return false;
  }

  render() {
    const { active, item } = this.props;
    const buttonName = "Totals";
    const buttonTitle = {
      active: "See the dynamic totals",
      success: "Return to the higher level of this discusion",
      inactive: "You need to participate before you can see the totals"
    };
    var number =  ' ';
    var success = false, inactive = false;
    var title = "";
    var onClick = this.props.onClick;

     // if (true) {
    if (active) {
      success = true;
      title = buttonTitle.success;
    } else {
      title = buttonTitle.active;
    }
    //  } 
    //else {
    //    inactive = true;
    //    onClick = this.donothing.bind(this);
    //    title = buttonTitle.inactive;
    //  }

      return (
        <ButtonGroup>
          <span className="civil-button-info">{number} </span>
          <Button small shy success={success} inactive={inactive} title={title} onClick={onClick} className="totals-button" title={title}>
            <span className="civil-button-text">{buttonName}</span>
          </Button>
        </ButtonGroup>
      );
    //} else return null;
  }
}

exports.panel = class TotalsPanel extends React.Component {
  mounted = false;
  render() {
    const {active, style, item, rasp}=this.props;
    const nextRASP={shape: rasp.shape, depth: rasp.depth, toParent: rasp.toParent} // RASP 1 to 1 case - subcomponents always start truncated, I'm not saving state so no change in depth, my parent is your parent
    if ((this.mounted===false && active===false) ) return null; // don't render this unless it's active, or been rendered before
    else {
      this.mounted = true;
      return (
        <div className="toggler totals" key={item._id+'-toggler-'+this.constructor.name}>
          <Accordion
            active={active}
            style={style}
          >
            <PanelStore parent={this.props.parent}
            type={this.props.type}
            limit={20} >
                <QVoteTotals {...this.props} >
                    <PanelHead cssName={'syn-qsort-finale'} >
                        <ReactActionStatePath>
                            <RASPQSortFinale/>
                        </ReactActionStatePath>
                    </PanelHead>
                </QVoteTotals>
            </PanelStore>
          </Accordion>
        </div>
      )
    }
  }
}