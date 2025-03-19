// https://github.com/EnCiv/civil-pursuit/issues/152

import React from 'react'
import CivilPursuit from '../app/web-components/civil-pursuit'
import { DeliberationContextDecorator, onDoneDecorator, socketEmitDecorator } from './common'
import { Default, useSetupTournament } from './tournament.stories'

const testSteps = [
  { webComponent: 'SignUp' },
  {
    webComponent: 'Details',
    questions: [['What party are you with']],
    schema: {
      type: 'object',
      properties: {
        dateOfBirth: {
          title: 'Date of Birth',
          type: 'string',
          format: 'date',
        },
      },
    },
    uischema: {
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/dateOfBirth',
        },
      ],
    },
  },
  // Copy paste the data from tournament.stories.js to make things easy
  {
    webComponent: 'Tournament',
    steps: Default.args.testSteps,
  },
  { webComponent: 'Conclusion' },
  { webComponent: 'Feedback' },
]

export default {
  component: CivilPursuit,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [DeliberationContextDecorator, onDoneDecorator, socketEmitDecorator],
}

export const Normal = {
  args: {
    subject: 'What One Issue Should We The People Unite and Solve First?',
    description:
      'This is a large scale online discussion with the purpose of starting unbiased, and thoughtful conversations, that lead to amazing new solutions. **But here, we are asking about concerns**, we will get to the solutions later.',
    steps: testSteps,
    defaultValue: Default.args.defaultValue,
  },
  render: args => {
    useSetupTournament()
    return <CivilPursuit {...args} />
  },
}
