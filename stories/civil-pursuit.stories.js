// https://github.com/EnCiv/civil-pursuit/issues/152

import React from 'react'
import CivilPursuit from '../app/web-components/civil-pursuit'
import { onDoneDecorator } from './common'
// it's weird that these things have to be imported from the story, and they can't be accessed though Normal.args....
// it seems like in StoryBook tournament.storied is being lazy loaded and aren't define at the time this file is being evaluated at the top level
import { tournamentSteps, tournamentDecorators, tournamentDefaultValue } from './tournament.stories'
import { jsFormDecorators } from './jsform.stories'

const testSteps = [
  //{ webComponent: 'SignUp', startTab: 'SignUp' }, // signup mock actions failing
  {
    webComponent: 'Jsform',
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
    steps: tournamentSteps,
  },
  // uncomment when implemented { webComponent: 'Conclusion' },
  {
    webComponent: 'Jsform',
    name: 'feedback',
    stepName: 'Feedback',
    stepIntro: {
      subject: 'Feedback',
      description: 'Please provide your feedback below',
    },
    schema: {
      type: 'object',
      properties: {
        experience: {
          title: 'Description',
          type: 'string',
        },
        improvements: {
          title: 'Description',
          type: 'string',
        },
      },
    },
    uischema: {
      type: 'VerticalLayout',
      elements: [
        { type: 'Label', text: 'How would you rate your overall experience using this?' },
        {
          type: 'Control',
          scope: '#/properties/experience',
        },
        { type: 'Label', text: 'What aspects of this discussion tool do you believe can be improved?' },
        {
          type: 'Control',
          scope: '#/properties/improvements',
        },
      ],
    },
  },
]

export default {
  component: CivilPursuit,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [onDoneDecorator],
}

export const Full = {
  args: {
    subject: 'What One Issue Should We The People Unite and Solve First?',
    description:
      'This is a large scale online discussion with the purpose of starting unbiased, and thoughtful conversations, that lead to amazing new solutions. **But here, we are asking about concerns**, we will get to the solutions later.',
    steps: testSteps,
    user: { email: 'success@email.com', id: '67bf9d6ae49200d1349ab34a' },
    userId: '67bf9d6ae49200d1349ab34a',
    participants: 1,
    ...tournamentDefaultValue,
    _id: '5d0137260dacd06732a1d814',
  },
  decorators: [...tournamentDecorators, ...jsFormDecorators],
}
export const FullClearStorage = {
  render: args => {
    // clear localStorage on mount
    React.useState(() => localStorage?.clear())
    return <CivilPursuit {...args} />
  },
  args: {
    subject: 'What One Issue Should We The People Unite and Solve First?',
    description:
      'This is a large scale online discussion with the purpose of starting unbiased, and thoughtful conversations, that lead to amazing new solutions. **But here, we are asking about concerns**, we will get to the solutions later.',
    steps: testSteps,
    user: { email: 'success@email.com', id: '67bf9d6ae49200d1349ab34a' },
    userId: '67bf9d6ae49200d1349ab34a',
    participants: 1,
    ...tournamentDefaultValue,
    _id: '5d0137260dacd06732a1d814',
  },
  decorators: [...tournamentDecorators, ...jsFormDecorators],
}

export const WithoutTournament = {
  render: args => {
    // clear localStorage on mount
    React.useState(() => localStorage?.clear())
    return <CivilPursuit {...args} />
  },
  args: {
    subject: 'What One Issue Should We The People Unite and Solve First?',
    description:
      'This is a large scale online discussion with the purpose of starting unbiased, and thoughtful conversations, that lead to amazing new solutions. **But here, we are asking about concerns**, we will get to the solutions later.',
    steps: testSteps,
    user: { email: 'success@email.com', id: '67bf9d6ae49200d1349ab34a' },
    userId: '67bf9d6ae49200d1349ab34a',
    participants: 1,
    steps: [
      //{ webComponent: 'SignUp', startTab: 'SignUp' }, // signup mock actions failing
      {
        webComponent: 'Jsform',
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
      // uncomment when implemented { webComponent: 'Conclusion' },
      {
        webComponent: 'Jsform',
        name: 'feedback',
        stepName: 'Feedback',
        stepIntro: {
          subject: 'Feedback',
          description: 'Please provide your feedback below',
        },
        schema: {
          type: 'object',
          properties: {
            experience: {
              title: 'Description',
              type: 'string',
            },
            improvements: {
              title: 'Description',
              type: 'string',
            },
          },
        },
        uischema: {
          type: 'VerticalLayout',
          elements: [
            { type: 'H', text: 'How would you rate your overall experience using this?' },
            {
              type: 'Control',
              scope: '#/properties/experience',
            },
            { type: 'H', text: 'What aspects of this discussion tool do you believe can be improved?' },
            {
              type: 'Control',
              scope: '#/properties/improvements',
            },
          ],
        },
      },
    ],
  },
  decorators: [...jsFormDecorators],
}
