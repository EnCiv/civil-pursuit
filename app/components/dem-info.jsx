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

export default function DemInfo({ pointId, demInfo: suppliedDemInfo, className }) {
  const classes = useStyles()
  const context = useDemInfoContext()

  const data = context?.data
  const demInfo = suppliedDemInfo ?? (pointId ? data?.demInfoById?.[pointId] : undefined)
  const uischema = data?.uischema

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

  return (
    <span className={cx(classes.demInfo, className)} role="note" aria-label={`Demographic information: ${values.join(', ')}`}>
      {values.join(' • ')}
    </span>
  )
}

const useStyles = createUseStyles(theme => ({
  demInfo: {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    maxWidth: '100%',
    padding: '0.2rem 0.55rem',
    border: `0.0625rem solid ${theme.colors.secondaryDivider}`,
    borderRadius: '9999px',
    backgroundColor: theme.colors.white,
    color: theme.colors.primaryButtonBlue,
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1.4,
    overflowWrap: 'anywhere',
  },
}))
