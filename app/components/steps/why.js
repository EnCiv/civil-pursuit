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
  const derivedProps = derivePointWhyListByCategory(data)

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

export function derivePointWhyListByCategory(data) {
  const local = useRef({
    pointWhyById: {},
    pointWhyList: [],
    reducedPointList: null,
    myWhyByParentId: null,
    category: null,
    intro: null,
    prevResult: {
      pointWhyList: [],
      category: undefined,
      intro: undefined,
    },
  }).current

  const reducedPointList = data?.reducedPointList || []
  const myWhyByParentId = data?.myWhyByParentId || {}
  const category = data?.category
  const intro = data?.intro

  let updated = false

  if (local.reducedPointList !== reducedPointList) {
    const oldIds = new Set(Object.keys(local.pointWhyById))

    for (const p of reducedPointList) {
      if (!local.pointWhyById[p._id]) {
        local.pointWhyById[p._id] = { point: p, why: myWhyByParentId[p._id] }
        updated = true
      } else {
        if (local.pointWhyById[p._id].point !== p) {
          local.pointWhyById[p._id] = { ...local.pointWhyById[p._id], point: p }
          updated = true
        }
      }
      oldIds.delete(p._id)
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

  if (local.category !== category) {
    local.category = category
    updated = true
  }
  if (local.intro !== intro) {
    local.intro = intro
    updated = true
  }

  if (updated) {
    local.pointWhyList = Object.values(local.pointWhyById)
    local.prevResult = {
      pointWhyList: local.pointWhyList,
      category: local.category,
      intro: local.intro,
    }
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
