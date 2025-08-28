// https://github.com/EnCiv/civil-pursuit/issues/298

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { useState, useEffect } from 'react'
import { H } from 'react-accessible-headings'

import StepIntro from '../step-intro'
import ShowDualPointList from '../../components/show-dual-point-list'
import RankingResults from '../../components/ranking-results'
import HowDoYouFeel from '../../components/how-do-you-feel'

export default function Conclusion(props) {
  const { className, discussionId, stepIntro, onDone = () => {}, ...otherProps } = props
  const [data, setData] = useState({})
  const classes = useStylesFromThemeFunction(props)

  useEffect(() => {
    window.socket.emit('get-conclusion', discussionId, data => {
      console.log('Conclusion data loaded:', data)
      if (data) {
        const conclusion = data
        setData(conclusion)
      }
    })
  }, [])
  console.log(data.point)
  return (
    <div className={cx(classes.conclusion, className)} {...otherProps}>
      <StepIntro {...stepIntro} />
      <div>
        <div className={cx(classes.subject)}>
          <H>{data.point?.subject}</H>
        </div>
        <div className={cx(classes.description)}>
          <text>{data.point?.description}</text>
        </div>
      </div>
      <div className={cx(classes.dualPointList)}>
        <ShowDualPointList leftPoints={data.mosts} leftHeader={"Why It's Most Important"} rightPoints={data.leasts} rightHeader={"Why It's Least Important"} vState={undefined} />
      </div>
      <div className={cx(classes.rankingResultsWrapper)}>
        <div className={cx(classes.votingResultsText)}>
          <text>Voting Results</text>
        </div>
        <div className={cx(classes.rankingResults)}>
          <RankingResults
            resultList={{
              Most: data.mosts ? data.mosts.length : 0,
              Neutral: 20,
              Least: data.leasts ? data.leasts.length : 0,
            }}
          />
        </div>
      </div>
      <div className={cx(classes.howDoYouFeelWrapper)}>
        <HowDoYouFeel title={'How do you feel about the results?'} />
      </div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  conclusion: {
    background: theme.colorPrimary,
    padding: '1rem',
  },
  subject: {
    color: theme.colors.primaryButtonBlue,
    fontSize: '3rem',
    fontWeight: 700,
    fontStyle: 'bold',
    lineHeight: '2.9375rem',
  },
  description: {
    color: theme.colors.title,
    fontSize: '1.5rem',
    fontWeight: 400,
    lineHeight: '1.875rem',
  },
  dualPointList: {
    paddingTop: '2rem',
    paddingBottom: '10rem',
  },
  rankingResultsWrapper: {
    backgroundColor: '#EBEBEBB2',
    padding: '2rem 0 2rem 0',
    borderRadius: '0.938rem',
  },
  rankingResults: {
    backgroundColor: '#D9D9D999',
    padding: '5rem',
  },
  votingResultsText: {
    fontWeight: 300,
    fontSize: '2.25rem',
    lineHeight: '2.938rem',
    padding: '2rem 2rem 3rem 2rem',
    color: theme.colors.primaryButtonBlue,
  },
  howDoYouFeelWrapper: {
    padding: '3rem',
  },
}))
