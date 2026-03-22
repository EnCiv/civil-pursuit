// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md
// Storybook story for localStorage Manager - interactive browser testing

import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { within, expect } from '@storybook/test'
import LocalStorageManager from '../app/lib/local-storage-manager'

export default {
  title: 'Utils/LocalStorage Manager',
  component: LocalStorageManagerDemo,
}

function LocalStorageManagerDemo() {
  const classes = useStyles()
  const [discussionId, setDiscussionId] = useState('test-discussion-123')
  const [userId, setUserId] = useState('test-user-456')
  const [data, setData] = useState(
    JSON.stringify(
      {
        pointById: { point1: { subject: 'Test', description: 'Test point' } },
        myWhyByCategoryByParentId: { most: {} },
        postRankByParentId: {},
      },
      null,
      2
    )
  )
  const [output, setOutput] = useState('')
  const [isAvailableResult, setIsAvailableResult] = useState(LocalStorageManager.isAvailable())

  const handleIsAvailable = () => {
    const result = LocalStorageManager.isAvailable()
    setIsAvailableResult(result)
    setOutput(`localStorage is ${result ? 'available' : 'NOT available'}`)
  }

  const handleSave = () => {
    try {
      const parsedData = JSON.parse(data)
      const result = LocalStorageManager.save(discussionId, userId, parsedData)
      setOutput(`Save result: ${result}\n${result ? 'Data saved successfully!' : 'Failed to save data'}`)
    } catch (e) {
      setOutput(`Error: ${e.message}`)
    }
  }

  const handleLoad = () => {
    const result = LocalStorageManager.load(discussionId, userId)
    if (result) {
      setOutput(`Loaded data:\n${JSON.stringify(result, null, 2)}`)
    } else {
      setOutput('No data found or data expired')
    }
  }

  const handleClear = () => {
    const result = LocalStorageManager.clear(discussionId, userId)
    setOutput(`Clear result: ${result}\n${result ? 'Data cleared successfully!' : 'Failed to clear data'}`)
  }

  const handleClearExpired = () => {
    const count = LocalStorageManager.clearExpired()
    setOutput(`Cleared ${count} expired item(s)`)
  }

  const handleLoadRaw = () => {
    const key = `civil-pursuit-deliberation-${discussionId}-${userId}`
    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setOutput(`Raw localStorage data:\n${JSON.stringify(parsed, null, 2)}`)
      } catch (e) {
        setOutput(`Raw data (not JSON):\n${raw}`)
      }
    } else {
      setOutput('No data in localStorage for this key')
    }
  }

  const handleListAll = () => {
    const items = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('civil-pursuit-deliberation')) {
        const value = localStorage.getItem(key)
        try {
          const parsed = JSON.parse(value)
          const age = Math.floor((Date.now() - parsed.timestamp) / 1000 / 60)
          items.push(`${key}:\n  Age: ${age} minutes\n  Discussion: ${parsed.discussionId}\n  User: ${parsed.userId}`)
        } catch (e) {
          items.push(`${key}: [Invalid JSON]`)
        }
      }
    }
    setOutput(items.length > 0 ? items.join('\n\n') : 'No deliberation data in localStorage')
  }

  const handleTestExpiry = () => {
    // Save data with old timestamp to test expiry
    const key = `civil-pursuit-deliberation-${discussionId}-expired`
    const oldTimestamp = Date.now() - 8 * 24 * 60 * 60 * 1000 // 8 days ago
    const payload = {
      data: { test: 'expired' },
      timestamp: oldTimestamp,
      discussionId,
      userId: 'expired',
    }
    localStorage.setItem(key, JSON.stringify(payload))
    setOutput('Created expired test data. Try "Load" with userId="expired" to see it return null, or "Clear Expired" to remove it.')
  }

  return (
    <div className={classes.container}>
      <h1>localStorage Manager Interactive Test</h1>

      <div className={classes.section}>
        <h2 className={classes.title}>Configuration</h2>
        <div>
          <input className={classes.input} type="text" placeholder="Discussion ID" value={discussionId} onChange={e => setDiscussionId(e.target.value)} />
          <input className={classes.input} type="text" placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
        </div>
        <div>
          <textarea className={classes.input} style={{ width: '100%', minHeight: '100px', fontFamily: 'monospace' }} placeholder="Data (JSON)" value={data} onChange={e => setData(e.target.value)} />
        </div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.title}>Basic Operations</h2>
        <button className={classes.button} onClick={handleIsAvailable}>
          Check Availability
        </button>
        <button className={classes.button} onClick={handleSave} disabled={!isAvailableResult}>
          Save Data
        </button>
        <button className={classes.button} onClick={handleLoad} disabled={!isAvailableResult}>
          Load Data
        </button>
        <button className={classes.button} onClick={handleClear} disabled={!isAvailableResult}>
          Clear Data
        </button>
        <div className={classes.info}>Status: localStorage is {isAvailableResult ? <span className={classes.success}>available</span> : <span className={classes.error}>NOT available</span>}</div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.title}>Advanced Operations</h2>
        <button className={classes.button} onClick={handleClearExpired} disabled={!isAvailableResult}>
          Clear Expired
        </button>
        <button className={classes.button} onClick={handleLoadRaw} disabled={!isAvailableResult}>
          Load Raw Data
        </button>
        <button className={classes.button} onClick={handleListAll} disabled={!isAvailableResult}>
          List All Deliberation Data
        </button>
        <button className={classes.button} onClick={handleTestExpiry} disabled={!isAvailableResult}>
          Create Expired Test Data
        </button>
        <div className={classes.info}>TTL: 7 days | Prefix: civil-pursuit-deliberation</div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.title}>Output</h2>
        <div className={classes.output}>{output || 'No output yet. Try some operations!'}</div>
      </div>

      <div className={classes.section}>
        <h2 className={classes.title}>Testing Notes</h2>
        <ul>
          <li>Try saving and loading data with different discussionId/userId combinations</li>
          <li>Modify the data JSON and save again to test overwrites</li>
          <li>Use "Create Expired Test Data" then "Clear Expired" to test TTL cleanup</li>
          <li>Open browser DevTools → Application → Local Storage to see the raw data</li>
          <li>Try saving large data objects to test quota handling</li>
          <li>The manager uses composite keys: discussionId-userId</li>
        </ul>
      </div>
    </div>
  )
}

