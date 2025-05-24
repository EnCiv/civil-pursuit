// this was originally taken from https://github.com/EnCiv/undebate-ssp/blob/main/app/socket-apis/find-and-unset-election-doc.js#L10
// ToDo - it should be made into a separate repo that can be imported into multiple projects
import { ObjectId } from 'mongodb'
function lp(path) {
  return path ? path + '.' : ''
}
export default function docToSetUnset(doc, sets = {}, unsets = {}, path = '') {
  Object.keys(doc).forEach(key => {
    if (typeof doc[key] === 'object' && doc[key] !== null && !(doc[key] instanceof ObjectId) && !(doc[key] instanceof Date)) {
      docToSetUnset(doc[key], sets, unsets, lp(path) + key)
    } else if (typeof doc[key] === 'function') return
    //just skip functions
    else if (typeof doc[key] === 'undefined') {
      unsets[lp(path) + key] = ''
    } else sets[lp(path) + key] = doc[key]
  })
  return [sets, unsets]
}
