// https://github.com/EnCiv/civil-pursuit/issues/221
// https://github.com/EnCiv/civil-pursuit/issues/224

import React from 'react'
import QuestionBox from '../app/components/question-box'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import StatusBadge from '../app/components/status-badge'
import { PrimaryButton, SecondaryButton } from '../app/components/button.jsx'

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
  tagline: 'Civil Pursuit',
}

export const Empty = Template.bind({})
Empty.args = {}

export const Markdown = Template.bind({})
Markdown.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. **We’re asking about concerns, not solutions.**',
  tagline: 'Civil Pursuit',
}

export const Mobile = Template.bind({})
Mobile.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. **We’re asking about concerns, not solutions.**',
  children: [[<StatusBadge status="Progress" name="1009 participants" />]],
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
  children: [[<StatusBadge status="Progress" name="1009 participants" />]],
}

export const Left = Template.bind({})
Left.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. We’re asking about concerns, not solutions.',
  contentAlign: 'left',
  children: [[<StatusBadge status="Progress" name="1009 participants" />]],
  tagline: 'Civil Pursuit',
}

export const WithChildren = Template.bind({})
WithChildren.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. **We’re asking about concerns, not solutions.**',
  contentAlign: 'left',
  children: [
    [<StatusBadge status="Progress" name="1009 participants" />, <StatusBadge status="Complete" name="Complete" />],
    [
      <PrimaryButton title="View Summary" style={{ width: 100 + '%' }}>
        View Summary
      </PrimaryButton>,
      <SecondaryButton title="View My Activity" style={{ width: 100 + '%' }}>
        View My Activity
      </SecondaryButton>,
    ],
  ],
}
