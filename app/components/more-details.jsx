// https://github.com/EnCiv/civil-pursuit/issues/89

'use strict'
import React, { useEffect, useState, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { JsonForms } from '@jsonforms/react'
import { vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'
import { PrimaryButton } from './button.jsx'
import { rankWith, isControl } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'

const shouldDisplayError = (data, schema, path) => {
  // Placeholder logic, replace with actual validation logic
  // If user choose some items which are illegal, should return true, then select box would be red
  return false
}

const CustomInputRenderer = withJsonFormsControlProps(
  ({ data, handleChange, path, uischema, schema, classes }) => {
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

    const hasError = shouldDisplayError(data, schema, path)

    const handleInputChange = event => {
      const value = type === 'checkbox' ? event.target.checked : event.target.value
      handleChange(path, value)
    }

    return (
      <div>
        <label htmlFor={id} className={cx({ [classes.errorLabel]: hasError })}>
          {label}
        </label>

        {type === 'select' ? (
          <select
            id={id}
            value={data || ''}
            onChange={handleInputChange}
            className={cx(classes.formInput, { [classes.errorInput]: hasError })}
          >
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
            id={id}
            type={type}
            checked={type === 'checkbox' ? !!data : undefined}
            value={type === 'checkbox' ? undefined : data || ''}
            onChange={handleInputChange}
            className={cx(classes.formInput, { [classes.errorInput]: hasError })}
          />
        )}
      </div>
    )
  }
)

const customRenderers = [
  ...vanillaRenderers,
  { tester: rankWith(3, isControl), renderer: CustomInputRenderer },
]

const MoreDetails = props => {
  const { className = '', schema = {}, uischema = {}, details = {}, onDone = () => {}, title, ...otherProps } = props
  const [data, setData] = useState(details)
  const [isValid, setIsValid] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const classes = useStyles(props)

  const handleIsValid = () => {
    const requiredData = schema.properties || {}
    return Object.keys(requiredData).every(key => {
      if (!requiredData[key].properties) return !!data[key]
      else return Object.keys(requiredData[key].properties).every(prop => !!data[key][prop])
    })
  }

  const memoedRenderers = useMemo(() => {
    return customRenderers.map(renderer => ({
      ...renderer,
      renderer:
        renderer.renderer === CustomInputRenderer
          ? props => <CustomInputRenderer {...props} classes={classes} submitted={submitted} />
          : renderer.renderer,
    }))
  }, [schema, uischema, classes, submitted])

  useEffect(() => {
    setIsValid(handleIsValid())
  }, [data, schema])

  return (
    <div className={cx(classes.formContainer, className)} {...otherProps}>
      {title && <p className={classes.formTitle}>{title}</p>}
      <div className={classes.jsonFormContainer}>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={data}
          renderers={memoedRenderers}
          cells={vanillaCells}
          onChange={({ data }) => setData(data)}
        />
        <PrimaryButton
          title={'Submit'}
          className={classes.actionButton}
          onDone={() => {
            setSubmitted(true)
            const valid = handleIsValid()
            setIsValid(valid)
            onDone({ valid, value: data })
          }}
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
  errorInput: {
    borderColor: 'red !important',
    outlineColor: 'red !important',
    backgroundColor: '#ffe6e6 !important',
  },
  errorLabel: {
    color: 'red',
  },
  actionButton: {
    width: '100%',
    margin: '1.5rem 0',
  },
}))

export default MoreDetails
