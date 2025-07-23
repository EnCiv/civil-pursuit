// https://github.com/EnCiv/civil-pursuit/issues/89
// https://github.com/EnCiv/civil-pursuit/issues/297

'use strict'
import React, { useEffect, useState, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { JsonForms } from '@jsonforms/react'
import { vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'
import { PrimaryButton } from './button'
import { rankWith, isControl } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import StepIntro from '../components/step-intro'

const CustomInputRenderer = withJsonFormsControlProps(({ data, handleChange, path, uischema, schema, classes }) => {
  const options = schema.enum || []
  const label = schema.title || uischema.label

  const id = `input-${path.replace(/\./g, '-')}`

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
    const value = type === 'checkbox' ? event.target.checked : event.target.value
    handleChange(path, value)
  }

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {type === 'select' ? (
        <select id={id} value={data || ''} onChange={handleInputChange} className={classes.formInput}>
          <option value="" disabled>
            Choose one
          </option>
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input id={id} type={type} checked={type === 'checkbox' ? !!data : undefined} value={type === 'checkbox' ? undefined : data || ''} onChange={handleInputChange} className={classes.formInput} />
      )}
    </div>
  )
})

const customRenderers = [...vanillaRenderers, { tester: rankWith(3, isControl), renderer: CustomInputRenderer }]

const JsForm = props => {
  const { className = '', schema = {}, uischema = {}, onDone = () => {}, name, stepIntro = { subject: '', description: '' }, discussionId } = props
  const [data, setData] = useState({})
  const classes = useStyles(props)

  useEffect(() => {
    window.socket.emit('get-jsform', discussionId, data => {
      if (data) {
        const moreDetails = data.moreDetails || {}
        setData(moreDetails)
        if (handleIsValid(moreDetails)) {
          onDone({ valid: true, value: moreDetails })
        }
      }
    })
  }, [])

  const handleSubmit = () => {
    window.socket.emit('upsert-jsform', discussionId, 'moreDetails', data)
    onDone({ valid: handleIsValid(data), value: data })
  }

  const handleIsValid = data => {
    const requiredData = schema.properties || {}
    return Object.keys(requiredData).every(key => {
      if (!requiredData[key].properties) return !!data[key]
      else return Object.keys(requiredData[key].properties).every(prop => !!data[key][prop])
    })
  }

  // useMemo renders (React components) so they don't get rebuilt every time the user types a character
  // This was really a problem with string input because focus went away from the input fields after each time the user typed a character
  const memoedRenderers = useMemo(() => {
    return customRenderers.map(renderer => ({
      ...renderer,
      renderer: renderer.renderer === CustomInputRenderer ? props => <CustomInputRenderer {...props} classes={classes} /> : renderer.renderer,
    }))
  }, [schema, uischema])

  const isValid = handleIsValid(data)

  return (
    <div className={cx(classes.formContainer, className)}>
      <StepIntro {...stepIntro} />
      <div className={classes.jsonFormContainer}>
        <JsonForms schema={schema} uischema={uischema} data={data} renderers={memoedRenderers} cells={vanillaCells} onChange={({ data }) => setData(data)} />
        <PrimaryButton title={'Submit'} className={classes.actionButton} onDone={handleSubmit} disabled={!isValid}>
          Submit
        </PrimaryButton>
      </div>
    </div>
  )
}

const useStyles = createUseStyles(theme => ({
  formContainer: props => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
}))

export default JsForm
