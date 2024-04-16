import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

const responseOptions = ['Awesome!', 'Just Okay', 'Unsatisfied']

export default function HowDoYouFeel(props) {
    //Isolate props and set initial state
    const { disabled, className, onDone, ...otherProps } = props
    const styleClasses = rankingStyleClasses(props)
    const classes = buttonStyles()
    const combinedClassName = cx(classes.Howdoyoufeel, className)
    const textClasses = textStyles()
    const textClassName = cx(textClasses.textStyle)
    const onSelection = e => {
        onDone({ valid: true, value: e.target.value })
    }
    return (
        <>
            <p className={textClassName}>How do you feel about it</p>
            <div className={cx(className, styleClasses.group, disabled)}{...otherProps}>
                {responseOptions.map(option => {
                    return (
                        <label>
                            <button
                                onClick={onSelection}
                                value={option}
                                className={combinedClassName}
                            >{option}</button>
                        </label>
                    )
                })}
            </div >
        </>
    )
}

const rankingStyleClasses = createUseStyles({
    optionIcon: { height: 'inherit', color: 'inherit', marginRight: '0.125rem' },
    option: { display: 'flex', height: '1.5rem', lineHeight: '1.5rem', color: 'inherit' },
    group: { display: 'flex', gap: '1.4375rem' },
    disabled: { opacity: '30%' },
    hideDefaultRadio: { display: 'none !important' },
})
const textStyles = createUseStyles(theme => ({
    textStyle: {
        fontSize: "2.4rem",
        fontWeight: "normal"
    },
}))

const buttonStyles = createUseStyles(theme => ({
    buttonBase: {
        // These are common styles
        width: 'auto',
        height: 'auto',
        borderRadius: '0.5rem',
        padding: '0.5rem 1.25rem',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: '1.5rem',
        textAlign: 'center',
        // Add any other common styles here
    },

    Howdoyoufeel: {
        extend: 'buttonBase',
        backgroundColor: theme.colors.white,
        color: theme.colors.primaryButtonBlue,
        border: `0.125rem solid ${theme.colors.primaryButtonBlue}`,

        '&:focus': {},

        '&:disabled': {
            backgroundColor: theme.colors.white,
            color: theme.colors.disableGray,
            border: `0.125rem solid ${theme.colors.disableSecBorderGray}`,
            textDecoration: 'none',
            transition: 'none',
        },

        '&:hover, &.hover': {
            textDecoration: 'underline',
            backgroundColor: theme.colors.white,
            borderColor: theme.colors.primaryButtonBlue,
        },

        '&:active': {
            backgroundColor: theme.colors.primaryButtonBlue,
            color: theme.colors.white,
            border: `0.125rem solid ${theme.colors.primaryButtonBlue}`,
            textDecoration: 'none',
        },
    },
}))