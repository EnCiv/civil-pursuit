import React from 'react'
import HowDoYouFeel from '../app/components/how-do-you-feel'
import common, { onDoneDecorator, onDoneResult } from './common'

export default {
  component: HowDoYouFeel,
  parameters: { layout: 'centered' },
  decorators: [onDoneDecorator],
}

export const Empty = {
  args: {
    title: 'Press me',
    disabled: false,
  },
}
