// https://github.com/EnCiv/civil-pursuit/issues/58

import React from 'react'
import ReviewPoint from '../app/components/review-point'
import { onDoneDecorator } from './common'
import { within, userEvent, expect, waitFor } from 'storybook/test'

export default {
  component: ReviewPoint,
  decorators: [onDoneDecorator],
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
}

const point0 = {
  _id: '0',
  subject: 'Expand access to stable housing',
  description: 'Affordable, secure homes help families stay near work, school, and community services.',
}

const point1 = {
  _id: '1',
  subject: 'Protect tenants from unfair evictions',
  description: 'Clear guidance and early legal support can help renters resolve disputes and keep stable housing.',
}

const point2 = {
  _id: '2',
  subject: 'Make job training easier to reach',
  description: 'Practical classes near transit can help adults build skills for better-paying local jobs.',
}

const point3 = {
  _id: '3',
  subject: 'Improve access to healthy groceries',
  description: 'Affordable fresh food should be available without a long trip across town.',
}

const point4 = {
  _id: '4',
  subject: 'Keep neighborhood parks clean',
  description: 'Regular maintenance gives residents a safer place to exercise, relax, and gather.',
}

const point5 = {
  _id: '5',
  subject: 'Run buses more often after work',
  description: 'Reliable evening service helps shift workers get home without needing a car.',
}

const point6 = {
  _id: '6',
  subject: 'Add shade trees along busy streets',
  description: 'Mature trees cool sidewalks and make walking routes more comfortable in summer.',
}

export const Empty = {
  args: {},
}

export const Desktop = {
  args: {
    point: point0,
    leftPointList: [point1, point2, point3],
    rightPointList: [point4, point5, point6],
  },
}

export const Mobile = {
  args: {
    point: point0,
    leftPointList: [point1, point2, point3],
    rightPointList: [point4, point5, point6],
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const WithDefaultRank = {
  args: {
    point: point0,
    leftPointList: [point1, point2, point3],
    rightPointList: [point4, point5, point6],
    rank: 'Neutral',
  },
}

export const ReviewOnDone = {
  args: {
    point: point0,
    leftPointList: [point1, point2, point3],
    rightPointList: [point4, point5, point6],
  },
  decorators: [onDoneDecorator],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const expectTableTypography = () => {
      const mainFontSize = parseFloat(getComputedStyle(canvas.getByText(point0.subject)).fontSize)
      const tableTexts = [
        canvas.getByText("Why It's Most Important"),
        canvas.getByText("Why It's Least Important"),
        canvas.getByText(point1.subject),
        canvas.getByText(point1.description),
      ]
      tableTexts.forEach(element => expect(parseFloat(getComputedStyle(element).fontSize)).toBeLessThanOrEqual(mainFontSize * 0.8))
      expect(getComputedStyle(tableTexts[0]).fontFamily).toContain('sans-serif')
      expect(getComputedStyle(tableTexts[0]).textAlign).toBe('center')
      expect(getComputedStyle(tableTexts[1]).textAlign).toBe('center')
    }
    await userEvent.click(canvas.getByText(point0.subject))
    await waitFor(() => expect(canvas.getByTitle('close')).toHaveAttribute('aria-expanded', 'true'))
    expectTableTypography()
    expect(canvas.queryByRole('button', { name: /(?:Collapse|Expand) Table/ })).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('radio', { name: 'Most' }))
    expect(args.onDone.mock.calls.at(-1)?.[0]).toMatchObject({
      valid: true,
      value: 'Most',
    })
    expect(canvas.getByTitle('close')).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(canvas.getByText(point1.subject))
    await waitFor(() => expect(canvas.getByTitle('open')).toHaveAttribute('aria-expanded', 'false'))
    canvas.getByTitle('open').focus()
    await userEvent.keyboard('{Enter}')
    await waitFor(() => expect(canvas.getByTitle('close')).toHaveAttribute('aria-expanded', 'true'))
  },
}
