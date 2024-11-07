// https://github.com/EnCiv/civil-pursuit/issues/77
// https://github.com/EnCiv/civil-pursuit/issues/200

'use strict'
import React, { useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import PairCompare from '../pair-compare'
import { H, Level } from 'react-accessible-headings'

// pointWithWhyRankListList = [{point: {}, whyRankList: [why:{}, rank:{}]]
function CompareReasons(props) {
  const { pointWithWhyRankListList = [], side = '', onDone = () => {}, className, ...otherProps } = props
  const classes = useStyles()
  const [completedPoints, setCompletedPoints] = useState(new Set())
  const [percentDone, setPercentDone] = useState(0)

  useEffect(() => {
    if (completedPoints.size === pointWithWhyRankListList.length) {
      onDone({ valid: true, value: percentDone })
    } else {
      onDone({ valid: false, value: percentDone })
    }
  }, [completedPoints, percentDone])

  useEffect(() => {
    if (pointWithWhyRankListList.length === 0) setPercentDone(100)
    else {
      setPercentDone(Number(((completedPoints.size / pointWithWhyRankListList.length) * 100).toFixed(2)))
    }
  }, [completedPoints, pointWithWhyRankListList])

  const handlePairCompare = ({ valid, value }, idx) => {
    setCompletedPoints(prevPoints => {
      const updatedPoints = new Set(prevPoints)
      if (valid) {
        updatedPoints.add(idx)
      } else {
        updatedPoints.delete(idx)
      }
      return updatedPoints
    })
  }

  return (
    <div className={classes.container} {...otherProps}>
      {pointWithWhyRankListList.map(({ point, whyRankList }, idx) => (
        <div key={idx} className={classes.headlinePoint}>
          <H className={classes.headlineTitle}>Please choose the most convincing explanation for...</H>
          <H className={classes.headlineSubject}>{point.subject}</H>
          <Level>
            <PairCompare className={classes.pairCompare} whyRankList={whyRankList} onDone={value => handlePairCompare(value, idx)} />
          </Level>
        </div>
      ))}
    </div>
  )
}

const useStyles = createUseStyles(theme => ({
  container: {
    fontFamily: theme.font.fontFamily,
  },
  headlinePoint: {
    borderTop: '0.0625rem solid #000000',
    marginBottom: '4rem',
    paddingTop: '2rem',
    '&:first-child': {
      borderTop: 'none',
    },
  },
  headlineTitle: {
    fontWeight: '600',
    fontSize: '1.5rem',
    lineHeight: '2rem',
  },
  headlineSubject: {
    fontWeight: '300',
    fontSize: '2.25rem',
    lineHeight: '2.9375rem',
  },
  pairCompare: {
    marginTop: '1rem',
  },
}))

export default CompareReasons
