// https://github.com/EnCiv/civil-pursuit/issues/89

'use strict'
import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { JsonForms } from '@jsonforms/react'
import { vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'
import { PrimaryButton } from './button.jsx'
import { rankWith, isEnumControl } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'

const CustomSelectRenderer = withJsonFormsControlProps(({ data, handleChange, path, uischema, schema, classes }) => {
  const options = schema.enum || []
  const label = uischema.label || schema.title

  return (
    <div>
      <label>{label}</label>
      <select value={data || ''} onChange={ev => handleChange(path, ev.target.value)} className={classes.formSelect}>
        <option value="" disabled>
          Choose one
        </option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
})

const customRenderers = [...vanillaRenderers, { tester: rankWith(3, isEnumControl), renderer: CustomSelectRenderer }]

const MoreDetails = props => {
  const { className = '', schema = {}, uischema = {}, details = {}, onDone = () => {}, ...otherProps } = props
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
    <div className={cx(classes.moreDetailsContainer, className)}>
      <p className={classes.title}>We just need a few more details about you to get started.</p>
      <div className={classes.formContainer}>
        <div>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={customRenderers.map(renderer => ({
              ...renderer,
              renderer:
                renderer.renderer === CustomSelectRenderer
                  ? props => <CustomSelectRenderer {...props} classes={classes} />
                  : renderer.renderer,
            }))}
            cells={vanillaCells}
            onChange={({ data, _errors }) => setData(data)}
          />
        </div>
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
  moreDetailsContainer: props => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: props.mode === 'dark' ? theme.colors.darkModeGray : theme.colors.white,
    color: props.mode === 'dark' ? theme.colors.white : theme.colors.black,
  }),
  submitButton: {
    width: '100%',
    margin: '2rem 0',
  },
  title: props => ({
    textAlign: 'center',
    color: props.mode === 'dark' ? theme.colors.white : theme.colors.primaryButtonBlue,
    fontSize: '2rem',
  }),
  formContainer: {
    marginBottom: '1rem',
    lineHeight: '2.25rem',
  },
  formSelect: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    border: `0.1rem solid ${theme.colors.borderGray}`,
    backgroundColor: theme.colors.cardOutline,
    color: theme.colors.title,
  },
}))

export default MoreDetails
