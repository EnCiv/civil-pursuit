import React from 'react'
import { userEvent, within } from '@storybook/testing-library'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import expect from 'expect'
import { onDoneDecorator, onDoneResult } from './common'
import MoreDetails from './../app/components/more-details'

export default {
  component: MoreDetails,
  args: {},
  // decorators: [onDoneDecorator],
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

const initialDetails = { householdIncome: '0-10000', housing: 'Apartment', numberOfSiblings: '2' }

export const Empty = () => {
  return <MoreDetails />
}

export const FigmaInputMatch = {
  args: {},
}

export const InitialDetailsInput = {
  args: {},
}

export const UserInputAndOnDoneCall = {
  args: {},
}

export const StateOfResidenceSelection = {
  args: {},
}

export const BirthDateInput = {
  args: {},
}
