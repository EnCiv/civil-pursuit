'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Accordion          from 'react-proactive-accordion';
import Harmony from '../harmony';


class HarmonyButton extends React.Component {
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

class HarmonyPanel extends React.Component {
  mounted = false;
  render() {
    const {active, style, item, rasp, visualMethod}=this.props;
    const nextRASP={shape: visualMethod==='titleize' ? 'title' : 'truncated' , depth: rasp.depth, toParent: rasp.toParent} // RASP 1 to 1 case - subcomponents always start truncated, I'm not saving state so no change in depth, my parent is your parent
    if (!this.mounted && !active) return null; // don't render this unless it's active, or been rendered before
    else {
      this.mounted = true;

      return (
        <div className="toggler harmony" key={item._id+'-toggler-'+this.constructor.name}>
          <Accordion
            active={active}
            style={style}
          >
            <Harmony
              {...this.props}
              rasp={nextRASP}
            />
          </Accordion>
        </div>
      )
    }
  }
}

export {HarmonyPanel as panel, HarmonyButton as button}