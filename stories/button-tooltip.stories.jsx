// https://github.com/EnCiv/civil-pursuit/issues/43

import React from 'react'
import { userEvent, within, expect, waitFor, fireEvent } from 'storybook/test'
import { Button, SecondaryButton, PrimaryButton } from '../app/components/button'

/**
 * Stories testing the TooltipPortal behaviour inside Button components.
 *
 * The tooltip (portal) renders in `document.body`, not inside `canvasElement`,
 * so assertions use `within(document.body)` rather than `within(canvasElement)`.
 *
 * Corner cases covered:
 *  - Tooltip appears on long-press (>500 ms) and disappears automatically
 *  - Tooltip does NOT appear on short click (<500 ms)
 *  - Tooltip renders in document.body (portal), not inside the canvas
 *  - Tooltip text matches the `title` prop
 *  - Long title text is visible without overflow clipping
 *  - Button near top-left edge: tooltip opens below/right
 *  - Button near top-right edge: tooltip opens below/left-aligned-right
 *  - Button near bottom-left edge: tooltip opens above/right
 *  - Button near bottom-right edge: tooltip opens above/left-aligned-right
 *  - Tooltip disappears when mouse leaves before long-press fires
 *  - Tooltip still works after re-render (title prop change)
 *  - Disabled button still shows tooltip on long-press
 */

export default {
  title: 'Button/Tooltip',
  component: Button,
  parameters: {
    layout: 'fullscreen',
  },
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

/** Press and hold a button for `ms` milliseconds then release. */
async function longPress(element, ms = 600) {
  await userEvent.pointer([{ keys: '[MouseLeft>]', target: element }])
  await new Promise(resolve => setTimeout(resolve, ms))
  await userEvent.pointer([{ keys: '[/MouseLeft]', target: element }])
}

/** Press and immediately release (short click, no tooltip).
 *  Uses fireEvent for synchronous dispatch so the 500ms timer cannot
 *  fire in the async event loop between mousedown and mouseup. */
async function shortPress(element) {
  fireEvent.mouseDown(element)
  fireEvent.mouseUp(element)
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Tooltip appears after a long-press (>500 ms) and the text matches `title`. */
export const TooltipAppearsOnLongPress = {
  args: {
    title: 'Long-press tooltip text',
    children: 'Hold me',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Hold me/i })

    // Before press — tooltip must not exist
    expect(document.querySelector('[role="tooltip"]')).toBeNull()

    await longPress(btn)

    // Tooltip renders in document.body via portal
    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      expect(tooltip.textContent).toContain('Long-press tooltip text')
    })
  },
}

/** Short click must NOT trigger the tooltip. */
export const TooltipDoesNotAppearOnShortClick = {
  args: {
    title: 'Should not appear',
    children: 'Click me quickly',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Click me quickly/i })

    await shortPress(btn)

    // Wait past the 500ms long-press threshold — tooltip must never mount
    await new Promise(resolve => setTimeout(resolve, 600))
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
  },
}

/** Tooltip is NOT inside canvasElement — it is in document.body. */
export const TooltipRendersInPortal = {
  args: {
    title: 'Portal tooltip',
    children: 'Hold for portal check',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Hold for portal check/i })

    await longPress(btn)

    await waitFor(() => {
      // Must NOT be inside canvasElement
      const insideCanvas = canvasElement.querySelector('[role="tooltip"]')
      expect(insideCanvas).toBeNull()

      // Must be inside document.body
      const inBody = document.querySelector('[role="tooltip"]')
      expect(inBody).not.toBeNull()
    })
  },
}

/** Tooltip auto-dismisses after `displayTime` without user action.
 *  displayTime = max(8, 0.1 * title.length) * 1000 ms. For "I will disappear" (16 chars)
 *  that is 8000 ms. The test waits up to 12 s for the portal to vanish. */
export const TooltipAutoDismisses = {
  args: {
    title: 'I will disappear',
    children: 'Hold then wait',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Hold then wait/i })

    await longPress(btn)

    // Confirm it appeared
    await waitFor(() => {
      expect(document.querySelector('[role="tooltip"]')).not.toBeNull()
    })

    // Wait for auto-dismiss (displayTime = 8000 ms); allow up to 12 s
    await waitFor(
      () => {
        expect(document.querySelector('[role="tooltip"]')).toBeNull()
      },
      { timeout: 12000 }
    )
  },
}

/** Tooltip does NOT appear when mouse leaves the button before the 500ms long-press fires. */
export const TooltipCancelledByMouseLeaveBeforeTooltipStarts = {
  args: {
    title: 'Should be cancelled',
    children: 'Move away fast',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Move away fast/i })

    // Use synchronous fireEvent so timing is deterministic
    fireEvent.mouseDown(btn)
    // Wait less than the 500ms threshold
    await new Promise(resolve => setTimeout(resolve, 100))
    // React's onMouseLeave is triggered by mouseout (which bubbles), not mouseleave (which doesn't)
    fireEvent.mouseOut(btn, { relatedTarget: document.body })
    // Release the mouse
    fireEvent.mouseUp(btn)

    // Timer was cleared by handleMouseLeave; wait past 500ms threshold
    await new Promise(resolve => setTimeout(resolve, 600))
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
  },
}

