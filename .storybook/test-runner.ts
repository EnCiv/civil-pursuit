import { injectAxe, checkA11y } from 'axe-playwright'

import { getStoryContext } from '@storybook/test-runner'

import type { TestRunnerConfig } from '@storybook/test-runner'

/*
 * See https://storybook.js.org/docs/react/writing-tests/test-runner#test-hook-api-experimental
 * to learn more about the test-runner hooks API.
 */
let a11yTestsDisabledMessage = false

const a11yConfig: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page)
    // Clear localStorage before each test to prevent data leakage between tests
    await page.evaluate(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear()
      }
    })
  },
  async postVisit(page, context) {
    // Get the entire context of a story, including parameters, args, argTypes, etc.
    if (!a11yTestsDisabledMessage) {
      a11yTestsDisabledMessage = true
      console.warn('a11y tests disabled in .storybook/test-runner.ts')
    }
    const storyContext = await getStoryContext(page, context)
    return // just don't run a11y tests for now
    // Do not run a11y tests on disabled stories.
    if (storyContext.parameters?.a11y?.disable) {
      return
    }
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    })
  },
}

module.exports = a11yConfig
