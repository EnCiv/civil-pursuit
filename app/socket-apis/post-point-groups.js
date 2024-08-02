// https://github.com/EnCiv/civil-pursuit/issues/178

const Joi = require('joi')
const { putGroupings } = require('./dturn')

const schema = Joi.object({
  discussionId: Joi.string().required(),
  groupings: Joi.array().max(99).required(),
})

async function postPointGroups(discussionId, round, groupings, cb) {
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

  // Validate inputs
  try {
    await schema.validateAsync({ discussionId: discussionId, groupings: groupings })
  } catch (error) {
    return cbFailure(error)
  }

  // Ignore empty groupings, but call cb(true).
  if (groupings == [] || groupings == [[]]) {
    return cbSuccess()
  }

  // Call putGroupings() and check for success
  let putSuccess = putGroupings(discussionId, round, this.synuser.id, groupings)
  return putSuccess ? cbSuccess() : cbFailure('The call to putGroupings() did not complete successfully.')
}
