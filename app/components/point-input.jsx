'use strict'
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';

// 100 character limit for subject

function PointInput(props) {
    const { style, className, maxWordCount=30, maxCharCount=100, defaultValue={subject: "", description: ""}, onDone=(valid, values={subject: "", description: ""})=>(valid, values)} = props
    const classes = useStyles()
    const [subject, setSubject] = useState(defaultValue.subject)
    const [description, setDescription] = useState(defaultValue.description)
    const [descWordCount, setDescWordCount] = useState(getDescWordCount(description))
    const [subjCharCount, setSubjCharCount] = useState(getSubjCharCount(subject))

    function getDescWordCount(inputText) {
        if(!inputText) return 0
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

    return (
        <>
            <div className={classes.container}>
                <input
                type="text"
                placeholder='Type some thing here'
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className={classes.subject}>

                </input>
                <span
                    className={classes.wordCount}
                >
                {subjCharCount} / {maxCharCount}
                </span>

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    onBlur={() => onDone((isSubjValid(subject) && isDescValid(description)), {subject: subject, description: description})}
                    className={classes.description}>
                </textarea>
                <span
                    className={classes.wordCount}
                >{descWordCount} / {maxWordCount}</span>
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
        },
        '&[type="text"]:hover': {
            ...sharedHoverStyle(theme),
        },
    },
    description: {
        ...sharedInputStyle(theme),
        resize: 'none',
        width: '100%',
        // height:
        padding: '0.9375rem 0.9375rem 1.25rem 0.9375rem',
        '&::placeholder': {
            ...sharedPlaceholderStyle(theme),
        },
        '&:hover': {
            ...sharedHoverStyle(theme),
        },
    },
    wordCount: {
        marginLeft: 'auto',
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
})

const sharedHoverStyle = theme => ({
    backgroundColor: `${theme.colors.cardOutline}`
})


export default PointInput