export const InteractiveTest = () => <LocalStorageManagerDemo />

InteractiveTest.storyName = 'Interactive Browser Test'

// Automated Interaction Tests (replicate Jest tests)

export const TestIsAvailable = {
  render: () => <div>Testing localStorage availability...</div>,
  play: async () => {
    // Test: should return true when localStorage is available
    const result = LocalStorageManager.isAvailable()
    expect(result).toBe(true)
  },
}

export const TestSaveAndLoad = {
  render: () => <div>Testing save and load operations...</div>,
  play: async () => {
    const discussionId = 'test-discussion-save-load'
    const userId = 'test-user-save-load'
    const mockData = {
      pointById: { point1: { subject: 'Test Point', description: 'Test Description' } },
      myWhyByCategoryByParentId: {
        most: { why1: { subject: 'Test Why', description: 'Test Why Description' } },
      },
      postRankByParentId: { rank1: { parentId: 'point1', rank: 1 } },
    }

    // Test: should save data to localStorage with correct key
    const saveResult = LocalStorageManager.save(discussionId, userId, mockData)
    expect(saveResult).toBe(true)

    const key = `civil-pursuit-deliberation-${discussionId}-${userId}`
    const stored = localStorage.getItem(key)
    expect(stored).toBeTruthy()

    const parsed = JSON.parse(stored)
    expect(parsed.data).toEqual(mockData)
    expect(parsed.discussionId).toBe(discussionId)
    expect(parsed.userId).toBe(userId)
    expect(parsed.timestamp).toBeGreaterThan(0)

    // Test: should load saved data correctly
    const loaded = LocalStorageManager.load(discussionId, userId)
    expect(loaded).toEqual(mockData)

    // Cleanup
    LocalStorageManager.clear(discussionId, userId)
  },
}

