import { result } from 'lodash'
import RankingResults from '../app/components/ranking-results'
import React from 'react'

export default {
  component: RankingResults,
}

export const TestRankingResults = {
  args: {
    resultList: {
      Most: 50,
      Neutral: 20,
      Least: 120,
    },
  },
}

// empty resultList
export const EmptyRankingResults = {
  args: {
    resultList: {},
  },
}

// Test whether the component is taking the width of the parent
export const TestParentWidth = {
  args: { resultList: TestRankingResults.args.resultList },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const ZeroRankingResults = {
  args: {
    resultList: {
      Most: 0,
      Neutral: 0,
      Least: 0,
    },
  },
}
