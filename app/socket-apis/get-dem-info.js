// https://github.com/EnCiv/civil-pursuit/issues/XXX
'use strict'

import { ObjectId } from 'mongodb'
import Points from '../models/points'
import Jsforms from '../models/jsforms'

/*
# Socket API: get-dem-info

Fetches demographic information for multiple points.
Returns moreDetails data for points where users have consented (shareInfo="Yes").

## Parameters

- `pointIds` (string[]) - Array of point IDs to fetch demographic info for
- `cb` (Function) - Callback function

## Callback Response

- **Success**: `cb({ [pointId]: moreDetails })` - Object mapping pointIds to their demographic data
  - Returns `null` for a pointId if:
    - Point not found
    - Jsform not found
    - User has not consented (shareInfo !== "Yes")
    - Error processing that specific pointId
- **Error**: `cb(undefined)` - Called when:
  - User is not authenticated
  - Invalid pointIds format (not array or empty)
  - Unexpected server error

## Privacy & Security

- **Privacy**: Only returns data if `shareInfo === "Yes"`
- **Security**: `userId` is always removed from response (even for user's own points per implementation)
- **Authentication**: Requires authenticated user (`this.synuser`)

## Example

```javascript
window.socket.emit('get-dem-info', ['id1', 'id2'], (result) => {
  if (result) {
    // Success: { id1: { stateOfResidence: 'CA', ... }, id2: null }
  } else {
    // Error: undefined
  }
})
```
*/
export default async function getDemInfo(pointIds, cb) {
  try {
    if (typeof cb !== 'function') {
      logger.error('get-dem-info: Callback is not a function', { pointIds, cb })
      return
    }
    // Validate authentication
    if (!this.synuser) {
      logger.error('get-dem-info: Unauthenticated request')
      return cb(undefined)
    }

    // Validate pointIds
    if (!Array.isArray(pointIds) || pointIds.length === 0) {
      logger.error('get-dem-info: Invalid pointIds', { pointIds })
      return cb(undefined)
    }

    // Validate all pointIds are strings
    if (!pointIds.every(id => typeof id === 'string')) {
      logger.error('get-dem-info: pointIds must be array of strings', { pointIds })
      return cb(undefined)
    }

    const currentUserId = this.synuser.id
    const result = {}

    // Fetch dem-info for each pointId
    for (const pointId of pointIds) {
      try {
        // Get point by _id
        const point = await Points.findOne({ _id: new ObjectId(pointId) })

        if (!point) {
          result[pointId] = null
          continue
        }

        const { userId, parentId } = point

        // Get jsform by userId and parentId (discussionId)
        const jsform = await Jsforms.findOne({ userId, parentId })

        if (!jsform || !jsform.moreDetails) {
          result[pointId] = null
          continue
        }

        const { moreDetails } = jsform

        // Privacy enforcement: only share if user has consented
        if (moreDetails.shareInfo !== 'Yes') {
          result[pointId] = null
          continue
        }

        // Clone moreDetails to avoid mutating database document
        const demInfo = { ...moreDetails }

        // Security: remove userId unless it's the current user's own point
        if (userId !== currentUserId && demInfo.userId) {
          delete demInfo.userId
        }

        result[pointId] = demInfo
      } catch (err) {
        logger.error('get-dem-info: Error processing pointId', { pointId, error: err.message })
        result[pointId] = null
      }
    }

    cb(result)
  } catch (err) {
    logger.error('get-dem-info: Unexpected error', { error: err.message, stack: err.stack })
    cb(undefined)
  }
}
