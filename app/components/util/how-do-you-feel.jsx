//https://github.com/EnCiv/civil-pursuit/issues/62
import React from 'react'
import { createUseStyles } from 'react-jss'
import { Button } from '../button'

const responseOptions = ['Awesome!', 'Just Okay', 'Unsatisfied']
export default function HowDoYouFeel(props) {
    const { disabled = false, className, onDone, title = '', ...otherProps } = props
    const styleClasses = rankingStyleClasses(props)
    const onSelection = e => {
        onDone({ valid: true, value: e.target.value })
    }
    return (
        <>
            <p className={styleClasses.textStyle}>How do you feel about it</p>
            <div className={styleClasses.group}{...otherProps}>
                {responseOptions.map(option => {
                    return (
                        <label>
                            <Button
                                title={title}
                                onClick={onSelection}
                                value={option}
                                className={styleClasses.Howdoyoufeel}
                            >{option}</Button>
                        </label>
                    )
                })}
            </div >
        </>
    )
}
const rankingStyleClasses = createUseStyles(theme => ({
    group: { display: 'flex', gap: '1.4375rem' },
    textStyle: { fontSize: "2.4rem", fontWeight: "normal" },
    Howdoyoufeel: {
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
