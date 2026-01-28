// https://github.com/EnCiv/civil-pursuit/issues/XXX

import React from 'react'
import DemInfo from '../app/components/dem-info'
import { DemInfoProvider, DemInfoContext } from '../app/components/dem-info-context'

export default {
  component: DemInfo,
  decorators: [
    Story => (
      <DemInfoProvider>
        <Story />
      </DemInfoProvider>
    ),
  ],
}

// Sample UISchema for ordering fields
const sampleUISchema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/stateOfResidence' },
    { type: 'Control', scope: '#/properties/yearOfBirth' },
    { type: 'Control', scope: '#/properties/politicalParty' },
    { type: 'Control', scope: '#/properties/shareInfo' },
  ],
}

// Helper to setup context with data
const DemInfoWithContext = ({ pointId, demInfo, uischema }) => {
  const { upsert } = React.useContext(DemInfoContext)

  React.useEffect(() => {
    if (uischema) {
      upsert({ uischema })
    }
    if (demInfo) {
      upsert({ demInfoById: { [pointId]: demInfo } })
    }
  }, [pointId, demInfo, uischema, upsert])

  return <DemInfo pointId={pointId} />
}

export const WithMultipleFields = {
  render: () => (
    <DemInfoWithContext
      pointId="point1"
      uischema={sampleUISchema}
      demInfo={{
        stateOfResidence: 'California',
        yearOfBirth: 1985,
        politicalParty: 'Democrat',
        shareInfo: 'Yes',
      }}
    />
  ),
}

export const WithSingleField = {
  render: () => (
    <DemInfoWithContext
      pointId="point2"
      uischema={sampleUISchema}
      demInfo={{
        stateOfResidence: 'Texas',
        shareInfo: 'Yes',
      }}
    />
  ),
}

export const NoData = {
  render: () => <DemInfoWithContext pointId="point3" uischema={sampleUISchema} demInfo={null} />,
}

export const ShareInfoNo = {
  render: () => (
    <DemInfoWithContext
      pointId="point4"
      uischema={sampleUISchema}
      demInfo={{
        stateOfResidence: 'New York',
        shareInfo: 'No',
      }}
    />
  ),
}

export const UISchemaOrdering = {
  render: () => (
    <div>
      <h3>Custom UISchema Order</h3>
      <DemInfoWithContext
        pointId="point5"
        uischema={sampleUISchema}
        demInfo={{
          politicalParty: 'Republican',
          stateOfResidence: 'Florida',
          yearOfBirth: 1990,
          shareInfo: 'Yes',
        }}
      />
      <h3 style={{ marginTop: '2rem' }}>Alphabetical Fallback (no UISchema)</h3>
      <DemInfoWithContext
        pointId="point6"
        uischema={null}
        demInfo={{
          politicalParty: 'Republican',
          stateOfResidence: 'Florida',
          yearOfBirth: 1990,
          shareInfo: 'Yes',
        }}
      />
    </div>
  ),
}

export const UserIdSkipped = {
  render: () => (
    <DemInfoWithContext
      pointId="point7"
      uischema={sampleUISchema}
      demInfo={{
        userId: 'user123',
        stateOfResidence: 'Oregon',
        yearOfBirth: 1995,
        shareInfo: 'Yes',
      }}
    />
  ),
}

export const ShareInfoFieldSkipped = {
  render: () => (
    <DemInfoWithContext
      pointId="point8"
      uischema={sampleUISchema}
      demInfo={{
        stateOfResidence: 'Washington',
        yearOfBirth: 1988,
        politicalParty: 'Independent',
        shareInfo: 'Yes',
      }}
    />
  ),
}

export const InteractiveToggle = {
  render: () => {
    const [hasData, setHasData] = React.useState(true)
    const [shareInfo, setShareInfo] = React.useState('Yes')

    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => setHasData(!hasData)}>Toggle Data: {hasData ? 'ON' : 'OFF'}</button>
          <button onClick={() => setShareInfo(shareInfo === 'Yes' ? 'No' : 'Yes')} style={{ marginLeft: '1rem' }}>
            Toggle ShareInfo: {shareInfo}
          </button>
        </div>
        <DemInfoWithContext
          pointId="point9"
          uischema={sampleUISchema}
          demInfo={
            hasData
              ? {
                  stateOfResidence: 'Colorado',
                  yearOfBirth: 1992,
                  politicalParty: 'Green',
                  shareInfo,
                }
              : null
          }
        />
      </div>
    )
  },
}

export const EmptyFields = {
  render: () => (
    <DemInfoWithContext
      pointId="point10"
      uischema={sampleUISchema}
      demInfo={{
        stateOfResidence: '',
        yearOfBirth: '',
        shareInfo: 'Yes',
      }}
    />
  ),
}
