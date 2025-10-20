const cloneDeep = require('lodash/cloneDeep')

/**
setOrDeleteByMutatePath(dst, src, messages, keyPath)

 dst: the object that src will be upserted into
 src: the object that is to be upserted into dst

optional: 
 messages: and array of strings detailing the changes. If undefined, no messages are generated. Mostly messages are for debugging and inspecting.
 keyPath: the object path in messages will be prefixed with keyPath, which could be the name of the dst variable for example

returns 
  dst if no real changes, or a new object, if changes were made

This function is applied recursively, so any sub-object that has changes in it will also be a new object, 
but sub-objects with no changes will keep the same object ref.

This is userful when react is rendering from a complex object that is handled by multiple react components,
only the components where there have been changes will see new props and rerender. Components that render
sub-objects that have not changed, will not rerender. For example if react is rendering a list, and only one
item in the list has chanaged, only the one item should rerender.

This works with plain objects and arrays. Has not been tested with maps or sets.

Also, if a property in src is present and set to undefined, like {a: {b: undefined}}, then the property (like a.b) in the dst will be deleted

Sub-objects in src will be cloned so nothing in src will be referced after use

Sub-objects of dst will be referenced directly if they have not changed, 

 */

function sameKeys(dstKeys, srcKeys) {
  // keys are from an array so they are in order
  if (dstKeys.length !== srcKeys.length) return false
  for (let i = 0; i < dstKeys.length; i++) {
    if (dstKeys[i] !== srcKeys[i]) {
      return false
    }
  }
  return true
}

function stringify(obj, key) {
  const value = obj[key]
  if (typeof value === 'undefined' && !Object.keys(obj).includes(key)) return 'not-present'
  if (typeof value === 'function') return (value.name || 'unnamed') + '()'
  // ??? it would be better to use util.inspect but that doesn't work on browser. Tried loupe but have trouble with require/import in node 16
  return JSON.stringify(value)
}

function setOrDeleteKeyWithMessages(dst, src, messages, keyPath, key) {
  if (typeof dst[key] === 'object' && typeof src[key] === 'object' && dst[key] !== null && src[key] !== null) {
    const wasUpdated = setOrDeleteByMutatePath(dst[key], src[key], messages, keyPath)
    if (wasUpdated !== dst[key]) {
      return wasUpdated
    }
  } else {
    if (typeof src[key] === 'object' && src[key] !== null) {
      if (messages) messages.push(`${keyPath}: changing ${stringify(dst, key)} to ${stringify(src, key)}`)
      return src[key]
    } else if (dst[key] !== src[key]) {
      if (messages) messages.push(`${keyPath}: changing ${stringify(dst, key)} to ${stringify(src, key)}`)
      return src[key]
    }
  }
  return dst[key]
}

export default function setOrDeleteByMutatePath(dst, src, messages, keyPath) {
  let updated = 0
  if (typeof dst === 'object' && typeof src === 'object' && dst !== null && src !== null) {
    const dstKeys = Object.keys(dst)
    const srcKeys = Object.keys(src)
    if (Array.isArray(dst) && Array.isArray(src)) {
      const newDst = []
      for (const key of srcKeys) {
        newDst[key] = setOrDeleteKeyWithMessages(dst, src, messages, `${keyPath ? keyPath : ''}[${key}]`, key)
        if (newDst[key] !== dst[key]) ++updated
      }
      if (!sameKeys(dstKeys, srcKeys)) {
        for (const key of dstKeys) {
          if (srcKeys.includes(key)) continue
          else {
            if (messages) messages.push(`deleting ${keyPath ? keyPath : ''}[${key}]: ${stringify(dst, key)}`)
            ++updated
          }
        }
      }
      if (updated) {
        if (messages) messages.push(`${keyPath ? 'mutating ' + keyPath : 'returning mutated copy'}`)
        return newDst
      }
    } else {
      const newDst = {}
      for (const key of srcKeys) {
        if (typeof src[key] === 'undefined') {
          if (messages) messages.push(`deleting ${keyPath ? keyPath + '.' : ''}${key}: ${stringify(dst, key)}`)
          //delete dst[key]
          ++updated
        } else {
          newDst[key] = setOrDeleteKeyWithMessages(dst, src, messages, (keyPath ? keyPath + '.' : '') + key, key)
          if (newDst[key] !== dst[key]) ++updated
        }
      }
      if (!sameKeys(dstKeys, srcKeys)) {
        for (const key of dstKeys) {
          if (srcKeys.includes(key)) continue
          else {
            newDst[key] = dst[key]
          }
        }
      }
      if (updated) {
        if (messages) messages.push(`${keyPath ? 'mutating ' + keyPath : 'returning mutated copy'}`)
        return newDst
      }
    }
  } else {
    if (messages) messages.push(`${keyPath ? keyPath + ': c' : 'C'}an not change type ${typeof dst} to ${typeof src}`)
  }
  return dst
}
