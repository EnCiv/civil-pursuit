import RankingResults from '../app/components/ranking-results'
import React from 'react'

export default {
  component: RankingResults,
  args: {},
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

const Template = args => (
  <div style={{ width: '300px' }}>
    <RankingResults {...args} />
  </div>
)

// Test whether the component is taking the width of the parent
export const TestParentWidth = Template.bind({})
TestParentWidth.args = {
  resultList: {
    Most: 50,
    Neutral: 20,
    Least: 120,
  },
}
