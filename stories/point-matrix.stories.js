// https://github.com/EnCiv/civil-pursuit/issues/[ISSUE_NUMBER]

import React from 'react'
import PointMatrix from '../app/components/point-matrix'

const sampleData = [
  {
    point: {
      subject: 'Inequality',
      description: 'Inequality can hinder economic growth and stability',
    },
    pre: 'neutral',
    post: 'most',
  },
  {
    point: {
      subject: 'Separation of wealth',
      description: 'Inequality can hinder economic growth and stability',
    },
    pre: 'neutral',
    post: 'most',
  },
  {
    point: {
      subject: 'Equality is a human right',
      description: 'Inequality can hinder economic growth and stability',
    },
    pre: 'most',
    post: 'least',
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
        pre: 'neutral',
        post: 'most',
      },
      {
        point: {
          subject: 'Fair taxation',
          description: 'Progressive taxation can reduce inequality',
        },
        pre: 'least',
        post: 'neutral',
      },
    ],
  },
}

export const allRatingCombinations = {
  args: {
    entries: [
      { point: { subject: 'Most to Most', description: '' }, pre: 'most', post: 'most' },
      { point: { subject: 'Most to Neutral', description: '' }, pre: 'most', post: 'neutral' },
      { point: { subject: 'Most to Least', description: '' }, pre: 'most', post: 'least' },
      { point: { subject: 'Neutral to Most', description: '' }, pre: 'neutral', post: 'most' },
      { point: { subject: 'Neutral to Neutral', description: '' }, pre: 'neutral', post: 'neutral' },
      { point: { subject: 'Neutral to Least', description: '' }, pre: 'neutral', post: 'least' },
      { point: { subject: 'Least to Most', description: '' }, pre: 'least', post: 'most' },
      { point: { subject: 'Least to Neutral', description: '' }, pre: 'least', post: 'neutral' },
      { point: { subject: 'Least to Least', description: '' }, pre: 'least', post: 'least' },
    ],
  },
}

export const empty = {
  args: {
    entries: [],
  },
}
