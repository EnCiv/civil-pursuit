import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

function Howdoyoufeel(props) {
    const {
        className = '',
        onDone = () => { },
        title = '',
        disabled = false,
        disableOnClick = false,
        children,
        ...otherProps
    } = props
    const [isDisabled, setIsDisabled] = useState(disabled)
    const classes = buttonStyles()
    const combinedClassName = cx(classes.buttonBase, className)

    return (
        <div>
            <p style={{ fontSize: "35px", fontWeight: "normal" }}>How do you feel about it</p>
            <span>
                <input className={combinedClassName}
                    title={title} disabled={isDisabled} type="Submit" defaultValue="Awesome!"
                    onClick={() => { onDone() }}
                    {...otherProps} /> &nbsp;
                <input className={combinedClassName}
                    title={title} disabled={isDisabled} type="Submit" defaultValue="Just Okay"
                    onClick={() => { onDone() }}
                    {...otherProps} /> &nbsp;
                <input className={combinedClassName}
                    title={title} disabled={isDisabled} type="Submit" defaultValue="Unsatisfied"
                    onClick={() => { onDone() }}
                    {...otherProps} />
            </span>
        </div>
    )
}

function HowdoyoufeelButton(props) {
    const { className, ...otherProps } = props
    const classes = buttonStyles()
    return <Howdoyoufeel {...otherProps} className={cx(classes.Howdoyoufeel, className)} />
}

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

export { Howdoyoufeel, HowdoyoufeelButton }


