// https://github.com/EnCiv/civil-pursuit/issues/89

'use strict'
import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { JsonForms } from '@jsonforms/react'
import { vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'
import { PrimaryButton } from './button.jsx'
import { rankWith, isControl } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'

const CustomInputRenderer = withJsonFormsControlProps(({ data, handleChange, path, uischema, schema, classes }) => {
  const options = schema.enum || []
  const label = schema.title || uischema.label

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

  return (
    <div>
      <label>{label}</label>
      {type === 'select' ? (
        <select value={data || ''} onChange={i => handleChange(path, i.target.value)} className={classes.formInput}>
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
        <input
          type={type}
          checked={type === 'checkbox' ? data : undefined}
          value={type === 'checkbox' ? undefined : data || ''}
          onChange={i => handleChange(path, type === 'checkbox' ? i.target.checked : i.target.value)}
          className={classes.formInput}
        />
      )}
    </div>
  )
})

const customRenderers = [...vanillaRenderers, { tester: rankWith(3, isControl), renderer: CustomInputRenderer }]

const MoreDetails = props => {
  const { className = '', schema = {}, uischema = {}, details = {}, onDone = () => {}, ...otherProps } = props
  const { title } = otherProps
  const [data, setData] = useState(details)
  const [isValid, setIsValid] = useState(false)
  const classes = useStyles(props)

  const handleOnClick = () => {
    if (isValid) {
      onDone({ valid: true, value: data })
    }
  }

  const handleIsValid = () => {
    const requiredData = schema.properties || {}
    return Object.keys(requiredData).every(i => (requiredData[i].enum ? data[i] !== undefined && data[i] !== '' : true))
  }

  useEffect(() => {
    setIsValid(handleIsValid())
  }, [data, schema])

  return (
    <div className={cx(classes.formContainer, className)}>
      {title && <p className={classes.formTitle}>{title}</p>}
      <div className={classes.jsonFormContainer}>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={data}
          renderers={customRenderers.map(renderer => ({
            ...renderer,
            renderer:
              renderer.renderer === CustomInputRenderer
                ? props => <CustomInputRenderer {...props} classes={classes} />
                : renderer.renderer,
          }))}
          cells={vanillaCells}
          onChange={({ data, _errors }) => setData(data)}
        />
        <PrimaryButton
          primary
          tile={'Submit form'}
          className={classes.submitButton}
          onClick={handleOnClick}
          onDone={() => onDone({ valid: isValid, value: data })}
          disabled={!isValid}
        >
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
  }),
  formTitle: props => ({
    textAlign: 'center',
    color: props.mode === 'dark' ? theme.colors.white : theme.colors.primaryButtonBlue,
    fontSize: '2rem',
  }),
  jsonFormContainer: {
    marginBottom: '1rem',
    lineHeight: '2.25rem',
  },
  formInput: props => ({
    width: '100% !important',
    padding: '0.5rem !important',
    borderRadius: '0.25rem !important',
    border: `0.1rem solid ${theme.colors.borderGray} !important`,
    backgroundColor: props.mode === 'dark' ? theme.colors.title : theme.colors.cardOutline,
    color: props.mode === 'dark' ? theme.colors.cardOutline : theme.colors.title,
  }),
  submitButton: {
    width: '100%',
    margin: '2rem 0',
  },
}))

export default MoreDetails