export const TestLoadNonExistent = {
  render: () => <div>Testing load of non-existent data...</div>,
  play: async () => {
    // Test: should return null when no data exists
    const loaded = LocalStorageManager.load('nonexistent-discussion-xyz', 'nonexistent-user-xyz')
    expect(loaded).toBeNull()
  },
}

export const TestOverwrite = {
  render: () => <div>Testing data overwrite...</div>,
  play: async () => {
    const discussionId = 'test-discussion-overwrite'
    const userId = 'test-user-overwrite'
    const data1 = { test: 'first' }
    const data2 = { test: 'second' }

    // Test: should overwrite existing data for same discussionId-userId
    LocalStorageManager.save(discussionId, userId, data1)
    LocalStorageManager.save(discussionId, userId, data2)

    const loaded = LocalStorageManager.load(discussionId, userId)
    expect(loaded).toEqual(data2)

    // Cleanup
    LocalStorageManager.clear(discussionId, userId)
  },
}

export const TestExpiredData = {
  render: () => <div>Testing expired data handling...</div>,
  play: async () => {
    const discussionId = 'test-discussion-expired'
    const userId = 'test-user-expired'
    const mockData = { test: 'expired' }

    // Test: should return null for expired data
    const key = `civil-pursuit-deliberation-${discussionId}-${userId}`
    const expiredTimestamp = Date.now() - 8 * 24 * 60 * 60 * 1000 // 8 days ago (past TTL)
    const payload = {
      data: mockData,
      timestamp: expiredTimestamp,
      discussionId,
      userId,
    }
    localStorage.setItem(key, JSON.stringify(payload))

    const loaded = LocalStorageManager.load(discussionId, userId)
    expect(loaded).toBeNull()

    // Verify expired data was removed
    expect(localStorage.getItem(key)).toBeNull()
  },
}

export const TestNonExpiredData = {
  render: () => <div>Testing non-expired data within TTL...</div>,
  play: async () => {
    const discussionId = 'test-discussion-nonexpired'
    const userId = 'test-user-nonexpired'
    const mockData = { test: 'not-expired' }

    // Test: should load non-expired data within TTL
    const key = `civil-pursuit-deliberation-${discussionId}-${userId}`
    const recentTimestamp = Date.now() - 1 * 24 * 60 * 60 * 1000 // 1 day ago (within TTL)
    const payload = {
      data: mockData,
      timestamp: recentTimestamp,
      discussionId,
      userId,
    }
    localStorage.setItem(key, JSON.stringify(payload))

    const loaded = LocalStorageManager.load(discussionId, userId)
    expect(loaded).toEqual(mockData)

    // Cleanup
    LocalStorageManager.clear(discussionId, userId)
  },
}

export const TestCorruptedJSON = {
  render: () => <div>Testing corrupted JSON handling...</div>,
  play: async () => {
    const discussionId = 'test-discussion-corrupt'
    const userId = 'test-user-corrupt'

    // Test: should return null for corrupted JSON
    const key = `civil-pursuit-deliberation-${discussionId}-${userId}`
    localStorage.setItem(key, 'invalid json{')

    const loaded = LocalStorageManager.load(discussionId, userId)
    expect(loaded).toBeNull()

    // Cleanup
    localStorage.removeItem(key)
  },
}

export const TestClear = {
  render: () => <div>Testing clear operation...</div>,
  play: async () => {
    const discussionId = 'test-discussion-clear'
    const userId = 'test-user-clear'
    const mockData = { test: 'clear-me' }

    // Test: should clear specific deliberation data
    LocalStorageManager.save(discussionId, userId, mockData)
    const key = `civil-pursuit-deliberation-${discussionId}-${userId}`

    expect(localStorage.getItem(key)).toBeTruthy()

    const result = LocalStorageManager.clear(discussionId, userId)
    expect(result).toBe(true)
    expect(localStorage.getItem(key)).toBeNull()
  },
}

