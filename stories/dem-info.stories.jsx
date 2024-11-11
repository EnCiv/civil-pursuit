import DemInfo from '../app/components/dem-info'
import React from 'react'

export default {
  component: DemInfo,
  args: {},
}

export const PrimaryAllFieldsIncluded = {
  args: {
    dob: new Date('1990-10-20T00:00:00.000Z').toISOString(),
    state: 'NY',
    party: 'Independent',
  },
}

export const UserNotFound = { args: {} }

export const AgeAndStateOnly = {
  args: {
    dob: new Date('1990-10-20T00:00:00.000Z').toISOString(),
    state: 'NY',
  },
}

export const StateAndPartyOnly = {
  args: {
    state: 'NY',
    party: 'Independent',
  },
}

export const AgeAndPartyOnly = {
  args: {
    dob: new Date('1990-10-20T00:00:00.000Z').toISOString(),
    party: 'Independent',
  },
}

export const PartyOnly = {
  args: {
    party: 'Independent',
  },
}

export const AgeOnly = {
  args: {
    dob: new Date('1990-10-20T00:00:00.000Z').toISOString(),
  },
}

export const StateOnly = {
  args: {
    state: 'NY',
  },
}

export const PartyOnlyEmptyField = {
  args: {
    party: '',
  },
}

export const AgeOnlyEmptyField = {
  args: {
    dob: null,
  },
}

export const StateOnlyEmptyField = {
  args: {
    state: '',
  },
}
