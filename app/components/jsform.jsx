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

const CustomInputRenderer = withJsonFormsControlProps(({ data, handleChange, path, uischema, schema, classes, errors }) => {
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
    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
      <label htmlFor={id}>{label}</label>

      {isError && (
        <div className={classes.errorInput}
          style={{
            position: 'absolute',
            top: '-1.25rem',
            left: 0,
            fontSize: '0.875rem',
            lineHeight: '2.0rem',
            minHeight: '1rem',
          }}
        >
          {errors}
        </div>
      )}

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
        <textarea id={id} ref={textareaRef} value={data || ''} onChange={handleInputChange} className={cx(classes.formInput, { [classes.errorInput]: isError })} />
      ) : (
        <input id={id} type={type} checked={type === 'checkbox' ? !!data : undefined} value={type === 'checkbox' ? undefined : data || ''} onChange={handleInputChange} className={cx(classes.formInput, { [classes.errorInput]: isError })} />
      )}
    </div>
  )
})

/* new renderer for H uischema elements */
const HRenderer = ({ uischema, path }) => {
  const text = (uischema && uischema.text) || ''
  return <H>{text}</H>
}

/* customRenderers:*/
const customRenderers = [...vanillaRenderers, { tester: rankWith(3, isControl), renderer: CustomInputRenderer }, { tester: rankWith(2, uischema => !!(uischema && uischema.type === 'H')), renderer: HRenderer }]

const JsForm = props => {
  const { className = '', schema = {}, uischema = {}, onDone = () => {}, name, title, stepIntro, discussionId } = props
  const [data, setData] = useState({})
  const [errors, setErrors] = useState([])
  const classes = useStyles(props)

  useEffect(() => {
    window.socket.emit('get-jsform', discussionId, data => {
      if (data) {
        const moreDetails = data[name] || {}
        setData(moreDetails)
        if (handleIsValid(moreDetails, schema, errors)) {
          onDone({ valid: true, value: moreDetails })
        }
      }
    })
  }, [])

  const handleSubmit = () => {
    window.socket.emit('upsert-jsform', discussionId, name, data)
    onDone({ valid: handleIsValid(data, schema, errors), value: data })
  }

  // useMemo renders (React components) so they don't get rebuilt every time the user types a character
  // This was really a problem with string input because focus went away from the input fields after each time the user typed a character
  const memoedRenderers = useMemo(() => {
    return customRenderers.map(renderer => ({
      ...renderer,
      renderer: renderer.renderer === CustomInputRenderer ? props => <CustomInputRenderer {...props} classes={classes} /> : renderer.renderer,
    }))
  }, [schema, uischema])

  const handleIsValid = (data, schema, errors) => {
    if (!data) return false
    if (errors && errors.length > 0) return false
    if (!schema || !schema.properties) return true // nothing to validate

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
    <div className={cx(classes.formContainer, className)}>
      {title && <p className={classes.formTitle}>{title}</p>}
      {stepIntro && <StepIntro {...stepIntro} />}
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
          <PrimaryButton title={'Submit'} className={classes.actionButton} onDone={handleSubmit} disabled={!isValid}>
            Submit
          </PrimaryButton>
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
    fontFamily: 'Inter',
  }),
  formTitle: props => ({
    textAlign: 'center',
    color: props.mode === 'dark' ? theme.colors.white : theme.colors.primaryButtonBlue,
    fontSize: '2rem',
  }),
  jsonFormContainer: {
    width: '100%',
    marginBottom: '1rem',
    lineHeight: '2.25rem',
    marginTop: '4rem',
  },
  formInput: props => ({
    width: '100%',
    padding: '0.625rem !important',
    borderRadius: '0.25rem !important',
    border: `0.1rem solid ${theme.colors.borderGray} !important`,
    backgroundColor: props.mode === 'dark' ? theme.colors.title : theme.colors.cardOutline,
    color: props.mode === 'dark' ? theme.colors.cardOutline : theme.colors.title,
    boxSizing: 'border-box',
  }),
  actionButton: {
    width: '100%',
    margin: '1.5rem 0',
  },
  errorInput: {
    borderColor: `${theme.colors.inputErrorBorder} !important`,
    color: `${theme.colors.inputErrorBorder}`,
  },
}))

export default JsForm
