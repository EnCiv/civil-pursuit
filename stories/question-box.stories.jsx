// https://github.com/EnCiv/civil-pursuit/issues/221
// https://github.com/EnCiv/civil-pursuit/issues/224

import React from 'react'
import QuestionBox from '../app/components/question-box'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import StatusBadge from '../app/components/status-badge'
import { PrimaryButton, SecondaryButton, ModifierButton } from '../app/components/button.jsx'

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
  children: [<StatusBadge status="Progress" name="1009 participants" />],
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
  children: [
    <div>
      <StatusBadge status="Progress" name="1009 participants" />
    </div>,
  ],
}

export const Left = Template.bind({})
Left.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. We’re asking about concerns, not solutions.',
  contentAlign: 'left',
  children: (
    <div>
      <StatusBadge status="Progress" name="1009 participants" />
    </div>
  ),
  tagline: 'Civil Pursuit',
}

const TwoStatusBadges = props => (
  <div {...props}>
    <StatusBadge name="509 participants" />
    <StatusBadge status="Complete" name="Complete" />
  </div>
)
const TwoButtons = props => (
  <div {...props}>
    <PrimaryButton title="View Summary">View Summary</PrimaryButton>
    <SecondaryButton title="View My Activity">View My Activity</SecondaryButton>
  </div>
)

export const WithChildren = Template.bind({})
WithChildren.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. **We’re asking about concerns, not solutions.**',
  contentAlign: 'left',
  children: [<TwoStatusBadges />, <TwoButtons />],
}

export const WithChildren2 = Template.bind({})
WithChildren2.args = {
  subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
  description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. **We’re asking about concerns, not solutions.**',
  contentAlign: 'left',
  children: [
    <div>
      <StatusBadge name="509 participants" />
      <StatusBadge status="Progress" name="Round 3" />
    </div>,
    <ModifierButton title="View Summary" style={{ width: 100 + '%' }}>
      View Summary
    </ModifierButton>,
  ],
}

export const WithChildrenWithRender = {
  args: {
    subject: 'What one issue should ‘We the People’ unite and solve first to make our country even better?',
    description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. **We’re asking about concerns, not solutions.**',
    contentAlign: 'center',
  },
  render: props => {
    return (
      <QuestionBox {...props}>
        <TwoStatusBadges />
        <TwoButtons />
      </QuestionBox>
    )
  },
}
export const WithOgImage = Template.bind({})
WithOgImage.args = {
  subject: 'What direction for our country?',
  description: 'This is a large-scale online discussion with the purpose of starting unbiased, and thoughtful conversations. **We\'re asking about concerns, not solutions.**',
  tagline: 'Civil Pursuit',
  metaTags: ['property="og:image" content="https://res.cloudinary.com/hf6mryjpf/image/upload/v1762403748/What-direction-for-our-country.png"'],
  children: [
    <div>
      <StatusBadge name="509 participants" />
      <StatusBadge status="Progress" name="Round 3" />
    </div>,
  ],
}