// https://github.com/EnCiv/civil-pursuit/issues/89
// https://github.com/EnCiv/civil-pursuit/issues/297
// https://github.com/EnCiv/civil-pursuit/issues/357

'use strict'
import React, { useEffect, useState, useMemo, useContext, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { JsonForms } from '@jsonforms/react'
import { vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'
import autosize from 'autosize'
import { PrimaryButton } from './button'
import { rankWith, isControl } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import StepIntro from './step-intro'
import { H, Level } from 'react-accessible-headings'

const CustomInputRenderer = withJsonFormsControlProps(({ data, handleChange, path, uischema, schema, classes, errors, isFeedbackForm }) => {
  const options = schema.enum || []
  const label = schema.title || uischema.label
  const id = `input-${path.replace(/\./g, '-')}`
  const textareaRef = useRef(null)
  const isMulti = uischema && uischema.options && uischema.options.multi

  let type
  if (schema.format === 'date') {
    type = 'date'
  } else if (schema.type === 'integer' || schema.type === 'number') {
    type = 'number'
  } else if (schema.type === 'boolean') {
    type = 'checkbox'
  } else if (options.length > 0) {
    type = 'select'
  } else {
    type = 'text'
  }

  const handleInputChange = event => {
    let value
    if (type === 'checkbox') value = event.target.checked
    else if (type === 'number' || schema.type === 'integer') value = parseInt(event.target.value, 10) || 0
    else value = event.target.value
    handleChange(path, value)
  }

  useEffect(() => {
    if (!isMulti) return
    if (textareaRef.current) autosize(textareaRef.current)
    return () => {
      if (textareaRef.current)
        try {
          autosize.destroy(textareaRef.current)
        } catch (e) {}
    }
  }, [isMulti])

  const isError = !!errors

  return (
    <div className={classes.field}>
      {isError && (
        <div
          className={classes.errorInput}
          style={{
            position: 'absolute',
            left: '0.5rem',
            bottom: '-1.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            minHeight: '1rem',
            padding: '0.25rem 0.5rem',
          }}
        >
          {errors}
        </div>
      )}

      <label className={cx(classes.fieldLabel, { [classes.feedbackTextareaLabel]: isFeedbackForm && isMulti })} htmlFor={id}>
        {label}
      </label>

      {type === 'select' ? (
        <select id={id} value={data || ''} onChange={handleInputChange} className={cx(classes.formInput, { [classes.errorInput]: isError })}>
          <option value="" disabled>
            Choose one
          </option>
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : isMulti ? (
        <textarea
          id={id}
          ref={textareaRef}
          value={data || ''}
          onChange={handleInputChange}
          className={cx(classes.formInput, classes.textareaInput, { [classes.errorInput]: isError })}
        />
      ) : (
        <input
          id={id}
          type={type}
          checked={type === 'checkbox' ? !!data : undefined}
          value={type === 'checkbox' ? undefined : data || ''}
          onChange={handleInputChange}
          className={cx(type === 'checkbox' ? classes.checkboxInput : classes.formInput, { [classes.errorInput]: isError })}
        />
      )}
    </div>
  )
})

/* new renderer for H uischema elements */
const HRenderer = ({ uischema, classes }) => {
  const text = (uischema && uischema.text) || ''
  if (!text.trim()) return null
  return <H className={classes.questionText}>{text}</H>
}

/* customRenderers:*/
const customRenderers = [...vanillaRenderers, { tester: rankWith(3, isControl), renderer: CustomInputRenderer }, { tester: rankWith(2, uischema => !!(uischema && uischema.type === 'H')), renderer: HRenderer }]

const JsForm = props => {
  const { className = '', schema = {}, uischema = {}, onDone = () => {}, name, title, stepIntro, discussionId, options = {} } = props
  const { submitOnNext = false } = options
  const isFeedbackForm = /feedback/i.test(name || '')
  const [data, setData] = useState({})
  const [errors, setErrors] = useState([])
  const classes = useStyles(props)
  const lastValidityRef = useRef(null)
  const latestDataRef = useRef({})

  // Keep ref updated with latest form data
  useEffect(() => {
    latestDataRef.current = data
  }, [data])

  useEffect(() => {
    if (!discussionId || !name) return
    let active = true
    window.socket.emit('get-jsform', discussionId, data => {
      if (active && data && data[name] !== undefined) {
        const moreDetails = data[name]
        setData(moreDetails)
        if (handleIsValid(moreDetails, schema, errors)) {
          onDone({ valid: true, value: moreDetails })
        }
      }
    })
    return () => { active = false }
  }, [discussionId, name])

  useEffect(() => {
    if (submitOnNext) {
      const isValid = handleIsValid(data, schema, errors)

      // Only call onDone when validity changes to prevent infinite loops
      if (lastValidityRef.current !== isValid) {
        lastValidityRef.current = isValid

        const onNext = isValid
          ? () => {
              // Read from ref to always get latest data, not stale closure
              window.socket.emit('upsert-jsform', discussionId, name, latestDataRef.current)
            }
          : undefined

        onDone({ valid: isValid, value: data, onNext })
      }
    }
  }, [data, errors, submitOnNext, discussionId, name])

  const handleSubmit = () => {
    const currentData = latestDataRef.current
    window.socket.emit('upsert-jsform', discussionId, name, currentData)
    onDone({ valid: handleIsValid(currentData, schema, errors), value: currentData })
  }

  // useMemo renders (React components) so they don't get rebuilt every time the user types a character
  // This was really a problem with string input because focus went away from the input fields after each time the user typed a character
  const memoedRenderers = useMemo(() => {
    return customRenderers.map(renderer => ({
      ...renderer,
      renderer:
        renderer.renderer === CustomInputRenderer
          ? props => <CustomInputRenderer {...props} classes={classes} isFeedbackForm={isFeedbackForm} />
          : renderer.renderer === HRenderer
            ? props => <HRenderer {...props} classes={classes} />
            : renderer.renderer,
    }))
  }, [schema, uischema, classes, isFeedbackForm])

  const handleIsValid = (data, schema, errors) => {
    if (!data) return false
    if (errors && errors.length > 0) return false
    if (!schema || !schema.properties) return true

    const requiredKeys = schema.required || []
    const props = schema.properties || {}

    return requiredKeys.every(key => {
      if (!props[key]) return false

      if (props[key].type === 'object' && props[key].properties) {
        return Object.keys(props[key].properties).every(prop => !!(data[key] && data[key][prop]))
      }
      return !!data[key]
    })
  }

  const isValid = handleIsValid(data, schema, errors)

  return (
    <div className={cx(classes.formContainer, { [classes.feedbackCard]: isFeedbackForm }, className)}>
      {title && <p className={classes.formTitle}>{title}</p>}
      {stepIntro && <StepIntro {...stepIntro} className={isFeedbackForm ? classes.feedbackIntro : undefined} />}
      <Level>
        <div className={classes.jsonFormContainer}>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={memoedRenderers}
            cells={vanillaCells}
            onChange={({ data, errors }) => {
              setData(data)
              setErrors(errors)
            }}
          />
          {!submitOnNext && (
            <PrimaryButton title={'Submit'} className={classes.actionButton} onDone={handleSubmit} disabled={!isValid}>
              Submit
            </PrimaryButton>
          )}
        </div>
      </Level>
    </div>
  )
}

const useStyles = createUseStyles(theme => ({
  formContainer: props => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    width: '100%',
    backgroundColor: props.mode === 'dark' ? theme.colors.darkModeGray : theme.colors.white,
    color: props.mode === 'dark' ? theme.colors.white : theme.colors.black,
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
  }),
  feedbackCard: {
    boxSizing: 'border-box',
    padding: '2rem',
    border: `0.0625rem solid ${theme.colors.borderGray}`,
    borderTop: `0.25rem solid ${theme.colors.encivYellow}`,
    borderRadius: '0.5rem',
    boxShadow: '0 0.75rem 1.75rem rgba(6, 51, 92, 0.12), 0 0.125rem 0.375rem rgba(0, 0, 0, 0.06)',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      padding: '1.25rem',
    },
  },
  feedbackIntro: {
    paddingBottom: '0.5rem',
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      fontFamily: `${theme.font.fontFamily}, sans-serif !important`,
      fontSize: '1.75rem !important',
      fontWeight: 700,
      lineHeight: 1.25,
    },
    '& p': {
      fontSize: '1rem',
      marginTop: '0.5rem',
    },
  },
  questionText: {
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.5,
    color: theme.colors.primaryButtonBlue,
    margin: '1.5rem 0 0.75rem',
  },
  formTitle: props => ({
    textAlign: 'center',
    color: props.mode === 'dark' ? theme.colors.white : theme.colors.primaryButtonBlue,
    fontSize: '2rem',
  }),
  jsonFormContainer: props => ({
    width: '100%',
    marginBottom: '1rem',
    lineHeight: '2.25rem',
    marginTop: /feedback/i.test(props.name || '') ? '1.5rem' : '4rem',
  }),
  field: {
    position: 'relative',
    marginTop: '0.75rem',
    marginBottom: '2rem',
  },
  fieldLabel: props => ({
    display: 'block',
    marginBottom: '0.625rem',
    color: props.mode === 'dark' ? theme.colors.white : theme.colors.primaryButtonBlue,
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.4,
  }),
  feedbackTextareaLabel: {
    marginBottom: '1.25rem',
  },
  formInput: props => ({
    width: '100%',
    minHeight: '3.5rem !important',
    padding: '0.875rem 1rem !important',
    borderRadius: '0.5rem !important',
    border: `0.1rem solid ${theme.colors.borderGray} !important`,
    backgroundColor: props.mode === 'dark' ? theme.colors.title : theme.colors.white,
    color: props.mode === 'dark' ? theme.colors.cardOutline : theme.colors.title,
    boxSizing: 'border-box',
    fontFamily: `${theme.font.fontFamily}, sans-serif`,
    fontSize: '1.0625rem',
    lineHeight: 1.5,
    boxShadow:
      props.mode === 'dark'
        ? '0 0.125rem 0 rgba(0, 0, 0, 0.32), 0 0.4rem 0.8rem rgba(0, 0, 0, 0.18), inset 0 0.0625rem 0 rgba(255, 255, 255, 0.06)'
        : '0 0.125rem 0 rgba(6, 51, 92, 0.08), 0 0.35rem 0.8rem rgba(6, 51, 92, 0.1), inset 0 0.0625rem 0 rgba(255, 255, 255, 0.8)',
    transition: 'border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
    '&:hover:not(:focus-visible):not(:disabled)': {
      borderColor: `${theme.colors.primaryButtonBlue} !important`,
    },
    '&:focus-visible': {
      borderColor: `${theme.colors.primaryButtonBlue} !important`,
      boxShadow: '0 0 0 0.2rem rgba(6, 51, 92, 0.14), 0 0.35rem 0.8rem rgba(6, 51, 92, 0.1)',
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.65,
    },
  }),
  textareaInput: {
    display: 'block',
    minHeight: '9rem',
    resize: 'vertical',
  },
  checkboxInput: {
    width: '1.25rem',
    height: '1.25rem',
    margin: '0.25rem 0 0',
    accentColor: theme.colors.primaryButtonBlue,
    cursor: 'pointer',
  },
  actionButton: {
    width: '100%',
    margin: '1.5rem 0',
  },
  errorInput: {
    borderColor: `${theme.colors.inputErrorBorder} !important`,
    color: `${theme.colors.inputErrorBorder}`,
    '&:focus-visible': {
      borderColor: `${theme.colors.inputErrorBorder} !important`,
      boxShadow: '0 0 0 0.2rem rgba(191, 19, 0, 0.14), 0 0.35rem 0.8rem rgba(191, 19, 0, 0.1)',
    },
  },
}))

export default JsForm
