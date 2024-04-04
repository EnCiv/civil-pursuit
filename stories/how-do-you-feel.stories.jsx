import React, { useCallback, useState } from 'react'
import { HowdoyoufeelButton, Howdoyoufeel } from '../app/components/how-do-you-feel'

export default {
    title: 'how-do-you-feel',
    component: Howdoyoufeel,
    decorators: [onDoneDecorator],
}
const Template = Component => args => <Component {...args} />


function onDoneDecorator(Story, context) {
    const [result, setResult] = useState({ count: 0 })
    const onDone = useCallback(res => {
        setResult({
            count: result.count + 1,
            onDoneResult: res,
            valid: true, value: "answer"
        })
    })

    context.args.onDone = onDone
    return (
        <>
            <Story />
            {result.count ? (
                <div style={{ width: '100%', border: 'solid 1px black', marginTop: '1rem', marginBottom: '1rem' }}>
                    <div>
                        onDone:{' '}
                        <span title="onDoneResult" id="onDoneResult" style={{ whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify(result, null, 4)}
                        </span>
                    </div>
                </div>
            ) : null}
        </>
    )
}

export const Awesome = Template(HowdoyoufeelButton).bind({})
Awesome.args = {
    title: 'Press me',
    disabled: false,
}



