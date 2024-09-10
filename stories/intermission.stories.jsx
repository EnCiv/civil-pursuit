// https://github.com/EnCiv/civil-pursuit/issues/137

import React from 'react'
import Intermission from '../app/components/intermission'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import {onDoneDecorator, onDoneResult } from './common'

export default {
  component: Intermission,
  decorators: [onDoneDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const validateEmail = email => {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

// const Template = args => <Intermission {...args} />
const Template = args => {
  window.socket = {
    emit: (handle, data, cb) => {
      console.log('User input email:', data.email)
      if (handle !== 'set user info') {
        console.error('emit expected set user info, got:', handle)
      }
      if (validateEmail(data.email)) {
        setTimeout(() => cb({ error: '' }), 1000)
        console.log("success!")
      } else {
        setTimeout(() => cb({ error: 'Something went wrong' }), 1000)
        console.log("error")
      }
    },
  }

  console.log('window.socket.emit defined inside Template')
  return <Intermission {...args} />
}

export const Empty = Template.bind({})
Empty.args = {}

export const NoEmail = Template.bind({})
NoEmail.args = {
  user: {},
}

export const NoEmailMobile = Template.bind({})
NoEmailMobile.args = {
  user: {},
}
NoEmailMobile.parameters = {
  viewport: {
    defaultViewport: 'iphonex',
  },
}
export const LastRound1 = Template.bind({})
LastRound1.args = {
  user: { email: 'example@gmail.com', tempid: '123456' },
}


export const LastRound2 = Template.bind({})
LastRound2.args = {
  user: { email: 'example@gmail.com', tempid: '123456' },
  lastRound: 2,
}
LastRound2.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)

  const continueButton = await canvas.getByText('Yes, Continue')
  await userEvent.click(continueButton)
  await waitFor(() =>
    expect(onDoneResult(canvas)).toMatchObject({
      count: 1,
      onDoneResult: {
        valid: true,
        value: 'continue',
      },
    })
  )
  const remindButton = await canvas.getByText('Remind Me Later')
  await userEvent.click(remindButton)
  await waitFor(() =>
    expect(onDoneResult(canvas)).toMatchObject({
      count: 2, 
      onDoneResult: {
        valid: true,
        value: 'remind',
      },
    })
  )
}
