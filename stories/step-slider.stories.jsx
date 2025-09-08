// https://github.com/EnCiv/civil-pursuit/issues/112
// https://github.com/EnCiv/civil-pursuit/issues/332

import React, { useState } from 'react'
import StepSlider from '../app/components/step-slider'
import TopNavBar from '../app/components/top-nav-bar'
import Footer from '../app/components/footer'

export default {
  component: StepSlider,
  parameters: {
    layout: 'fullscreen',
  },
}

const storybookPadding = '2rem' // it padds the iframe with 1rem all around

const stepNames = ['Answer', 'Group', 'Rank', 'Why Most', 'Why Least', 'Compare Why Most', 'Compare Why Least', 'Review', 'Intermission']

function createPrimarySteps(num = 4) {
  let primarySteps = Array.from({ length: num }, (_, i) => ({
    name: stepNames[i],
    title: `this is step ${i + 1} names ${stepNames[i]}`,
  }))

  return primarySteps
}

const Template = args => {
  const [backgroundColor, setBackgroundColor] = useState('white')
  return (
    <div
      style={{
        width: `calc(100vw - ${storybookPadding})`,
        minHeight: `calc(100vh - ${storybookPadding})`,
        backgroundColor: backgroundColor,
      }}
    >
      <TopNavBar />
      <div
        style={{
          width: '48em',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          padding: 0,
          backgroundColor: 'black',
          minHeight: `calc(100vh - ${storybookPadding})`,
        }}
      >
        <StepSlider {...args} onDone={val => (val ? setBackgroundColor('black') : setBackgroundColor('white'))} />
      </div>
      <Footer />
    </div>
  )
}

const Panel = props => (
  <div style={{ width: 'inherit', height: '150vh', backgroundColor: props.backGroundColor }}>
    <div style={{ position: 'relative', width: 'inherit', height: 'inherit' }}>
      <button onClick={() => props.onDone({ valid: true, value: 1 })} style={{ position: 'absolute', top: '20vh' }}>
        Done
      </button>

      <button onClick={() => props.onDone({ valid: true, value: 'skip' })} style={{ position: 'absolute', top: '40vh' }}>
        Skip
      </button>

      <button onClick={() => props.onDone({ valid: true, value: 'Rank' })} style={{ position: 'absolute', top: '60vh' }}>
        Move To Rank
      </button>
    </div>
  </div>
)

const list = [<Panel backGroundColor="green" />, <Panel backGroundColor="blue" />, <Panel backGroundColor="red" />, <Panel backGroundColor="purple" />]

function createPanels(panels = 4) {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'gray']
  const panelList = []

  for (let count = 0; count < panels; count++) {
    panelList.push(<Panel backGroundColor={colors[count % colors.length]} stepName={stepNames[count]} />)
  }

  return panelList
}

export const WithNoSteps = Template.bind({})
WithNoSteps.args = { children: createPanels(4) }

export const WithFourSteps = Template.bind({})
WithFourSteps.args = { steps: createPrimarySteps(4), children: createPanels(4) }

export const WithSevenSteps = Template.bind({})
WithSevenSteps.args = { steps: createPrimarySteps(7), children: createPanels(7) }

const childrenWithNestedSlider = createPanels(5)
childrenWithNestedSlider[2] = <StepSlider steps={createPrimarySteps(3)} children={createPanels(3)} />
export const NestedSliders = {
  args: { children: childrenWithNestedSlider },
  render: Template,
}
