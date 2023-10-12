'use strict'
import React from 'react'

function PointButton(props) {
    const { vState } = props

    return (

        <button style={pointButtonStyles[`${vState}Button`]}>Select as Lead</button>
    )
}

const sharedButtonStyles = {
    display: 'flex',
    width: '100%',
    height: 'auto',
    minHeight: '50px',
    padding: '8px 20px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '8px',
}

const pointButtonStyles = {
    defaultButton: {
        border: '2px solid #FFC315',
        background: '#FFF',
        ...sharedButtonStyles
    },

    hoverButton: {
        border: '2px solid #FFC315',
        background: '#FFF',
        ...sharedButtonStyles
    },

    mouseDownButton: {
        background: '#FFC315',
        ...sharedButtonStyles
    }
}

export default PointButton;