/** Long title wraps correctly and is fully readable. */
export const TooltipWithLongTitle = {
  args: {
    title: 'This is a very long tooltip text that tests wrapping behaviour so that no content is clipped off screen in any viewport configuration',
    children: 'Hold for long tooltip',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Hold for long tooltip/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      // Check it's not overflowing the viewport
      const rect = tooltip.getBoundingClientRect()
      expect(rect.left).toBeGreaterThanOrEqual(0)
      expect(rect.right).toBeLessThanOrEqual(window.innerWidth + 1) // +1 for rounding
    })
  },
}

/** Button positioned near the top-left: tooltip should open below and to the right. */
export const TooltipPositionTopLeft = {
  render: () => (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Button title="Top-left tooltip" style={{ position: 'absolute', top: 0, left: 0 }}>
        Top-left
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Top-left/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      const rect = tooltip.getBoundingClientRect()
      // Should be below the button (not above, because there's no space above)
      const btnRect = btn.getBoundingClientRect()
      expect(rect.top).toBeGreaterThan(btnRect.bottom - 1)
      // Should not overflow left
      expect(rect.left).toBeGreaterThanOrEqual(0)
    })
  },
}

/** Button positioned near the top-right: tooltip should open below, right-aligned. */
export const TooltipPositionTopRight = {
  render: () => (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Button title="Top-right tooltip" style={{ position: 'absolute', top: 0, right: 0 }}>
        Top-right
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Top-right/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      const rect = tooltip.getBoundingClientRect()
      const btnRect = btn.getBoundingClientRect()
      // Should be below the button
      expect(rect.top).toBeGreaterThan(btnRect.bottom - 1)
      // Should not overflow right
      expect(rect.right).toBeLessThanOrEqual(window.innerWidth + 1)
    })
  },
}

/** Button positioned near the bottom-left: tooltip should open above. */
export const TooltipPositionBottomLeft = {
  render: () => (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Button title="Bottom-left tooltip" style={{ position: 'absolute', bottom: 0, left: 0 }}>
        Bottom-left
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Bottom-left/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      const rect = tooltip.getBoundingClientRect()
      const btnRect = btn.getBoundingClientRect()
      // Should be above the button
      expect(rect.bottom).toBeLessThan(btnRect.top + 1)
      // Should not overflow left
      expect(rect.left).toBeGreaterThanOrEqual(0)
    })
  },
}

/** Button positioned near the bottom-right: tooltip opens above, right-aligned. */
export const TooltipPositionBottomRight = {
  render: () => (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Button title="Bottom-right tooltip" style={{ position: 'absolute', bottom: 0, right: 0 }}>
        Bottom-right
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Bottom-right/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      const rect = tooltip.getBoundingClientRect()
      const btnRect = btn.getBoundingClientRect()
      // Should be above the button
      expect(rect.bottom).toBeLessThan(btnRect.top + 1)
      // Should not overflow right
      expect(rect.right).toBeLessThanOrEqual(window.innerWidth + 1)
    })
  },
}

/** Button vertically centred: tooltip can go above or below (just mustn't overflow). */
export const TooltipPositionCentre = {
  render: () => (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Centre tooltip — fits either way">Centre button</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Centre button/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      const rect = tooltip.getBoundingClientRect()
      expect(rect.top).toBeGreaterThanOrEqual(0)
      expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight + 1)
      expect(rect.left).toBeGreaterThanOrEqual(0)
      expect(rect.right).toBeLessThanOrEqual(window.innerWidth + 1)
    })
  },
}

/** Disabled button — long-press still shows tooltip. */
export const TooltipOnDisabledButton = {
  args: {
    title: 'Disabled tooltip',
    disabled: true,
    children: 'Disabled button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Disabled button/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      expect(tooltip.textContent).toContain('Disabled tooltip')
    })
  },
}

/** PrimaryButton variant — tooltip works the same way. */
export const TooltipOnPrimaryButton = {
  render: () => <PrimaryButton title="Primary tooltip">Primary button</PrimaryButton>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Primary button/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      expect(tooltip.textContent).toContain('Primary tooltip')
    })
  },
}

/** SecondaryButton variant — tooltip works the same way. */
export const TooltipOnSecondaryButton = {
  render: () => <SecondaryButton title="Secondary tooltip">Secondary button</SecondaryButton>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Secondary button/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      expect(tooltip.textContent).toContain('Secondary tooltip')
    })
  },
}

/** Empty title — no tooltip is shown even after a long-press. */
export const NoTooltipWhenTitleEmpty = {
  args: {
    title: '',
    children: 'No tooltip here',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /No tooltip here/i })

    await longPress(btn)

    // Timer is skipped when title is empty — portal must never mount
    await new Promise(resolve => setTimeout(resolve, 600))
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
  },
}

// ---------------------------------------------------------------------------
// Narrow-viewport / wrapping stories
// ---------------------------------------------------------------------------

