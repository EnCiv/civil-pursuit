//https://github.com/EnCiv/civil-pursuit/issues/103

'use strict'

import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import WhyInput from './why-input'
import { isEqual } from 'lodash'
import { cloneDeep } from 'lodash'

// create an object where the why-input results {valid, value) are indexed by their parentId
// return [theObject, changed] where changed indicates if there were any changes if the previous object is supplied
function byParentId(points, whys, whyByParenId, validByParentId) {
  return points.reduce(
    ([o, changed], point) => {
      const whyPoint = whys.find(p => p.parentId === point._id) || { subject: '', description: '', parentId: point._id }
      if (whyByParenId && isEqual(whyPoint, whyByParenId[point._id])) {
        o[point._id] = whyByParenId[point._id]
      } else {
        changed = true
        o[point._id] = whyPoint
        if (validByParentId) validByParentId[point._id] = false
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
  // create an object where the valid state of the why point is indexed it's parentId. Initially not valid, valid will come up from below
  const points = type === 'most' ? shared.mosts : shared.leasts
  const whys = type === 'most' ? shared.whyMosts : shared.whyLeasts
  const [validByParentId] = useState(points.reduce((o, point) => ((o[point._id] = false), o), {}))

  // track all the results in a single state, that is indexed by the point._id (which is the parentId of the why-input point)
  // needs to be a single object because we may have multiple things changed at once and react doesn't rerender and recacluclate this everytime the set function is called
  const [whyByParentId, setWhyByParentId] = useState(
    byParentId(points, whys)[0] // returns [whyByParentId, changed] but we only want to initialize the why
  )

  // if something is changed from the top down, need to update the state
  useEffect(() => {
    setWhyByParentId(whyByParentId => {
      const [newWhyByParentId, changed] = byParentId(points, whys, whyByParentId, validByParentId)
      return changed ? newWhyByParentId : whyByParentId
    })
  }, [type, points, whys])

  useEffect(() => {
    if (!points.length) {
      onDone({ valid: true, value: [] })
      return
    }
  }, [])

  const updateWhyResponse = ({ valid, value }) => {
    validByParentId[value.parentId] = valid
    if (!isEqual(whyByParentId[value.parentId], value)) {
      const why = cloneDeep(value)
      whyByParentId[value.parentId] = why
      const whyIndex = whys.findIndex(point => point.parentId === value.parentId)
      if (whyIndex < 0) whys.push(why)
      else whys[whyIndex] = why
    }
    onDone({
      valid: Object.values(validByParentId).every(valid => valid === true),
      value: Object.values(whyByParentId),
    })
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
              <WhyInput point={point} value={whyByParentId[point._id]} onDone={updateWhyResponse} />
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
