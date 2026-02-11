// https://github.com/EnCiv/civil-pursuit/issues/100
// https://github.com/EnCiv/civil-pursuit/issues/221
// https://github.com/EnCiv/civil-pursuit/issues/224

/**
 * # QuestionBox
 *
 * A styled container for displaying questions with optional tagline, subject, description, and children.
 *
 * ## Props
 *
 * - `className` (string, default: '') - Additional CSS class names to apply to the outer container
 * - `subject` (string, default: '') - Main subject/title text displayed prominently
 * - `description` (string, default: '') - Description text that supports Markdown formatting
 * - `contentAlign` (string, default: 'center') - Alignment for content ('center', 'left', or 'right')
 * - `tagline` (string, default: '') - Optional tagline displayed above the subject
 * - `children` (React.ReactNode|Array, optional) - Child components to render below the description
 *
 * ## Children Behavior
 *
 * - Each child element is rendered as a separate row in a flex column layout
 * - Children are cloned and receive merged className props including alignment styles
 * - **Children must accept className prop and spread it to their outer element**
 * - The `contentAlign` prop controls horizontal alignment (justifyContent) of each child
 * - Can pass children as an array prop or use JSX children syntax
 *
 * ## Examples
 *
 * Using JSX children syntax:
 * ```jsx
 * <QuestionBox subject="Question?" contentAlign="left">
 *   <StatusBadge name="100 participants" />
 *   <PrimaryButton>Continue</PrimaryButton>
 * </QuestionBox>
 * ```
 *
 * Using children as array prop:
 * ```jsx
 * <QuestionBox
 *   subject="Question?"
 *   contentAlign="center"
 *   children={[<StatusBadge />, <PrimaryButton />]}
 * />
 * ```
 *
 * See stories in question-box.stories.jsx for more examples.
 */

import React, { useState, useRef, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Markdown from 'markdown-to-jsx'
import SvgChevronUp from '../svgr/chevron-up'
import SvgChevronDown from '../svgr/chevron-down'

/**
 * Extract OG image URL from metaTags array
 *
 * - `metaTags` - Array of meta tag strings like: `property="og:image" content="https://..."`
 *
 * Returns the content URL from the og:image meta tag, or `null` if not found
 */
function extractOgImage(metaTags) {
  if (!metaTags || !Array.isArray(metaTags)) return null

  const ogImageTag = metaTags.find(tag => tag.includes('og:image'))
  if (!ogImageTag) return null

  const contentMatch = ogImageTag.match(/content="([^"]+)"/)
  return contentMatch ? contentMatch[1] : null
}

const maxDescriptionHeight = 5 // rem

const QuestionBox = props => {
  const { className = '', subject = '', description = '', contentAlign = 'center', tagline = '', metaTags = [], children = [], ...otherProps } = props
  const classes = useStylesFromThemeFunction({ ...props, contentAlign })
  const ogImage = extractOgImage(metaTags)
  const [isExpanded, setIsExpanded] = useState(true)
  const [showToggle, setShowToggle] = useState(false)
  const descriptionRef = useRef(null)

  useEffect(() => {
    if (descriptionRef.current && description) {
      const descriptionHeight = descriptionRef.current.scrollHeight
      const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const collapsedHeightInPixels = maxDescriptionHeight * remInPixels
      setShowToggle(descriptionHeight > collapsedHeightInPixels)
    }
  }, [description])

  return (
    <div className={cx(classes.questionBox, className)} {...otherProps}>
      <div className={classes.topic}>
        {ogImage && <img src={ogImage} alt="" className={classes.ogImage} />}
        {tagline && <div className={classes.fixedText}>{tagline}</div>}
        <h1 className={classes.subject}>{subject}</h1>
        <div>
          <div ref={descriptionRef} className={cx(classes.description, { [classes.collapsed]: !isExpanded })}>
            <Markdown>{description}</Markdown>
          </div>
          {showToggle && (
            <button className={classes.toggleButton} onClick={() => setIsExpanded(!isExpanded)} aria-label={isExpanded ? 'Collapse description' : 'Expand description'} title={isExpanded ? 'Collapse' : 'Expand'}>
              {isExpanded ? <SvgChevronUp /> : <SvgChevronDown />}
            </button>
          )}
        </div>
        <div className={classes.children}>
          {React.Children.map(children, (child, index) =>
            child
              ? React.cloneElement(child, {
                  key: index,
                  ...child.props,
                  className: cx(child.props?.className, classes.item, classes[`align${contentAlign.charAt(0).toUpperCase() + contentAlign.slice(1)}`]),
                })
              : null
          )}
        </div>
      </div>
    </div>
  )
}

const useStylesFromThemeFunction = createUseStyles(theme => ({
  questionBox: {
    position: 'relative',
    borderRadius: '1.875rem',
    border: `0.0625rem solid ${theme.colors.secondaryDivider}`,
    backgroundColor: 'rgba(235, 235, 235, 0.4)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: props => (props.contentAlign === 'center' ? 'center' : props.contentAlign === 'left' ? 'flex-start' : 'flex-end'),
    padding: '3.625rem 9.875rem',
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      padding: '3.1875rem 1.5625rem',
      borderRadius: '0',
    },
  },

  topic: {
    textAlign: props => props.contentAlign,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  fixedText: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '1.0625rem',
    lineHeight: '1.5625rem',
    letterSpacing: '0.01em',
    color: theme.colors.primaryButtonBlue,
    textAlign: props => props.contentAlign,
    whiteSpace: 'nowrap',
  },

  subject: {
    marginBlockStart: '0',
    marginBlockEnd: '0',
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: '3.75rem',
    lineHeight: '4.125rem',
    letterSpacing: '-0.03em',
    color: theme.colors.primaryButtonBlue,
    textAlign: props => props.contentAlign,
    [`@media (max-width: ${theme.condensedWidthBreakPoint})`]: {
      fontSize: '3rem',
      lineHeight: '3.3rem',
    },
  },

  description: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: '1.5rem',
    color: theme.colors.primaryButtonBlue,
    textAlign: 'left',
    transition: 'max-height 0.3s ease-in-out, overflow 0.3s ease-in-out',
  },
  collapsed: {
    maxHeight: `${maxDescriptionHeight}rem`,
    overflow: 'hidden',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '2rem',
      background: 'linear-gradient(to bottom, transparent, rgba(235, 235, 235, 0.9))',
    },
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: theme.colors.primaryButtonBlue,
    transition: 'transform 0.2s ease',
    width: 'fit-content',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    '&:focus': {
      outline: `2px solid ${theme.colors.primaryButtonBlue}`,
      outlineOffset: '2px',
      borderRadius: '0.25rem',
    },
  },
  ogImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
  },
  children: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    padding: '1rem 0',
  },
  item: {
    display: 'flex',
    flex: 1,
    gap: '1rem',
  },
  alignCenter: {
    justifyContent: 'center',
  },
  alignLeft: {
    justifyContent: 'flex-start',
  },
  alignRight: {
    justifyContent: 'flex-end',
  },
}))

export default QuestionBox
