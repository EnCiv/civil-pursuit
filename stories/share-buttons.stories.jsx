import React, { useState } from 'react'
import ShareButtons from '../app/components/share-buttons'

export default {
  title: 'Components/ShareButtons',
  component: ShareButtons,
  parameters: {
    layout: 'centered',
  },
}

/**
 * Default ShareButtons with basic URL
 */
export const Default = () => {
  const [copied, setCopied] = useState(false)

  const handleCopyClick = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 4000)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h3>Share this discussion</h3>
      <ShareButtons url="https://example.com/deliberation/12345" subject="Important Community Discussion" description="Join us in discussing the future of our community" copied={copied} onCopyClick={handleCopyClick} />
    </div>
  )
}

/**
 * ShareButtons with custom subject and description
 */
export const WithCustomContent = () => {
  const [copied, setCopied] = useState(false)

  const handleCopyClick = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 4000)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h3>Share Climate Action Discussion</h3>
      <ShareButtons
        url="https://enciv.org/climate-action"
        subject="Climate Action: What Should We Do?"
        description="We're gathering community input on local climate action initiatives. Your voice matters!"
        copied={copied}
        onCopyClick={handleCopyClick}
      />
    </div>
  )
}

/**
 * ShareButtons showing copied state
 */
export const CopiedState = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h3>Link copied to clipboard</h3>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>This story shows the "Copied!" tooltip that appears after clicking the copy link button</p>
      <ShareButtons url="https://enciv.org/discussion" subject="Community Discussion" description="Join the conversation" copied={true} onCopyClick={() => {}} />
    </div>
  )
}

/**
 * ShareButtons with minimal props
 */
export const MinimalProps = () => {
  const [copied, setCopied] = useState(false)

  const handleCopyClick = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 4000)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h3>Default subject and description</h3>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>When subject and description are not provided, the component uses default text</p>
      <ShareButtons url="https://enciv.org/discussion/minimal" copied={copied} onCopyClick={handleCopyClick} />
    </div>
  )
}

/**
 * ShareButtons in a dark background context
 */
export const DarkBackground = () => {
  const [copied, setCopied] = useState(false)

  const handleCopyClick = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 4000)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', backgroundColor: '#1a1a1a', color: 'white' }}>
      <h3>Share on Dark Background</h3>
      <p style={{ fontSize: '0.875rem', color: '#ccc' }}>Testing how the share buttons look on a dark background</p>
      <ShareButtons url="https://enciv.org/discussion/dark" subject="Discussion on Dark Background" description="Testing visibility and contrast" copied={copied} onCopyClick={handleCopyClick} />
    </div>
  )
}

/**
 * Interactive demo with working copy functionality
 */
export const InteractiveDemo = () => {
  const [copied, setCopied] = useState(false)
  const [copyCount, setCopyCount] = useState(0)

  const handleCopyClick = async () => {
    const url = 'https://enciv.org/interactive-demo'
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const ta = document.createElement('textarea')
        ta.value = url
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setCopyCount(prev => prev + 1)
      setTimeout(() => setCopied(false), 4000)
    } catch (e) {
      console.error('Copy failed:', e)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h3>Interactive Share Buttons</h3>
      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>Click the copy link button to actually copy the URL to your clipboard!</p>
      {copyCount > 0 && (
        <p style={{ fontSize: '0.875rem', color: '#0E7C7B', marginBottom: '1rem' }}>
          Link copied {copyCount} time{copyCount !== 1 ? 's' : ''}
        </p>
      )}
      <ShareButtons url="https://enciv.org/interactive-demo" subject="Interactive Demo Discussion" description="Try clicking the copy button to test the functionality" copied={copied} onCopyClick={handleCopyClick} />
    </div>
  )
}

/**
 * ShareButtons with custom className
 */
export const WithCustomClassName = () => {
  const [copied, setCopied] = useState(false)

  const handleCopyClick = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 4000)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h3>Custom styling with className</h3>
      <p style={{ fontSize: '0.875rem', color: '#666' }}>ShareButtons accepts a className prop for additional styling</p>
      <ShareButtons
        url="https://enciv.org/styled"
        subject="Styled Discussion"
        description="Testing custom className"
        copied={copied}
        onCopyClick={handleCopyClick}
        className="custom-share-buttons"
        style={{ border: '2px dashed #0E7C7B', padding: '1rem', borderRadius: '0.5rem' }}
      />
    </div>
  )
}
