import React from 'react';
import RoundTracker from './round-tracker';

export default {
  title: 'Components/RoundTracker',
  component: RoundTracker,
};

const Template = (args) => <RoundTracker {...args} />;

export const Default = Template.bind({});
Default.args = {
  totalRounds: 12,
};

export const MobileView = Template.bind({});
MobileView.args = {
  totalRounds: 12,
};
