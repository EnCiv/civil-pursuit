'use strict';

import React from 'react';
import Row from '../../util/row';
import Column from '../../util/column';

// choices is an array of checkbox objects.
// checkboxes must have a name.  They may have an _id (like a MongoDB _id), but if they don't the name will be used as the id.
// onChange is called after each change with null if nothing is checked, or an array of the checked _id's
// property is require and is the property name to be found in this.prop.info
//
export default class staticProfileCheckbox extends React.Component {
    choices=[{name: 'Choice1', _id: 1}, {name:'Choice 2', _id: 2}];
    boxes = {};
    state={};

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    saveInfo() {
        var arr = [];
        Object.keys(this.boxes).forEach(box => {
            if (this.boxes[box].checked) arr.push(box);
        })
        if(this.props.onChange) this.props.onChange({[this.props.property]: arr.length ? arr : null});
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        const { info, property } = this.props;

        return (
            <div>
                <Row key="header" className="syn-checkbox-header">Check all that apply</Row>
                {this.choices.map(checkBox => (
                    <Row key={checkBox.name} className={'checkbox-' + property} id={'checkbox-' + property + '-' + (checkBox._id || checkBox.name)}>
                        <Column className="gutter">
                            {checkBox.name}
                        </Column>
                        <Column className="gutter">
                            <input
                                ref={e => { if (e) this.boxes[(checkBox._id || checkBox.name)] = e }}
                                type="checkbox"
                                onChange={this.saveInfo.bind(this)}
                                value={checkBox._id || checkBox.name}
                                defaultChecked={(info[property] || []).some(r => r === (checkBox._id || checkBox.name))}
                            />
                        </Column>
                    </Row>
                ))}
            </div>
        );
    }
}

