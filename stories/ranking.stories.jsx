import React from 'react'
import Ranking from '../app/components/ranking'
import common, { onDoneDecorator, onDoneResult } from './common'
import expect from 'expect'
import { userEvent, within } from '@storybook/testing-library'

export default {
  component: Ranking,
  parameters: { layout: 'centered' },
  decorators: [onDoneDecorator],
}

const testEnabledNoDefault = async (step, numericalIdentifier = '', defaultValue = '') => {
  let item
  await common.asyncSleep(600)

  await step('Item should be found', async () => {
    item = document.querySelector(`.testRanking-${numericalIdentifier}`)
    await step('Item DOM Node should be found', async () => {
      expect(item).toBeTruthy()
    })
    await step('Initial value should be blank', async () => {
      expect(item.dataset.value).toBe(defaultValue)
    })
  })

  await step('When not disabled, states should be properly selectable and represented in item value', async () => {
    await userEvent.click(item.querySelector('.rankingMost'))
    await step('"Most" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Most')
    })

    await userEvent.click(item.querySelector('.rankingNeutral'))
    await step('"Neutral" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Neutral')
    })

    await userEvent.click(item.querySelector('.rankingLeast'))
    await step('"Least" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Least')
    })
  })
}

const testDisabledNoDefault = async (step, numericalIdentifier = '', defaultValue = '') => {
  let item
  await common.asyncSleep(600)

  await step('Item should be found', async () => {
    item = document.querySelector(`.testRanking-${numericalIdentifier}`)
    await step('Item DOM Node should be found', async () => {
      expect(item).toBeTruthy()
    })
    await step('Initial value should be undefined', async () => {
      expect(item.dataset.value).toBe(defaultValue)
    })
  })

  await step('When disabled, states should not be selectable and item value should not change', async () => {
    await userEvent.click(item.querySelector('.rankingMost'))
    await step('"Most" option not selectable; does not set item value', async () => {
      expect(item.dataset.value).toBe(defaultValue)
    })

    await userEvent.click(item.querySelector('.rankingNeutral'))
    await step('"Neutral" option not selectable; does not set item value', async () => {
      expect(item.dataset.value).toBe(defaultValue)
    })

    await userEvent.click(item.querySelector('.rankingLeast'))
    await step('"Least" option not selectable; does not set item value', async () => {
      expect(item.dataset.value).toBe(defaultValue)
    })
  })
}

const testEnabledWithDefaultNeutral = async (step, numericalIdentifier = '', defaultValue = 'Neutral') => {
  let item
  await common.asyncSleep(600)

  await step('Item should be found', async () => {
    item = document.querySelector(`.testRanking-${numericalIdentifier}`)
    await step('Item DOM Node should be found', async () => {
      expect(item).toBeTruthy()
    })
    await step(`Initial value should be ${defaultValue}`, async () => {
      expect(item.dataset.value).toBe(defaultValue)
    })
  })

  await step('When not disabled, states should be properly selectable and represented in item value', async () => {
    await userEvent.click(item.querySelector('.rankingMost'))
    await step('"Most" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Most')
    })

    await userEvent.click(item.querySelector('.rankingNeutral'))
    await step('"Neutral" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Neutral')
    })

    await userEvent.click(item.querySelector('.rankingLeast'))
    await step('"Least" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Least')
    })
  })
}

const testDisabledWithDefaultNeutral = async (step, numericalIdentifier = '', defaultValue = 'Neutral') => {
  let item
  await common.asyncSleep(600)

  await step('Item should be found', async () => {
    item = document.querySelector(`.testRanking-${numericalIdentifier}`)
    await step('Item DOM Node should be found', async () => {
      expect(item).toBeTruthy()
    })
    await step(`Initial value should be ${defaultValue}`, async () => {
      expect(item.dataset.value).toBe(defaultValue)
    })
  })

  await step('When disabled, states should not be selectable and item value should not change', async () => {
    await userEvent.click(item.querySelector('.rankingMost'))
    await step('"Most" option not selectable; does not set item value', async () => {
      expect(item.dataset.value).toBe(defaultValue)
    })

    await userEvent.click(item.querySelector('.rankingNeutral'))
    await step('"Neutral" option not selectable; does not set item value', async () => {
      expect(item.dataset.value).toBe(defaultValue)
    })

    await userEvent.click(item.querySelector('.rankingLeast'))
    await step('"Least" option not selectable; does not set item value', async () => {
      expect(item.dataset.value).toBe(defaultValue)
    })
  })
}

