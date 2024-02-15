import RankingResult from '../app/components/ranking-result'

export default {
  component: RankingResult,
  args: {},
}

export const rankingResult = {
  args: {
    resultList: {
      Most: 50,
      Neutral: 20,
      Least: 120,
    },
  },
}

// empty resultList
export const emptyRankingResult = {
  args: {
    resultList: {},
  },
}
