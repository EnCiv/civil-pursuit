// https://github.com/EnCiv/civil-pursuit/issues/298

import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { useEffect } from 'react'
import { H } from 'react-accessible-headings'
import { useDeliberationContext, useLocalStorageIfAvailable } from '../deliberation-context'

import StepIntro from '../step-intro'
import ShowDualPointList from '../../components/show-dual-point-list'
import RankingResults from '../../components/ranking-results'
import HowDoYouFeel from '../../components/how-do-you-feel'

export default function Conclusion(props) {
  const { className, discussionId, stepIntro, onDone = () => {}, ...otherProps } = props
  const classes = useStylesFromThemeFunction(props)
  const { data, upsert } = useDeliberationContext()
  const storageAvailable = useLocalStorageIfAvailable()

  useEffect(() => {
    if (!data?.topPointAndWhys) {
      window.socket.emit('get-conclusion', discussionId, topPointAndWhys => {
        if (topPointAndWhys) upsert({ topPointAndWhys })
      })
    }
  }, [])

  const handleOnDone = ({ valid, value }) => {
    if (!storageAvailable) {
      window.socket.emit('upsert-jsform', discussionId, 'conclusion', { howDoYouFeel: value })
    }
    onDone({ valid })
  }

  return (
    <div className={cx(classes.conclusion, className)} {...otherProps}>
      <div className={cx(classes.mostAndLeastsWrapper)}>
        <StepIntro {...stepIntro} />
        {data?.topPointAndWhys &&
          data.topPointAndWhys.map(d => (
            <>
              <div>
                <div className={cx(classes.subject)}>
                  <H>{d.point?.subject}</H>
                </div>
                <div className={cx(classes.description)}>
                  <text>{d.point?.description}</text>
                </div>
              </div>
              <div className={cx(classes.dualPointList)}>
                <ShowDualPointList leftPoints={d.mosts} leftHeader={"Why It's Most Important"} rightPoints={d.leasts} rightHeader={"Why It's Least Important"} vState={'expanded'} />
              </div>
              <div className={cx(classes.rankingResultsWrapper)}>
                <div className={cx(classes.votingResultsText)}>
                  <text>Voting Results</text>
                </div>
                <div className={cx(classes.rankingResults)}>
                  <RankingResults
                    resultList={Object.entries(d.counts).reduce((rl, [key, value]) => {
                      const newKey = key.charAt(0).toUpperCase() + key.slice(1)
                      return { ...rl, [newKey]: value }
                    }, {})}
                  />
                </div>
              </div>
            </>
          ))}
        {data?.topPointAndWhys && (
          <div className={cx(classes.howDoYouFeelWrapper)}>
            <HowDoYouFeel title={'How do you feel about the results?'} onDone={handleOnDone} />
          </div>
        )}
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
    padding: '2rem',
  },
  rankingResults: {
    backgroundColor: '#D9D9D999',
    padding: '5rem',
  },
  votingResultsText: {
    fontWeight: 300,
    fontSize: '2.25rem',
    lineHeight: '2.938rem',
    padding: '2rem 0rem 3rem 2rem',
    color: theme.colors.primaryButtonBlue,
  },
  howDoYouFeelWrapper: {
    padding: '5rem 2rem 5rem 2rem',
  },
  mostAndLeastsWrapper: { padding: '0 4rem 0 4rem' },
}))
