// https://github.com/EnCiv/civil-pursuit/issues/44

'use strict'
import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import cx from 'classnames';
import autosize from 'autosize';

function PointInput(props) {
    const { style={}, className="", maxWordCount = 30, maxCharCount = 100, defaultValue = {description: "", subject: ""}, onDone = ()=>{}, ...otherProps} = props
    const classes = useStyles()
    const [subject, setSubject] = useState(defaultValue?.subject ?? "")
    const [description, setDescription] = useState(defaultValue?.description ?? "")
    const [descWordCount, setDescWordCount] = useState(getDescWordCount(description))
    const [subjCharCount, setSubjCharCount] = useState(getSubjCharCount(subject))
    const textareaRef = useRef(null);

    useEffect(() => {
        autosize(textareaRef.current)

        return () => {
            autosize.destroy(textareaRef.current)
        }
    }, [])

    function getDescWordCount(inputText) {
        if (!inputText) return 0
        return inputText.trim().split(/\s+/).length;
    }

    function getSubjCharCount(inputText) {
        return inputText.length
    }


    const isDescValid = inputText => {
        const wordCount = getDescWordCount(inputText)
        return wordCount > 0 && wordCount <= maxWordCount
    }

    const isSubjValid = inputText => {
        const charCount = getSubjCharCount(inputText)
        return charCount > 0 && charCount <= maxCharCount
    }

    const handleSubjectChange = (value) => {
        setSubject(value)
        setSubjCharCount(getSubjCharCount(value))
    }

    const handleDescriptionChange = (value) => {
        setDescription(value)
        setDescWordCount(getDescWordCount(value))
    }

    const handleOnBlur = () => {
        onDone((isSubjValid(subject) && isDescValid(description)), ({ subject, description }))
    }

    return (
            <div className={cx(classes.container, className)} {...otherProps}>
                <input
                    type="text"
                    placeholder='Type some thing here'
                    value={subject}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    onBlur={handleOnBlur}
                    className={cx(classes.subject, classes.sharedInputStyle, (subjCharCount > maxCharCount && classes.errorInput))}
                    >

                </input>
                <span
                    className={subjCharCount > maxCharCount ? classes.errorWordCount : classes.wordCount}
                >
                    {subjCharCount} / {maxCharCount}
                </span>

                <textarea
                    ref={textareaRef}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    onBlur={handleOnBlur}
                    className={cx(classes.description, classes.sharedInputStyle, (descWordCount > maxWordCount && classes.errorInput))}
                    >
                </textarea>
                <span
                    className={descWordCount > maxWordCount ? classes.errorWordCount : classes.wordCount}
                >{descWordCount} / {maxWordCount}</span>
            </div>
    )
};


const useStyles = createUseStyles(theme => ({

    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
        width: '100%',
    },
    sharedInputStyle: {
        radius: '0.25rem',
        border: `0.0625rem solid ${theme.colors.inputBorder}`,
        backgroundColor: `${theme.colors.cardOutline}`,
        outline: 'none',
        fontFamily: theme.font.fontFamily
    },
    subject: {
        padding: '0.9375rem',
        height: '2.8125rem',
        '&::placeholder': {
            ...sharedPlaceholderStyle(theme),
        },
        '&[type="text"]': {
            border: `0.0625rem solid ${theme.colors.inputBorder}`,
            color: theme.colors.title,
            fontSize: '1rem',
            lineHeight: '1.5rem'
        },
        '&[type="text"]:hover': {
            ...sharedHoverStyle(theme),
        },
    },
    description: {
        resize: 'none',
        width: '100%',
        padding: '0.9375rem 0.9375rem 1.25rem 0.9375rem',
        '&::placeholder': {
            ...sharedPlaceholderStyle(theme),
        },
        '&:hover': {
            ...sharedHoverStyle(theme),
        },
    },
    wordCount: {
        color: theme.colors.inputWordCount,
        ...sharedWordCountStyle(theme),
    },
    errorInput: {
        borderRadius: '0.25rem',
        ...sharedErrorStyle(theme),
        '&:hover': {
            ...sharedErrorStyle(theme)
        },
        '&[type="text"]': {
            ...sharedErrorStyle(theme)
        },
        '&[type="text"]:hover': {
            ...sharedErrorStyle(theme)
        }
    },
    errorWordCount: {
        color: theme.colors.inputErrorWordCount,
        ...sharedWordCountStyle(theme)
    }
}))

const sharedPlaceholderStyle = theme => ({
    height: '1.5rem',
    opacity: '50%',
    font: theme.font.fontFamily,
    weight: '400',
    size: '1rem',
    lineHeight: '1.5rem',
    color: theme.colors.encivGray,
})

const sharedHoverStyle = theme => ({
    backgroundColor: `${theme.colors.cardOutline}`
})

const sharedErrorStyle = theme => ({
    border: `1px solid ${theme.colors.inputErrorBorder}`,
    background: theme.colors.inputErrorContainer,
    color: theme.colors.inputErrorBorder,
})

const sharedWordCountStyle = theme => ({
    textAlign: 'right',
    fontFamily: theme.font.fontFamily,
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: '300',
    lineHeight: '1.125rem'
})


export default PointInput
