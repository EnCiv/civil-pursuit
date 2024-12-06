const cloneDeep = require('lodash/cloneDeep')

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
  return JSON.stringify(value, null, 2)
}

function setOrDeleteKeyWithMessages(dst, src, messages, keyPath, key) {
  if (typeof dst[key] === 'object' && typeof src[key] === 'object' && dst[key] !== null && src[key] !== null) {
    const updated = setOrDeleteWithMessages(dst[key], src[key], messages, keyPath)
    if (updated) dst[key] = { ...dst[key] }
    return updated
  } else {
    if (typeof src[key] === 'object' && src[key] !== null) {
      if (messages) messages.push(`${keyPath}: changing ${stringify(dst, key)} to ${stringify(src, key)}`)
      dst[key] = cloneDeep(src[key])
      return 1
    } else if (dst[key] !== src[key]) {
      if (messages) messages.push(`${keyPath}: changing ${stringify(dst, key)} to ${stringify(src, key)}`)
      dst[key] = src[key]
      return 1
    }
  }
  return 0
}

function setOrDeleteWithMessages(dst, src, messages, keyPath) {
  let updated = 0
  if (typeof dst === 'object' && typeof src === 'object' && dst !== null && src !== null) {
    const dstKeys = Object.keys(dst)
    const srcKeys = Object.keys(src)
    if (Array.isArray(dst) && Array.isArray(src)) {
      for (const key of srcKeys) updated += setOrDeleteKeyWithMessages(dst, src, messages, `${keyPath ? keyPath : ''}[${key}]`, key)
      if (!sameKeys(dstKeys, srcKeys)) {
        for (const key of dstKeys.reverse()) {
          // reverse because splice changes order each time
          if (srcKeys.includes(key)) continue
          else {
            if (messages) messages.push(`deleting ${keyPath ? keyPath : ''}[${key}]: ${dst[key]}`)
            dst.splice(key, 1)
            ++updated
          }
        }
        return updated
      }
    } else {
      for (const key of srcKeys) {
        if (typeof src[key] === 'undefined') {
          if (messages) messages.push(`deleting ${keyPath ? keyPath + '.' : ''}${key}: ${dst[key]}`)
          delete dst[key]
          ++updated
        } else updated += setOrDeleteKeyWithMessages(dst, src, messages, (keyPath ? keyPath + '.' : '') + key, key)
      }
    }
  } else {
    if (messages) messages.push(`${keyPath ? keyPath + ': c' : 'C'}an not change type ${typeof dst} to ${typeof src}`)
  }
  return updated
}

// returns a top level copy of dst, with mutated changes along the src path(s)
// or returns dst if there were no changes
export default function setOrDeleteByMutatePath(dst, src, messages, keyPath) {
  if (setOrDeleteWithMessages(dst, src, messages, keyPath)) return { ...dst }
  else return dst
}
