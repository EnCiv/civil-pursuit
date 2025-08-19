import React, { useState, useRef, useEffect } from 'react'
import { createUseStyles } from 'react-jss'

function PairWise({ children }) {
  const childArray = React.Children.toArray(children)
  const classes = useStyles()
  const containerRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const placeholderLeftRef = useRef(null)
  const placeholderRightRef = useRef(null)

  const [leftIndex, setLeftIndex] = useState(childArray.length > 0 ? 0 : null)
  const [rightIndex, setRightIndex] = useState(childArray.length > 1 ? 1 : null)
  // nextIndex is the index of the next child to bring in; null when none
  const [nextIndex, setNextIndex] = useState(childArray.length > 2 ? 2 : null)

  const [incoming, setIncoming] = useState(null) // { index, wrapper, inner }
  const [animating, setAnimating] = useState(false)
  const [singleOverlay, setSingleOverlay] = useState(null)
  const [singleCentered, setSingleCentered] = useState(false)
  const [singleMeta, setSingleMeta] = useState(null)

  // derived: whether exactly two visible slots remain (both left and right non-null)
  const isLastTwo = leftIndex != null && rightIndex != null && nextIndex == null

  // If the component is used with a single child (story single), compute a slot-like width
  // so the single story renders the same centered width/position as the final state.
  useEffect(() => {
    if (childArray.length !== 1) return
    if (singleCentered) return
    const container = containerRef.current
    if (!container) return
    const cRect = container.getBoundingClientRect()
    const rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const gapPx = 1 * rootFont // 1rem grid gap used in styles
    const paddingLeft = parseFloat(getComputedStyle(container).paddingLeft) || rootFont
    const slotWidth = Math.max(0, Math.round((cRect.width - paddingLeft * 2 - gapPx) / 2))
    setSingleMeta({ index: 0, width: slotWidth, height: null })
    setSingleCentered(true)
  }, [childArray.length])

  useEffect(() => {
    if (childArray.length === 0) {
      setLeftIndex(null)
      setRightIndex(null)
      setNextIndex(null)
    } else if (childArray.length === 1) {
      setLeftIndex(0)
      setRightIndex(null)
      setNextIndex(null)
    } else {
      setLeftIndex(i => (i == null ? 0 : Math.min(i, childArray.length - 1)))
      setRightIndex(i => (i == null ? 1 : Math.min(i, childArray.length - 1)))
      setNextIndex(n => (childArray.length > 2 ? Math.min(n || 2, childArray.length - 1) : null))
    }
  }, [children])

  // watch for situation where only one slot is visible and animate it to center
  useEffect(() => {
    const visibleCount = (leftIndex != null ? 1 : 0) + (rightIndex != null ? 1 : 0)
    if (visibleCount !== 1) {
      // cleanup any single overlay state, but don't clear an already-completed centered state
      if (singleOverlay && !singleCentered) {
        setSingleOverlay(null)
      }
      return
    }

    // already centered statically
    if (singleCentered) return

    // if an overlay was already created (final-click path), don't create another one
    if (singleOverlay) return

    // determine which side has the card: prefer actual DOM presence to handle index swaps
    const leftSlotEl = leftRef.current
    const rightSlotEl = rightRef.current
    let side = null
    if (leftSlotEl && leftSlotEl.querySelector('[data-pair-item="true"]')) side = 'left'
    else if (rightSlotEl && rightSlotEl.querySelector('[data-pair-item="true"]')) side = 'right'
    else side = leftIndex != null ? 'left' : 'right'

    const slotRef = side === 'left' ? leftRef : rightRef
    const slotEl = slotRef.current
    const container = containerRef.current
    if (!slotEl || !container) return

    const cardEl = slotEl.querySelector('[data-pair-item="true"]') || slotEl
    const cRect = container.getBoundingClientRect()
    const cardRect = cardEl.getBoundingClientRect()

    const startLeft = cardRect.left - cRect.left
    const startTop = cardRect.top - cRect.top
    const width = cardRect.width
    const height = cardRect.height
    const centerLeft = Math.round((cRect.width - width) / 2)

    const overlay = {
      index: leftIndex != null ? leftIndex : rightIndex,
      style: {
        position: 'absolute',
        left: `${startLeft}px`,
        top: `${startTop}px`,
        width: `${width}px`,
        height: `${height}px`,
        transition: 'left 600ms ease',
        pointerEvents: 'none',
        zIndex: 70,
      },
      targetLeft: centerLeft,
      width,
      height,
    }

    setSingleOverlay(overlay)

    // animate to center
    requestAnimationFrame(() => {
      setSingleOverlay(o => (o ? { ...o, style: { ...o.style, left: `${o.targetLeft}px` } } : o))
      setTimeout(() => {
        // after animation, save metadata and show static centered representation
        setSingleMeta({ index: overlay.index, width: overlay.width, height: overlay.height })
        // remove slot indexes so slots stop rendering immediately
        setLeftIndex(null)
        setRightIndex(null)
        setSingleCentered(true)
        setSingleOverlay(null)
      }, 650)
    })
  }, [leftIndex, rightIndex])

  const startReplace = clickedSide => {
    if (animating) return
    // If there's no next child to bring in, treat this as the final step:
    // animate the clicked card out and leave the other card as the sole remaining one.
    if (nextIndex == null) {
      const container = containerRef.current
      const placeholderEl = clickedSide === 'left' ? placeholderLeftRef.current : placeholderRightRef.current
      const targetSlotEl = clickedSide === 'left' ? leftRef.current : rightRef.current
      if (!container || !placeholderEl || !targetSlotEl) return

      const cardEl = targetSlotEl.querySelector('[data-pair-item="true"]') || targetSlotEl
      const outgoingEl = cardEl || targetSlotEl
      if (!outgoingEl) return

      // create overlay from the remaining slot (the one NOT clicked) so that the remaining card
      // slides to center while the clicked card slides out. If the other slot is missing, fallback to outgoing.
      const cRect = container.getBoundingClientRect()
      const otherSlotEl = clickedSide === 'left' ? rightRef.current : leftRef.current
      const otherCardEl = otherSlotEl ? otherSlotEl.querySelector('[data-pair-item="true"]') || otherSlotEl : null
      const overlaySourceEl = otherCardEl || outgoingEl
      const rRect = overlaySourceEl.getBoundingClientRect()
      const startLeft = rRect.left - cRect.left
      const startTop = rRect.top - cRect.top
      const overlayIndex = otherCardEl ? (clickedSide === 'left' ? rightIndex : leftIndex) : clickedSide === 'left' ? leftIndex : rightIndex
      const overlay = {
        index: overlayIndex,
        style: {
          position: 'absolute',
          left: `${startLeft}px`,
          top: `${startTop}px`,
          width: `${rRect.width}px`,
          height: `${rRect.height}px`,
          transition: 'left 600ms ease',
          pointerEvents: 'none',
          zIndex: 70,
        },
        targetLeft: Math.round((cRect.width - rRect.width) / 2),
        width: rRect.width,
        height: rRect.height,
      }
      setSingleOverlay(overlay)

      const oRect = outgoingEl.getBoundingClientRect()
      const moveDir = clickedSide === 'left' ? -1 : 1
      const offscreenX = moveDir * (cRect.width + oRect.width)

      outgoingEl.style.transition = 'transform 600ms ease'
      outgoingEl.style.transform = `translate(${offscreenX}px, 0)`
      setAnimating(true)

      // animate overlay to center while outgoing moves out; finalize after
      requestAnimationFrame(() => setSingleOverlay(o => (o ? { ...o, style: { ...o.style, left: `${o.targetLeft}px` } } : o)))
      setTimeout(() => {
        // after overlay animation completes, save metadata and show static centered representation
        setSingleMeta({ index: overlay.index, width: overlay.width, height: overlay.height })
        // remove the clicked side, leaving the other side as the sole card
        if (clickedSide === 'left') setLeftIndex(null)
        else setRightIndex(null)
        setSingleCentered(true)
        setSingleOverlay(null)
        setAnimating(false)
      }, 650)

      return
    }
    const container = containerRef.current
    const placeholderEl = clickedSide === 'left' ? placeholderLeftRef.current : placeholderRightRef.current
    const targetSlotEl = clickedSide === 'left' ? leftRef.current : rightRef.current

    if (!container || !placeholderEl || !targetSlotEl) return

    const cRect = container.getBoundingClientRect()
    const pRect = placeholderEl.getBoundingClientRect()
    // find the actual card element inside the slot (we mark it with data-pair-item)
    const cardEl = targetSlotEl.querySelector('[data-pair-item="true"]') || null
    const cardRect = cardEl ? cardEl.getBoundingClientRect() : targetSlotEl.getBoundingClientRect()
    const outgoingEl = cardEl || targetSlotEl
    if (!outgoingEl) return
    const oRect = outgoingEl.getBoundingClientRect()

    const incomingIndex = nextIndex

    // Determine sizes and start positions
    const incomingWidth = cardRect.width
    const incomingHeight = cardRect.height
    const placeholderHeight = pRect.height

    const wrapperStartLeft = pRect.left - cRect.left
    const wrapperStartTop = pRect.bottom - cRect.top - placeholderHeight
    const wrapperTargetTop = cardRect.top - cRect.top

    const innerStartTop = -(incomingHeight - placeholderHeight)
    const innerTargetTop = 0

    const moveDir = clickedSide === 'left' ? -1 : 1
    const offscreenX = moveDir * (cRect.width + oRect.width)

    const wrapperInitial = {
      position: 'absolute',
      width: `${incomingWidth}px`,
      left: `${wrapperStartLeft}px`,
      top: `${wrapperStartTop}px`,
      height: `${placeholderHeight}px`,
      overflow: 'hidden',
      transition: 'top 600ms ease, height 600ms ease',
      zIndex: 60,
    }

    const innerInitial = {
      position: 'relative',
      top: `${innerStartTop}px`,
      transition: 'top 600ms ease',
    }

    setIncoming({ index: incomingIndex, wrapper: wrapperInitial, inner: innerInitial })
    setAnimating(true)

    requestAnimationFrame(() => {
      outgoingEl.style.transition = 'transform 600ms ease'
      outgoingEl.style.transform = `translate(${offscreenX}px, 0)`

      setIncoming(inc =>
        inc
          ? {
              ...inc,
              wrapper: { ...inc.wrapper, top: `${wrapperTargetTop}px`, height: `${incomingHeight}px` },
              inner: { ...inc.inner, top: `${innerTargetTop}px` },
            }
          : inc
      )

      setTimeout(() => {
        if (clickedSide === 'left') setLeftIndex(incomingIndex)
        else setRightIndex(incomingIndex)

        setNextIndex(n => {
          const next = (n == null ? 0 : n) + 1
          return next >= childArray.length ? null : next
        })

        outgoingEl.style.transition = ''
        outgoingEl.style.transform = ''

        setIncoming(null)
        setAnimating(false)
      }, 650)
    })
  }

  const renderSlot = side => {
    const idx = side === 'left' ? leftIndex : rightIndex
    const slotRef = side === 'left' ? leftRef : rightRef
    const placeholderRef = side === 'left' ? placeholderLeftRef : placeholderRightRef

    return (
      <div className={classes.slot} ref={slotRef}>
        <div ref={placeholderRef} className={classes.placeholder} style={singleOverlay || isLastTwo ? { border: 'none', background: 'transparent' } : undefined} />
        {idx != null ? (
          <div className={classes.itemWrapper} onClick={() => startReplace(side)}>
            <div data-pair-item="true" className={classes.item} style={(singleOverlay && singleOverlay.index === idx) || singleCentered ? { visibility: 'hidden' } : undefined}>
              {childArray[idx]}
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  if (childArray.length === 0) return null

  if (childArray.length === 1) {
    const rawChild = childArray[0]
    const finalChild = React.isValidElement(rawChild) ? React.cloneElement(rawChild, { style: { ...(rawChild.props && rawChild.props.style ? rawChild.props.style : {}), height: 'auto', minHeight: 0 } }) : rawChild

    return (
      <div className={classes.container} ref={containerRef}>
        <div className={classes.centerSingle}>
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            {/* keep placeholder vertical space so card sits at the same vertical position */}
            <div style={{ height: '2rem', marginBottom: '0.5rem' }} />
            <div className={classes.item} style={{ width: singleMeta ? `${singleMeta.width}px` : '50%', flex: '0 0 auto', height: 'auto', minHeight: 0, margin: '0 auto' }}>
              {finalChild}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If we've animated the last remaining card into the center, only render that centered view
  if (singleCentered) {
    const finalIndex = singleMeta ? singleMeta.index : leftIndex != null ? leftIndex : rightIndex
    const rawChild = childArray[finalIndex]
    const finalChild = React.isValidElement(rawChild) ? React.cloneElement(rawChild, { style: { ...(rawChild.props && rawChild.props.style ? rawChild.props.style : {}), height: 'auto', minHeight: 0 } }) : rawChild

    return (
      <div className={classes.container} ref={containerRef}>
        <div className={classes.centerSingle}>
          <div style={{ width: '100%', boxSizing: 'border-box' }}>
            {/* keep placeholder vertical space so final card stays at same vertical position */}
            <div style={{ height: '2rem', marginBottom: '0.5rem' }} />
            <div
              className={classes.item}
              style={{
                width: singleMeta ? `${singleMeta.width}px` : '50%',
                flex: '0 0 auto',
                height: 'auto',
                minHeight: 0,
                margin: '0 auto',
              }}
            >
              {finalChild}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.container} ref={containerRef}>
      <div className={classes.grid}>
        {renderSlot('left')}
        {renderSlot('right')}
      </div>

      {incoming ? (
        <div className={classes.incoming} style={incoming.wrapper}>
          <div style={incoming.inner} className={classes.item}>
            {childArray[incoming.index]}
          </div>
        </div>
      ) : null}
      {singleOverlay ? (
        <div style={singleOverlay.style} className={classes.item}>
          {childArray[singleOverlay.index]}
        </div>
      ) : null}
      {/* singleCentered handled earlier via early return; no duplicate render here */}
    </div>
  )
}

export default PairWise

// styles placed at bottom per request
const useStyles = createUseStyles(theme => ({
  container: {
    padding: '1rem',
    boxSizing: 'border-box',
    position: 'relative',
  },
  grid: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'stretch',
  },
  slot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  placeholder: {
    height: '2rem',
    border: '1px solid #ccc',
    borderBottom: 'none',
    borderRadius: [0, 0, 8, 8],
    boxSizing: 'border-box',
    marginBottom: '0.5rem',
    background: '#fafafa',
  },
  itemWrapper: {
    flex: 1,
    display: 'flex',
    minHeight: 0,
  },
  item: {
    flex: 1,
    border: '1px solid #ccc',
    borderRadius: 8,
    padding: '0.5rem',
    boxSizing: 'border-box',
    overflow: 'hidden',
    background: '#fff',
  },
  incoming: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  centerSingle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
