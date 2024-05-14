// https://github.com/EnCiv/civil-pursuit/issues/89

'use strict'
import React, { useState } from 'react'
import Column from './util/column'
import Submit from './util/submit'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { JsonForms } from '@jsonforms/react'
import { vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'

const schema = {
  type: 'object',
  properties: {
    householdIncome: {
      type: 'string',
      enum: ['Option 1', 'Option 2', 'Option 3'],
    },
    housing: {
      type: 'string',
      enum: ['Option 1', 'Option 2', 'Option 3'],
    },
    numberOfSiblings: {
      type: 'string',
      enum: ['Option 1', 'Option 2', 'Option 3'],
    },
  },
}
const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/householdIncome',
    },

    {
      type: 'Control',
      scope: '#/properties/housing',
    },
    {
      type: 'Control',
      scope: '#/properties/numberOfSiblings',
    },
  ],
}

const MoreDetails = props => {
  const {
    point = { subject: '', description: '', _id: '' },
    defaultValue = { subject: '', description: '' },
    onDone = () => {},
    className,
  } = props
  const [data, setData] = useState(initialData)
  const classes = useStyles()
  const initialData = {}

  const handleOnDone = ({ valid, value }) => {
    // value.parentId = `${point._id}`
    // onDone({ valid, value })
  }

  return (
    <div
      className={cx(classes.container, className)}
    >
      <h3>We just need a few more details about you to get started.</h3>

      <div className={classes.formContainer}>
        <Column>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={vanillaRenderers}
            cells={vanillaCells}
            onChange={({ data, _errors }) => setData(data)}
          />
          <Submit
            className={classes.submitButton}
          >
            Submit
          </Submit>
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
    border: 'medium dashed green',
  },
  formContainer: { margin: '1.25rem', border: 'small solid red' },
  selectList: {},
  selectTitle: { fontWeight: 'bold' },
  submitButton: { backgroundColor: '#06335C', color: '#fff', borderRadius: '10px', width: '100%' },
}))

export default MoreDetails
