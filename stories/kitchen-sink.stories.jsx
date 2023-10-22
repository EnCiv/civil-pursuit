import React from 'react';
import KitchenSink from '../app/components/kitchen-sink';
import common from './common'

export default {
    component: KitchenSink,
    parameters: {
        layout: 'centered',
      },
    decorators: [
        Story => (
            <div style={common.outerStyle}>
                {common.outerSetup()}
                <Story />
            </div>
        )
    ]
}

export const Primary = { args: {} }
