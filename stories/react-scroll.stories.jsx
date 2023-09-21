import React from 'react'

const specs = () => {}
const describe = () => {}
const it = () => {}

// import {ReactWrapper, mount} from "enzyme";
import expect from 'expect'

import Common from './common'

import ReactScrollBar from '../app/components/util/react-scrollbar'

class Layout extends React.Component {
  render() {
    return (
      <div style={Common.outerStyle}>
        <div
          ref={e => {
            if (!this.topBar && e) {
              this.topBar = e
              this.forceUpdate()
            }
          }}
          style={{
            height: '100px',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            backgroundColor: 'rgba(255,255,255,.9)',
            margin: 0,
            textAlign: 'center',
            verticalAlign: 'middle',
          }}
        >
          Banner
        </div>
        <ReactScrollBar style={{}} topBar={this.topBar} extent={0}>
          <div id="scroll-bar">{this.props.children}</div>
        </ReactScrollBar>
      </div>
    )
  }
}

export default {
  title: 'react-scroll',
  component: Layout,
  decorators: [
    Story => (
      <Layout>
        {Common.outerSetup()}
        <Story />
      </Layout>
    ),
  ],
}

export const Setup = () => {
  Common.outerSetup()
  var lines = []
  let i = 0
  while (i++ < 80) lines.push(<div key={'line-' + i}>{i}</div>)

  return <div style={{ backgroundColor: 'lightblue' }}>{lines}</div>
}

export const ScrollFocusAt20 = () => {
  var topBar = undefined
  Common.outerSetup()
  var lines = []
  let i = 0
  while (i++ < 80)
    lines.push(
      <div id={'line-' + i} key={'line-' + i}>
        {i}
      </div>
    )

  const story = <div style={{ backgroundColor: 'lightblue' }}>{lines}</div>

  const storyTest = async e => {
    // do this after the story has rendered
    Common.Wrapper = mount(story, { attachTo: e })
    await Common.asyncSleep(600)

    specs(() =>
      describe('item should be found', () => {
        let item = document.getElementById('line-20')
        window.Synapp.ScrollFocus(item)

        it(`Item DOM Node should be found`, function () {
          expect(item).toBeTruthy()
        })
      })
    )
  }

  return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>
}

export const ScrollFocusAt80 = () => {
  var topBar = undefined
  Common.outerSetup()
  var lines = []
  let i = 0
  while (i++ < 80)
    lines.push(
      <div id={'line-' + i} key={'line-' + i}>
        {i}
      </div>
    )

  const story = <div style={{ backgroundColor: 'lightblue' }}>{lines}</div>

  const storyTest = async e => {
    // do this after the story has rendered
    Common.Wrapper = mount(story, { attachTo: e })
    await Common.asyncSleep(600)

    specs(() =>
      describe('item should be found', () => {
        let item = document.getElementById('line-80')
        window.Synapp.ScrollFocus(item)
        it(`Item DOM Node should be found`, function () {
          expect(item).toBeTruthy()
        })
      })
    )
  }
  return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>
}

export const ScrollFocusAt78 = () => {
  var topBar = undefined
  Common.outerSetup()
  var lines = []
  let i = 0
  while (i++ < 80)
    lines.push(
      <div id={'line-' + i} key={'line-' + i}>
        {i}
      </div>
    )

  const story = <div style={{ backgroundColor: 'lightblue' }}>{lines}</div>

  const storyTest = async e => {
    // do this after the story has rendered
    Common.Wrapper = mount(story, { attachTo: e })
    await Common.asyncSleep(600)

    specs(() =>
      describe('item should be found', () => {
        let item = document.getElementById('line-78')
        window.Synapp.ScrollFocus(item)
        it(`Item DOM Node should be found`, function () {
          expect(item).toBeTruthy()
        })
      })
    )
  }
  return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>
}

export const ScrollFocusAt40 = () => {
  var topBar = undefined
  Common.outerSetup()
  var lines = []
  let i = 0
  while (i++ < 80)
    lines.push(
      <div id={'line-' + i} style={i === 40 ? { height: '2000px' } : {}} key={'line-' + i}>
        {i}
      </div>
    )

  const story = <div style={{ backgroundColor: 'lightblue' }}>{lines}</div>

  const storyTest = async e => {
    // do this after the story has rendered
    Common.Wrapper = mount(story, { attachTo: e })
    await Common.asyncSleep(600)

    specs(() =>
      describe('item should be found', () => {
        let item = document.getElementById('line-40')
        window.Synapp.ScrollFocus(item)
        it(`Item DOM Node should be found`, function () {
          expect(item).toBeTruthy()
        })
      })
    )
  }
  return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>
}

export const ScrollFocusAt1 = () => {
  var topBar = undefined
  Common.outerSetup()
  var lines = []
  let i = 0
  while (i++ < 80)
    lines.push(
      <div id={'line-' + i} key={'line-' + i}>
        {i}
      </div>
    )

  const story = <div style={{ backgroundColor: 'lightblue' }}>{lines}</div>

  const storyTest = async e => {
    // do this after the story has rendered
    Common.Wrapper = mount(story, { attachTo: e })
    await Common.asyncSleep(600)

    specs(() =>
      describe('item should be found', () => {
        let item = document.getElementById('line-1')
        window.Synapp.ScrollFocus(item)
        it(`Item DOM Node should be found`, function () {
          expect(item).toBeTruthy()
        })
      })
    )
  }
  return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>
}

export const ScrollFocusSmallArea1 = () => {
  var topBar = undefined
  Common.outerSetup()
  var lines = []
  let i = 0
  while (i++ < 20)
    lines.push(
      <div id={'line-' + i} key={'line-' + i}>
        {i}
      </div>
    )

  const story = <div style={{ backgroundColor: 'lightblue' }}>{lines}</div>

  const storyTest = async e => {
    // do this after the story has rendered
    Common.Wrapper = mount(story, { attachTo: e })
    await Common.asyncSleep(600)

    specs(() =>
      describe('item should be found', () => {
        let item = document.getElementById('line-1')
        window.Synapp.ScrollFocus(item)
        it(`Item DOM Node should be found`, function () {
          expect(item).toBeTruthy()
        })
      })
    )
  }
  return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>
}

export const ScrollFocusSmallArea20 = () => {
  var topBar = undefined
  Common.outerSetup()
  var lines = []
  let i = 0
  while (i++ < 20)
    lines.push(
      <div id={'line-' + i} key={'line-' + i}>
        {i}
      </div>
    )

  const story = <div style={{ backgroundColor: 'lightblue' }}>{lines}</div>

  const storyTest = async e => {
    // do this after the story has rendered
    Common.Wrapper = mount(story, { attachTo: e })
    await Common.asyncSleep(600)

    specs(() =>
      describe('item should be found', () => {
        let item = document.getElementById('line-20')
        window.Synapp.ScrollFocus(item)
        it(`Item DOM Node should be found`, function () {
          expect(item).toBeTruthy()
        })
      })
    )
  }
  return <Common.RenderStory testFunc={storyTest}></Common.RenderStory>
}
