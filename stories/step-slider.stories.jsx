// https://github.com/EnCiv/civil-pursuit/issues/112

import React, { useState } from 'react'
import StepSlider from '../app/components/step-slider'
import NavBar from '../app/components/nav-bar'

export default {
  title: 'step-slider',
  component: StepSlider,
  argTypes: {},
}

const storybookPadding = '2rem' // it padds the iframe with 1rem all around

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

export const NoNavBar = Template.bind({})
NoNavBar.args = { children: list }

export const WithNavBar = Template.bind({})
WithNavBar.args = { NavBar: NavBar, children: list }

const list2 = [
  <Panel backGroundColor="yellow" />,
  <Panel backGroundColor="gray" />,
  <StepSlider NavBar={NavBar} children={list} />,
  <Panel backGroundColor="aqua" />,
  <Panel backGroundColor="magenta" />,
]

export const Nested = Template.bind({})
Nested.args = { NavBar: undefined, children: list2 }

export const NestedWithNavBar = Template.bind({})
NestedWithNavBar.args = { NavBar: NavBar, children: list2 }
