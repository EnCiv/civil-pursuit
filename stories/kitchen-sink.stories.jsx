import React from 'react';
import KitchenSink from '../app/components/kitchen-sink';
import common from './common'

const testType = {
	"_id": "56ce331e7957d17202e996d6",
	"name": "Intro",
	"harmony": [],
	"id": "9okDr"
}

export default {
    component: KitchenSink,
    decorators: [
        Story => {
            common.outerSetup()
            return <Story />
        }
    ]
}

export const KitchenSinkStory = () => {
    const testItem = {
        subject: "Test Item Subject",
        description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
        type: testType
    }

    return <div style={common.outerStyle}><KitchenSink /></div>
}
