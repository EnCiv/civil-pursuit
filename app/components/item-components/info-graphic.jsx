'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Accordion          from 'react-proactive-accordion';



class InfoGraphicButton extends React.Component {

  render() {
    let { active, infographicImg, onClick, buttonName='InfoGraph', buttonTitle={active: "Show the Info Graphic", success: "Hide the Info Graphic"} } = this.props;
    let number='';
    if (infographicImg) {

      return (
        <ButtonGroup>
          <span className="civil-button-info">{number} </span>
          <Button small shy success={active}  title={buttonTitle[active ? 'success' : 'active']} onClick={onClick} className="infographic-button" >
            <span className="civil-button-text">{buttonName}</span>
          </Button>
        </ButtonGroup>
      );
    } else return null;
  }
}

class InfoGraphicPanel extends React.Component {
  mounted = false;
  render() {
    const {active, style, item, rasp, infographicImg}=this.props;
    if ((this.mounted===false && active===false) || !infographicImg) return null; // don't render this unless it's active, or been rendered before
    else {
      this.mounted = true;
      return (
        <div className="toggler infographic" key={item._id+'-toggler-'+this.constructor.name}>
          <Accordion
            active={active}
            style={style}
            duration={1500}
          >
            <img src={infographicImg} style={{display: 'block', margin: 0, width: "100%"}} />
          </Accordion>
        </div>
      )
    }
  }
}

export {InfoGraphicButton as button, InfoGraphicPanel as panel}