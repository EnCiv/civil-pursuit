// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md
// localStorage Manager Utility for Late Sign-Up Feature
//
// Manages localStorage data for deliberation sessions before user authentication.
// Uses composite keys: discussionId-userId for multi-user support on shared devices.
// Includes TTL (time-to-live) and graceful fallback for disabled/unavailable localStorage.

const STORAGE_PREFIX = 'civil-pursuit-deliberation'
const TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

/**
 * Check if localStorage is available and working
 *
 * Returns `true` if localStorage is available, `false` otherwise
 */
export function isAvailable() {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Generate storage key from discussionId and userId
 *
 * - `discussionId` - The discussion ID
 * - `userId` - The user ID (tempId from useAuth.skip())
 *
 * Returns the composite storage key
 */
function getKey(discussionId, userId) {
  return `${STORAGE_PREFIX}-${discussionId}-${userId}`
}

/**
 * Save deliberation data to localStorage
 *
 * Caller should check isAvailable() first and handle unavailable case separately
 *
 * - `discussionId` - The discussion ID
 * - `userId` - The user ID
 * - `data` - The deliberation data to save
 *
 * Returns `true` if saved successfully, `false` otherwise
 */
export function save(discussionId, userId, data) {
  try {
    const key = getKey(discussionId, userId)
    const payload = {
      data,
      timestamp: Date.now(),
      discussionId,
      userId,
    }
    localStorage.setItem(key, JSON.stringify(payload))
    return true
  } catch (e) {
    // Likely quota exceeded
    console.error('Failed to save to localStorage:', e)
    return false
  }
}

/**
 * Load deliberation data from localStorage
 *
 * Caller should check isAvailable() first and handle unavailable case separately
 *
 * - `discussionId` - The discussion ID
 * - `userId` - The user ID
 *
 * Returns the deliberation data or `null` if not found/expired
 */
export function load(discussionId, userId) {
  try {
    const key = getKey(discussionId, userId)
    const item = localStorage.getItem(key)

    if (!item) {
      return null
    }

    const payload = JSON.parse(item)

    // Check TTL
    if (Date.now() - payload.timestamp > TTL_MS) {
      // Data expired, remove it
      localStorage.removeItem(key)
      return null
    }

    return payload.data
  } catch (e) {
    console.error('Failed to load from localStorage:', e)
    return null
  }
}

/**
 * Clear deliberation data from localStorage
 *
 * Caller should check isAvailable() first and handle unavailable case separately
 *
 * - `discussionId` - The discussion ID
 * - `userId` - The user ID
 *
 * Returns `true` if cleared successfully, `false` otherwise
 */
export function clear(discussionId, userId) {
  try {
    const key = getKey(discussionId, userId)
    localStorage.removeItem(key)
    return true
  } catch (e) {
    console.error('Failed to clear localStorage:', e)
    return false
  }
}

/**
 * Clear all expired deliberation data from localStorage
 *
 * Useful for cleanup/maintenance
 *
 * Caller should check isAvailable() first and handle unavailable case separately
 *
 * Returns the number of items cleared
 */
export function clearExpired() {
  let cleared = 0
  try {
    const now = Date.now()
    const keys = []

    // Collect all keys first (can't modify during iteration)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keys.push(key)
      }
    }

    // Check and remove expired items
    keys.forEach(key => {
      try {
        const item = localStorage.getItem(key)
        if (item) {
          const payload = JSON.parse(item)
          if (now - payload.timestamp > TTL_MS) {
            localStorage.removeItem(key)
            cleared++
          }
        }
      } catch (e) {
        // Invalid JSON or other error, remove it
        localStorage.removeItem(key)
        cleared++
      }
    })
  } catch (e) {
    console.error('Failed to clear expired localStorage items:', e)
  }

  return cleared
}

export default {
  isAvailable,
  save,
  load,
  clear,
  clearExpired,
}
