import React from 'react'
import { userEvent, within } from '@storybook/testing-library'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import expect from 'expect'
import { onDoneDecorator, onDoneResult } from './common'
import MoreDetails from './../app/components/more-details'

export default {
  component: MoreDetails,
  args: {},
  decorators: [onDoneDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const testSchema = {
  type: 'object',
  properties: {
    householdIncome: {
      title: 'Household Income',
      type: 'string',
      enum: ['0-10000', '10000-20000', '20000-30000'],
    },
    housing: {
      title: 'Housing',
      type: 'string',
      enum: ['House', 'Apartment', 'None'],
    },
    numberOfSiblings: {
      title: 'Number of Siblings',
      type: 'string',
      enum: ['0', '1', '2'],
    },
  },
}

const testUIschema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/householdIncome',
    },
    {
      type: 'Control',
      scope: '#/properties/housing',
    },
    {
      type: 'Control',
      scope: '#/properties/numberOfSiblings',
    },
  ],
}

const testStateOfResidenceSchema = {
  type: 'object',
  properties: {
    stateOfResidence: {
      title: 'State of Residence',
      type: 'string',
      enum: [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
      ],
    },
  },
}

const testStateOfResidenceUIschema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/stateOfResidence',
    },
  ],
}

const testDOBSchema = {
  type: 'object',
  properties: {
    dateOfBirth: {
      title: 'Date of Birth',
      type: 'string',
      enum: [''],
    },
  },
}

const testDOBUISchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/dateOfBirth',
    },
  ],
}

const initialDetails = {
  householdIncome: '0-10000',
  housing: 'Apartment',
  numberOfSiblings: '2',
}

export const Empty = {
  args: {},
}

export const FigmaInputMatch = {
  args: {
    schema: testSchema,
    uischema: testUIschema,
    onDone: null,
    className: 'Submit form',
  },
}

export const InitialDetailsInput = {
  args: {
    schema: testSchema,
    uischema: testUIschema,
    details: initialDetails,
    onDone: null,
    className: 'Submit form',
  },
}

export const UserInputAndOnDoneCall = {
  args: {
    schema: testSchema,
    uischema: testUIschema,
    details: initialDetails,
    onDone: null,
    className: 'Submit form',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Submit/i }))

    expect(onDoneResult(canvas)).toMatchObject({
      count: 2,
      onDoneResult: {
        valid: true,
        value: [
          {
            householdIncome: '0-10000',
            housing: 'Apartment',
            numberOfSiblings: '2',
          },
        ],
      },
    })
  },
}

export const StateOfResidenceSelection = {
  args: { schema: testStateOfResidenceSchema, uischema: testStateOfResidenceUIschema },
}

export const BirthDateInput = {
  args: { schema: testDOBSchema, uischema: testDOBUISchema },
}
