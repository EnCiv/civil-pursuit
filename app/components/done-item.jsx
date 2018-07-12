'use strict';
import React from 'react';
import Button from './util/button';
import cx from 'classnames';



export default class DoneItem extends React.PureComponent {
    componentWillReceiveProps(newProps){
        if(!this.props.doneActive && newProps.doneActive){
            setTimeout(()=>Synapp.ScrollFocus(this.refs.item,500),500)
        }
    }
    render() {
        const {doneActive, onClick, message}=this.props;
        return (
            <div className={cx('done-text', { ['done-active']: doneActive })} key='done' ref="item" >
                {doneActive ? message : " "}
                <Button small shy inactive={!doneActive}
                    onClick={onClick} // null is needed here so setState doesn't complain about the mouse event that's the next parameter
                    className="profile-panel-done"
                    style={doneActive ? { backgroundColor: 'black', color: 'white', float: 'right' } : { backgroundColor: 'darkgray', color: 'gray', float: 'right' }}
                >
                    <span className="civil-button-text">{"next"}</span>
                </Button>
            </div>
        )
    }
}