import React from 'react'

import expect from 'expect'

import Common from './common'

import ReactScrollBar from '../app/components/util/react-scrollbar'

import { fireEvent, within } from '@storybook/testing-library'

class Layout extends React.Component {
    render(){
        return (
            <div style={Common.outerStyle}>
                <div ref={e=>{if(!this.topBar && e) {this.topBar=e;this.forceUpdate()}}} style={{height: "100px", position: "fixed", top: 0, left: 0, right: 0,zIndex: 2, backgroundColor: "rgba(255,255,255,.9)", margin: 0,textAlign: "center", verticalAlign: "middle"}}>Banner</div>
                <ReactScrollBar style={{}} topBar={this.topBar} extent={0}>
                    <div id="scroll-bar">
                        {this.props.children}
                    </div>
                </ReactScrollBar>
            </div>
        )
    }
}

export default {
  title: 'react-scroll-bar',
  component: Layout,
  decorators: [
    Story => {
      Common.outerSetup()
      return <Story />
    },
  ],
}

const generateDivs = maxLines => {
  let lines = []
  let i = 0
  while (i++ < maxLines)
    lines.push(
      <div id={'line-' + i} key={'line-' + i}>
        {i}
      </div>
    )

  return (
    <Layout>
      <div style={{ backgroundColor: 'lightblue' }}>{lines}</div>
    </Layout>
  )
}

const testFunction = async (canvasElement, step, focalPoint = '') => {
  await Common.asyncSleep(600)
  const canvas = within(canvasElement)

  await step('Item should be found', async () => {
    let item = canvas.getByText(`${focalPoint}`)
    // let item=document.getElementById("line-78");
    await step('Item DOM Node should be found', async () => {
      expect(item).not.toBeNull()
    })
    await step('Item should be focusable', async () => {
      // window.Synapp.ScrollFocus(item)
      // fireEvent.focus(item)
      //   item.focus()
      // expect(document.activeElement).toBe(item);
    })
  })
}

export const Setup = () => {
  return generateDivs(80)
}

export const ScrollFocusAt1 = {
  render: () => {
    return generateDivs(80)
  },
  play: ({ canvasElement, step }) => {
    testFunction(canvasElement, step, '1')
  },
}

export const ScrollFocusAt20 = {
  render: () => {
    return generateDivs(80)
  },
  play: ({ canvasElement, step }) => {
    testFunction(canvasElement, step, '20')
  },
}

export const ScrollFocusAt78 = {
  render: () => {
    return generateDivs(80)
  },
  play: ({ canvasElement, step }) => {
    testFunction(canvasElement, step, '78')
  },
}

export const ScrollFocusAt80 = {
  render: () => {
    return generateDivs(80)
  },
  play: ({ canvasElement, step }) => {
    testFunction(canvasElement, step, '80')
  },
}

export const ScrollFocusSmallArea1 = {
  render: () => {
    return generateDivs(20)
  },
  play: ({ canvasElement, step }) => {
    testFunction(canvasElement, step, '1')
  },
}

export const ScrollFocusSmallArea20 = {
  render: () => {
    return generateDivs(20)
  },
  play: ({ canvasElement, step }) => {
    testFunction(canvasElement, step, '20')
  },
}

export const ScrollFocus40DivTooLarge = {
  render: () => {
    let lines = []
    let i = 0
    while (i++ < 80)
      lines.push(
        <div id={'line-' + i} style={i === 40 ? { height: '2000px' } : {}} key={'line-' + i}>
          {i}
        </div>
      )

    return (
      <Layout>
        <div style={{ backgroundColor: 'lightblue' }}>{lines}</div>
      </Layout>
    )
  },
  play: ({ canvasElement, step }) => {
    testFunction(canvasElement, step, '40')
  },
}