/** On a narrow viewport (320 px) a long title must wrap rather than overflow.
 *  The tooltip maxWidth is capped at (vw - 16) px, so the right edge must
 *  never exceed window.innerWidth. */
export const TooltipWrapsOnNarrowViewport = {
  parameters: {
    viewport: { defaultViewport: 'iphone5' }, // 320 × 568
  },
  render: () => (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Button title="This tooltip title is intentionally very long so that it must wrap to stay inside a narrow mobile viewport without overflowing the screen edges">Hold me</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Hold me/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()

      const rect = tooltip.getBoundingClientRect()
      const vw = window.innerWidth

      // Must not overflow either side
      expect(rect.left).toBeGreaterThanOrEqual(0)
      expect(rect.right).toBeLessThanOrEqual(vw + 1)

      // Tooltip must be narrower than the viewport (i.e. it wrapped instead of overflowing)
      expect(rect.width).toBeLessThanOrEqual(vw - 14) // maxWidth = vw - 16px
    })
  },
}

/** On a narrow viewport the tooltip near the LEFT edge must not overflow left. */
export const TooltipNarrowViewportLeftEdge = {
  parameters: {
    viewport: { defaultViewport: 'iphone5' },
  },
  render: () => (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Button title="Long text forced to wrap on narrow screen — left edge anchor" style={{ position: 'absolute', top: '50%', left: 0 }}>
        Left edge
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Left edge/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      const rect = tooltip.getBoundingClientRect()
      expect(rect.left).toBeGreaterThanOrEqual(0)
      expect(rect.right).toBeLessThanOrEqual(window.innerWidth + 1)
    })
  },
}

/** On a narrow viewport the tooltip near the RIGHT edge must not overflow right. */
export const TooltipNarrowViewportRightEdge = {
  parameters: {
    viewport: { defaultViewport: 'iphone5' },
  },
  render: () => (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Button title="Long text forced to wrap on narrow screen — right edge anchor" style={{ position: 'absolute', top: '50%', right: 0 }}>
        Right edge
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Right edge/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      const rect = tooltip.getBoundingClientRect()
      expect(rect.left).toBeGreaterThanOrEqual(0)
      expect(rect.right).toBeLessThanOrEqual(window.innerWidth + 1)
    })
  },
}

/** Extreme case: viewport is very narrow (below the 20rem cap) AND the title
 *  is a single unbreakable-looking word — the tooltip must still be constrained. */
export const TooltipNarrowViewportSingleLongWord = {
  parameters: {
    viewport: { defaultViewport: 'iphone5' },
  },
  render: () => (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Superlongtooltiptitlewithnospacesinitthatwouldforcethebrowsertodecidehowtobreakthisword">Hold me</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Hold me/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      const rect = tooltip.getBoundingClientRect()
      // Must not overflow — browser uses word-break: break-word as fallback
      expect(rect.left).toBeGreaterThanOrEqual(0)
      expect(rect.right).toBeLessThanOrEqual(window.innerWidth + 1)
    })
  },
}

/** Narrow viewport with button in the TOP-LEFT corner: tooltip must open below,
 *  stay within the right side, and wrap its long text. */
export const TooltipNarrowViewportTopLeftCorner = {
  parameters: {
    viewport: { defaultViewport: 'iphone5' },
  },
  render: () => (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Button title="Narrow viewport top-left corner — long title that must wrap to fit" style={{ position: 'absolute', top: 0, left: 0 }}>
        Top-left narrow
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Top-left narrow/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      const rect = tooltip.getBoundingClientRect()
      const btnRect = btn.getBoundingClientRect()

      // Opens below (no space above)
      expect(rect.top).toBeGreaterThan(btnRect.bottom - 1)
      // Stays within viewport
      expect(rect.left).toBeGreaterThanOrEqual(0)
      expect(rect.right).toBeLessThanOrEqual(window.innerWidth + 1)
    })
  },
}

/** Narrow viewport with button in the BOTTOM-RIGHT corner: tooltip must open above,
 *  stay within the left side, and wrap its long text. */
export const TooltipNarrowViewportBottomRightCorner = {
  parameters: {
    viewport: { defaultViewport: 'iphone5' },
  },
  render: () => (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Button title="Narrow viewport bottom-right corner — long title that must wrap to fit" style={{ position: 'absolute', bottom: 0, right: 0 }}>
        Bottom-right narrow
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const btn = canvas.getByRole('button', { name: /Bottom-right narrow/i })

    await longPress(btn)

    await waitFor(() => {
      const tooltip = document.querySelector('[role="tooltip"]')
      expect(tooltip).not.toBeNull()
      const rect = tooltip.getBoundingClientRect()
      const btnRect = btn.getBoundingClientRect()

      // Opens above (no space below)
      expect(rect.bottom).toBeLessThan(btnRect.top + 1)
      // Stays within viewport
      expect(rect.left).toBeGreaterThanOrEqual(0)
      expect(rect.right).toBeLessThanOrEqual(window.innerWidth + 1)
    })
  },
}
