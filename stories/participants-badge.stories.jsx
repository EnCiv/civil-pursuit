// https://github.com/EnCiv/civil-pursuit/issues/221

import React from 'react'
import ParticipantsBadge from '../app/components/participants-badge'
import { DeliberationContextDecorator, socketEmitDecorator } from './common'

export default {
  component: ParticipantsBadge,
  decorators: [
    DeliberationContextDecorator,
    socketEmitDecorator,
    Story => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}

export const NoParticipants = {
  args: {
    minParticipants: 0,
    defaultValue: { participants: 0 },
  },
}

export const OneParticipant = {
  args: {
    minParticipants: 0,
    defaultValue: { participants: 1 },
  },
}

export const MultipleParticipants = {
  args: {
    minParticipants: 0,
    defaultValue: { participants: 42 },
  },
}

export const BelowMinimum = {
  args: {
    minParticipants: 100,
    defaultValue: { participants: 50 },
  },
}

export const AboveMinimum = {
  args: {
    minParticipants: 100,
    defaultValue: { participants: 150 },
  },
}
