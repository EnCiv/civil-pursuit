'use strict';

import React from 'react';
import Row from '../util/row';
import Column from '../util/column';

class Race extends React.Component {
    name = 'race';
    boxes = {};
    state={};

    componentDidMount() {
        window.socket.emit('get races', checkBoxData => this.setState({ checkBoxData }));
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    saveInfo() {
        var arr = [];
        Object.keys(this.boxes).forEach(box => {
            if (this.boxes[box].checked) arr.push(box);
        })
        if(this.props.onChange) this.props.onChange({[this.name]: arr.length ? arr : null});
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        const { children, info, collection, property, ...newProps } = this.props;
        const { checkBoxData = [] } = this.state;

        return (
            <div>
                <Row key="header" className="syn-checkbox-header">Check all that apply</Row>
                {checkBoxData.map(checkBox => (
                    <Row key={checkBox._id} className={'checkbox-' + this.name} id={'checkbox-' + this.name + '-' + checkBox._id}>
                        <Column className="gutter">
                            {checkBox.name}
                        </Column>
                        <Column className="gutter">
                            <input
                                ref={e => { if (e) this.boxes[checkBox._id] = e }}
                                type="checkbox"
                                onChange={this.saveInfo.bind(this)}
                                value={checkBox._id}
                                defaultChecked={(info[this.name] || []).some(r => r === checkBox._id)}
                            />
                        </Column>
                    </Row>
                ))}
            </div>
        );
    }
}

export default Race;
