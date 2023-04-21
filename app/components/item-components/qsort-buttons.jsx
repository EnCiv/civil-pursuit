'use strict';

import React from 'react';
import ButtonGroup      from '../util/button-group';
import Button           from '../util/button';
import QSortButtonList from '../qsort-button-list';

// button is 'active' even if it has been pushed. By pushing it again, you can change it back to unsosrted

class QSortButtons extends React.Component {
  render () {
    const { item, rasp} = this.props;
    const qbuttons= this.props.qbuttons || QSortButtonList;
    const toParent=rasp.toParent;

    let buttons = [];

    buttons=Object.keys(qbuttons).slice(1).map(btn => {
        var number=[];
        var onClick=null;
        if(typeof qbuttons[btn].total !== 'number') {
            onClick=()=>{
                toParent({type: "TOGGLE_BUTTON", button: btn, toBeContinued: true}); // tell item this button is set
                toParent({type: "TOGGLE_QBUTTON", button: btn, distance: -1}); // tell qsort items this button is set 
            }
        }
        return(
                <ButtonGroup key={item._id+'-'+btn}>
                    {number}
                    <span className="civil-button-info">{typeof qbuttons[btn].total === 'number' ? qbuttons[btn].total : ""}</span>
                    <Button small shy 
                    inactive= { onClick===null } 
                    success= { rasp.button && rasp.button===btn }
                    onClick= { onClick }
                    className= {`qsort-${qbuttons[btn].name}`}
                    title= {qbuttons[btn].title[rasp.button && rasp.button===btn ?'active':'inactive']}
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
export {QSortButtons as button}