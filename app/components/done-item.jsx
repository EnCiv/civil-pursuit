'use strict';
import React from 'react';
import Button from './util/button';
import cx from 'classnames';
import injectSheet from 'react-jss'
import publicConfig from '../../public.json'

const styles = {
    'doneText': {
        position: 'relative', /* otherwise things that are relative will obscure this when they move around */
        padding: '2em',
        margin: '1em',
        'white-space':      'pre-line',
        'text-align':       'left',
        color: 'black',
        'font-size': '1.2em',
        'transition': `${publicConfig.timeouts.animation}ms all linear`,
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
}


class DoneItem extends React.PureComponent {
    componentDidMount(){
        const advance=this.props.autoAdvance || this.props.onClick;
        if(this.props.active && !(this.props.constraints && this.props.constraints.length) && this.props.populated && advance)
            setTimeout(()=>advance(null),publicConfig.timeouts.glimpse); // null is needed here so setState doesn't complain about the mouse event that's the next parameter
    }
    componentWillReceiveProps(newProps){
        const advance=this.props.autoAdvance || this.props.onClick;
        if(newProps.active && !(newProps.constraints && newProps.constraints.length) && !this.props.populated && newProps.populated && advance)
            setTimeout(()=>advance(null),publicConfig.timeouts.glimpse); // null is needed here so setState doesn't complain about the mouse event that's the next parameter
        else if(!this.props.active && newProps.active){
            setTimeout(()=>{Synapp.ScrollFocus(this.refs.item,publicConfig.timeouts.animation),publicConfig.timeouts.animation})
        }
    }
    render() {
        const {active, onClick, message, constraints=[], classes}=this.props;
        return (
            <div className={cx(cx(classes['doneText']), { [cx(classes['doneActive'])]: active })} key='done' ref="item" >
                <div className={cx(classes['doneExplain'])}>
                    {!active && constraints.map((c,i)=>(<p key={i.toString()}>{c}</p>))}
                    {active ? message : " "}
                </div>
                <div className={cx(classes['doneButton'])}>
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

export default injectSheet(styles)(DoneItem);