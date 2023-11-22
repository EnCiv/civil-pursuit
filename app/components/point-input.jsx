'use strict'
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';

function PointInput(props) {
    const { style, className, maxWordCount=30, defaultValue={subject: "", description: ""} } = props
    const classes = useStyles()
    const [subject, setSubject] = useState(defaultValue.subject)
    const [description, setDescription] = useState(defaultValue.description)
    const [wordCount, setWordCount] = useState(getWordCount(description))

    function getWordCount(inputText) {
        if(!inputText) return 0
        return inputText.trim().split(/\s+/).length;
    }

    const isValidWordCount = inputText => {
        const wordCount = getWordCount(inputText)
        return wordCount > 0 && wordCount <= maxWordCount
    }


    const handleSubjectChange = (value) => {
        setSubject(value)
    }

    const handleDescriptionChange = (value) => {
        setDescription(value)
        setWordCount(getWordCount(value))
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
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    className={classes.description}>
                </textarea>
                <span className={classes.wordCount}>{wordCount} / {maxWordCount}</span>
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
