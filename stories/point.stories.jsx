import React, { useEffect, useState } from 'react'
import Point from '../app/components/point'
import PointLeadButton from '../app/components/point-lead-button'
import Theme from '../app/components/theme'

const DemInfoTestComponent = props => {
  const { vState } = props
  const theme = Theme
  return (
    <div
      style={{
        color: vState === 'selected' ? theme.colors.success : '#5D5D5C',
        ...theme.font,
        fontSize: '1rem',
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
    point: {
      subject: 'Phasellus diam sapien, placerat id sollicitudin eget',
      description:
        'Cras porttitor quam eros, vel auctor magna consequat vitae. Donec condimentum ac libero mollis tristique.',
      demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' },
    },
  },
}

// Empty, in the case that the component data is loading:
export const Empty = () => {
  return <Point />
}
export const PrimaryDefault = {
  args: { vState: 'default' },
}
export const PrimarySelected = {
  args: { vState: 'selected' },
}
export const PrimaryDisabled = { args: { vState: 'disabled' } }

export const Lead = {
  args: {
    vState: 'default',
    children: <PointLeadButton vState="default" />,
  },
}
export const LeadSelected = {
  args: {
    vState: 'selected',
    children: <PointLeadButton vState="selected" />,
  },
}

export const MultipleChildren = {
  args: {
    vState: 'default',
    children: (
      <>
        <PointLeadButton vState="default" />
        <Point
          point={{ _id: '42', subject: 'sub child', description: 'this is a point as a child of a point' }}
          style={{ width: '100%' }}
        />
      </>
    ),
  },
}

export const MultipleChildrenSelected = {
  args: {
    vState: 'selected',
    children: (
      <>
        <PointLeadButton />
        <PointLeadButton />
        <PointLeadButton />
      </>
    ),
  },
}

export const ParentsWidth = args => {
  return (
    <div style={{ width: '33.5625rem' }}>
      <Point
        {...args}
        vState={'default'}
        children={
          <>
            <PointLeadButton vState="default" />
          </>
        }
      />
    </div>
  )
}

export const Collapsed = {
  args: { vState: 'collapsed' },
}

export const Secondary = args => {
  return <Point {...args} vState={'secondary'} />
}

export const LoadingLoop = () => {
  const [isLoading, setIsLoading] = useState(true)

  return <Point vState={'loading'} isLoading={isLoading} />
}

export const LoadingThenLoads = args => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  return <Point vState={isLoading ? 'loading' : 'default'} isLoading={isLoading} {...args} />
}
