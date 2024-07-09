// https://github.com/EnCiv/civil-pursuit/issues/89

'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { JsonForms } from '@jsonforms/react'
import { vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'
import { PrimaryButton } from './button.jsx'
import { rankWith, isEnumControl } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'

const CustomSelectRenderer = withJsonFormsControlProps(({ data, handleChange, path, uischema, schema }) => {
  const classes = useStyles({ mode: 'light' })
  const options = schema.enum || []
  const label = uischema.label || schema.title

  return (
    <div>
      <label>{label}</label>
      <select value={data || ''} onChange={ev => handleChange(path, ev.target.value)} className={classes.select}>
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
  const {
    className = 'Submit Form',
    schema = {},
    uischema = {},
    details = {},
    onDone = () => {
      valid, value
    },
    active = true,
    value,
    ...otherProps
  } = props
  const [data, setData] = useState(details)
  const classes = useStyles(props)

  const handleOnClick = () => {
    onDone({ valid: true, value })
  }

  return (
    <div className={cx(classes.moreDetailsContainer, className)}>
      <p className={classes.title}>We just need a few more details about you to get started.</p>
      <div className={classes.formContainer}>
        <div>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={customRenderers}
            cells={vanillaCells}
            onChange={({ data, _errors }) => setData(data)}
          />
        </div>
        <PrimaryButton primary tile={'Submit form'} className={classes.submitButton} onClick={() => handleOnClick()}>
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
    margin: '1rem 0',
  },
  title: props => ({
    textAlign: 'center',
    color: props.mode === 'dark' ? theme.colors.white : theme.colors.primaryButtonBlue,
    fontSize: '2rem',
  }),
  formControl: {
    marginBottom: '1rem',
  },
  select: {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '0.1rem solid #EBEBEB',
    backgroundColor: '#FBFBFB',
    color: '#1A1A1A',
  },
}))

export default MoreDetails
