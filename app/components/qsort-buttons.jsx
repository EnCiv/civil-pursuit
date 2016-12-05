'use strict';

import React from 'react';
import ButtonGroup      from './util/button-group';
import Button           from './util/button';
import Icon               from './util/icon';

class QSortButtons extends React.Component {
  toggle (section) {
    this.props.toggle(this.props.item._id, section);
  }



  render () {

    const { item, buttonstate, qbuttons} = this.props;

    let buttons = [];

    buttons=qbuttons.map(btn => {
        return(
                <ButtonGroup>
                    <Button small shy 
                    inactive= { buttonstate[btn.name] } 
                    onClick= { this.toggle.bind(this, btn.name) } 
                    className= {`qsort-${btn.name}`}
                    title= {btn.title[buttonstate[btn.name]?'active':'inactive']}
                    style={{backgroundColor: btn.color}}
                    >
                        <span className="civil-button-text">{btn.name}</span>
                    </Button>
                </ButtonGroup>
        )
    })
    
    return (<section>{ buttons }</section>);
  }
}

export default QSortButtons;
