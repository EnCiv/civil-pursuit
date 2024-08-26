// https://github.com/EnCiv/civil-pursuit/issues/44

'use strict'
import React, { useEffect, useRef, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import autosize from 'autosize'

function PointInput(props) {
  const {
    style = {},
    className = '',
    maxWordCount = 30,
    maxCharCount = 100,
    value = { description: '', subject: '' },
    onDone = () => {},
    ...otherProps
  } = props
  const classes = useStyles()

  // biState is for bidirectional state - we will use setBiState to change state values, but sometimers we will just change the value
  // in the object, without returning a new object so we don't cause a rerender
  const [biState, setBiState] = useState({ subject: value?.subject ?? '', description: value?.description ?? '' })
  const [descWordCount, setDescWordCount] = useState(getDescWordCount(biState.description))
  const [subjCharCount, setSubjCharCount] = useState(getSubjCharCount(biState.subject))
  const textareaRef = useRef(null)

  // if valaue is changed from above, need to update state and then update the parent about validity
  useEffect(() => {
    const subject = value.subject ?? ''
    const description = value.description ?? ''
    // if no change, don't do anything.  This happens on first render
    if (subject === biState.subject && description === biState.description) return
    // calling the setter with the new data, to cause a rerender
    setBiState(biState => ({ subject, description })) // no ...biState because nothing else in there

    onDone({
      valid: isSubjValid(subject) && isDescValid(description),
      value: { ...value },
    })
  }, [value.subject, value.description])

  useEffect(() => {
    autosize(textareaRef.current)
    // on initial render, if there are initial values, call onDone to update the parent about their validity
    if (value.subject || value.description) {
      setTimeout(handleOnBlur)
    }
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

  const isDescValid = inputText => {
    const wordCount = getDescWordCount(inputText)
    return wordCount > 0 && wordCount <= maxWordCount
  }

  const isSubjValid = inputText => {
    const charCount = getSubjCharCount(inputText)
    return charCount > 0 && charCount <= maxCharCount
  }

  const handleSubjectChange = value => {
    setBiState(biState => ((biState.subject = value), biState)) // use the setter but don't create a new object and cause a rerender
    setSubjCharCount(getSubjCharCount(value))
  }

  const handleDescriptionChange = value => {
    // the biState pattern is not to call the setter onChange, because the input component will display value as soon as it's changed by the user,
    // but with textArea, the calling the setter is required
    setBiState(biState => ({ ...biState, description: value }))
    setDescWordCount(getDescWordCount(value))
  }

  const handleOnBlur = e => {
    onDone({
      valid: isSubjValid(biState.subject) && isDescValid(biState.description),
      value: { ...value, ...biState },
    })
  }

  return (
    <div className={cx(classes.container, className)} {...otherProps}>
      <input
        type="text"
        placeholder="Type some thing here"
        value={biState.subject}
        onChange={e => handleSubjectChange(e.target.value)}
        onBlur={handleOnBlur}
        className={cx(classes.subject, classes.sharedInputStyle, subjCharCount > maxCharCount && classes.errorInput)}
      ></input>
      <span className={subjCharCount > maxCharCount ? classes.errorWordCount : classes.wordCount}>
        {subjCharCount} / {maxCharCount}
      </span>

      <textarea
        ref={textareaRef}
        placeholder="Description"
        value={biState.description}
        onChange={e => handleDescriptionChange(e.target.value)}
        onBlur={handleOnBlur}
        className={cx(
          classes.description,
          classes.sharedInputStyle,
          descWordCount > maxWordCount && classes.errorInput
        )}
      ></textarea>
      <span className={descWordCount > maxWordCount ? classes.errorWordCount : classes.wordCount}>
        {descWordCount} / {maxWordCount}
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
      fontSize: '1rem',
      lineHeight: '1.5rem',
    },
    '&[type="text"]:hover': {
      ...sharedHoverStyle(theme),
    },
  },
  description: {
    resize: 'none',
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
