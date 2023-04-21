'use strict';

import React from 'react';
import Input from '../util/input';


export default class GenderIdentity extends React.Component {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    saveInfo(v) {
        const specify = v.value || '';
        if (specify && this.props.onChange) this.props.onChange({ gender_identity: { specify } });
        else if (!specify && this.props.onChange) this.props.onChange({gender_identity: null});
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    render() {

        let { info={} } = this.props;
        let { specify = '' } = info.gender_identity || {};

        return (
            <div>
                <div className="specify-other">
                    <Input onChange={this.saveInfo.bind(this)} defaultValue={specify} />
                </div>
            </div>
        );
    }
}
