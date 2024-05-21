// https://github.com/EnCiv/civil-pursuit/issues/89

'use strict'
import React, { useState } from 'react'
import Column from './util/column'
import Submit from './util/submit'
import { createUseStyles } from 'react-jss'
import { JsonForms } from '@jsonforms/react'
import { vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'

const MoreDetails = props => {
  const [data, setData] = useState(initialData)
  const classes = useStyles(props)
  const initialData = {}

  const schema = {
    type: 'object',
    properties: {
      householdIncome: {
        title: 'Household Income',
        type: 'string',
        enum: ['0-10000', '10000-20000', '20000-30000'],
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
    },
  }
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Label',
        text: 'Household Income',
      },
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

  const handleOnSubmit = () => {
    console.log('Form data: ', data)
    // Handle form submission logic here
  }

  return (
    <div
      className={classes.container}
    >
      <p className={classes.title}>We just need a few more details about you to get started.</p>
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
            onClick={handleOnSubmit}
          >
            Submit
          </Submit>
        </Column>
      </div>
    </div>
  )
}

const useStyles = createUseStyles(theme => ({
  container: props => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: props.mode != 'dark' ? theme.colors.darkModeGray : theme.colors.white,
    color: props.mode != 'dark' ? theme.colors.white : theme.colors.black,
    border: 'medium dashed green',
  }),
  formContainer: {
    border: 'medium solid red',
  },
  selectList: {},
  selectTitle: { fontWeight: 'bold' },
  stackedControl: {
    fontWeight: 'bold',
    '& > .control': {
      fontWeight: 'bold',
      display: 'block',
      marginBottom: '1.25rem',
    },
  },
  [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
    container: {
      flexDirection: 'column',
    },
  },
}))

export default MoreDetails
