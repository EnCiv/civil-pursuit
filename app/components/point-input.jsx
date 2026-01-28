// https://github.com/EnCiv/civil-pursuit/issues/44
// https://github.com/EnCiv/civil-pursuit/issues/288

'use strict'
import React, { useEffect, useRef, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import autosize from 'autosize'
import ObjectId from 'bson-objectid'

function PointInput(props) {
  const { style = {}, className = '', maxWordCount = 30, maxCharCount = 100, value, onDone = () => {}, ...otherProps } = props
  const classes = useStyles()
  // inputState is for bidirectional state - we will use setInputState to change state values, but sometimers we will just change the value
  // in the object, without returning a new object so we don't cause a rerender
  const [inputState, setInputState] = useState({ subject: value?.subject ?? '', description: value?.description ?? '' })
  const textareaRef = useRef(null)

  // if valaue is changed from above, need to update state and then update the parent about validity
  // there may be other things that have changed in value, besides subject and description so need to update
  // validity to parent even if those things haven't changed
  const [prev, setPrev] = useState({ value, firstRender: true })
  // on first render, if there is a value, we need to call onDone to update the parent about the validity
  if (prev.firstRender) {
    prev.firstRender = false
    if (value) {
      setTimeout(() =>
        onDone({
          valid: isSubjValid(value.subject || '') && isDescValid(value.description || ''),
          value,
        })
      )
    }
  }
  if (prev.value !== value) {
    const subject = value?.subject ?? ''
    const description = value?.description ?? ''
    // if no change, don't do anything.  This happens on first render
    if (!prev.value || !(subject === inputState.subject && description === inputState.description)) {
      // if there was not previous value, then we need to call onDone to update the parent about the validity
      // mutate directly as we are about to render it and don't need to rerender
      inputState.subject = subject
      inputState.description = description
      setTimeout(() =>
        onDone({
          valid: isSubjValid(subject) && isDescValid(description),
          value,
        })
      )
    }
    prev.value = value
  }

  useEffect(() => {
    autosize(textareaRef.current)
    return () => {
      autosize.destroy(textareaRef.current)
    }
  }, [])

  function getDescWordCount(inputText) {
    if (!inputText) return 0
    return inputText.trim().split(/\s+/).length
  }

  function getSubjCharCount(inputText) {
    return inputText.length
  }

  const subjCharCount = getSubjCharCount(inputState.subject)
  const descWordCount = getDescWordCount(inputState.description)

  const isDescValid = inputText => {
    const wordCount = getDescWordCount(inputText)
    return wordCount > 0 && wordCount <= maxWordCount
  }

  const isSubjValid = inputText => {
    const charCount = getSubjCharCount(inputText)
    return charCount > 0 && charCount <= maxCharCount
  }

  const handleSubjectChange = value => {
    setInputState(inputState => ({ ...inputState, subject: value })) // use the setter because subject and descrciption may change before the next rerender wish updates inputState
  }

  const handleDescriptionChange = value => {
    setInputState(inputState => ({ ...inputState, description: value })) // use the setter because subject and descrciption may change before the next rerender wish updates inputState
  }

  const handleOnBlur = e => {
    const newValue = { ...value, ...inputState }
    if (!newValue._id) newValue._id = ObjectId().toString()
    onDone({
      valid: isSubjValid(inputState.subject) && isDescValid(inputState.description),
      value: newValue,
    })
  }

  return (
    <div className={cx(classes.container, className)} {...otherProps}>
      <input
        type="text"
        placeholder="Type some thing here"
        value={inputState.subject}
        onChange={e => handleSubjectChange(e.target.value)}
        onBlur={handleOnBlur}
        className={cx(classes.subject, classes.sharedInputStyle, subjCharCount > maxCharCount && classes.errorInput)}
      ></input>
      <span className={cx(subjCharCount > maxCharCount ? classes.errorWordCount : classes.wordCount)}>
        Character count{' '}
        <span
          className={cx({
            [classes.wordCountLimitReached]: subjCharCount >= maxCharCount, // make the text bold
          })}
        >
          {subjCharCount} / {maxCharCount}
        </span>
      </span>

      <textarea
        ref={textareaRef}
        placeholder="Description"
        value={inputState.description}
        onChange={e => handleDescriptionChange(e.target.value)}
        onBlur={handleOnBlur}
        className={cx(classes.description, classes.sharedInputStyle, descWordCount > maxWordCount && classes.errorInput)}
      ></textarea>
      <span className={cx(descWordCount > maxWordCount ? classes.errorWordCount : classes.wordCount)}>
        Word count{' '}
        <span
          className={cx({
            [classes.wordCountLimitReached]: descWordCount >= maxWordCount, // make the text bold
          })}
        >
          {descWordCount} / {maxWordCount}
        </span>
      </span>
    </div>
  )
}

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
    fontFamily: theme.font.fontFamily,
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
      fontSize: '1.25rem',
      lineHeight: '1.5rem',
    },
    '&[type="text"]:hover': {
      ...sharedHoverStyle(theme),
    },
  },
  description: {
    resize: 'none',
    fontSize: '1rem',
    marginTop: '0.9375rem',
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
      ...sharedErrorStyle(theme),
    },
    '&[type="text"]': {
      ...sharedErrorStyle(theme),
    },
    '&[type="text"]:hover': {
      ...sharedErrorStyle(theme),
    },
  },
  errorWordCount: {
    color: theme.colors.inputErrorWordCount,
    ...sharedWordCountStyle(theme),
  },
  wordCountLimitReached: {
    fontWeight: 'bold',
  },
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
  backgroundColor: `${theme.colors.cardOutline}`,
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
  lineHeight: '1.125rem',
})

export default PointInput
