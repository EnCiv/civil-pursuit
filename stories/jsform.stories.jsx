import React, { useState } from 'react'
import { userEvent, within } from '@storybook/test'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { expect } from '@storybook/jest'
import Jsform from '../app/components/jsform'
import { onDoneDecorator, onDoneResult, buildApiDecorator, socketEmitDecorator } from './common'

export default {
  component: Jsform,
  args: {},
  decorators: [onDoneDecorator, socketEmitDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
  excludeStories: ['jsFormDecorators'],
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

const setupJsFormsApisWithData = Story => {
  useState(() => {
    // execute this code once, before the component is initally rendered
    // the api call will provide the new data for this step
    window.socket._socketEmitHandlers['get-jsform'] = (discussionId, cb) => {
      window.socket._socketEmitHandlerResults['get-jsform'].push([discussionId])
      setTimeout(() => {
        // Just simulating a response with some data
        cb?.({
          loadData: {
            stringExample: 'Test String',
            integerExample: 42,
            numberExample: 3.14,
            checkboxExample: true,
            selectionExample: 'option 2',
            dateExample: '2023-01-01',
            objectExample: {
              fieldOne: 'A',
              fieldTwo: 'B',
              fieldThree: 'C',
              fieldFour: 'D',
            },
          },
        })
      }, 0)
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
export const jsFormDecorators = [buildApiDecorator('get-jsform', (discussionId, cb) => () => {}), buildApiDecorator('upsert-jsform', (discussionId, name, data, cb) => () => {})]

export const UserInputAndOnDoneCall = {
  args: {
    schema: testSchema,
    uischema: testUIschema,
    details: initialTestSchemaDetails,
    stepIntro: { subject: 'We just need a few more details about you to get started.' },
    name: 'moreDetails',
    discussionId: '123456789012345678901234567890abcd',
  },
  decorators: jsFormDecorators,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.selectOptions(canvas.getByLabelText(/Household Income/i), '10000-20000')
    await userEvent.selectOptions(canvas.getByLabelText(/Housing/i), 'House')
    await userEvent.selectOptions(canvas.getByLabelText(/Number of Siblings/i), '1')
    await userEvent.click(canvas.getByRole('button', { name: /Submit/i }))
    expect(window.socket._socketEmitHandlerResults['upsert-jsform'][0]).toMatchObject(['123456789012345678901234567890abcd', 'moreDetails', { householdIncome: '10000-20000', housing: 'House', numberOfSiblings: '1' }])
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
    name: 'moreDetails',
    discussionId: '123456789012345678901234567890abcd',
    schema: testStateOfResidenceSchema,
    uischema: testStateOfResidenceUIschema,
  },
}

export const BirthDateInput = {
  args: { name: 'moreDetails', discussionId: '123456789012345678901234567890abcd', schema: testDobSchema, uischema: testDobUISchema },
}

export const AllInputTypes = {
  args: { name: 'moreDetails', discussionId: '123456789012345678901234567890abcd', schema: testAllInputsSchema, uischema: testAllInputsUISchema },
}

export const LoadPreviousFilledData = {
  decorators: [setupJsFormsApisWithData],
  args: { name: 'loadData', discussionId: '123456789012345678901234567890abcd', schema: testAllInputsSchema, uischema: testAllInputsUISchema },
}

//  Empty form, should disable submit
export const EmptyForm = {
  args: {
    name: 'errorForm',
    discussionId: '123456789012345678901234567890abcd',
    schema: {
      type: 'object',
      properties: {
        politicalParty: {
          title: 'Political Party or nearest ideology',
          type: 'string',
          enum: ['Democrat', 'Republican', 'Independent', 'Libertarian', 'Green', 'Other']
        },
        stateOfResidence: {
          title: 'State of Residence',
          type: 'string',
          enum: ['California', 'Texas', 'New York'], // shortened for test
        },
        yearOfBirth: { title: 'Year of Birth', type: 'integer', minimum: 1900, maximum: 2025 },
        Gender: { title: 'Gender', type: 'string', enum: ['Male', 'Female', 'Other'] },
        shareInfo: {
          title: 'Personally Identifiable Information is not shown, but may we share this information with your posts?',
          type: 'string',
          enum: ['Yes', 'No'],
        },
      },
      required: ['shareInfo'],
    },
    uischema: {
      type: 'VerticalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/politicalParty' },
        { type: 'Control', scope: '#/properties/stateOfResidence' },
        { type: 'Control', scope: '#/properties/yearOfBirth' },
        { type: 'Control', scope: '#/properties/Gender' },
        { type: 'Control', scope: '#/properties/shareInfo' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const submitButton = canvas.getByRole('button', { name: /Submit/i })
    // Since shareInfo is required and empty → disabled
    expect(submitButton).toBeDisabled()
  },
}

// Existing all valid input
export const SubmitAllValid = {
  args: {
    name: 'errorForm',
    discussionId: '123456789012345678901234567890abcd',
    schema: {
      type: 'object',
      properties: {
        politicalParty: {
          title: 'Political Party or nearest ideology',
          type: 'string',
          enum: ['Democrat', 'Republican', 'Independent', 'Libertarian', 'Green', 'Other'],
        },
        stateOfResidence: {
          title: 'State of Residence',
          type: 'string',
          enum: ['California', 'Texas', 'New York'], // shortened for test
        },
        yearOfBirth: { title: 'Year of Birth', type: 'integer', minimum: 1900, maximum: 2025 },
        Gender: { title: 'Gender', type: 'string', enum: ['Male', 'Female', 'Other'] },
        shareInfo: {
          title: 'Personally Identifiable Information is not shown, but may we share this information with your posts?',
          type: 'string',
          enum: ['Yes', 'No'],
        },
      },
      required: ['shareInfo'],
    },
    uischema: {
      type: 'VerticalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/politicalParty' },
        { type: 'Control', scope: '#/properties/stateOfResidence' },
        { type: 'Control', scope: '#/properties/yearOfBirth' },
        { type: 'Control', scope: '#/properties/Gender' },
        { type: 'Control', scope: '#/properties/shareInfo' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const submitButton = canvas.getByRole('button', { name: /Submit/i })

    // fill some optional fields
    await userEvent.selectOptions(canvas.getByLabelText(/Political Party/i), 'Independent')
    await userEvent.type(canvas.getByLabelText(/Year of Birth/i), '1990')
    await userEvent.selectOptions(canvas.getByLabelText(/Gender/i), 'Female')

    // required field
    await userEvent.selectOptions(canvas.getByLabelText(/may we share this information/i), 'Yes')

    expect(submitButton).not.toBeDisabled()
    await userEvent.click(submitButton)
  },
}

// Validation of year
export const YearOfBirthValidation = {
  args: {
    schema: {
      type: 'object',
      properties: {
        yearOfBirth: { title: 'Year of Birth', type: 'integer', minimum: 1900, maximum: 2025 },
        shareInfo: {
          title: 'Personally Identifiable Information is not shown, but may we share this information with your posts?',
          type: 'string',
          enum: ['Yes', 'No'],
        },
      },
      required: ['shareInfo'],
    },
    uischema: {
      type: 'VerticalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/yearOfBirth' },
        { type: 'Control', scope: '#/properties/shareInfo' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText(/Year of Birth/i)

    await userEvent.type(input, '1800')
    expect(canvas.getByText(/must be >= 1900/i)).toBeInTheDocument()
    expect(canvas.getByRole('button', { name: /Submit/i })).toBeDisabled()
  },
}

// Required field shareInfo before submit
export const RequiredShareInfo = {
  args: {
    schema: {
      type: 'object',
      properties: {
        shareInfo: {
          title: 'Personally Identifiable Information is not shown, but may we share this information with your posts?',
          type: 'string',
          enum: ['Yes', 'No'],
        },
      },
      required: ['shareInfo'],
    },
    uischema: {
      type: 'VerticalLayout',
      elements: [{ type: 'Control', scope: '#/properties/shareInfo' }],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: /Submit/i })
    expect(submit).toBeDisabled()
  },
}

// Optional field checks
export const OptionalField = {
  args: {
    schema: {
      type: 'object',
      properties: {
        nickname: { title: 'Nickname', type: 'string' },
        shareInfo: {
          title: 'Personally Identifiable Information is not shown, but may we share this information with your posts?',
          type: 'string',
          enum: ['Yes', 'No'],
        },
      },
      required: ['shareInfo'],
    },
    uischema: {
      type: 'VerticalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/nickname' },
        { type: 'Control', scope: '#/properties/shareInfo' },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const submit = canvas.getByRole('button', { name: /Submit/i })

    // must answer required field
    expect(submit).toBeDisabled()
    await userEvent.selectOptions(canvas.getByLabelText(/may we share this information/i), 'No')
  },
}

export const SkipOnUndefinedData = {
  args: {
    name: 'moreDetails',
    discussionId: '123456789012345678901234567890abcd',
    schema: testSchema,
    uischema: testUIschema,
  },
  decorators: [
    buildApiDecorator('get-jsform', (discussionId, cb) => () => {
      cb({})
    }),
    buildApiDecorator('upsert-jsform', (discussionId, name, data, cb) => () => {
      cb?.()
    }),
    onDoneDecorator,
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    console.log('[SkipOnUndefinedData] play started')

    expect(canvas.getByLabelText(/Household Income/i)).toBeInTheDocument()
    expect(canvas.getByLabelText(/Housing/i)).toBeInTheDocument()
    expect(canvas.getByLabelText(/Number of Siblings/i)).toBeInTheDocument()

    const result = onDoneResult(canvas)
    console.log('[SkipOnUndefinedData] onDoneResult:', result)

    expect(result).toMatchObject({ count: 0 })
  },
}