'use strict';
import React from 'react';
import Button from './util/button';
import cx from 'classnames';

const styles = cssInJS({
    'doneText': {
        position: 'relative', /* otherwise things that are relative will obscure this when they move around */
        padding: '2em',
        margin: '1em',
        'white-space':      'pre-line',
        'text-align':       'left',
        color: 'black',
        'font-size': '1.2em',
        'transition': '0.5s all linear',
        border: '1px solid #fff',
        'box-shadow':  '0 0 0.0 0.0 rgba(255, 255, 255, 0)',
        display: 'table'
      },
    'doneActive': {
        border: '1px solid #666',
        'box-shadow':  '0 0 0.5em 0.25em rgba(0, 0, 0, 0.3)'

      },
    'doneExplain': {
        display: 'table-cell',
        'vertical-align': 'middle',
        'text-align':  'left',
        'width': '100%'
    },
    'doneButton': {
        display: 'table-cell',
        'vertical-align': 'middle',
        ':button': {
            display: 'inline-block'
        }
    }
})


export default class DoneItem extends React.PureComponent {
    componentWillReceiveProps(newProps){
        if(!this.props.active && newProps.active){
            setTimeout(()=>Synapp.ScrollFocus(this.refs.item,500),500)
        }
    }
    render() {
        const {active, onClick, message, constraints=[]}=this.props;
        return (
            <div className={cx(styles['doneText'], { [styles['doneActive']]: active })} key='done' ref="item" >
                <div className={styles['doneExplain']}>
                    {!active && constraints.map((c,i)=>(<p key={i.toString()}>{c}</p>))}
                    {active ? message : " "}
                </div>
                <div className={styles['doneButton']}>
                    <Button small shy inactive={!active}
                        onClick={onClick} // null is needed here so setState doesn't complain about the mouse event that's the next parameter
                        className="profile-panel-done"
                        style={active ? { backgroundColor: 'black', color: 'white', float: 'right' } : { backgroundColor: 'darkgray', color: 'gray', float: 'right' }}
                    >
                        <span className="civil-button-text">{"next"}</span>
                    </Button>
                </div>
            </div>
        )
    }
}