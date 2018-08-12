'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';
import Icon from '../util/icon';
import Accordion          from 'react-proactive-accordion';


exports.button = class DetailButton extends React.Component {
  render() {
    const { active, item, onClick, user } = this.props;
    var success=false;
    var title=null;

    if ((item.type && item.type.feedbackMethod!=="hidden") && ( user && item.user && item.user._id == user.id)) {
        if(active){
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

exports.panel = class DetailPanel extends React.Component {
    mounted=false;
    render(){
      if(!this.mounted && !this.props.active) return null; // don't render this unless it's active, or been rendered before
      else {
        this.mounted=true;
        return(
            <div className="toggler detail"  key={this.props.item._id+'-toggler-'+this.constructor.name}>
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