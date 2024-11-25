// https://github.com/EnCiv/civil-pursuit/issues/221
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
  description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. We’re asking about concerns, not solutions.',
  participants: 1009,
  tagline: 'Civil Pursuit',
}

export const Empty = Template.bind({})
Empty.args = {}

export const Markdown = Template.bind({})
Markdown.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. **We’re asking about concerns, not solutions.**',
  participants: 1009,
  tagline: 'Civil Pursuit',
}

export const Mobile = Template.bind({})
Mobile.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. **We’re asking about concerns, not solutions.**',
  participants: 1009,
  tagline: 'Civil Pursuit',
}
Mobile.parameters = {
  viewport: {
    defaultViewport: 'iphonex',
  },
}

export const NoTagline = Template.bind({})
NoTagline.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. We’re asking about concerns, not solutions.',
  participants: 1009,
}

export const Left = Template.bind({})
Left.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. We’re asking about concerns, not solutions.',
  participants: 1009,
  contentAlign: 'left',
  tagline: 'Civil Pursuit',
}
