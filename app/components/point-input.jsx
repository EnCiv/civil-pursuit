// https://github.com/EnCiv/civil-pursuit/issues/44
// https://github.com/EnCiv/civil-pursuit/issues/288

'use strict'
import React, { useEffect, useId, useRef, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import autosize from 'autosize'
import ObjectId from 'bson-objectid'

function PointInput(props) {
  const { style = {}, className = '', maxWordCount = 30, maxCharCount = 100, value, onDone = () => {}, ...otherProps } = props
  const classes = useStyles()
  const instanceId = useId()
  const subjectId = `${instanceId}-subject`
  const characterCountId = `${instanceId}-character-count`
  const descriptionId = `${instanceId}-description`
  const wordCountId = `${instanceId}-word-count`
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
      // Bidirectional data pattern (Variant B — render-time mutation): mutate
      // inputState directly instead of calling setInputState, since the component
      // is already re-rendering due to the prop change. See docs/bidirectional-data-pattern.md.
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
    if (!newValue._id) newValue._id = new ObjectId().toString()
    onDone({
      valid: isSubjValid(inputState.subject) && isDescValid(inputState.description),
      value: newValue,
    })
  }

  return (
    <div className={cx(classes.container, className)} {...otherProps}>
      <label className={classes.fieldLabel} htmlFor={subjectId}>Response title</label>
      <input
        id={subjectId}
        type="text"
        placeholder="Type some thing here"
        value={inputState.subject}
        onChange={e => handleSubjectChange(e.target.value)}
        onBlur={handleOnBlur}
        className={cx(classes.subject, classes.sharedInputStyle, subjCharCount > maxCharCount && classes.errorInput)}
        aria-describedby={characterCountId}
      ></input>
      <span id={characterCountId} aria-live="polite" className={cx(subjCharCount > maxCharCount ? classes.errorWordCount : classes.wordCount)}>
        Character count{' '}
        <span
          className={cx({
            [classes.wordCountLimitReached]: subjCharCount >= maxCharCount, // make the text bold
          })}
        >
          {subjCharCount} / {maxCharCount}
        </span>
      </span>

      <label className={classes.fieldLabel} htmlFor={descriptionId}>Response description</label>
      <textarea
        id={descriptionId}
        ref={textareaRef}
        placeholder="Description"
        value={inputState.description}
        onChange={e => handleDescriptionChange(e.target.value)}
        onBlur={handleOnBlur}
        className={cx(classes.description, classes.sharedInputStyle, descWordCount > maxWordCount && classes.errorInput)}
        aria-describedby={wordCountId}
      ></textarea>
      <span id={wordCountId} aria-live="polite" className={cx(descWordCount > maxWordCount ? classes.errorWordCount : classes.wordCount)}>
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
  fieldLabel: {
    color: theme.colors.title,
    fontFamily: theme.font.fontFamily,
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.25,
  },
  sharedInputStyle: {
    borderRadius: '0.625rem',
    border: `0.0625rem solid ${theme.colors.inputBorder}`,
    backgroundColor: theme.colors.white,
    outline: 'none',
    fontFamily: theme.font.fontFamily,
    boxShadow: 'inset 0 0.125rem 0.35rem rgba(26, 26, 26, 0.07), inset 0 0.0625rem 0.125rem rgba(6, 51, 92, 0.04)',
    transition: `border-color ${theme.motion.form} ${theme.motion.standardEase}, box-shadow ${theme.motion.form} ${theme.motion.standardEase}, background-color ${theme.motion.form} ${theme.motion.standardEase}`,
    '&:focus-visible': {
      borderColor: theme.colors.primaryButtonBlue,
      boxShadow: 'inset 0 0.125rem 0.35rem rgba(26, 26, 26, 0.07), 0 0 0 0.15rem rgba(6, 51, 92, 0.12)',
    },
  },
  subject: {
    width: '100%',
    minHeight: '3.5rem',
    boxSizing: 'border-box',
    padding: '0.875rem 1rem',
    '&::placeholder': {
      ...sharedPlaceholderStyle(theme),
    },
    '&[type="text"]': {
      color: theme.colors.title,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    '&[type="text"]:hover': {
      ...sharedHoverStyle(theme),
    },
  },
  description: {
    width: '100%',
    minHeight: '8rem',
    boxSizing: 'border-box',
    resize: 'vertical',
    fontSize: '1.125rem',
    lineHeight: 1.65,
    padding: '1rem 1.125rem',
    '&::placeholder': {
      ...sharedPlaceholderStyle(theme),
    },
    '&:hover': {
      ...sharedHoverStyle(theme),
    },
  },
  wordCount: {
    color: theme.colors.primaryButtonBlue,
    opacity: 1,
    ...sharedWordCountStyle(theme),
  },
  errorInput: {
    borderRadius: '0.625rem',
    ...sharedErrorStyle(theme),
    '&:focus-visible': {
      borderColor: theme.colors.inputErrorBorder,
      boxShadow: 'inset 0 0.125rem 0.35rem rgba(191, 19, 0, 0.08), 0 0 0 0.15rem rgba(191, 19, 0, 0.12)',
    },
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
  fontFamily: theme.font.fontFamily,
  fontWeight: 400,
  fontSize: '1rem',
  lineHeight: 1.5,
  color: theme.colors.encivGray,
  opacity: 0.8,
})

const sharedHoverStyle = theme => ({
  borderColor: theme.colors.hoverGray,
  boxShadow: 'inset 0 0.2rem 0.45rem rgba(26, 26, 26, 0.1)',
})

const sharedErrorStyle = theme => ({
  border: `1px solid ${theme.colors.inputErrorBorder}`,
  background: theme.colors.inputErrorContainer,
  color: theme.colors.inputErrorBorder,
})

const sharedWordCountStyle = theme => ({
  textAlign: 'right',
  fontFamily: theme.font.fontFamily,
  fontSize: '0.75rem',
  fontStyle: 'normal',
  fontWeight: '300',
  lineHeight: '1rem',
})

export default PointInput
