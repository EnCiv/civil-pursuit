'use strict'
import React from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'
import { useDemInfoContext } from './dem-info-context'

function parseUISchemaOrder(uischema) {
  if (!uischema || !uischema.elements) return null
  return uischema.elements
    .filter(e => e.type === 'Control' && typeof e.scope === 'string')
    .map(e => {
      const m = e.scope.match(/#\/properties\/(.+)$/)
      return m ? m[1] : null
    })
    .filter(Boolean)
}

export default function DemInfo({ pointId, className }) {
  const classes = useStyles()
  const context = useDemInfoContext()

  // Handle case where context isn't available (e.g., in isolated stories)
  if (!context) return null
  if (!pointId) return null

  const { data } = context
  if (!data) return null

  const demInfo = data.demInfoById?.[pointId]
  const uischema = data.uischema

  if (!demInfo) return null
  if (typeof demInfo !== 'object') return null

  const order = parseUISchemaOrder(uischema) || Object.keys(demInfo).sort()
  const values = []
  for (const key of order) {
    if (key === 'shareInfo') continue
    const v = demInfo[key]
    if (v === undefined || v === null || v === '') continue

    // Special handling for yearOfBirth: calculate age
    if (key === 'yearOfBirth') {
      const currentYear = new Date().getFullYear()
      const age = currentYear - v
      values.push(String(age))
    } else {
      values.push(String(v))
    }
  }
  if (!values.length) return null

  return <div className={cx(classes.demInfo, className)}>{values.join(' • ')}</div>
}

const useStyles = createUseStyles({
  demInfo: {
    color: 'inherit', // Inherit color from parent
    opacity: 0.6, // Make it lighter than the parent color
    fontSize: '0.85em',
    display: 'inline-block',
  },
})
