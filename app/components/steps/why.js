//https://github.com/EnCiv/civil-pursuit/issues/103
//https://github.com/EnCiv/civil-pursuit/issues/214

import React, { useEffect, useContext, useRef, useState } from 'react'
import DeliberationContext from '../deliberation-context'
import WhyInput from '../why-input'
import { H, Level } from 'react-accessible-headings'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { isEqual, cloneDeep } from 'lodash'

export default function WhyStep(props) {
  const { myWhyByParentId, ...otherProps } = props
  const { data, upsert } = useContext(DeliberationContext)
  const derivedProps = userDeriver(data)

  useEffect(() => {
    if (!data?.myWhyByParentId && data?.reducedPointList?.length > 0) {
      const ids = data.reducedPointList.map(point => point._id)
      window.socket.emit('getUserWhys', ids, results => {
        const myWhyByParentId = results.reduce((acc, point) => {
          acc[point.parentId] = point
          return acc
        }, {})
        upsert({ myWhyByParentId })
      })
    }
  }, [data, upsert])

  function handleOnDone({ valid, value, delta }) {
    if (!delta.category) {
      delta.category = data.category
    }

    const updatedMyWhyByParentId = {
      ...data.myWhyByParentId,
      [delta.parentId]: delta,
    }

    upsert({ myWhyByParentId: updatedMyWhyByParentId })

    window.socket.emit('upsertWhy', delta, updatedDoc => {
      if (updatedDoc) {
        const updatedContext = {
          ...data.myWhyByParentId,
          [delta.parentId]: updatedDoc,
        }
        upsert({ myWhyByParentId: updatedContext })
      } else {
        console.error('Failed to upsert why')
      }
    })

    props.onDone({ valid, value, delta })
  }

  if (!data || !data.reducedPointList || !data.myWhyByParentId) {
    return null
  }

  return (
    <div>
      <Why {...derivedProps} {...otherProps} onDone={handleOnDone} />
    </div>
  )
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

  if (!pointWhyList || pointWhyList.length === 0) {
    return null // Return null if there is no data
  }

  // Initialize allWhys
  const [allWhys, setAllWhys] = useState(() => {
    const initialWhys = {}
    pointWhyList.forEach(({ point, why }) => {
      initialWhys[point._id] = why || {
        subject: '',
        description: '',
        parentId: point._id,
        category,
      }
    })

    return initialWhys
  })

  // Sync changes in pointWhyList to allWhys
  useEffect(() => {
    const updatedWhys = {}
    pointWhyList.forEach(({ point, why }) => {
      updatedWhys[point._id] = {
        ...allWhys[point._id],
        ...(why || { subject: '', description: '', parentId: point._id, category }),
      }
    })
    if (!isEqual(allWhys, updatedWhys)) {
      setAllWhys(updatedWhys)
    }
  }, [pointWhyList])

  const handleOnDone = ({ valid, value, delta }) => {
    setAllWhys(prevWhys => {
      const updatedWhys = {
        ...prevWhys,
        [delta.parentId]: { ...prevWhys[delta.parentId], ...delta },
      }
      const allValid = Object.values(updatedWhys).every(why => why.subject.trim() && why.description.trim())
      onDone({ valid: allValid, value: allValid ? Object.values(updatedWhys) : value, delta })
      return updatedWhys
    })
  }

  return (
    <div className={cx(classes.wrapper, className)} {...otherProps}>
      <div className={classes.introContainer}>
        <H className={classes.introTitle}>{`Why it's ${category && category[0].toUpperCase() + category.slice(1)} Important`}</H>
        <div className={classes.introText}>{intro}</div>
      </div>
      <Level>
        <div className={classes.pointsContainer}>
          {pointWhyList.map(({ point }) => {
            return (
              <div key={point._id}>
                <hr className={classes.pointsHr}></hr>
                <WhyInput
                  point={point}
                  value={allWhys[point._id] || {}}
                  onDone={({ valid, value }) => {
                    const delta = {
                      subject: value.subject || '',
                      description: value.description || '',
                      parentId: point._id,
                      category,
                    }
                    handleOnDone({ valid, value: delta, delta })
                  }}
                />
              </div>
            )
          })}
        </div>
      </Level>
    </div>
  )
}

export function userDeriver(data) {
  const local = useRef({}).current
  const reducedPointList = data?.reducedPointList || []
  const myWhyByParentId = data?.myWhyByParentId || {}
  const category = data?.category
  const intro = data?.intro

  const dataChanged = !isEqual(data, local.prevData)

  if (!local.prevResult) {
    // First calculation
    const pointWhyList = reducedPointList.map(point => ({
      point,
      why: myWhyByParentId[point._id],
    }))
    local.prevData = cloneDeep(data)
    local.prevResult = { pointWhyList, category, intro }
  } else if (dataChanged) {
    // Partial update logic:
    // 1. Create a new object based on the old prevResult
    // 2. For each point, update reference only if the why data for that point has changed; otherwise, retain the old reference
    const oldPointWhyList = local.prevResult.pointWhyList
    const newPointWhyList = []
    let changed = false

    for (let i = 0; i < reducedPointList.length; i++) {
      const point = reducedPointList[i]
      const oldItem = oldPointWhyList.find(item => item.point._id === point._id)
      const newWhy = myWhyByParentId[point._id]

      if (!oldItem) {
        // New point data
        changed = true
        newPointWhyList.push({ point, why: newWhy })
      } else {
        const oldWhy = oldItem.why
        const whyChanged = !isEqual(oldWhy, newWhy)
        const pointChanged = !isEqual(oldItem.point, point)
        if (whyChanged || pointChanged) {
          changed = true
          newPointWhyList.push({ point, why: newWhy })
        } else {
          // Keep unchanged items with the original reference
          newPointWhyList.push(oldItem)
        }
      }
    }

    // If the list length changes or the number of points changes, also consider it as changed
    if (newPointWhyList.length !== oldPointWhyList.length) {
      changed = true
    }

    if (changed) {
      local.prevData = cloneDeep(data)
      local.prevResult = { pointWhyList: newPointWhyList, category, intro }
    }
    // Do not update prevResult if there are no substantial changes
  }

  return local.prevResult
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
