// https://github.com/EnCiv/civil-pursuit/blob/main/docs/late-sign-up-spec.md
import React, { useContext, useEffect, useState } from 'react'
import { createUseStyles } from 'react-jss'
import { DeliberationContext, DeliberationContextProvider, useLocalStorageIfAvailable, flushRoundToServer } from '../app/components/deliberation-context'
import { DeliberationContextDecorator, buildApiDecorator } from './common'
import { within, userEvent, expect, waitFor } from '@storybook/test'
import LocalStorageManager from '../app/lib/local-storage-manager'

// Setup socket mock for all stories
function setupSocketMock() {
  if (typeof window !== 'undefined' && !window.socket) {
    window.socket = {
      on: () => {},
      emit: () => {},
    }
  }
}

setupSocketMock()

export default {
  component: DeliberationContext,
  args: {},
  decorators: [DeliberationContextDecorator],
}

const Template = props => {
  const { data = {}, upsert } = useContext(DeliberationContext)
  useEffect(() => {
    setTimeout(() => upsert(props.obj), 2000)
  })
  return (
    <div>
      upsert will be called after 2 seconds. data:
      {JSON.stringify(data, null, 2)}
    </div>
  )
}

export const ObjectCanBeUpserted = Template.bind({})
ObjectCanBeUpserted.args = { obj: { message: 'a message from the future' } }

// Interactive demo component for localStorage integration
function LocalStorageDemo() {
  const classes = useStyles()
  const { data, upsert, storageAvailable } = useContext(DeliberationContext)
  const isStorageAvailable = useLocalStorageIfAvailable()
  const [output, setOutput] = useState('')
  const [testData, setTestData] = useState(JSON.stringify({ pointById: { point1: { subject: 'Test Point' } } }, null, 2))

  const handleUpsert = () => {
    try {
      const parsed = JSON.parse(testData)
      upsert(parsed)
      setOutput('Data upserted to context and localStorage')
    } catch (e) {
      setOutput(`Error: ${e.message}`)
    }
  }

  const handleCheckStorage = () => {
    const discussionId = data.discussionId
    const userId = data.userId
    if (!discussionId || !userId) {
      setOutput('No discussionId or userId in context')
      return
    }
    const stored = LocalStorageManager.load(discussionId, userId)
    setOutput(`localStorage data:\n${JSON.stringify(stored, null, 2)}`)
  }

  const handleFlush = () => {
    const discussionId = data.discussionId
    const userId = data.userId
    if (!discussionId || !userId) {
      setOutput('No discussionId or userId in context')
      return
    }
    flushRoundToServer(discussionId, userId, (error, result) => {
      if (error) {
        setOutput(`Error: ${error.message}`)
      } else {
        setOutput(`Flush result:\n${JSON.stringify(result, null, 2)}`)
      }
    })
  }

  const handleClearStorage = () => {
    const discussionId = data.discussionId
    const userId = data.userId
    if (!discussionId || !userId) {
      setOutput('No discussionId or userId in context')
      return
    }
    const cleared = LocalStorageManager.clear(discussionId, userId)
    setOutput(`localStorage cleared: ${cleared}`)
  }

  return (
    <div className={classes.container}>
      <h1>DeliberationContext with localStorage</h1>

      <div className={classes.section}>
        <h2>Status</h2>
        <p>
          localStorage Available: <strong>{storageAvailable ? 'Yes' : 'No'}</strong>
        </p>
        <p>
          Hook Result: <strong>{isStorageAvailable ? 'Yes' : 'No'}</strong>
        </p>
        <p>
          Discussion ID: <strong>{data.discussionId || 'Not set'}</strong>
        </p>
        <p>
          User ID: <strong>{data.userId || 'Not set'}</strong>
        </p>
      </div>

      <div className={classes.section}>
        <h2>Context Data</h2>
        <pre className={classes.output}>{JSON.stringify(data, null, 2)}</pre>
      </div>

      <div className={classes.section}>
        <h2>Test Operations</h2>
        <textarea className={classes.textarea} value={testData} onChange={e => setTestData(e.target.value)} placeholder="JSON data to upsert" />
        <div className={classes.buttonGroup}>
          <button className={classes.button} onClick={handleUpsert}>
            Upsert to Context
          </button>
          <button className={classes.button} onClick={handleCheckStorage}>
            Check localStorage
          </button>
          <button className={classes.button} onClick={handleFlush}>
            Flush to Server
          </button>
          <button className={classes.button} onClick={handleClearStorage}>
            Clear localStorage
          </button>
        </div>
        <pre className={classes.output}>{output || 'No output yet'}</pre>
      </div>
    </div>
  )
}

