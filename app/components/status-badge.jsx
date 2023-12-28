// https://github.com/EnCiv/civil-pursuit/issues/47

'use strict'
import React from 'react';

function StatusBadge(props) {
    const { style={}, className="", name="", status="", number=undefined, ...otherProps} = props;

    return (
        <span>
            {status}
        </span>
    )
}

export default StatusBadge;
