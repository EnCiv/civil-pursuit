'use strict'
import React from 'react'
import insertSheet from 'react-jss'
import cx from 'classnames'

function PointButton(props) {
    const { vState, classes } = props

    return (
        <button className={cx(classes[`${vState}Button`])}>Select as Lead</button>
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

export default insertSheet(pointButtonStyles)(PointButton)
