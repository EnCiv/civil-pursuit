// https://github.com/EnCiv/civil-pursuit/issues/80

import React, { useEffect, useState } from 'react'
import Point from '../app/components/point'
import PointLeadButton from '../app/components/point-lead-button'
import Theme from '../app/components/theme'
import { DemInfoProvider, DemInfoContext } from '../app/components/dem-info-context'

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
      description: 'Cras porttitor quam eros, vel auctor magna consequat vitae. Donec condimentum ac libero mollis tristique.',
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
        <Point point={{ _id: '42', subject: 'sub child', description: 'this is a point as a child of a point' }} style={{ width: '100%' }} />
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

const createPoint = (subject, description = 'Point Description', children = null, vState = 'default') => (
  <Point point={{ subject, description }} vState={vState} style={{ width: '100%' }}>
    {children}
  </Point>
)

const point6 = createPoint('Point 6', 'Point 6 Description')
const point5 = createPoint('Point 5', 'Point 5 Description', point6)
const point4 = createPoint('Point 4', 'Point 4 Description', point5)
const point3 = createPoint('Point 3', 'Point 3 Description', point4)
const point2 = createPoint('Point 2', 'Point 2 Description', point3)

export const ChildrenPointsSixLayersDeep = {
  args: {
    point: {
      subject: 'Point 2',
      description: 'Point 2 Description',
    },
    vState: 'default',
    children: point3,
  },
}

export const ChildrenPointsSevenLayersDeep = {
  args: {
    point: {
      subject: 'Point 1',
      description: 'Point 1 Description',
    },
    vState: 'default',
    children: point2,
  },
}

// DemInfo integration stories - Point already renders DemInfo internally
const PointWithDemInfoDecorator = Story => (
  <DemInfoProvider>
    <Story />
  </DemInfoProvider>
)

const PointWithDemInfoSetup = ({ pointId, demInfo, uischema, ...pointProps }) => {
  const { upsert } = React.useContext(DemInfoContext)

  React.useEffect(() => {
    if (uischema) {
      upsert({ uischema })
    }
    if (demInfo) {
      upsert({ demInfoById: { [pointId]: demInfo } })
    }
  }, [pointId, demInfo, uischema, upsert])

  return <Point {...pointProps} />
}

const demUISchema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/stateOfResidence' },
    { type: 'Control', scope: '#/properties/yearOfBirth' },
    { type: 'Control', scope: '#/properties/politicalParty' },
  ],
}

export const PointWithDemInfo = {
  decorators: [PointWithDemInfoDecorator],
  render: () => (
    <PointWithDemInfoSetup
      pointId="point1"
      point={{
        _id: 'point1',
        subject: 'Implement renewable energy infrastructure',
        description: 'We need to invest heavily in solar and wind power to reduce carbon emissions.',
      }}
      vState="default"
      uischema={demUISchema}
      demInfo={{
        stateOfResidence: 'California',
        yearOfBirth: 1985,
        politicalParty: 'Democrat',
        shareInfo: 'Yes',
      }}
    />
  ),
}

export const PointWithNoDemInfo = {
  decorators: [PointWithDemInfoDecorator],
  render: () => (
    <PointWithDemInfoSetup
      pointId="point2"
      point={{
        _id: 'point2',
        subject: 'Increase education funding',
        description: 'Schools need more resources to provide quality education.',
      }}
      vState="default"
      uischema={demUISchema}
      demInfo={null}
    />
  ),
}

export const MultiplePointsWithMixedDemInfo = {
  decorators: [PointWithDemInfoDecorator],
  render: () => {
    const { upsert } = React.useContext(DemInfoContext)

    React.useEffect(() => {
      upsert({ uischema: demUISchema })
      upsert({
        demInfoById: {
          point3: {
            stateOfResidence: 'Texas',
            yearOfBirth: 1990,
            politicalParty: 'Republican',
            shareInfo: 'Yes',
          },
          point4: null, // No dem info
          point5: {
            stateOfResidence: 'New York',
            yearOfBirth: 1975,
            politicalParty: 'Independent',
            shareInfo: 'Yes',
          },
        },
      })
    }, [upsert])

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Point
          point={{
            _id: 'point3',
            subject: 'Healthcare reform',
            description: 'We need universal healthcare coverage.',
          }}
          vState="default"
        />
        <Point
          point={{
            _id: 'point4',
            subject: 'Tax policy changes',
            description: 'Reform the tax code to be more progressive.',
          }}
          vState="default"
        />
        <Point
          point={{
            _id: 'point5',
            subject: 'Infrastructure investment',
            description: 'Modernize roads, bridges, and public transit.',
          }}
          vState="default"
        />
      </div>
    )
  },
}

export const PointWithDemInfoSelected = {
  decorators: [PointWithDemInfoDecorator],
  render: () => (
    <PointWithDemInfoSetup
      pointId="point6"
      point={{
        _id: 'point6',
        subject: 'Climate change action',
        description: 'Immediate action is needed to address climate change.',
      }}
      vState="selected"
      uischema={demUISchema}
      demInfo={{
        stateOfResidence: 'Oregon',
        yearOfBirth: 1992,
        politicalParty: 'Green',
        shareInfo: 'Yes',
      }}
    />
  ),
}
