'use strict';

import React from 'react';
import ButtonGroup from '../util/button-group';
import Button from '../util/button';

exports.button = class EditButton extends React.Component {

    onClick(button) {
        this.props.rasp.toParent({type: "TOGGLE_BUTTON", button: 'Edit', toBeContinuted: true});
        this.props.rasp.toParent({type: "SET_EDIT"});
    }

  render() {
    const { active, item, onClick, rasp } = this.props;
    var success=false;
    var title=null;

      if(rasp.button==='Edit') {
          success=true;
          title="click to edit this";
      } else {
          success=false;
          title="click to post this";
      }
      return(
        <ButtonGroup>
            <span className="civil-button-info">{""}</span>
            <Button
                small
                shy
                success={success}
                onClick={this.onClick.bind(this)}
                title={title}
                className   =   "edit-button"         
            >
                <span className="civil-button-text">{rasp.button==='edit'? 'post':'edit'}</span>
            </Button>
        </ButtonGroup>
      );
  }
}