export const LocalStorageIntegration = () => (
  <DeliberationContextProvider defaultValue={{ discussionId: 'test-discussion-123', userId: 'test-user-456' }}>
    <LocalStorageDemo />
  </DeliberationContextProvider>
)

LocalStorageIntegration.storyName = 'localStorage Integration Demo'

// Automated interaction tests
export const TestStorageAvailableOnInit = {
  render: () => {
    const TestComponent = () => {
      const { storageAvailable } = useContext(DeliberationContext)
      return <div data-testid="storage-status">{storageAvailable ? 'available' : 'unavailable'}</div>
    }
    return (
      <DeliberationContextProvider defaultValue={{ discussionId: 'test-init', userId: 'user-init' }}>
        <TestComponent />
      </DeliberationContextProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const status = canvas.getByTestId('storage-status')
    expect(status.textContent).toBe('available')
  },
}

export const TestUseLocalStorageHook = {
  render: () => {
    const TestComponent = () => {
      const isAvailable = useLocalStorageIfAvailable()
      return <div data-testid="hook-result">{isAvailable ? 'true' : 'false'}</div>
    }
    return (
      <DeliberationContextProvider defaultValue={{ discussionId: 'test-hook', userId: 'user-hook' }}>
        <TestComponent />
      </DeliberationContextProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const result = canvas.getByTestId('hook-result')
    expect(result.textContent).toBe('true')
  },
}

export const TestUpsertSavesToLocalStorage = {
  render: () => {
    const TestComponent = () => {
      const { data, upsert } = useContext(DeliberationContext)
      const [saved, setSaved] = useState(false)

      const handleTest = () => {
        upsert({ pointById: { point1: { subject: 'Test Point' } } })
        // Check localStorage after upsert
        setTimeout(() => {
          const stored = LocalStorageManager.load(data.discussionId, data.userId)
          setSaved(!!stored?.pointById?.point1)
        }, 100)
      }

      return (
        <div>
          <button data-testid="upsert-button" onClick={handleTest}>
            Upsert
          </button>
          <div data-testid="saved-status">{saved ? 'saved' : 'not-saved'}</div>
        </div>
      )
    }
    return (
      <DeliberationContextProvider defaultValue={{ discussionId: 'test-upsert', userId: 'user-upsert' }}>
        <TestComponent />
      </DeliberationContextProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByTestId('upsert-button')
    await userEvent.click(button)

    await waitFor(
      () => {
        const status = canvas.getByTestId('saved-status')
        expect(status.textContent).toBe('saved')
      },
      { timeout: 500 }
    )
  },
}

export const TestLoadFromLocalStorageOnMount = {
  render: () => {
    // Pre-populate localStorage
    const discussionId = 'test-load-mount'
    const userId = 'user-load-mount'
    LocalStorageManager.save(discussionId, userId, {
      discussionId,
      userId,
      pointById: { point1: { subject: 'Pre-saved Point' } },
    })

    const TestComponent = () => {
      const { data } = useContext(DeliberationContext)
      return <div data-testid="loaded-data">{data.pointById?.point1?.subject || 'not-loaded'}</div>
    }

    return (
      <DeliberationContextProvider defaultValue={{ discussionId, userId }}>
        <TestComponent />
      </DeliberationContextProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const loadedData = canvas.getByTestId('loaded-data')
    expect(loadedData.textContent).toBe('Pre-saved Point')

    // Cleanup
    LocalStorageManager.clear('test-load-mount', 'user-load-mount')
  },
}

export const TestFlushRoundToServer = {
  render: () => {
    const TestComponent = () => {
      const { data } = useContext(DeliberationContext)
      const [result, setResult] = useState('')

      const handleFlush = () => {
        // Pre-populate some data
        LocalStorageManager.save(data.discussionId, data.userId, {
          discussionId: data.discussionId,
          userId: data.userId,
          pointById: { point1: { subject: 'Flush Test' } },
        })

        flushRoundToServer(data.discussionId, data.userId, (error, flushResult) => {
          if (error) {
            setResult('error')
          } else {
            setResult(flushResult.flushed ? 'flushed' : 'not-flushed')
          }
        })
      }

      return (
        <div>
          <button data-testid="flush-button" onClick={handleFlush}>
            Flush
          </button>
          <div data-testid="flush-result">{result || 'pending'}</div>
        </div>
      )
    }

    return (
      <DeliberationContextProvider defaultValue={{ discussionId: 'test-flush', userId: 'user-flush' }}>
        <TestComponent />
      </DeliberationContextProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByTestId('flush-button')
    await userEvent.click(button)

    await waitFor(
      () => {
        const result = canvas.getByTestId('flush-result')
        expect(result.textContent).toBe('flushed')
      },
      { timeout: 500 }
    )

    // Verify localStorage was cleared
    const stored = LocalStorageManager.load('test-flush', 'user-flush')
    expect(stored).toBeNull()
  },
}

export const TestFlushWithNoData = {
  render: () => {
    const TestComponent = () => {
      const { data } = useContext(DeliberationContext)
      const [result, setResult] = useState('')

      const handleFlush = () => {
        // Ensure no data in localStorage
        LocalStorageManager.clear(data.discussionId, data.userId)

        flushRoundToServer(data.discussionId, data.userId, (error, flushResult) => {
          if (error) {
            setResult('error')
          } else {
            setResult(flushResult.reason || 'flushed')
          }
        })
      }

      return (
        <div>
          <button data-testid="flush-empty-button" onClick={handleFlush}>
            Flush Empty
          </button>
          <div data-testid="flush-empty-result">{result || 'pending'}</div>
        </div>
      )
    }

    return (
      <DeliberationContextProvider defaultValue={{ discussionId: 'test-flush-empty', userId: 'user-flush-empty' }}>
        <TestComponent />
      </DeliberationContextProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByTestId('flush-empty-button')
    await userEvent.click(button)

    await waitFor(
      () => {
        const result = canvas.getByTestId('flush-empty-result')
        expect(result.textContent).toBe('no-data')
      },
      { timeout: 500 }
    )
  },
}

export const TestTTLExpiration = {
  render: () => {
    const TestComponent = () => {
      const { data } = useContext(DeliberationContext)
      const [status, setStatus] = useState('initial')

      const handleTest = async () => {
        const discussionId = data.discussionId
        const userId = data.userId

        // Save data with a timestamp that's 200ms away from expiring (7 days - 200ms)
        const TTL_MS = 7 * 24 * 60 * 60 * 1000
        const almostExpiredTimestamp = Date.now() - TTL_MS + 200

        // Manually save to localStorage with old timestamp
        const key = `civil-pursuit-deliberation-${discussionId}-${userId}`
        const payload = {
          data: {
            discussionId,
            userId,
            pointById: { point1: { subject: 'Almost Expired Point' } },
          },
          timestamp: almostExpiredTimestamp,
          discussionId,
          userId,
        }
        localStorage.setItem(key, JSON.stringify(payload))

        // Verify it loads initially (still within TTL)
        const loaded = LocalStorageManager.load(discussionId, userId)
        if (loaded?.pointById?.point1) {
          setStatus('loaded-initially')
        } else {
          setStatus('failed-to-load')
          return
        }

        // Wait 300ms for it to expire
        await new Promise(resolve => setTimeout(resolve, 300))

        // Try to load again - should be expired and return null
        const loadedAfterExpiry = LocalStorageManager.load(discussionId, userId)
        if (loadedAfterExpiry === null) {
          setStatus('expired-correctly')
        } else {
          setStatus('failed-to-expire')
        }
      }

      return (
        <div>
          <button data-testid="ttl-test-button" onClick={handleTest}>
            Test TTL
          </button>
          <div data-testid="ttl-status">{status}</div>
        </div>
      )
    }

    return (
      <DeliberationContextProvider defaultValue={{ discussionId: 'test-ttl', userId: 'user-ttl' }}>
        <TestComponent />
      </DeliberationContextProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByTestId('ttl-test-button')
    await userEvent.click(button)

    // Wait for initial load verification
    await waitFor(
      () => {
        const status = canvas.getByTestId('ttl-status')
        expect(status.textContent).toBe('loaded-initially')
      },
      { timeout: 500 }
    )

    // Wait for expiration verification (300ms + buffer)
    await waitFor(
      () => {
        const status = canvas.getByTestId('ttl-status')
        expect(status.textContent).toBe('expired-correctly')
      },
      { timeout: 1000 }
    )

    // Cleanup
    LocalStorageManager.clear('test-ttl', 'user-ttl')
  },
}

export const TestClearExpiredOnInit = {
  render: () => {
    // Pre-populate localStorage with expired data
    const discussionId = 'test-clear-expired'
    const userId = 'user-clear-expired'
    const TTL_MS = 7 * 24 * 60 * 60 * 1000

    // Create expired entry
    const expiredKey = `civil-pursuit-deliberation-${discussionId}-expired`
    const expiredPayload = {
      data: { pointById: { point1: { subject: 'Expired Point' } } },
      timestamp: Date.now() - TTL_MS - 1000, // Expired 1 second ago
      discussionId,
      userId: 'expired',
    }
    localStorage.setItem(expiredKey, JSON.stringify(expiredPayload))

    // Create valid entry
    const validKey = `civil-pursuit-deliberation-${discussionId}-valid`
    const validPayload = {
      data: { pointById: { point2: { subject: 'Valid Point' } } },
      timestamp: Date.now(),
      discussionId,
      userId: 'valid',
    }
    localStorage.setItem(validKey, JSON.stringify(validPayload))

    const TestComponent = () => {
      const [result, setResult] = useState('')

      useEffect(() => {
        // Check if expired entry was cleaned up
        const expiredExists = localStorage.getItem(expiredKey) !== null
        const validExists = localStorage.getItem(validKey) !== null

        if (!expiredExists && validExists) {
          setResult('expired-cleared-valid-kept')
        } else if (expiredExists && validExists) {
          setResult('expired-not-cleared')
        } else {
          setResult('unexpected-state')
        }

        // Cleanup
        localStorage.removeItem(expiredKey)
        localStorage.removeItem(validKey)
      }, [])

      return <div data-testid="clear-expired-result">{result || 'checking'}</div>
    }

    return (
      <DeliberationContextProvider defaultValue={{ discussionId, userId }}>
        <TestComponent />
      </DeliberationContextProvider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await waitFor(
      () => {
        const result = canvas.getByTestId('clear-expired-result')
        expect(result.textContent).toBe('expired-cleared-valid-kept')
      },
      { timeout: 500 }
    )
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
  output: {
    padding: '1rem',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '0.25rem',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    maxHeight: '300px',
    overflow: 'auto',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '0.5rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '0.25rem',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#FFC315',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    fontSize: '1rem',
    '&:hover': {
      backgroundColor: '#e6b014',
    },
  },
})
