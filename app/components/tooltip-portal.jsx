// https://github.com/EnCiv/civil-pursuit/issues/43

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { createUseStyles } from 'react-jss'

/**
 * Lightweight tooltip portal that replaces `@codastic/react-positioning-portal`.
 *
 * Renders `portalContent` in a fixed-position overlay anchored to the bounding
 * rect of its single child. Chooses the quadrant (top/bottom, left/right) that
 * has the most available viewport space so the tooltip never clips an edge.
 *
 * - `isOpen` - When `true` the tooltip is mounted and visible.
 * - `portalContent` - React node rendered inside the floating tooltip.
 * - `children` - Single child element used as the anchor.
 * - `offset` - Gap in px between anchor and tooltip (default `8`).
 * - `className` - Extra class applied to the tooltip container.
 *
 * Returns the anchor child with the portal appended to `document.body`.
 */
export function TooltipPortal({ isOpen, portalContent, children, offset = 8, className }) {
  const anchorRef = useRef(null)
  const [style, setStyle] = useState({})
  const classes = useStyles()

  const reposition = useCallback(() => {
    if (!anchorRef.current) return
    const rect = anchorRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Prefer placing above if there is more space above than below, else below
    const spaceAbove = rect.top
    const spaceBelow = vh - rect.bottom
    const preferAbove = spaceAbove > spaceBelow

    // Prefer placing to the left-aligned if there is more room to the right
    // (tooltip left edge aligns with anchor left edge), else right-align.
    // We don't know tooltip width yet, so use anchor centre as split heuristic.
    const anchorCentreX = rect.left + rect.width / 2
    const preferLeft = anchorCentreX < vw / 2

    const newStyle = {
      position: 'fixed',
      zIndex: 9999,
      pointerEvents: 'none',
      maxWidth: `min(20rem, ${vw - 16}px)`,
    }

    if (preferAbove) {
      newStyle.bottom = vh - rect.top + offset
    } else {
      newStyle.top = rect.bottom + offset
    }

    if (preferLeft) {
      newStyle.left = Math.max(8, rect.left)
    } else {
      newStyle.right = Math.max(8, vw - rect.right)
    }

    setStyle(newStyle)
  }, [offset])

  useLayoutEffect(() => {
    if (isOpen) reposition()
  }, [isOpen, reposition])

  // Clone child to attach the anchor ref
  const child = React.Children.only(children)
  const anchoredChild = React.cloneElement(child, {
    ref: node => {
      anchorRef.current = node
      // Forward any existing ref on the child
      const { ref } = child
      if (typeof ref === 'function') ref(node)
      else if (ref && 'current' in ref) ref.current = node
    },
  })

  return (
    <>
      {anchoredChild}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className={`${classes.tooltipContainer}${className ? ` ${className}` : ''}`} style={style} role="tooltip">
            {portalContent}
          </div>,
          document.body
        )}
    </>
  )
}

const useStyles = createUseStyles(theme => ({
  tooltipContainer: {
    background: theme?.colors?.darkModeGray ?? '#343433',
    color: theme?.colors?.white ?? '#FFF',
    borderRadius: '0.375rem',
    padding: '0.375rem 0.625rem',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    boxShadow: '0 0.25rem 0.75rem rgba(0,0,0,0.18)',
    wordBreak: 'break-word',
  },
}))

export default TooltipPortal
