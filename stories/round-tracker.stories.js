// https://github.com/EnCiv/civil-pursuit/issues/101
import React from 'react';
import RoundTracker from '../app/components/round-tracker';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

export default {
  title: 'RoundTracker',
  component: RoundTracker,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
};

const Template = (args) => <RoundTracker {...args} />;

export const OneRound = Template.bind({});
OneRound.args = {
  roundsStatus: ['inProgress', 'pending', 'pending'],
};

export const TwoRounds = Template.bind({});
TwoRounds.args = {
  roundsStatus: ['complete', 'inProgress', 'pending'],
};

export const ThreeRounds = Template.bind({});
ThreeRounds.args = {
  roundsStatus: ['complete', 'complete', 'inProgress', 'pending'],
};

export const FourRounds = Template.bind({});
FourRounds.args = {
  roundsStatus: ['complete', 'complete', 'complete', 'inProgress', 'pending'],
};

export const EightRounds = Template.bind({});
EightRounds.args = {
  roundsStatus: ['complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'inProgress', 'pending'],
};

export const TwelveRounds = Template.bind({});
TwelveRounds.args = {
  roundsStatus: ['complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'inProgress'],
};

export const EmptyRounds = Template.bind({});
EmptyRounds.args = {
  roundsStatus: [],
};

// Mobile views
export const MobileOneRound = Template.bind({});
MobileOneRound.args = {
  roundsStatus: ['inProgress', 'pending'],
};
MobileOneRound.parameters = {
  viewport: {
    defaultViewport: 'iphonex',
  },
};

export const MobileTwoRounds = Template.bind({});
MobileTwoRounds.args = {
  roundsStatus: ['complete', 'inProgress', 'pending'],
};
MobileTwoRounds.parameters = {
  viewport: {
    defaultViewport: 'iphonex',
  },
};

export const MobileThreeRounds = Template.bind({});
MobileThreeRounds.args = {
  roundsStatus: ['complete', 'complete', 'inProgress', 'pending'],
};
MobileThreeRounds.parameters = {
  viewport: {
    defaultViewport: 'iphonex',
  },
};

export const MobileFourRounds = Template.bind({});
MobileFourRounds.args = {
  roundsStatus: ['complete', 'complete', 'complete', 'inProgress', 'pending'],
};
MobileFourRounds.parameters = {
  viewport: {
    defaultViewport: 'iphonex',
  },
};

export const MobileEightRounds = Template.bind({});
MobileEightRounds.args = {
  roundsStatus: ['complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'inProgress', 'pending'],
};
MobileEightRounds.parameters = {
  viewport: {
    defaultViewport: 'iphonex',
  },
};

export const MobileTwelveRounds = Template.bind({});
MobileTwelveRounds.args = {
  roundsStatus: ['complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'inProgress'],
};
MobileTwelveRounds.parameters = {
  viewport: {
    defaultViewport: 'iphonex',
  },
};
