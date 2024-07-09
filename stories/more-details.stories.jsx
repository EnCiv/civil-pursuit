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
  },
}

export const InitialDetailsInput = {
  args: {
    schema: testSchema,
    uischema: testUIschema,
    details: initialDetails,
  },
}

export const UserInputAndOnDoneCall = {
  args: { schema: testSchema, uischema: testUIschema, details: initialDetails, onDone: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /Submit/i }))
    let result = onDoneResult(canvas)
    expect(result.count).toEqual(2)
  },
}

export const StateOfResidenceSelection = {
  args: { schema: testSchema, uischema: testUIschema },
}

export const BirthDateInput = {
  args: { schema: testSchema, uischema: testUIschema },
}
