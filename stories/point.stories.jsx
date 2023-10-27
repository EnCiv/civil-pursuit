import Point from '../app/components/point'
import PointLeadButton from '../app/components/point-lead-button'
import React from 'react'

function DemInfo() {
  return (
    <div
      style={{
        color: '#5D5D5C',
        fontFamily: 'Inter',
        fontSize: '1rem',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '1.5rem',
      }}
    >
      DemInfo | Component
    </div>
  )
}

export default {
  component: Point,
  args: {
    subject: 'Phasellus diam sapien, placerat id sollicitudin eget',
    description:
      'Cras porttitor quam eros, vel auctor magna consequat vitae. Donec condimentum ac libero mollis tristique.',
  },
}

export const Primary = { args: { vState: 'default', children: <DemInfo /> } }
export const PrimaryMouseDown = { args: { vState: 'mouseDown', children: <DemInfo /> } }
export const PrimaryDisabled = { args: { vState: 'disabled' } }

export const Lead = {
  args: {
    vState: 'default',
    children: <PointLeadButton vState="default" />,
  },
}
export const LeadMouseDown = {
  args: {
    vState: 'mouseDown',
    children: <PointLeadButton vState="mouseDown" />,
  },
}

export const MultipleChildren = {
  args: {
    vState: 'default',
    children: (
      <>
        <DemInfo />
        <PointLeadButton vState="default" />
      </>
    ),
  },
}
