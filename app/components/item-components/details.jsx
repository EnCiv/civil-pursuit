'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Icon from '../util/icon';
import Accordion          from '../util/accordion';


var Detail={button: DetailButton, panel= DetailPanel }
export default Detail;

class DetailButton extends React.Component {
  render() {
    const { buttonState, item, onClick } = this.props;
    var success=false;

    if ((item.type && item.type.feedbackMethod!=="hidden") && ( user && item.user && item.user._id == user.id)) {
        if(buttonState.details){
            success=true;
            title="close the feedback panel";
        }else{
            title="View the feedback on your creation";
        }
        return(
            <ButtonGroup>
                <span className="civil-button-info">{ item.popularity.number + '%' }</span>
                <Button small shy success={success} onClick={ onClick } className="toggle-details" title={title} >
                    <span className="civil-button-text">Feedback</span>
                </Button>
            </ButtonGroup>
        )
    } else return null;
  }
}

class DetailPanel extends React.Component {
    mounted=false;
    render(){
      if(!mounted && !this.props.active) return null; // don't render this unless it's active, or been rendered before
      else {
        this.mounted=true;
        return(
            <div className="toggler detail">
                <Accordion
                    active  =   {this.props.active}
                    style   = {this.props.style}
                    >
                    <DetailsStore item={ this.props.item }>
                        <Details />
                    </DetailsStore>
                </Accordion>
            </div>
        )
      }
    }
}