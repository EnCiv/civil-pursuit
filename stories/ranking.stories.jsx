import React from 'react'
import Ranking from '../app/components/util/ranking'
import common from './common'
import expect from 'expect'
import { userEvent } from '@storybook/testing-library'

export default {
  component: Ranking,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div style={common.outerStyle}>
        {common.outerSetup()}
        <Story />
      </div>
    ),
  ],
}

const testFunction = async (step, numericalIdentifier = '') => {
  let item
  await common.asyncSleep(600)

  await step('Item should be found', async () => {
    item = document.querySelector(`#testRanking-${numericalIdentifier}`)
    await step('Item DOM Node should be found', async () => {
      expect(item).toBeTruthy()
    })
    await step('Initial value should be undefined', async () => {
      expect(item.dataset.value).toBe('')
    })
  })

  await step('States should be properly selectable and represented in item value', async () => {
    await userEvent.click(item.querySelector('#rankingMost'))
    await step('"Most" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Most')
    })

    await userEvent.click(item.querySelector('#rankingNeutral'))
    await step('"Neutral" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Neutral')
    })

    await userEvent.click(item.querySelector('#rankingLeast'))
    await step('"Least" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Least')
    })
  })
}

const generateComponent = numericalIdentifier => {
  return (
    <Ranking
      id={`testRanking-${numericalIdentifier}`}
      block="true"
      large="true"
      className={['itemComponent', 'className2', 'className3']}
      onSelect={e => {
        console.log(e.target.value)
      }}
    ></Ranking>
  )
}
export const Primary = {
  render: () => generateComponent(1),
  play: ({ step }) => {
    testFunction(step, '1')
  },
}
