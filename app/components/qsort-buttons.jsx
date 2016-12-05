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

    buttons=Object.keys(buttonstate).map(btn => {
        return(
                <ButtonGroup>
                    <Button small shy 
                    inactive= { buttonstate[btn] } 
                    onClick= { this.toggle.bind(this, qbuttons[btn].name) } 
                    className= {`qsort-${qbuttons[btn].name}`}
                    title= {qbuttons[btn].title[buttonstate[btn]?'active':'inactive']}
                    style={{backgroundColor: qbuttons[btn].color}}
                    >
                        <span className="civil-button-text">{qbuttons[btn].name}</span>
                    </Button>
                </ButtonGroup>
        )
    })
    
    return (<section>{ buttons }</section>);
  }
}

export default QSortButtons;
