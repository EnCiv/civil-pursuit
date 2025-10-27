// https://github.com/EnCiv/civil-pursuit/issues/61
// https://github.com/EnCiv/civil-pursuit/issues/215

'use strict'
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react'
import { createUseStyles } from 'react-jss'
import ReviewPoint from '../review-point'
import DeliberationContext from '../deliberation-context'
import useFetchDemInfo from '../hooks/use-fetch-dem-info'
import StepIntro from '../step-intro'
import { useRankByParentId } from './rank'

export default function RerankStep(props) {
  const { onDone, round } = props
  const { data, upsert } = useContext(DeliberationContext)
  const fetchDemInfo = useFetchDemInfo()
  let onNext
  const handleOnDone = ({ valid, value, delta }) => {
    if (delta) {
      upsert({ postRankByParentId: { [delta.parentId]: delta } })
      window.socket.emit('upsert-rank', delta)
    }
    if (valid) {
      const shownStatementIds = {} // only change objects in shownStatementIds if they have changed
      const idRanks = data.reducedPointList.map(point_group => {
        const pointId = point_group.point._id
        const rank = (delta?.parentId === pointId ? delta : data.postRankByParentId[pointId])?.category === 'most' ? 1 : 0
        if (data.uInfo[round]?.shownStatementIds?.[pointId]?.rank !== rank) {
          shownStatementIds[pointId] = structuredClone(data.uInfo[round]?.shownStatementIds?.[pointId] || {})
          shownStatementIds[pointId].rank = rank
        } // else only need to change what's different
        return { [pointId]: rank }
      })
      onNext = () => {
        const groupings = data.groupIdsLists || []
        upsert({ uInfo: { [round]: { shownStatementIds, groupings, finished: true } } })
        window.socket.emit('finish-round', data.discussionId, round, idRanks, groupings, () => {})
      }
    }
    onDone({ valid, value, onNext })
  }

  // fetch previous data
  useEffect(() => {
    // on the browser, do this once and only once when this component is first rendered
    const { discussionId, reducedPointList } = data
    if (!reducedPointList || !reducedPointList.length) return // nothing to do
    window.socket.emit(
      'get-user-post-ranks-and-top-ranked-whys',
      discussionId,
      round,
      reducedPointList.map(point_group => point_group.point._id),
      result => {
        if (!result) return // there was an error
        const { ranks, whys } = result
        //if (!ranks.length && !whys.length) return // nothing to do
        const postRankByParentId = ranks.reduce((postRankByParentId, rank) => ((postRankByParentId[rank.parentId] = rank), postRankByParentId), {})
        const whysByCategoryByParentId = whys.reduce((wXpXc, w) => (wXpXc[w.category][w.parentId] ? wXpXc[w.category][w.parentId].push(w) : (wXpXc[w.category][w.parentId] = [w]), wXpXc), { most: {}, least: {} })
        upsert({ postRankByParentId, whysByCategoryByParentId })

        // Fetch dem-info for parent points and all why points
        const whyIds = whys.map(w => w._id)
        fetchDemInfo(whyIds)
      }
    )
  }, [round, data.reducedPointList])

  const topWhysByCategoryByParentId = useMemo(() => {
    const topWhysByCategoryByParentId = data.reducedPointList?.reduce(
      (tWxCxP, { point, group }) => {
        ;['most', 'least'].forEach(category => {
          tWxCxP[category][point._id] = data.whysByCategoryByParentId?.[category]?.[point._id] || []
          if (data.myWhyByCategoryByParentId?.[category]?.[point._id] && !tWxCxP[category][point._id].some(p => p._id === data.myWhyByCategoryByParentId[category][point._id]._id))
            tWxCxP[category][point._id].push(data.myWhyByCategoryByParentId[category][point._id])
        })
        return tWxCxP
      },
      { most: {}, least: {} }
    ) || { most: {}, least: {} }
    return topWhysByCategoryByParentId
  }, [data.reducedPointList, data.whysByCategoryByParentId, data.myWhyByCategoryByParentId])
  return (
    <Rerank {...props} reducedPointList={data.reducedPointList} topWhysByCategoryByParentId={topWhysByCategoryByParentId} postRankByParentId={data.postRankByParentId} round={round} discussionId={data.discussionId} onDone={handleOnDone} />
  )
}

