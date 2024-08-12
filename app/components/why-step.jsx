//https://github.com/EnCiv/civil-pursuit/issues/103

'use strict'

import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import WhyInput from './why-input'
import { cloneDeep } from 'lodash'

export default function WhyStep(props) {
  const {
    className = '',
    type = '', // "most" or "least"
    intro = '',
    shared = { mosts: [], leasts: [], whyMosts: [], whyLeasts: [] },
    onDone = () => {},
    ...otherProps
  } = props
  const classes = useStylesFromThemeFunction()

  const points = type === 'most' ? shared.mosts : shared.leasts

  // convert any existing whyMosts into an object where they are indexed by parentId
  const [whyByParentId, setWhyByParentId] = useState(
    (type === 'most' ? shared.mosts : shared.leasts).reduce((o, point) => {
      const whys = type == 'most' ? shared.whyMosts : shared.whyLeasts
      const whyPoint = whys.find(p => p.parentId === point._id) || { subject: '', description: '', parentId: point._id }
      o[point._id] = { valid: false, value: whyPoint }
      return o
    }, {})
  )

  console.info({ whyByParentId })

  useEffect(() => {
    if (!points.length) {
      onDone({ valid: true, value: [] })
      return
    }
    const value = Object.values(whyByParentId).map(aP => aP.value)
    console.info('complete?', areAnswersComplete())
    onDone({ valid: areAnswersComplete(), value })
  }, [whyByParentId])

  const updateWhyResponse = ({ valid, value }) => {
    console.info('update', { valid, value })
    const newW = { ...whyByParentId, [value.parentId]: { valid, value } }
    setWhyByParentId(newW)
  }

  const areAnswersComplete = () => {
    return points.every(point => whyByParentId[point._id].valid)
  }

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <div className={classes.introContainer}>
        <div className={classes.introTitle}>
          {`Why it's ${type && type[0].toUpperCase() + type.slice(1)} Important`}
        </div>
        <div className={classes.introText}>{intro}</div>
      </div>
      <div className={classes.pointsContainer}>
        {points.length ? (
          points.map(point => (
            <div key={point._id}>
              <hr className={classes.pointsHr}></hr>
              <WhyInput point={point} defaultValue={whyByParentId[point._id].value} onDone={updateWhyResponse} />
            </div>
          ))
        ) : (
          <div className={classes.noPointsContainer}>
            <hr className={classes.pointsHr}></hr>
            There are no issues to respond to.
          </div>
        )}
      </div>
    </div>
  )
}
const useStylesFromThemeFunction = createUseStyles(theme => ({
  wrapper: {
    background: theme.colorPrimary,
  },
  introContainer: {
    textAlign: 'left',
    padding: '0 1.875rem',
  },
  introTitle: {
    fontSize: '2.25rem',
    paddingBottom: '2rem',
  },
  introText: {
    display: 'block',
    fontSize: '1.25rem',
  },
  [`@media (min-width: ${theme.condensedWidthBreakPoint})`]: {
    introContainer: {
      padding: '0',
    },
    introText: {
      maxWidth: '33rem',
    },
  },
  pointsContainer: {
    fontSize: '1.25rem',
  },
  pointsHr: {
    color: '#D9D9D9',
    margin: '4rem 0',
  },
  [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
    pointsHr: {
      margin: '2rem 1.875rem',
    },
  },
}))
