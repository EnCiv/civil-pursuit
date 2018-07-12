'use strict';
import React from 'react';
import Button from './util/button';
import cx from 'classnames';



export default class DoneItem extends React.PureComponent {
    componentWillReceiveProps(newProps){
        if(!this.props.active && newProps.active){
            setTimeout(()=>Synapp.ScrollFocus(this.refs.item,500),500)
        }
    }
    render() {
        const {active, onClick, message}=this.props;
        return (
            <div className={cx('done-text', { ['done-active']: active })} key='done' ref="item" >
                {active ? message : " "}
                <Button small shy inactive={!active}
                    onClick={onClick} // null is needed here so setState doesn't complain about the mouse event that's the next parameter
                    className="profile-panel-done"
                    style={active ? { backgroundColor: 'black', color: 'white', float: 'right' } : { backgroundColor: 'darkgray', color: 'gray', float: 'right' }}
                >
                    <span className="civil-button-text">{"next"}</span>
                </Button>
            </div>
        )
    }
}