const testEnabledWithBadDefault = async (step, numericalIdentifier = '', defaultValue = '') => {
  let item
  await common.asyncSleep(600)

  await step('Item should be found', async () => {
    item = document.querySelector(`.testRanking-${numericalIdentifier}`)
    await step('Item DOM Node should be found', async () => {
      expect(item).toBeTruthy()
    })
    await step('Initial value should be blank', async () => {
      expect(item.dataset.value).toBe(defaultValue)
    })
  })

  await step('When not disabled, states should be properly selectable and represented in item value', async () => {
    await userEvent.click(item.querySelector('.rankingMost'))
    await step('"Most" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Most')
    })

    await userEvent.click(item.querySelector('.rankingNeutral'))
    await step('"Neutral" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Neutral')
    })

    await userEvent.click(item.querySelector('.rankingLeast'))
    await step('"Least" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Least')
    })
  })
}

const testEnabledWithDashDefault = async (step, numericalIdentifier = '', defaultValue = '') => {
  let item
  await common.asyncSleep(600)

  await step('Item should be found', async () => {
    item = document.querySelector(`.testRanking-${numericalIdentifier}`)
    await step('Item DOM Node should be found', async () => {
      expect(item).toBeTruthy()
    })
    await step('Initial value should be blank', async () => {
      expect(item.dataset.value).toBe(defaultValue)
    })
  })

  await step('When not disabled, states should be properly selectable and represented in item value', async () => {
    await userEvent.click(item.querySelector('.rankingMost'))
    await step('"Most" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Most')
    })

    await userEvent.click(item.querySelector('.rankingNeutral'))
    await step('"Neutral" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Neutral')
    })

    await userEvent.click(item.querySelector('.rankingLeast'))
    await step('"Least" option selectable and sets item value', async () => {
      expect(item.dataset.value).toBe('Least')
    })
  })
}

/* Note that the use of the unique numerical identifier here is solely to facilitate testing via storybook
   without the context of a larger question/point component. In production, I expect that there rankings
   will be referenced by sub-selection on a larger entity.

   More generally, I've incorporated a class identifier containing the relevant option to facilitate
   selection of options, as shown below, rather than an ID.
*/
const generateComponent = (numericalIdentifier, disabled = false, defaultValue = '') => {
  return (
    <Ranking disabled={disabled} defaultValue={defaultValue} className={`testRanking-${numericalIdentifier}`}></Ranking>
  )
}

export const Empty = {
  args: {},
}

export const LeastOnDone = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const leastEle = canvas.getByText(/Least/i)
    await userEvent.click(leastEle)
    const result = onDoneResult()
    expect(result).toMatchObject({ count: 1, onDoneResult: { valid: true, value: 'Least' } })
  },
}

export const DefaultMost = {
  args: { defaultValue: 'Most' },
}

export const BadDefault = {
  args: { defaultValue: 'BadDefault' },
  play: async ({ step }) => {
    // using step instead of canvasElement because don't want userEvent
    await common.asyncSleep(1) // wait for the rerender after onDone is called
    await step('onDone should be called after initial render with valid: false', async () => {
      const result = onDoneResult()
      expect(result).toMatchObject({
        count: 1,
        onDoneResult: { valid: false, value: '' },
      })
    })
  },
}

export const Functionality_Enabled_and_No_Default = {
  render: () => generateComponent(1, false, ''),
  play: ({ step }) => {
    testEnabledNoDefault(step, '1')
  },
}

export const Functionality_Disabled_and_No_Default = {
  render: () => generateComponent(2, true, ''),
  play: ({ step }) => {
    testDisabledNoDefault(step, '2')
  },
}

export const Functionality_Enabled_and_Neutral_Default = {
  render: () => generateComponent(3, false, 'Neutral'),
  play: ({ step }) => {
    testEnabledWithDefaultNeutral(step, '3', 'Neutral')
  },
}

export const Functionality_Disabled_and_Neutral_Default = {
  render: () => generateComponent(4, true, 'Neutral'),
  play: ({ step }) => {
    testDisabledWithDefaultNeutral(step, '4', 'Neutral')
  },
}

export const Functionality_Enabled_and_Bad_Default = {
  render: () => generateComponent(5, false, 'badvalue'),
  play: ({ step }) => {
    testEnabledWithBadDefault(step, '5', '')
  },
}

export const Functionality_Enabled_and_Dash_Default = {
  render: () => generateComponent(6, false, '-'),
  play: ({ step }) => {
    testEnabledWithDashDefault(step, '6', '')
  },
}
