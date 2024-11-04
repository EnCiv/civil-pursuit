import DemInfo from '../app/components/dem-info'
import React from 'react'

export default {
  component: DemInfo,
  args: {},
}

export const PrimaryAllFieldsIncluded = {
  args: {
    dob: '1990-10-20',
    state: 'NY',
    party: 'Independent',
  },
}

export const UserNotFound = { args: {} }

export const AgeAndStateOnly = {
  args: {
    dob: '1990-10-20',
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
    dob: '1990-10-20',
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
    dob: '1990-10-20',
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
