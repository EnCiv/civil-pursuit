import React, { useContext, useEffect } from 'react'
import { DeliberationContext, DeliberationContextProvider } from '../app/components/deliberation-context'
import { DeliberationContextDecorator } from './common'
import { within, userEvent } from '@storybook/testing-library'
import expect from 'expect'

export default {
  component: DeliberationContext,
  args: {},
  decorators: [DeliberationContextDecorator],
}

const Template = props => {
  const { data = {}, upsert } = useContext(DeliberationContext)
  useEffect(() => {
    setTimeout(() => upsert(props.obj), 2000)
  })
  return (
    <div>
      upsert will be called after 2 seconds. data:
      {JSON.stringify(data, null, 2)}
    </div>
  )
}

export const ObjectCanBeUpserted = Template.bind({})
ObjectCanBeUpserted.args = { obj: { message: 'a message from the future' } }
