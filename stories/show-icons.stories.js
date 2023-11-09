import React, { useState } from 'react'
import * as icons from '../app/svgr'

function Iconify(props) {
  const { iconName, ...otherProps } = props
  const Icon = icons[iconName]
  return <Icon {...otherProps} />
}

function ShowIcons(props) {
  const { backgroundColor } = props
  const [iconName, setIconName] = useState(Object.keys(icons)[0])
  return (
    <div style={{ backgroundColor }}>
      <h1 style={{ textAlign: 'center' }}>Icons found in app/svgr</h1>
      {Object.keys(icons).map(key => {
        const Icon = icons[key]
        return (
          <div
            style={{
              display: 'inline-block',
              textAlign: 'center',
              margin: '1rem',
            }}
            onClick={() => setIconName(key)}
          >
            <Icon />
            <div>{key}</div>
          </div>
        )
      })}
      <div style={{ padding: 0, margin: 0 }}>
        <div
          style={{
            border: '1px solid green',
            display: 'block',
            margin: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: 0,
            width: 'fit-content',
            height: 'fit-content',
          }}
        >
          <Iconify iconName={iconName} style={{ display: 'block' }} width="30rem" height="auto" />
        </div>
      </div>
    </div>
  )
}

export default {
  title: 'Show Icons',
  component: ShowIcons,
  argTypes: {},
}

const Template = (args, context) => {
  return <ShowIcons {...args} />
}

export const Normal = Template.bind({})
Normal.args = { backgroundColor: '#ececec' }
