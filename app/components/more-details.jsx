// https://github.com/EnCiv/civil-pursuit/issues/89

'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { JsonForms } from '@jsonforms/react'
import { vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'
import { PrimaryButton } from './button.jsx'

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
  } = props
  const [data, setData] = useState(details)
  const classes = useStyles(props)

  const handleOnClick = ({ valid, value }) => {
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
            renderers={vanillaRenderers}
            cells={vanillaCells}
            onChange={({ data, _errors }) => setData(data)}
          />
        </div>
        <PrimaryButton
          primary
          className={classes.submitButton}
          onDone={onDone}
          disabled={!active}
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
    margin: '1rem 0',
  },
  title: props => ({
    color: props.mode === 'dark' ? theme.colors.white : theme.colors.primaryButtonBlue,
    fontSize: '2rem',
  }),
}))

export default MoreDetails