export const TestClearDoesNotAffectOthers = {
  render: () => <div>Testing clear does not affect other data...</div>,
  play: async () => {
    const discussionId = 'test-discussion-isolation'
    const userId1 = 'test-user-1'
    const userId2 = 'test-user-2'

    // Test: should not affect other deliberation data
    LocalStorageManager.save(discussionId, userId1, { user: 'one' })
    LocalStorageManager.save(discussionId, userId2, { user: 'two' })

    LocalStorageManager.clear(discussionId, userId1)

    expect(LocalStorageManager.load(discussionId, userId1)).toBeNull()
    expect(LocalStorageManager.load(discussionId, userId2)).toEqual({ user: 'two' })

    // Cleanup
    LocalStorageManager.clear(discussionId, userId2)
  },
}

export const TestClearExpired = {
  render: () => <div>Testing clearExpired operation...</div>,
  play: async () => {
    const now = Date.now()
    const expiredTimestamp = now - 8 * 24 * 60 * 60 * 1000 // 8 days ago
    const recentTimestamp = now - 1 * 24 * 60 * 60 * 1000 // 1 day ago

    // Test: should remove all expired items
    // Add expired items
    localStorage.setItem('civil-pursuit-deliberation-test-old1-user1', JSON.stringify({ data: {}, timestamp: expiredTimestamp, discussionId: 'test-old1', userId: 'user1' }))
    localStorage.setItem('civil-pursuit-deliberation-test-old2-user2', JSON.stringify({ data: {}, timestamp: expiredTimestamp, discussionId: 'test-old2', userId: 'user2' }))

    // Add non-expired item
    localStorage.setItem('civil-pursuit-deliberation-test-recent-user3', JSON.stringify({ data: {}, timestamp: recentTimestamp, discussionId: 'test-recent', userId: 'user3' }))

    // Add non-deliberation item (should not be touched)
    localStorage.setItem('other-key-test', 'other-value')

    const cleared = LocalStorageManager.clearExpired()

    expect(cleared).toBeGreaterThanOrEqual(2)
    expect(localStorage.getItem('civil-pursuit-deliberation-test-old1-user1')).toBeNull()
    expect(localStorage.getItem('civil-pursuit-deliberation-test-old2-user2')).toBeNull()
    expect(localStorage.getItem('civil-pursuit-deliberation-test-recent-user3')).toBeTruthy()
    expect(localStorage.getItem('other-key-test')).toBe('other-value')

    // Cleanup
    localStorage.removeItem('civil-pursuit-deliberation-test-recent-user3')
    localStorage.removeItem('other-key-test')
  },
}

export const TestClearExpiredInvalidJSON = {
  render: () => <div>Testing clearExpired removes invalid JSON...</div>,
  play: async () => {
    // Test: should remove items with invalid JSON
    localStorage.setItem('civil-pursuit-deliberation-test-corrupt-user', 'invalid json{')

    const clearedBefore = LocalStorageManager.clearExpired()

    expect(localStorage.getItem('civil-pursuit-deliberation-test-corrupt-user')).toBeNull()
    expect(clearedBefore).toBeGreaterThanOrEqual(1)
  },
}

export const TestMultipleUsersInSameDiscussion = {
  render: () => <div>Testing multiple users in same discussion...</div>,
  play: async () => {
    const discussionId = 'test-shared-discussion'
    const user1 = 'test-user-1'
    const user2 = 'test-user-2'
    const data1 = { user: 'one' }
    const data2 = { user: 'two' }

    // Test: should handle multiple users in same discussion
    LocalStorageManager.save(discussionId, user1, data1)
    LocalStorageManager.save(discussionId, user2, data2)

    expect(LocalStorageManager.load(discussionId, user1)).toEqual(data1)
    expect(LocalStorageManager.load(discussionId, user2)).toEqual(data2)

    // Cleanup
    LocalStorageManager.clear(discussionId, user1)
    LocalStorageManager.clear(discussionId, user2)
  },
}

