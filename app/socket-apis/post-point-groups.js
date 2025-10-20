// https://github.com/EnCiv/civil-pursuit/issues/178

import Joi from 'joi'
import { putGroupings } from '../dturn/dturn'

const schema = Joi.object({
  discussionId: Joi.string().required(),
  groupings: Joi.array().max(99).items(Joi.array().max(99)).required(),
})

export default async function postPointGroups(discussionId, round, groupings, cb) {
  if (cb && typeof cb !== 'function') console.error('postPointGroups cb must be a function, received:', cb)
  // Anonymous functions to handle success/fail
  const cbFailure = errorMsg => {
    if (errorMsg) console.error(errorMsg)
    if (cb) cb(undefined)
  }
  const cbSuccess = () => {
    if (cb) cb(true)
  }

  // Verify user is logged in.
  if (!this.synuser || !this.synuser.id) {
    return cbFailure('Cannot post point group - user is not logged in.')
  }
  if (typeof discussionId !== 'string' || discussionId.length !== 24) return cbFailure('discussionId is not a valid ObjectId')
  if (typeof round !== 'number') return cbFailure('round is not a number')
  if (!Array.isArray(groupings)) return cbFailure('groupings is not an array')
  if (groupings.length > 99) return cbFailure('groupings is too long')
  if (groupings.some(g => !Array.isArray(g))) return cbFailure('groupings contains a non-array element')
  if (groupings.some(g => g.length > 99)) return cbFailure('groupings contains a subarray that is too long')
  // Validate inputs
  try {
    await schema.validateAsync({ discussionId: discussionId, groupings: groupings })
  } catch (error) {
    return cbFailure(error['details'][0]['message'])
  }

  // Ignore empty groupings, but call cb(true).
  if (!groupings.length || groupings.every(g => !g.length)) {
    return cbSuccess()
  }

  // Ensure no subarray has only 1 object
  for (let index = 0; index < groupings.length; index++) {
    if (groupings[index].length == 1) return cbFailure(`Groupings contains a subarr with only 1 object - ${groupings[index]}`)
  }

  // Call putGroupings() and check for success
  let putSuccess = await putGroupings(discussionId, round, this.synuser.id, groupings)
  return putSuccess ? cbSuccess() : cbFailure('The call to putGroupings() did not complete successfully.')
}
