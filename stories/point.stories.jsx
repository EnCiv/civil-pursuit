import Point from '../app/components/point'
import PointLeadButton from '../app/components/point-lead-button'
import React from 'react'

export default {
  component: Point,
  args: {
    subject: 'Phasellus diam sapien, placerat id sollicitudin eget',
    description:
      'Cras porttitor quam eros, vel auctor magna consequat vitae. Donec condimentum ac libero mollis tristique.',
  },
}

export const Primary = { args: { vState: 'default' } }
export const PrimaryMouseDown = { args: { vState: 'mouseDown' } }
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

// to do: implement test for clicking (mousedown)
// group stories
// better/more convetional names
