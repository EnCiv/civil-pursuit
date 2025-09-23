import { getDiscussionStatus } from '../dturn/dturn'
import { ensureDeliberationLoaded } from './subscribe-deliberation'

export default async function get_discussion_status(discussionId, cb) {
  if (typeof cb !== 'function') return
  const loaded = await ensureDeliberationLoaded.call(this, discussionId) // this is the socket
  if (!loaded) return cb(undefined)
  const status = await getDiscussionStatus(discussionId)
  cb(status)
}
