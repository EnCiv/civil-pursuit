import { setupPage } from '@storybook/test-runner'
import type { TestRunnerConfig } from '@storybook/test-runner'

/*
 * See https://storybook.js.org/docs/react/writing-tests/test-runner#test-hook-api-experimental
 * to learn more about the test-runner hooks API.
 */

/*
We have disable a11yConfig because we have been getting intermittent errors like this:
```
 FAIL  stories/tournament.stories.js (48.896 s)
  ● tournament › BatchUpsertInteractionTest › play-test

    page.evaluate: Execution context was destroyed, most likely because of a navigation

      21 |       console.warn('a11y tests disabled in .storybook/test-runner.ts')
      22 |     }
    > 23 |     const storyContext = await getStoryContext(page, context)
         |                                               ^
      24 |     return // just don't run a11y tests for now
      25 |     // Do not run a11y tests on disabled stories.
      26 |     if (storyContext.parameters?.a11y?.disable) {
```

The code below remains disabled; getStoryContext can fail when a story navigates.

const a11yConfig: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page)
  },
  async postVisit(page, context) {
    if (!a11yTestsDisabledMessage) {
      a11yTestsDisabledMessage = true
      console.warn('a11y tests disabled in .storybook/test-runner.ts')
    }
    const storyContext = await getStoryContext(page, context)
    return // just don't run a11y tests for now
    if (storyContext.parameters?.a11y?.disable) return
    await checkA11y(page, '#storybook-root')
  },
}

module.exports = a11yConfig
*/

const config: TestRunnerConfig = {
  async preVisit(page) {
    const hasTestRunner = await page.evaluate(() => typeof (window as any).__test === 'function').catch(() => false)
    if (!hasTestRunner) await setupPage(page, page.context())
  },
}

module.exports = config
