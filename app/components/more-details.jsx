// https://github.com/EnCiv/civil-pursuit/issues/89

'use strict'
import React, { useState } from 'react'
import Column from './util/column'
import Select from './util/select'
import Submit from './util/submit'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { JsonForms } from '@jsonforms/react'
import { vanillaCells, vanillaRenderers } from '@jsonforms/vanilla-renderers'

const schema = {}
const uischema = {}

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

  const handleOnDone = ({ valid, value }) => {
    // value.parentId = `${point._id}`
    // onDone({ valid, value })
  }

  return (
    <div className={cx(classes.container, className)} {...otherProps}>
      <h2>We just need a few more details about you to get started.</h2>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={vanillaRenderers}
        // cells={vanillaCells}
        // onChange={({ data, _errors }) => setData(data)}
      />
      <Column>
        <div>Household Income</div>
        <Select
          block
          medium
          // ref=""
          // defaultValue={}
          // onChange={}
        >
          <option value="">Select household range</option>
        </Select>
        <div>Housing</div>
        <Select
          block
          medium
          // ref=""
          // defaultValue={}
          // onChange={}
        >
          <option value="">Select housing type</option>
        </Select>
        <div>Number of Siblings</div>
        <Select
          block
          medium
          // ref=""
          // defaultValue={}
          // onChange={}
        >
          <option value="">Choose one</option>
        </Select>
        <Submit medium success radius>
          Submit
        </Submit>
      </Column>
    </div>
  )
}

const useStyles = createUseStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}))

export default MoreDetails
