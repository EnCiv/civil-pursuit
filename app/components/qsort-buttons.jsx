'use strict';

import React from 'react';
import ButtonGroup      from './util/button-group';
import Button           from './util/button';
import Icon               from './util/icon';

// button is 'active' even if it has been pushed. By pushing it again, you can change it back to unsosrted

class QSortButtons extends React.Component {
  toggle (section) {
    if(this.props.toggle) this.props.toggle(this.props.item._id, section);
  }


  render () {

    const { item, buttonstate, qbuttons} = this.props;

    let buttons = [];

    buttons=Object.keys(buttonstate).map(btn => {
        return(
                <ButtonGroup> 
                    <span className="civil-button-info">{typeof buttonstate[btn] == 'number' ? buttonstate[btn] : ""}</span>
                    <Button small shy 
                    inactive= { false } 
                    onClick= { this.props.toggle ? this.toggle.bind(this, btn) : undefined } 
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
