// https://github.com/EnCiv/civil-pursuit/issues/89

'use strict'
import React, { useState } from 'react'
import Column from './util/column'
import Submit from './util/submit'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { JsonForms } from '@jsonforms/react'
import { vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'

const MoreDetails = props => {
  const {
    point = { subject: '', description: '', _id: '' },
    defaultValue = { subject: '', description: '' },
    onDone = () => {},
    className,
    ...otherProps
  } = props
  const [data, setData] = useState(initialData)
  const classes = useStyles()
  const initialData = {}

  const schema = {
    type: 'object',
    properties: {
      householdIncome: {
        title: 'Household Income',
        type: 'string',
        enum: ['0-10000', '10000-20000', '20000-30000'],
        default: 'Select household range',
      },
      housing: {
        title: 'Housing',
        type: 'string',
        enum: ['House', 'Apartment', 'None'],
      },
      numberOfSiblings: {
        title: 'Number of Siblings',
        type: 'string',
        enum: ['0', '1', '2'],
      },
      submit: {
        type: 'button',
        title: 'Submit',
      },
    },
  }
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/householdIncome',
        options: {
          classNames: classes.stackedControl,
        },
      },

      {
        type: 'Control',
        scope: '#/properties/housing',
        labelAlignment: 'top',
      },
      {
        type: 'Control',
        scope: '#/properties/numberOfSiblings',
        labelAlignment: 'top',
      },
      {
        type: 'Button',
        scope: '#/properties/submit',
      },
    ],
  }

  const handleOnDone = ({ valid, value }) => {
    console.log('handleOnDone clicked')
    // value.parentId = `${point._id}`
    // onDone({ valid, value })
  }

  const onSubmit = data => {
    console.log('Form data:', data)
    console.log('onSubmit clicked')
    // Handle form submission logic here
  }

  return (
    <div
      className={cx(classes.container, className)}
      {...otherProps}
    >
      <h3>We just need a few more details about you to get started.</h3>
      <div className={classes.formContainer}>
        <Column>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={vanillaRenderers}
            details={} // the data for jsonforms
            cells={vanillaCells}
            onChange={({ data, _errors }) => setData(data)}
            onSubmit={onSubmit}
          />
          <Submit className={classes.submitButton}>Submit</Submit>
        </Column>
      </div>
    </div>
  )
}

const useStyles = createUseStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Inter',
    // border: 'medium dashed green',
  },
  formContainer: {
    margin: '1.25rem',
    // border: 'medium solid red'
  },
  selectList: {},
  selectTitle: { fontWeight: 'bold' },
  submitButton: { backgroundColor: '#06335C', color: '#fff', borderRadius: '10px', width: '100%' },
  stackedControl: {
    fontWeight: 'bold',
    '& > .control': {
      fontWeight: 'bold',
      display: 'block',
      marginBottom: '10px',
    },
  },
}))

export default MoreDetails
