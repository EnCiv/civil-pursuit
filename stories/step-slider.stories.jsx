// https://github.com/EnCiv/civil-pursuit/issues/112

import React, { useState } from 'react'
import StepSlider from '../app/components/step-slider'

export default {
  title: 'step-slider',
  component: StepSlider,
  argTypes: {},
}

const storybookPadding = '2rem' // it padds the iframe with 1rem all around

function createPrimarySteps(num = 4) {
  function stepLengthGenerator() {
    const subjects = ['Cat ', 'Mountain ', 'Teacher ', 'Bird ', 'Astronaut ']
    const verbs = ['Eats ', 'Discovers ', 'Teaches ', 'Climbs ', 'Paints ']
    const predicates = ['Quickly', 'Mathematics', 'Delicious Meals', 'Happily ', 'Stunning Landscapes']
    const words = [subjects, verbs, predicates]

    let sentence = ''
    for (let i = 0; i < 3; i++) {
      const random = Math.floor((Math.random() * 10) % 5)
      sentence += words[i][random]
    }

    return sentence
  }

  let primarySteps = Array.from({ length: num }, (_, i) => ({
    name: `Step ${i + 1}: The ${stepLengthGenerator()}`,
    title: `this is step ${i + 1}`,
    complete: false,
    seen: false,
  }))
  primarySteps[1].name = 'Step 2: Rate'

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
    </div>
  )
}

const Panel = props => (
  <div style={{ width: 'inherit', height: '150vh', backgroundColor: props.backGroundColor }}>
    <div style={{ position: 'relative', width: 'inherit', height: 'inherit' }}>
      <button onClick={props.onDone} style={{ position: 'absolute', top: '20vh' }}>
        Done
      </button>
    </div>
  </div>
)

const list = [
  <Panel backGroundColor="green" />,
  <Panel backGroundColor="blue" />,
  <Panel backGroundColor="red" />,
  <Panel backGroundColor="purple" />,
]

function createPanels(panels = 4) {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
  const panelList = []

  for (let count = 0; count < panels; count++) {
    panelList.push(<Panel backGroundColor={colors[count % colors.length]} />)
  }

  return panelList
}

export const WithNoSteps = Template.bind({})
WithNoSteps.args = { children: createPanels(4) }

export const WithFourSteps = Template.bind({})
WithFourSteps.args = { steps: createPrimarySteps(4), children: createPanels(4) }

export const WithSevenSteps = Template.bind({})
WithSevenSteps.args = { steps: createPrimarySteps(7), children: createPanels(7) }
