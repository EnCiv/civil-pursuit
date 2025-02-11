//https://github.com/EnCiv/civil-pursuit/issues/103
//https://github.com/EnCiv/civil-pursuit/issues/214

import React, { useEffect, useContext, useRef, useState } from 'react'
import DeliberationContext from '../deliberation-context'
import WhyInput from '../why-input'
import { H, Level } from 'react-accessible-headings'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { isEqual } from 'lodash'

export default function WhyStep(props) {
  const { data, upsert } = useContext(DeliberationContext)
  const { category, onDone, ...otherProps } = props

  useEffect(() => {
    if (!data?.myWhyByParentId && data?.reducedPointList?.length > 0) {
      const ids = data.reducedPointList.map(point => point._id)
      window.socket.emit('get-user-whys', ids, results => {
        const myWhyByParentId = results.reduce((acc, point) => {
          acc[point.parentId] = point
          return acc
        }, {})
        upsert({ myWhyByParentId })
      })
    }
  }, [])

  function handleOnDone({ valid, value, delta }) {
    if (!delta.category) {
      delta.category = category
    }

    upsert({ myWhyByParentId: { [delta.parentId]: delta } })

    window.socket.emit('upsert-why', delta, updatedDoc => {
      if (updatedDoc) {
        if (!isEqual(updatedDoc, delta)) {
          upsert({ myWhyByParentId: { [delta.parentId]: updatedDoc } })
        }
      } else {
        console.error('Failed to upsert why')
      }
    })

    onDone({ valid, value })
  }

  const args = derivePointWhyListByCategory(data, category)

  if (!data || !data.reducedPointList || !data.myWhyByParentId) return null

  return <Why {...args} {...otherProps} category={category} onDone={handleOnDone} />
}

export function Why(props) {
  const {
    className = '',
    intro = '',
    pointWhyList = [],
    category = '', // "most" or "least"
    onDone = () => {},
    ...otherProps
  } = props

  const classes = useStylesFromThemeFunction()

  // for every point, we need to keep track of whether the user has completed the why input, and the ref of the input so we can mark it as incomplete if it changes from above.
  // we only know it's completed it valid is passed up by onDone
  const [completedByPointId] = useState(() => {
    return pointWhyList.reduce((completedByPointId, { point, why }) => {
      completedByPointId[point._id] = { completed: false, why }
      return completedByPointId
    }, {})
  })

  // not useEffect because we need to do this when the pointWhyList changes and before the chidlren are rendered and possibly make onDone calls
  const [prev] = useState({ pointWhyList })
  if (prev.pointWhyList !== pointWhyList) {
    prev.pointWhyList = pointWhyList
    const oldIds = new Set(Object.keys(completedByPointId))
    for (const { point, why } of pointWhyList) {
      if (!completedByPointId[point._id] || completedByPointId[point._id].why !== why) completedByPointId[point._id] = { completed: false, why }
      oldIds.delete(point._id)
    }
    // if the point is no longer in pointWyList, delete it
    for (const oldId of oldIds) delete completedByPointId[oldId]
  }

  const handleOnDone = ({ valid, value }) => {
    if (!value.category) {
      value.category = category
    }
    completedByPointId[delta.parentId].completed = { completed: valid, why: value }
    const values = Object.values(completedByPointId)
    const numValid = values.reduce((numValid, completed) => (completed.completed ? numValid + 1 : numValid), 0)
    const total = values.length
    setTimeout(() => {
      onDone({
        valid: numValid === total,
        value: numValid / total,
        delta: value,
      })
    }, 0)
  }

  if (!pointWhyList?.length) {
    return null
  }

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <div className={classes.introContainer}>
        <H className={classes.introTitle}>{`Why it's ${category && category[0].toUpperCase() + category.slice(1)} Important`}</H>
        <div className={classes.introText}>{intro}</div>
      </div>
      <Level>
        <div className={classes.pointsContainer}>
          {pointWhyList.map(({ point, why }) => (
            <div key={point._id}>
              <hr className={classes.pointsHr}></hr>
              <WhyInput point={point} value={why} onDone={handleOnDone} />
            </div>
          ))}
        </div>
      </Level>
    </div>
  )
}

export function derivePointWhyListByCategory(data, category) {
  const local = useRef({
    pointWhyById: {},
    reducedPointList: undefined,
    myWhyByParentId: undefined,
    pointWhyList: undefined,
  }).current

  const { reducedPointList = [], myWhyByParentId = {}, preRankByParentId = {} } = data || {}

  let updated = false

  if (local.reducedPointList !== reducedPointList) {
    const pointsInCategory = reducedPointList.filter(item => {
      const pId = item.point?._id
      return pId && preRankByParentId[pId]?.category === category
    })

    const oldIds = new Set(Object.keys(local.pointWhyById))

    for (const item of pointsInCategory) {
      const pId = item.point._id
      if (!local.pointWhyById[pId]) {
        local.pointWhyById[pId] = { point: item.point, why: myWhyByParentId[pId] }
        updated = true
      } else {
        if (local.pointWhyById[pId].point !== item.point) {
          local.pointWhyById[pId] = { ...local.pointWhyById[pId], point: item.point }
          updated = true
        }
      }
      oldIds.delete(pId)
    }

    for (const oldId of oldIds) {
      delete local.pointWhyById[oldId]
      updated = true
    }

    local.reducedPointList = reducedPointList
  }

  if (local.myWhyByParentId !== myWhyByParentId) {
    for (const pId of Object.keys(local.pointWhyById)) {
      const oldWhy = local.pointWhyById[pId].why
      const newWhy = myWhyByParentId[pId]

      if (oldWhy !== newWhy) {
        local.pointWhyById[pId] = { ...local.pointWhyById[pId], why: newWhy }
        updated = true
      }
    }

    local.myWhyByParentId = myWhyByParentId
  }

  if (updated) {
    local.pointWhyList = Object.values(local.pointWhyById)
  }

  return { pointWhyList: local.pointWhyList }
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
    fontSize: '1.25rem',
  },
  pointsContainer: {
    fontSize: '1.25rem',
  },
  pointsHr: {
    color: '#D9D9D9',
    margin: '4rem 0',
  },
}))
