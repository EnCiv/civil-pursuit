'use strict'
import React from 'react'
import insertSheet from 'react-jss'
import cx from 'classnames'

function PointLeadButton(props) {
    const { vState, classes } = props

    return (
        <button className={cx(classes[`${vState}Button`])}>Select as Lead</button>
    )
}

const sharedLeadButtonStyles = {
    display: 'flex',
    width: '100%',
    height: 'auto',
    minHeight: '3.125rem',
    padding: '0.5rem 1.25rem',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: '0.5rem',
    border: '2px solid #FFC315',

    fontFamily: 'Inter',
    fontSize: '1rem',
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: '1.5rem',
    textAlign: 'center',
    color: '#1A1A1A',
}

const pointLeadButtonStyles = {
    defaultButton: {
        background: '#FFF',
        ...sharedLeadButtonStyles
    },

    hoverButton: {
        background: '#FFF',
        ...sharedLeadButtonStyles
    },

    mouseDownButton: {
        background: '#FFC315',
        ...sharedLeadButtonStyles
    }
}

export default insertSheet(pointLeadButtonStyles)(PointLeadButton)
