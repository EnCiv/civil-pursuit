import DemInfo from '../app/components/dem-info';
import React from 'react';

export default {
    component: DemInfo,
    args: {}
}

export const PrimaryAllFieldsIncluded = { args: {
    user: {
        dob: '1990-10-20T00:00:00.000Z',
        state: 'NY',
        party: 'Independent'
      },
}}

export const UserNotFound = { args: {}}

export const NoUserFields = { args: { user: {}}}

export const AgeAndStateOnly = {
    args: {
        user: {
            dob: '1990-10-20T00:00:00.000Z',
            state: 'NY',
        },
    }
}

export const StateAndPartyOnly = {
    args: {
        user: {
            state: 'NY',
            party: 'Independent',
        },
    }
}

export const AgeAndPartyOnly = {
    args: {
        user: {
            dob: '1990-10-20T00:00:00.000Z',
            party: 'Independent',
        },
    }
}

export const PartyOnly = {
    args: {
        user: {
            party: 'Independent',
        },
    }
}

export const AgeOnly = {
    args: {
        user: {
            dob: '1990-10-20T00:00:00.000Z',
        },
    }
}

export const StateOnly = {
    args: {
        user: {
            state: 'NY',
        },
    }
}

export const PartyOnlyEmptyField = {
    args: {
        user: {
            party: '',
        },
    }
}

export const AgeOnlyEmptyField = {
    args: {
        user: {
            dob: null,
        },
    }
}

export const StateOnlyEmptyField = {
    args: {
        user: {
            state: '',
        },
    }
}
