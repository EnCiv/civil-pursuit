//https://github.com/EnCiv/civil-pursuit/issues/103

'use strict'

import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import WhyInput from './why-input'
import { isEqual } from 'lodash'

// create an object where the why-input results {valid, value) are indexed by their parentId
// return [theObject, changed] where changed indicates if there were any changes if the previous object is supplied
function byParentId(points, whys, whyByParenId) {
  return points.reduce(
    ([o, changed], point) => {
      const whyPoint = whys.find(p => p.parentId === point._id) || { subject: '', description: '', parentId: point._id }
      if (whyByParenId && isEqual(whyPoint, whyByParenId[point._id].value)) {
        o[point._id] = whyByParenId[point._id]
      } else {
        changed = true
        o[point._id] = { valid: false, value: whyPoint }
      }
      return [o, changed]
    },
    [{}, false]
  )
}

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

  // track all the results in a single state, that is indexed by the point._id (which is the parentId of the why-input point)
  // needs to be a single object because we may have multiple things changed at once and react doesn't rerender and recacluclate this everytime the set function is called
  const [whyByParentId, setWhyByParentId] = useState(
    byParentId(type === 'most' ? shared.mosts : shared.leasts, type == 'most' ? shared.whyMosts : shared.whyLeasts)[0]
  )

  // if something is changed from the top down, need to update the state
  useEffect(() => {
    const [newWhyByParentId, changed] = byParentId(
      type === 'most' ? shared.mosts : shared.leasts,
      type == 'most' ? shared.whyMosts : shared.whyLeasts,
      whyByParentId
    )
    if (changed) {
      setWhyByParentId(newWhyByParentId)
    }
  }, [type, type === 'most' ? shared.mosts : shared.leasts, type == 'most' ? shared.whyMosts : shared.whyLeasts])

  // if there is a change to the state, call onDone to update the parent component
  useEffect(() => {
    if (!points.length) {
      onDone({ valid: true, value: [] })
      return
    }
    const value = Object.values(whyByParentId).map(aP => aP.value)
    const valid = Object.values(whyByParentId)
      .map(aP => aP.valid)
      .every(valid => valid === true)
    onDone({ valid, value })
  }, [whyByParentId])

  const updateWhyResponse = ({ valid, value }) => {
    // don't set it if it hasn't changed, that causes an loop
    if (!isEqual(whyByParentId[value.parentId], { valid, value }))
      // a function as prop because there are multiple WhyPoints that will call this before rerendering, like on initial render with data, or on a top down data update
      setWhyByParentId(whyByParentId => ({ ...whyByParentId, [value.parentId]: { valid, value } }))
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
              <WhyInput point={point} value={whyByParentId[point._id].value} onDone={updateWhyResponse} />
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
