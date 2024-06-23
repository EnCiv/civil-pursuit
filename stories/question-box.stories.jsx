import React from 'react'
import QuestionBox from '../app/components/question-box'

export default {
  component: QuestionBox,
}

const Template = args => <QuestionBox {...args} />

export const Default = Template.bind({})
Default.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. We’re asking about concerns, not solutions.',
  participants: 1009,
}

export const Empty = Template.bind({})
Empty.args = {}
