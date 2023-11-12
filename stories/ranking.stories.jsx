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

const testEnabledFunctionality = async (step, numericalIdentifier = '') => {
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

  await step('When not disabled, states should be properly selectable and represented in item value', async () => {
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

const testDisabledComponent = async (step, numericalIdentifier = '') => {
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

  await step('When disabled, states should not be selectable and item value should not change', async () => {
    await userEvent.click(item.querySelector('#rankingMost'))
    await step('"Most" option not selectable; does not set item value', async () => {
      expect(item.dataset.value).toBe('')
    })

    await userEvent.click(item.querySelector('#rankingNeutral'))
    await step('"Neutral" option not selectable; does not set item value', async () => {
      expect(item.dataset.value).toBe('')
    })

    await userEvent.click(item.querySelector('#rankingLeast'))
    await step('"Least" option not selectable; does not set item value', async () => {
      expect(item.dataset.value).toBe('')
    })
  })
}

const generateComponent = (numericalIdentifier, disabled = false) => {
  return (
    <Ranking
      disabled={disabled}
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
  render: () => generateComponent(1, false),
  play: ({ step }) => {
    testEnabledFunctionality(step, '1')
  },
}

export const ButtonsDisabled = {
  render: () => generateComponent(2, true),
  play: ({ step }) => {
    testDisabledComponent(step, '2')
  },
}
