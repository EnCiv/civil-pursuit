// https://github.com/EnCiv/civil-pursuit/issues/[ISSUE_NUMBER]

import React from 'react'
import PointMatrix from '../app/components/point-matrix'

const sampleData = [
  {
    point: {
      subject: 'Inequality',
      description: 'Inequality can hinder economic growth and stability',
    },
    before: 'neutral',
    after: 'most',
  },
  {
    point: {
      subject: 'Separation of wealth',
      description: 'Inequality can hinder economic growth and stability',
    },
    before: 'neutral',
    after: 'most',
  },
  {
    point: {
      subject: 'Equality is a human right',
      description: 'Inequality can hinder economic growth and stability',
    },
    before: 'most',
    after: 'least',
  },
]

export default {
  component: PointMatrix,
  args: {},
}

export const threeEntries = {
  args: {
    entries: sampleData,
  },
}

export const oneEntry = {
  args: {
    entries: [sampleData[0]],
  },
}

export const fiveEntries = {
  args: {
    entries: [
      ...sampleData,
      {
        point: {
          subject: 'Economic distribution',
          description: 'How wealth is distributed impacts society',
        },
        before: 'neutral',
        after: 'most',
      },
      {
        point: {
          subject: 'Fair taxation',
          description: 'Progressive taxation can reduce inequality',
        },
        before: 'least',
        after: 'neutral',
      },
    ],
  },
}

export const allRatingCombinations = {
  args: {
    entries: [
      { point: { subject: 'Most to Most', description: '' }, before: 'most', after: 'most' },
      { point: { subject: 'Most to Neutral', description: '' }, before: 'most', after: 'neutral' },
      { point: { subject: 'Most to Least', description: '' }, before: 'most', after: 'least' },
      { point: { subject: 'Neutral to Most', description: '' }, before: 'neutral', after: 'most' },
      { point: { subject: 'Neutral to Neutral', description: '' }, before: 'neutral', after: 'neutral' },
      { point: { subject: 'Neutral to Least', description: '' }, before: 'neutral', after: 'least' },
      { point: { subject: 'Least to Most', description: '' }, before: 'least', after: 'most' },
      { point: { subject: 'Least to Neutral', description: '' }, before: 'least', after: 'neutral' },
      { point: { subject: 'Least to Least', description: '' }, before: 'least', after: 'least' },
    ],
  },
}

export const empty = {
  args: {
    entries: [],
  },
}
