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
  const { data, upsert } = useContext(DeliberationContext)
  const { category, intro, ...otherProps } = props
  const derivedPointWhyList = derivePointWhyListByCategory(data, category)

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
      delta.category = category
    }

    upsert({ myWhyByParentId: { [delta.parentId]: delta } })

    window.socket.emit('upsertWhy', delta, updatedDoc => {
      if (updatedDoc) {
        if (!isEqual(updatedDoc, delta)) {
          upsert({ myWhyByParentId: { [delta.parentId]: updatedDoc } })
        }
      } else {
        console.error('Failed to upsert why')
      }
    })

    props.onDone({ valid, value, delta })
  }

  if (!data || !data.reducedPointList || !data.myWhyByParentId) {
    return null
  }

  if (!derivedPointWhyList?.pointWhyList || !Array.isArray(derivedPointWhyList.pointWhyList)) {
    return null
  }

  return (
    <div>
      <Why pointWhyList={derivedPointWhyList.pointWhyList} {...otherProps} category={category} intro={intro} onDone={handleOnDone} />
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

  const allWhysRef = useRef({})
  const [dummy, setDummy] = useState(0)

  useEffect(() => {
    const updatedWhys = allWhysRef.current
    let changed = false

    pointWhyList.forEach(({ point, why }) => {
      if (why) {
        if (!isEqual(updatedWhys[point._id], why)) {
          updatedWhys[point._id] = { ...why }
          changed = true
        }
      }
    })

    Object.keys(updatedWhys).forEach(id => {
      if (!pointWhyList.find(({ point }) => point._id === id)) {
        delete updatedWhys[id]
        changed = true
      }
    })

    if (changed) {
      setDummy(d => d + 1)
    }
  }, [pointWhyList])

  const handleOnDone = ({ valid, value, delta }) => {
    if (!delta.category) {
      delta.category = category
    }

    const updatedWhys = allWhysRef.current
    if (!updatedWhys[delta.parentId]) {
      updatedWhys[delta.parentId] = {}
    }
    Object.assign(updatedWhys[delta.parentId], delta)

    setTimeout(() => {
      const allValid = Object.values(updatedWhys).every(why => {
        return why && typeof why.subject === 'string' && why.subject.trim() && typeof why.description === 'string' && why.description.trim()
      })

      onDone({
        valid: allValid,
        value: allValid ? Object.values(updatedWhys) : value,
        delta,
      })
    }, 0)
  }

  if (!pointWhyList || !pointWhyList.length) {
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
          {pointWhyList.map(({ point }) => (
            <div key={point._id}>
              <hr className={classes.pointsHr}></hr>
              <WhyInput
                point={point}
                value={allWhysRef.current[point._id] || {}}
                onDone={({ valid, value }) => {
                  const delta = { ...value, parentId: point._id }
                  handleOnDone({ valid, value: delta, delta })
                }}
              />
            </div>
          ))}
        </div>
      </Level>
    </div>
  )
}

export function derivePointWhyListByCategory(data, category) {
  const local = useRef({
    pointWhyById: undefined,
    reducedPointList: undefined,
    myWhyByParentId: undefined,
    result: { pointWhyListByCategory: undefined },
  }).current

  if (!local.pointWhyById) {
    local.pointWhyById = {}
  }

  if (!local.reducedPointList) {
    local.reducedPointList = []
  }

  const { reducedPointList = [], myWhyByParentId = {}, preRankByParentId = {} } = data || {}
  //filter
  const filteredPoints = reducedPointList.filter(item => {
    const pId = item.point?._id
    return pId && preRankByParentId[pId]?.category === category
  })

  let updated = false

  if (local.reducedPointList !== filteredPoints) {
    const oldIds = new Set(Object.keys(local.pointWhyById))

    for (const item of filteredPoints) {
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

    local.reducedPointList = filteredPoints
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
    local.result = {
      pointWhyList: Object.values(local.pointWhyById),
    }
  }

  return local.result
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
