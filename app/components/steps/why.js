//https://github.com/EnCiv/civil-pursuit/issues/103
//https://github.com/EnCiv/civil-pursuit/issues/214

import React, { useEffect, useContext, useRef, useState } from 'react'
import DeliberationContext from '../deliberation-context'
import WhyInput from '../why-input'
import { H, Level } from 'react-accessible-headings'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { isEqual } from 'lodash'
import StepIntro from '../step-intro'

export default function WhyStep(props) {
  const { data, upsert } = useContext(DeliberationContext)
  const { category, onDone, ...otherProps } = props

  useEffect(() => {
    if (!data?.myWhyByCategoryByParentId && data?.reducedPointList?.length > 0) {
      const ids = data.reducedPointList.map(pG => pG.point._id)
      window.socket.emit('get-user-whys', ids, results => {
        // Group whys by category, then by parentId
        const myWhyByCategoryByParentId = {}
        for (const point of results) {
          if (!myWhyByCategoryByParentId[point.category]) myWhyByCategoryByParentId[point.category] = {}
          myWhyByCategoryByParentId[point.category][point.parentId] = point
        }
        upsert({ myWhyByCategoryByParentId })
      })
    }
  }, [])

  function handleOnDone({ valid, value, delta }) {
    if (delta) {
      // Upsert only the changed value for the correct category
      const category = delta.category || props.category
      const newData = upsert({
        myWhyByCategoryByParentId: {
          [category]: {
            [delta.parentId]: delta,
          },
        },
      })
      if (newData === data) return // if no change, don't send up
      window.socket.emit('upsert-why', delta, updatedDoc => {
        if (updatedDoc) {
          if (!isEqual(updatedDoc, delta)) {
            upsert({
              myWhyByCategoryByParentId: {
                [category]: {
                  [delta.parentId]: updatedDoc,
                },
              },
            })
          }
        } else {
          console.error('Failed to upsert why')
        }
      })
    }
    onDone({ valid, value })
  }

  const args = derivePointWhyListByCategory(data, category)

  if (!data || !data.reducedPointList) return null

  return <Why {...args} {...otherProps} category={category} onDone={handleOnDone} />
}

export function Why(props) {
  const {
    className = '',
    pointWhyList,
    category = '', // "most" or "least"
    onDone = () => {},
    stepIntro,
    maxWordCount,
    maxCharCount,
  } = props

  const classes = useStylesFromThemeFunction()

  // for every point, we need to keep track of whether the user has completed the why input, and the ref of the input so we can mark it as incomplete if it changes from above.
  // we only know it's completed it valid is passed up by onDone
  const [completedByPointId] = useState(() => {
    return (pointWhyList || []).reduce((completedByPointId, { point, why }) => {
      completedByPointId[point._id] = { completed: false, why }
      return completedByPointId
    }, {})
  })

  // not useEffect because we need to do this when the pointWhyList changes and before the children are rendered and possibly make onDone calls
  const [prev] = useState({ pointWhyList })
  if (prev.pointWhyList !== pointWhyList) {
    prev.pointWhyList = pointWhyList
    const oldIds = new Set(Object.keys(completedByPointId).map(id => id + '')) // convert to string because some tests (incorrectly) pass a number but when used as a key to an object it's a string. But set doesn't convert numbers to strings
    for (const { point, why } of pointWhyList || []) {
      if (!completedByPointId[point._id] || completedByPointId[point._id].why !== why) {
        const completed = completedByPointId[point._id]?.completed && isEqual(completedByPointId[point._id].why, why) // happens when subject or description is changed by user - context returns and updated object
        completedByPointId[point._id] = { completed, why }
      }
      oldIds.delete(point._id)
    }
    // if the point is no longer in pointWyList, delete it
    for (const oldId of oldIds) delete completedByPointId[oldId]
  }

  const handleOnDone = ({ valid, value }) => {
    let delta = value
    if (value) {
      if (!value.category) value.category = category
      // if the object coming up is the same as the one we have, and it's valid and completed, don't send up to be upserted
      if (completedByPointId[value.parentId].why === value) {
        if (completedByPointId[value.parentId].completed && valid) return // do not send up redundant data
        else delta = undefined
      }
      completedByPointId[value.parentId] = { completed: valid, why: value }
    }
    const values = Object.values(completedByPointId)
    const numValid = values.reduce((numValid, { completed }) => (completed ? numValid + 1 : numValid), 0)
    const total = values.length
    setTimeout(() => {
      onDone({
        valid: numValid === total,
        value: numValid / total,
        delta,
      })
    }, 0)
  }

  if (!pointWhyList?.length) {
    setTimeout(() => onDone({ valid: true, value: 1 }), 0) // if there are no points, mark as done
    return <div className={cx(classes.wrapper, className)}>Nothing to do here. Hit Next to continue.</div>
  }

  return (
    <div className={cx(classes.wrapper, className)}>
      <StepIntro {...stepIntro} />
      <Level>
        <div className={classes.pointsContainer}>
          {pointWhyList.map(({ point, why }, i) => (
            <div key={point._id}>
              {i > 0 && <hr className={classes.pointsHr}></hr>}
              <WhyInput point={point} value={why} onDone={handleOnDone} maxWordCount={maxWordCount} maxCharCount={maxCharCount} />
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

  const { reducedPointList = [], myWhyByCategoryByParentId = {}, preRankByParentId = {} } = data || {}
  const myWhyByParentId = myWhyByCategoryByParentId[category] || {}

  let updated = false

  if (local.reducedPointList !== reducedPointList || local.preRankByParentId !== preRankByParentId) {
    const pointsInCategory = reducedPointList.filter(item => {
      const pId = item.point?._id
      return pId && preRankByParentId[pId]?.category === category
    })

    const oldIds = new Set(Object.keys(local.pointWhyById).map(id => id + '')) // convert to string because some tests (incorrectly) pass a number but when used as a key to an object it's a string. But set doesn't convert numbers to strings

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
    local.preRankByParentId = preRankByParentId
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
