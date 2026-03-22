// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md
// Tests for localStorage Manager Utility

import LocalStorageManager, { isAvailable, save, load, clear, clearExpired } from '../local-storage-manager'

// Mock localStorage for Node.js/Jest environment
class LocalStorageMock {
  constructor() {
    this.store = {}
  }

  clear() {
    this.store = {}
  }

  getItem(key) {
    return this.store[key] || null
  }

  setItem(key, value) {
    this.store[key] = String(value)
  }

  removeItem(key) {
    delete this.store[key]
  }

  key(index) {
    const keys = Object.keys(this.store)
    return keys[index] || null
  }

  get length() {
    return Object.keys(this.store).length
  }
}

global.localStorage = new LocalStorageMock()

describe('localStorage Manager', () => {
  const mockDiscussionId = 'test-discussion-123'
  const mockUserId = 'test-user-456'
  const mockData = {
    pointById: { point1: { subject: 'Test Point', description: 'Test Description' } },
    myWhyByCategoryByParentId: {
      most: { why1: { subject: 'Test Why', description: 'Test Why Description' } },
    },
    postRankByParentId: { rank1: { parentId: 'point1', rank: 1 } },
  }

  let originalLocalStorage

  beforeEach(() => {
    // Save original localStorage and create fresh instance
    originalLocalStorage = global.localStorage
    global.localStorage = new LocalStorageMock()
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Restore original localStorage
    global.localStorage = originalLocalStorage
    jest.restoreAllMocks()
  })

  describe('isAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isAvailable()).toBe(true)
    })

    it('should return false when localStorage is disabled', () => {
      const originalSetItem = global.localStorage.setItem
      global.localStorage.setItem = jest.fn(() => {
        throw new Error('localStorage disabled')
      })

      expect(isAvailable()).toBe(false)

      global.localStorage.setItem = originalSetItem
    })
  })

  describe('save', () => {
    it('should save data to localStorage with correct key', () => {
      const result = save(mockDiscussionId, mockUserId, mockData)

      expect(result).toBe(true)
      const key = `civil-pursuit-deliberation-${mockDiscussionId}-${mockUserId}`
      const stored = localStorage.getItem(key)
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored)
      expect(parsed.data).toEqual(mockData)
      expect(parsed.discussionId).toBe(mockDiscussionId)
      expect(parsed.userId).toBe(mockUserId)
      expect(parsed.timestamp).toBeGreaterThan(0)
    })

    it('should return false when quota is exceeded', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const setItemSpy = jest.spyOn(global.localStorage, 'setItem').mockImplementation(() => {
        const error = new Error('QuotaExceededError')
        error.name = 'QuotaExceededError'
        throw error
      })

      const result = save(mockDiscussionId, mockUserId, mockData)
      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save to localStorage:', expect.any(Error))

      setItemSpy.mockRestore()
      consoleErrorSpy.mockRestore()
    })

    it('should overwrite existing data for same discussionId-userId', () => {
      const data1 = { test: 'first' }
      const data2 = { test: 'second' }

      save(mockDiscussionId, mockUserId, data1)
      save(mockDiscussionId, mockUserId, data2)

      const loaded = load(mockDiscussionId, mockUserId)
      expect(loaded).toEqual(data2)
    })
  })

  describe('load', () => {
    it('should load saved data correctly', () => {
      save(mockDiscussionId, mockUserId, mockData)
      const loaded = load(mockDiscussionId, mockUserId)

      expect(loaded).toEqual(mockData)
    })

    it('should return null when no data exists', () => {
      const loaded = load('nonexistent-discussion', 'nonexistent-user')
      expect(loaded).toBeNull()
    })

    it('should return null for expired data', () => {
      // Save data with old timestamp
      const key = `civil-pursuit-deliberation-${mockDiscussionId}-${mockUserId}`
      const expiredTimestamp = Date.now() - 8 * 24 * 60 * 60 * 1000 // 8 days ago (past TTL)
      const payload = {
        data: mockData,
        timestamp: expiredTimestamp,
        discussionId: mockDiscussionId,
        userId: mockUserId,
      }
      localStorage.setItem(key, JSON.stringify(payload))

      const loaded = load(mockDiscussionId, mockUserId)
      expect(loaded).toBeNull()

      // Verify expired data was removed
      expect(localStorage.getItem(key)).toBeNull()
    })

    it('should load non-expired data within TTL', () => {
      // Save data with recent timestamp
      const key = `civil-pursuit-deliberation-${mockDiscussionId}-${mockUserId}`
      const recentTimestamp = Date.now() - 1 * 24 * 60 * 60 * 1000 // 1 day ago (within TTL)
      const payload = {
        data: mockData,
        timestamp: recentTimestamp,
        discussionId: mockDiscussionId,
        userId: mockUserId,
      }
      localStorage.setItem(key, JSON.stringify(payload))

      const loaded = load(mockDiscussionId, mockUserId)
      expect(loaded).toEqual(mockData)
    })

    it('should return null for corrupted JSON', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const key = `civil-pursuit-deliberation-${mockDiscussionId}-${mockUserId}`
      localStorage.setItem(key, 'invalid json{')

      const loaded = load(mockDiscussionId, mockUserId)
      expect(loaded).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load from localStorage:', expect.any(SyntaxError))

      consoleErrorSpy.mockRestore()
    })
  })

  describe('clear', () => {
    it('should clear specific deliberation data', () => {
      save(mockDiscussionId, mockUserId, mockData)
      const key = `civil-pursuit-deliberation-${mockDiscussionId}-${mockUserId}`

      expect(localStorage.getItem(key)).toBeTruthy()

      const result = clear(mockDiscussionId, mockUserId)
      expect(result).toBe(true)
      expect(localStorage.getItem(key)).toBeNull()
    })

    it('should return false when removeItem throws error', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const removeItemSpy = jest.spyOn(global.localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('localStorage error')
      })

      const result = clear(mockDiscussionId, mockUserId)
      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to clear localStorage:', expect.any(Error))

      removeItemSpy.mockRestore()
      consoleErrorSpy.mockRestore()
    })

    it('should not affect other deliberation data', () => {
      const userId2 = 'different-user'
      save(mockDiscussionId, mockUserId, mockData)
      save(mockDiscussionId, userId2, { other: 'data' })

      clear(mockDiscussionId, mockUserId)

      expect(load(mockDiscussionId, mockUserId)).toBeNull()
      expect(load(mockDiscussionId, userId2)).toEqual({ other: 'data' })
    })
  })

  describe('clearExpired', () => {
    it('should remove all expired items', () => {
      const now = Date.now()
      const expiredTimestamp = now - 8 * 24 * 60 * 60 * 1000 // 8 days ago
      const recentTimestamp = now - 1 * 24 * 60 * 60 * 1000 // 1 day ago

      // Add expired items
      localStorage.setItem('civil-pursuit-deliberation-old1-user1', JSON.stringify({ data: {}, timestamp: expiredTimestamp, discussionId: 'old1', userId: 'user1' }))
      localStorage.setItem('civil-pursuit-deliberation-old2-user2', JSON.stringify({ data: {}, timestamp: expiredTimestamp, discussionId: 'old2', userId: 'user2' }))

      // Add non-expired item
      localStorage.setItem('civil-pursuit-deliberation-recent-user3', JSON.stringify({ data: {}, timestamp: recentTimestamp, discussionId: 'recent', userId: 'user3' }))

      // Add non-deliberation item (should not be touched)
      localStorage.setItem('other-key', 'other-value')

      const cleared = clearExpired()

      expect(cleared).toBe(2)
      expect(localStorage.getItem('civil-pursuit-deliberation-old1-user1')).toBeNull()
      expect(localStorage.getItem('civil-pursuit-deliberation-old2-user2')).toBeNull()
      expect(localStorage.getItem('civil-pursuit-deliberation-recent-user3')).toBeTruthy()
      expect(localStorage.getItem('other-key')).toBe('other-value')
    })

    it('should remove items with invalid JSON', () => {
      localStorage.setItem('civil-pursuit-deliberation-corrupt-user', 'invalid json{')

      const cleared = clearExpired()

      expect(cleared).toBe(1)
      expect(localStorage.getItem('civil-pursuit-deliberation-corrupt-user')).toBeNull()
    })

    it('should return 0 when no items to clear', () => {
      const cleared = clearExpired()
      expect(cleared).toBe(0)
    })

    it('should handle errors gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      // Mock length to be > 0 but key() throws immediately
      Object.defineProperty(global.localStorage, 'length', {
        get: () => 1,
        configurable: true,
      })

      const originalKey = global.localStorage.key
      global.localStorage.key = function (index) {
        throw new Error('localStorage error')
      }

      const cleared = clearExpired()
      expect(cleared).toBe(0)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to clear expired localStorage items:', expect.any(Error))

      global.localStorage.key = originalKey
      // Restore length property
      delete global.localStorage.length
      consoleErrorSpy.mockRestore()
    })
  })

  describe('default export', () => {
    it('should export all functions as default object', () => {
      expect(LocalStorageManager.isAvailable).toBe(isAvailable)
      expect(LocalStorageManager.save).toBe(save)
      expect(LocalStorageManager.load).toBe(load)
      expect(LocalStorageManager.clear).toBe(clear)
      expect(LocalStorageManager.clearExpired).toBe(clearExpired)
    })
  })

  describe('multi-user scenarios', () => {
    it('should handle multiple users in same discussion', () => {
      const user1 = 'user-1'
      const user2 = 'user-2'
      const data1 = { user: 'one' }
      const data2 = { user: 'two' }

      save(mockDiscussionId, user1, data1)
      save(mockDiscussionId, user2, data2)

      expect(load(mockDiscussionId, user1)).toEqual(data1)
      expect(load(mockDiscussionId, user2)).toEqual(data2)
    })

    it('should handle same user in multiple discussions', () => {
      const discussion1 = 'discussion-1'
      const discussion2 = 'discussion-2'
      const data1 = { discussion: 'one' }
      const data2 = { discussion: 'two' }

      save(discussion1, mockUserId, data1)
      save(discussion2, mockUserId, data2)

      expect(load(discussion1, mockUserId)).toEqual(data1)
      expect(load(discussion2, mockUserId)).toEqual(data2)
    })
  })

  describe('edge cases', () => {
    it('should handle empty data object', () => {
      save(mockDiscussionId, mockUserId, {})
      const loaded = load(mockDiscussionId, mockUserId)
      expect(loaded).toEqual({})
    })

    it('should handle special characters in IDs', () => {
      const specialDiscussion = 'discussion-with-特殊字符-émojis-🎉'
      const specialUser = 'user-with-@#$%-symbols'
      const data = { special: 'data' }

      save(specialDiscussion, specialUser, data)
      const loaded = load(specialDiscussion, specialUser)
      expect(loaded).toEqual(data)
    })

    it('should handle large data objects', () => {
      const largeData = {
        points: Array(100)
          .fill(null)
          .map((_, i) => ({ id: `point-${i}`, subject: `Subject ${i}`, description: `Description ${i}` })),
      }

      const result = save(mockDiscussionId, mockUserId, largeData)
      expect(result).toBe(true)

      const loaded = load(mockDiscussionId, mockUserId)
      expect(loaded).toEqual(largeData)
    })
  })
})