export const TestSameUserMultipleDiscussions = {
  render: () => <div>Testing same user in multiple discussions...</div>,
  play: async () => {
    const discussion1 = 'test-discussion-1'
    const discussion2 = 'test-discussion-2'
    const userId = 'test-multi-discussion-user'
    const data1 = { discussion: 'one' }
    const data2 = { discussion: 'two' }

    // Test: should handle same user in multiple discussions
    LocalStorageManager.save(discussion1, userId, data1)
    LocalStorageManager.save(discussion2, userId, data2)

    expect(LocalStorageManager.load(discussion1, userId)).toEqual(data1)
    expect(LocalStorageManager.load(discussion2, userId)).toEqual(data2)

    // Cleanup
    LocalStorageManager.clear(discussion1, userId)
    LocalStorageManager.clear(discussion2, userId)
  },
}

export const TestEmptyDataObject = {
  render: () => <div>Testing empty data object...</div>,
  play: async () => {
    const discussionId = 'test-discussion-empty'
    const userId = 'test-user-empty'

    // Test: should handle empty data object
    LocalStorageManager.save(discussionId, userId, {})
    const loaded = LocalStorageManager.load(discussionId, userId)
    expect(loaded).toEqual({})

    // Cleanup
    LocalStorageManager.clear(discussionId, userId)
  },
}

export const TestSpecialCharactersInIDs = {
  render: () => <div>Testing special characters in IDs...</div>,
  play: async () => {
    const specialDiscussion = 'discussion-with-特殊字符-émojis-🎉'
    const specialUser = 'user-with-@#$%-symbols'
    const data = { special: 'data' }

    // Test: should handle special characters in IDs
    LocalStorageManager.save(specialDiscussion, specialUser, data)
    const loaded = LocalStorageManager.load(specialDiscussion, specialUser)
    expect(loaded).toEqual(data)

    // Cleanup
    LocalStorageManager.clear(specialDiscussion, specialUser)
  },
}

export const TestLargeDataObject = {
  render: () => <div>Testing large data object...</div>,
  play: async () => {
    const discussionId = 'test-discussion-large'
    const userId = 'test-user-large'
    const largeData = {
      points: Array(100)
        .fill(null)
        .map((_, i) => ({ id: `point-${i}`, subject: `Subject ${i}`, description: `Description ${i}` })),
    }

    // Test: should handle large data objects
    const result = LocalStorageManager.save(discussionId, userId, largeData)
    expect(result).toBe(true)

    const loaded = LocalStorageManager.load(discussionId, userId)
    expect(loaded).toEqual(largeData)

    // Cleanup
    LocalStorageManager.clear(discussionId, userId)
  },
}

export const TestDefaultExport = {
  render: () => <div>Testing default export structure...</div>,
  play: async () => {
    // Test: should export all functions as default object
    expect(LocalStorageManager.isAvailable).toBeDefined()
    expect(LocalStorageManager.save).toBeDefined()
    expect(LocalStorageManager.load).toBeDefined()
    expect(LocalStorageManager.clear).toBeDefined()
    expect(LocalStorageManager.clearExpired).toBeDefined()

    expect(typeof LocalStorageManager.isAvailable).toBe('function')
    expect(typeof LocalStorageManager.save).toBe('function')
    expect(typeof LocalStorageManager.load).toBe('function')
    expect(typeof LocalStorageManager.clear).toBe('function')
    expect(typeof LocalStorageManager.clearExpired).toBe('function')
  },
}

// Styles at bottom per EnCiv coding guidelines
const useStyles = createUseStyles({
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  section: {
    marginBottom: '2rem',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '0.5rem',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#333',
  },
  input: {
    padding: '0.5rem',
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '0.25rem',
    fontSize: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
    backgroundColor: '#FFC315',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    fontSize: '1rem',
    '&:hover': {
      backgroundColor: '#e6b014',
    },
    '&:disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
  },
  output: {
    padding: '1rem',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '0.25rem',
    marginTop: '1rem',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
  info: {
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
})
