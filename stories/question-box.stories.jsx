// https://github.com/EnCiv/civil-pursuit/issues/100
import React from 'react'
import QuestionBox from '../app/components/question-box'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

export default {
  component: QuestionBox,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const Template = args => <QuestionBox {...args} />

export const Default = Template.bind({})
Default.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description:
    'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. We’re asking about concerns, not solutions.',
  participants: 1009,
}

export const Empty = Template.bind({})
Empty.args = {}

export const Markdown = Template.bind({})
Markdown.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description:
    'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. **We’re asking about concerns, not solutions.**',
  participants: 1009,
}

export const Mobile = Template.bind({})
Mobile.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description:
    'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. **We’re asking about concerns, not solutions.**',
  participants: 1009,
}
Mobile.parameters = {
  viewport: {
    defaultViewport: 'iphonex',
  },
}

