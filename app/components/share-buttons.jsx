import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { EmailShareButton, FacebookShareButton, LinkedinShareButton, TwitterShareButton, EmailIcon, FacebookIcon, LinkedinIcon, TwitterIcon } from 'react-share'

/**
 * Reusable component for social media share buttons
 *
 * - `url` - The URL to share
 * - `subject` - The subject/title of the discussion
 * - `description` - Description of the discussion
 * - `copied` - Whether the copy link indicator should show
 * - `onCopyClick` - Callback for copy link button click
 * - `className` - Additional CSS classes to apply
 *
 * Returns a share button group with copy link, email, Facebook, Twitter/X, and LinkedIn
 */
const ShareButtons = ({ url, subject, description, copied, onCopyClick, className, ...otherProps }) => {
  const classes = useStylesFromThemeFunction()
  const shareTitle = subject || 'Join this important discussion'
  const shareBody = description ? `${description}\n\n${url}` : `I'd like to invite you to participate in this deliberation: ${url}`

  return (
    <div className={cx(classes.shareSection, className)} {...otherProps}>
      <div className={classes.shareButtons}>
        <button
          type="button"
          onClick={onCopyClick}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.currentTarget.click()
            }
          }}
          className={classes.copyLinkButton}
          title="Copy link to clipboard"
          aria-label="Copy link to clipboard"
        >
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="31" fill="#0E7C7B" />
            <path
              d="M28 36L22.67 30.67C20.78 28.78 20.78 25.69 22.67 23.8C24.56 21.91 27.65 21.91 29.54 23.8L34.87 29.13M34.87 29.13L40.2 34.46C42.09 36.35 42.09 39.44 40.2 41.33C38.31 43.22 35.22 43.22 33.33 41.33L28 36M34.87 29.13L28 36"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {copied && <span className={classes.copiedPopup}>Copied!</span>}
        </button>
        <EmailShareButton url={url} subject={shareTitle} body={shareBody} title="Share via email">
          <EmailIcon size={32} round />
        </EmailShareButton>
        <FacebookShareButton url={url} quote={shareTitle} title="Share on Facebook">
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <div title="Share on X">
          <TwitterShareButton url={url} title={shareTitle}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
        <div title="Share on LinkedIn">
          <LinkedinShareButton url={url} title={shareTitle} summary={shareBody}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>
      </div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  shareSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    alignItems: 'flex-start',
  },
  shareButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    alignItems: 'flex-start',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  copyLinkButton: {
    position: 'relative',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
    '&:hover': {
      opacity: 0.8,
    },
    '&:focus': {
      outline: '2px solid #0E7C7B',
      outlineOffset: '2px',
      borderRadius: '50%',
    },
  },
  copiedPopup: {
    position: 'absolute',
    left: '50%',
    bottom: '100%',
    transform: 'translateX(-50%)',
    marginBottom: '0.25rem',
    background: theme.colors.primaryButtonBlue,
    color: theme.colors.white,
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    zIndex: 1000,
    whiteSpace: 'nowrap',
  },
}))

export default ShareButtons