// table to map from data model properties, to the Rank Strings shown in the UI
const toRankString = {
  undefined: '',
  most: 'Most',
  least: 'Least',
  neutral: 'Neutral',
}

// table to map from UI's Rank Strings to the data model prpoerty names
const rankStringToCategory = Object.entries(toRankString).reduce((rS2C, [key, value]) => {
  if (key === 'undefined') return rS2C // rankStringToCategory[''] will be undefined
  rS2C[value] = key
  return rS2C
}, {})

export function Rerank(props) {
  const { reducedPointList, postRankByParentId, topWhysByCategoryByParentId, onDone = () => {}, className, round, discussionId, stepIntro } = props
  // this component manages the rank doc so we keep a local copy
  // if it's changed from above, we use the setter to cause a rerender
  // if it's changed from below (by the user) we mutate the state so we don't cause a rerender

  const [vStateByPointId, setVStateByPointId] = useState(() => {
    const vStateByPointId = {}
    let firstDisabled = false
    for (const pointGroup of reducedPointList || []) {
      vStateByPointId[pointGroup.point._id] = postRankByParentId?.[pointGroup.point._id]?.category ? 'enabled' : firstDisabled ? 'disabled' : ((firstDisabled = true), 'open')
    }
    return vStateByPointId
  })

  const validAndPercentDone = (reducedPointList, rankByParentId) => {
    if (!reducedPointList) return { valid: false, value: 0 }
    let doneCount = 0
    for (const pointGroup of reducedPointList || []) {
      if (rankByParentId[pointGroup.point._id]?.category) doneCount++
    }
    const percentDone = doneCount / reducedPointList.length
    return { valid: percentDone >= 1, value: percentDone }
  }
  const [rankByParentId, handleRankPoint] = useRankByParentId(discussionId, round, 'post', reducedPointList, postRankByParentId, validAndPercentDone, onDone)
  const handleRankAndVState = (point, result) => {
    handleRankPoint(point, result)
    setVStateByPointId(prev => {
      const newVStateByPointId = {}
      let pointUpdated = false
      let updated = false
      let newPointUpdated = false
      for (const pG of reducedPointList) {
        if (pG.point._id === point._id) {
          newVStateByPointId[pG.point._id] = result.valid ? 'enabled' : newVStateByPointId[pG.point._id] === 'open' ? 'disabled' : 'open'
          pointUpdated = true
          updated = newVStateByPointId[pG.point._id] !== prev[pG.point._id] ? true : updated
          newPointUpdated = newVStateByPointId[pG.point._id] === 'open' ? true : newPointUpdated
        } else if (pointUpdated && !newPointUpdated && prev[pG.point._id] && !rankByParentId[pG.point._id]?.category) {
          newVStateByPointId[pG.point._id] = 'open'
          updated = true
          newPointUpdated = true
        } else {
          newVStateByPointId[pG.point._id] = prev[pG.point._id]
        }
      }
      if (!newPointUpdated) {
        for (const pG of reducedPointList) {
          if (newVStateByPointId[pG.point._id] !== 'open' && !rankByParentId[pG.point._id]?.category) {
            newVStateByPointId[pG.point._id] = 'open'
            newPointUpdated = true
            updated = true
            break
          }
        }
      }
      return updated ? newVStateByPointId : prev
    })
  }

  const classes = useStylesFromThemeFunction()

  // first time through should call onDone if there are reviewPoints to notify parent of valid status
  useEffect(() => {
    if (reducedPointList) onDone(validAndPercentDone(reducedPointList, rankByParentId))
  }, [])

  if (!reducedPointList) return null // nothing ready yet

  return (
    <div className={classes.reviewPointsContainer}>
      <StepIntro {...stepIntro} />
      {reducedPointList.map(({ point, group }) => (
        <div key={point._id} className={classes.reviewPoint}>
          <ReviewPoint
            point={point}
            leftPointList={topWhysByCategoryByParentId['most']?.[point._id] || []}
            rightPointList={topWhysByCategoryByParentId['least']?.[point._id] || []}
            rank={toRankString[rankByParentId[point._id]?.category]}
            onDone={result => handleRankAndVState(point, result)}
            vState={vStateByPointId[point._id]}
          />
        </div>
      ))}
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  reviewPointsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    paddingLeft: '0.2rem', // room for the shadow around the points
    paddingRight: '0.8rem',
    marginBottom: '1rem', // for box shadow of children
  },
}))
