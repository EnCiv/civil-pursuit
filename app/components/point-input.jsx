'use strict'
import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import autosize from 'autosize';

// 100 character limit for subject

function PointInput(props) {
    const { style={}, className="", maxWordCount = 30, maxCharCount = 100, defaultValue = { subject: "", description: "" }, onDone = (valid, values = { subject: "", description: "" }) => (valid, values) } = props
    const classes = useStyles()
    const [subject, setSubject] = useState(defaultValue.subject)
    const [description, setDescription] = useState(defaultValue.description)
    const [descWordCount, setDescWordCount] = useState(getDescWordCount(description))
    const [subjCharCount, setSubjCharCount] = useState(getSubjCharCount(subject))
    const [isSubjFocused, setIsSubjFocused] = useState(false)
    const [isDescFocused, setIsDescFocused] = useState(false)
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

    const handleDescriptionBlur = () => {
        setIsDescFocused(false)
        onDone((isSubjValid(subject) && isDescValid(description)), { subject: subject, description: description })
    }

    return (
        <>
            <div className={classes.container}>
                <input
                    type="text"
                    placeholder='Type some thing here'
                    value={subject}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    onFocus={() => setIsSubjFocused(true)}
                    onBlur={() => setIsSubjFocused(false)}
                    className={subjCharCount > maxCharCount ? classes.subject + ' ' + classes.errorInput: classes.subject}>

                </input>
                {isSubjFocused && (<span
                    className={classes.wordCount}
                >
                    {subjCharCount} / {maxCharCount}
                </span>)}

                <textarea
                    ref={textareaRef}
                    placeholder="Description"
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    onBlur={handleDescriptionBlur}
                    onFocus={() => setIsDescFocused(true)}
                    className={descWordCount > maxWordCount ? classes.description + ' ' + classes.errorInput: classes.description}>
                </textarea>
                {isDescFocused && (<span
                    className={classes.wordCount}
                >{descWordCount} / {maxWordCount}</span>)}
            </div>
        </>
    )
};


const useStyles = createUseStyles(theme => ({

    container: {
        display: 'flex',
        flexDirection: 'column',
        top: '4.0625rem',
        left: '2.75rem',
        gap: '0.625rem',
        width: '100%',
        height: '13.125rem',
    },
    subject: {
        ...sharedInputStyle(theme),
        padding: '0.9375rem',
        height: '2.8125rem',
        '&::placeholder': {
            ...sharedPlaceholderStyle(theme),
        },
        '&[type="text"]': {
            border: `0.0625rem solid ${theme.colors.borderGray}`,
            color: theme.colors.title,
            fontSize: '1rem',
            lineHeight: '1.5rem'
        },
        '&[type="text"]:hover': {
            ...sharedHoverStyle(theme),
        },
    },
    description: {
        ...sharedInputStyle(theme),
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
        textAlign: 'right',
        fontFamily: theme.font.fontFamily,
        fontSize: '0.875rem',
        fontStyle: 'normal',
        fontWeight: '300',
        lineHeight: '1.125rem'
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

    }
}))

const sharedPlaceholderStyle = theme => ({
    width: '31.6875rem',
    height: '1.5rem',
    opacity: '50%',
    font: theme.font.fontFamily,
    weight: '400',
    size: '1rem',
    lineHeight: '1.5rem',
    color: theme.colors.encivGray,
})

const sharedInputStyle = theme => ({
    radius: '0.25rem',
    border: `0.0625rem solid ${theme.colors.borderGray}`,
    backgroundColor: `${theme.colors.cardOutline}`,
    outline: 'none',
    fontFamily: theme.font.fontFamily
})

const sharedHoverStyle = theme => ({
    backgroundColor: `${theme.colors.cardOutline}`
})

const sharedErrorStyle = theme => ({
    border: `1px solid ${theme.colors.encivStatesError}`,
    background: theme.colors.encivStatesErrorContainer,
    color: theme.colors.encivStatesError,
})


export default PointInput
