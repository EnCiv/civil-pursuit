import React, { useState } from 'react'
import { userEvent, within } from '@storybook/test'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import expect from 'expect'
import { onDoneDecorator, onDoneResult, socketEmitDecorator } from './common'
import Jsform from '../app/components/jsform'

export default {
  component: Jsform,
  args: {},
  decorators: [onDoneDecorator, socketEmitDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

// Base test schema

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

const initialTestSchemaDetails = {
  householdIncome: '0-10000',
  housing: 'Apartment',
  numberOfSiblings: '2',
}

// State of Residence schema

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

// Date of Birth schema

const testDobSchema = {
  type: 'object',
  properties: {
    dateOfBirth: {
      title: 'Date of Birth',
      type: 'string',
      format: 'date',
    },
  },
}

const testDobUISchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/dateOfBirth',
    },
  ],
}

// All inputs schema

const testAllInputsSchema = {
  type: 'object',
  properties: {
    stringExample: {
      title: 'String',
      type: 'string',
    },
    integerExample: { title: 'Integer', type: 'integer' },
    numberExample: {
      title: 'Number',
      type: 'number',
    },
    checkboxExample: { title: 'Checkbox', type: 'boolean' },
    selectionExample: {
      title: 'Select',
      type: 'string',
      enum: ['option 1', 'option 2', 'option 3'],
    },
    dateExample: { title: 'Date', type: 'string', format: 'date' },
    objectExample: {
      title: 'Object',
      type: 'object',
      properties: {
        fieldOne: {
          title: 'Field one',
          type: 'string',
        },
        fieldTwo: { title: 'Field two', type: 'string' },
        fieldThree: { title: 'Field three', type: 'string' },
        fieldFour: { title: 'Field four', type: 'string' },
      },
    },
  },
}

const testAllInputsUISchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/stringExample',
    },
    {
      type: 'Control',
      scope: '#/properties/integerExample',
    },
    {
      type: 'Control',
      scope: '#/properties/numberExample',
    },
    {
      type: 'Control',
      scope: '#/properties/checkboxExample',
    },
    {
      type: 'Control',
      scope: '#/properties/selectionExample',
    },
    {
      type: 'Control',
      scope: '#/properties/dateExample',
    },
    {
      type: 'Group',
      label: 'Object',
      elements: [
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/objectExample/properties/fieldOne',
            },
            {
              type: 'Control',
              scope: '#/properties/objectExample/properties/fieldTwo',
            },
          ],
        },
        {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/objectExample/properties/fieldThree',
            },
            {
              type: 'Control',
              scope: '#/properties/objectExample/properties/fieldFour',
            },
          ],
        },
      ],
    },
  ],
}

// Stories

export const Empty = {
  args: {},
}

export const FigmaInputMatch = {
  args: {
    schema: testSchema,
    uischema: testUIschema,
    stepIntro: { subject: 'We just need a few more details about you to get started.' },
  },
}

export const InitialTestSchemaDetailsInput = {
  args: {
    schema: testSchema,
    uischema: testUIschema,
    details: initialTestSchemaDetails,
    stepIntro: { subject: 'We just need a few more details about you to get started.' },
  },
}

const setupJsFormsApis = Story => {
  useState(() => {
    // execute this code once, before the component is initally rendered
    // the api call will provide the new data for this step
    window.socket._socketEmitHandlers['get-jsform'] = (discussionId, cb) => {
      window.socket._socketEmitHandlerResults['get-jsform'].push[[discussionId]]
      setTimeout(() => cb?.())
    }
    window.socket._socketEmitHandlerResults['get-jsform'] = []
    window.socket._socketEmitHandlers['upsert-jsform'] = (discussionId, name, data, cb) => {
      window.socket._socketEmitHandlerResults['upsert-jsform'].push([[discussionId, name, data]])
      setTimeout(() => cb?.())
    }
    window.socket._socketEmitHandlerResults['upsert-jsform'] = []
  })
  return <Story />
}
export const UserInputAndOnDoneCall = {
  args: {
    schema: testSchema,
    uischema: testUIschema,
    details: initialTestSchemaDetails,
    stepIntro: { subject: 'We just need a few more details about you to get started.' },
    discussionId: '123456789012345678901234567890abcd',
  },
  decorators: [setupJsFormsApis],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.selectOptions(canvas.getByLabelText(/Household Income/i), '10000-20000')
    await userEvent.selectOptions(canvas.getByLabelText(/Housing/i), 'House')
    await userEvent.selectOptions(canvas.getByLabelText(/Number of Siblings/i), '1')
    await userEvent.click(canvas.getByRole('button', { name: /Submit/i }))
    expect(window.socket._socketEmitHandlerResults['upsert-jsform'][0]).toMatchObject([['123456789012345678901234567890abcd', 'moreDetails', { householdIncome: '10000-20000', housing: 'House', numberOfSiblings: '1' }]])
    expect(onDoneResult(canvas)).toMatchObject({
      count: 1,
      onDoneResult: {
        valid: true,
        value: {
          householdIncome: '10000-20000',
          housing: 'House',
          numberOfSiblings: '1',
        },
      },
    })
  },
}

export const StateOfResidenceSelection = {
  args: {
    schema: testStateOfResidenceSchema,
    uischema: testStateOfResidenceUIschema,
  },
}

export const BirthDateInput = {
  args: { schema: testDobSchema, uischema: testDobUISchema },
}

export const AllInputTypes = {
  args: { schema: testAllInputsSchema, uischema: testAllInputsUISchema },
}
