import React from 'react'
import RoundTracker from '../app/components/round-tracker'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

export default {
  title: 'RoundTracker',
  component: RoundTracker,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
}

export const OneRound = {
  args: {
    roundsStatus: ['inProgress', 'pending', 'pending'],
  },
}

export const TwoRounds = {
  args: {
    roundsStatus: ['complete', 'inProgress', 'pending'],
  },
}

export const ThreeRounds = {
  args: {
    roundsStatus: ['complete', 'complete', 'inProgress', 'pending'],
  },
}

export const FourRounds = {
  args: {
    roundsStatus: ['complete', 'complete', 'complete', 'inProgress', 'pending'],
  },
}

export const EightRounds = {
  args: {
    roundsStatus: [
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'inProgress',
      'pending',
    ],
  },
}

export const TwelveRounds = {
  args: {
    roundsStatus: [
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'inProgress',
    ],
  },
}

export const EmptyRounds = {
  args: {
    roundsStatus: [],
  },
}

// Mobile views
export const MobileOneRound = {
  args: {
    roundsStatus: ['inProgress', 'pending'],
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const MobileTwoRounds = {
  args: {
    roundsStatus: ['complete', 'inProgress', 'pending'],
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const MobileThreeRounds = {
  args: {
    roundsStatus: ['complete', 'complete', 'inProgress', 'pending'],
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const MobileFourRounds = {
  args: {
    roundsStatus: ['complete', 'complete', 'complete', 'inProgress', 'pending'],
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const MobileEightRounds = {
  args: {
    roundsStatus: [
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'inProgress',
      'pending',
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const MobileTwelveRounds = {
  args: {
    roundsStatus: [
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'complete',
      'inProgress',
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}
