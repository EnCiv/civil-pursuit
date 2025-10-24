// https://github.com/EnCiv/civil-pursuit/issues/198

import React, { useContext, useState } from 'react'
import GroupingStep, { GroupPoints } from '../app/components/steps/grouping'
import { onDoneDecorator, onDoneResult, DeliberationContextDecorator, deliberationContextData, socketEmitDecorator, buildApiDecorator } from './common'
import { within, userEvent, expect, waitFor } from '@storybook/test'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'
import { DemInfoProvider, DemInfoContext } from '../app/components/dem-info-context'
import { resetRequestedById } from '../app/components/hooks/use-fetch-dem-info'

const discussionId = '1101'
const round = 0

export default {
  component: GroupPoints,
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
  decorators: [onDoneDecorator],
}

const createPointDoc = (
  _id,
  subject,
  description = 'Point Description',
  demInfo = {
    dob: '1990-10-20T00:00:00.000Z',
    state: 'NY',
    party: 'Independent',
  }
) => {
  return {
    point: {
      _id,
      subject,
      description,
      demInfo,
    },
    group: [],
  }
}

const pointItems = Array.from({ length: 10 }, (_, index) => createPointDoc(index, 'Point ' + index, 'Point Description ' + index))

function groupingPointsToContext(groupingPoints) {
  const cn = {
    ...groupingPoints.reduce(
      (cn, gp) => {
        // context, reviewPoint
        cn.pointById[gp.point._id] = gp.point
        return cn
      },
      { pointById: {}, groupIdsLists: [] }
    ),
  }
  return cn
}

export const Empty = {
  args: {},
}

export const Desktop = {
  args: {
    reducedPointList: pointItems,
  },
}

export const Mobile = {
  args: {
    reducedPointList: pointItems,

    onDone: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const canCreateGroup = {
  args: {
    reducedPointList: pointItems,
  },
  decorators: [onDoneDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const point1 = canvas.getByText('Point 1')
    await userEvent.click(point1)
    const point2 = canvas.getByText('Point 2')
    await userEvent.click(point2)
    const CreateGroup = canvas.getByText('Create Group')
    await userEvent.click(CreateGroup)
    expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: false,
      },
    })
    const selectAsLead = canvas.getByTitle('Select as Lead: Point 1')
    await userEvent.click(selectAsLead)
    await userEvent.click(canvas.getByTitle('Done'))
    expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: true,
        delta: [
          {
            point: {
              _id: 1,
              subject: 'Point 1',
              description: 'Point Description 1',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [
              {
                _id: 2,
                subject: 'Point 2',
                description: 'Point Description 2',
                demInfo: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
            ],
          },
        ],
      },
    })
    // Problem Hack - ungroup the points so this story will run again - but if you need to get the onDone data after something changes, you need to take this out.
    await userEvent.click(canvas.getByTitle('Ungroup'))
  },
}
export const canUnGroup = {
  args: {
    reducedPointList: pointItems,
  },
  decorators: [onDoneDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Point 1'))
    await userEvent.click(canvas.getByText('Point 2'))
    await userEvent.click(canvas.getByText('Create Group'))
    await userEvent.click(canvas.getByTitle('Select as Lead: Point 1'))
    await userEvent.click(canvas.getByTitle('Done'))
    await userEvent.click(canvas.getByTitle('Ungroup'))
    expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: true,
        delta: [
          {
            point: {
              _id: 0,
              subject: 'Point 0',
              description: 'Point Description 0',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 3,
              subject: 'Point 3',
              description: 'Point Description 3',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 4,
              subject: 'Point 4',
              description: 'Point Description 4',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 5,
              subject: 'Point 5',
              description: 'Point Description 5',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 6,
              subject: 'Point 6',
              description: 'Point Description 6',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 7,
              subject: 'Point 7',
              description: 'Point Description 7',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 8,
              subject: 'Point 8',
              description: 'Point Description 8',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 9,
              subject: 'Point 9',
              description: 'Point Description 9',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 2,
              subject: 'Point 2',
              description: 'Point Description 2',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
          {
            point: {
              _id: 1,
              subject: 'Point 1',
              description: 'Point Description 1',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [],
          },
        ],
      },
    })
  },
}

// Problem: this runs the first time, but if you go to some other story and come back to this one it fails - the pointList doesn't go back to it's initial state
export const canCreateGroupWithAGroup = {
  args: {
    reducedPointList: pointItems,
  },
  decorators: [onDoneDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Point 1'))
    await userEvent.click(canvas.getByText('Point 2'))
    await userEvent.click(canvas.getByText('Create Group'))
    await userEvent.click(canvas.getByTitle('Select as Lead: Point 1'))
    await userEvent.click(canvas.getByTitle('Done'))
    await userEvent.click(canvas.getByText('Point 3'))
    await userEvent.click(canvas.getByText('Point 1'))
    await userEvent.click(canvas.getByText('Create Group'))
    await userEvent.click(canvas.getByTitle('Select as Lead: Point 1'))
    await userEvent.click(canvas.getByTitle('Done'))
    expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: true,
        delta: [
          {
            point: {
              _id: 1,
              subject: 'Point 1',
              description: 'Point Description 1',
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [
              {
                _id: 3,
                subject: 'Point 3',
                description: 'Point Description 3',
                demInfo: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
              {
                _id: 2,
                subject: 'Point 2',
                description: 'Point Description 2',
                demInfo: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
            ],
          },
        ],
      },
    })
    // Problem Hack - ungroup the points so this story will run again - but if you need to get the onDone data after something changes, you need to take this out.
    await userEvent.click(canvas.getByTitle('Ungroup'))
  },
}

// Problem: this runs the first time, but if you go to some other story and come back to this one it fails - the groupPoints doesn't go back to it's initial state
export const canRemoveOnePointFromAGroup = {
  args: {
    reducedPointList: pointItems,
  },
  decorators: [onDoneDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Point 1'))
    await userEvent.click(canvas.getByText('Point 2'))
    await userEvent.click(canvas.getByText('Create Group'))
    await userEvent.click(canvas.getByTitle('Select as Lead: Point 1'))
    await userEvent.click(canvas.getByTitle('Done'))
    await userEvent.click(canvas.getByText('Point 3'))
    await userEvent.click(canvas.getByText('Point 1'))
    await userEvent.click(canvas.getByText('Create Group'))
    await userEvent.click(canvas.getByTitle('Select as Lead: Point 1'))
    await userEvent.click(canvas.getByTitle('Done'))
    await userEvent.click(canvas.getByTitle('Edit'))
    await userEvent.click(canvas.getByTitle('Remove from Group: Point 2'))
    expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: true,
        delta: [
          { point: { _id: 0, subject: 'Point 0', description: 'Point Description 0', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 4, subject: 'Point 4', description: 'Point Description 4', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 5, subject: 'Point 5', description: 'Point Description 5', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 6, subject: 'Point 6', description: 'Point Description 6', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 7, subject: 'Point 7', description: 'Point Description 7', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 8, subject: 'Point 8', description: 'Point Description 8', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 9, subject: 'Point 9', description: 'Point Description 9', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 2, subject: 'Point 2', description: 'Point Description 2', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          {
            point: { _id: 1, subject: 'Point 1', description: 'Point Description 1', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } },
            group: [{ _id: 3, subject: 'Point 3', description: 'Point Description 3', demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }],
          },
        ],
      },
    })
    // Problem Hack - ungroup the points so this story will run again - but if you need to get the onDone data after something changes, you need to take this out.
    await userEvent.click(canvas.getByTitle('Ungroup'))
  },
}

function getGroupingArgsFrom(groupingPoints) {
  const cn = groupingPointsToContext(groupingPoints)
  const { pointById, ...defaultValue } = { ...cn, round, discussionId }
  return { pointById, defaultValue }
}

const groupingPoints = [
  {
    point: {
      _id: 0,
      subject: 'Point 0',
      description: 'Point Description 0',
      demInfo: {
        dob: '1990-10-20T00:00:00.000Z',
        state: 'NY',
        party: 'Independent',
      },
    },
    group: [],
  },
  {
    point: {
      _id: 4,
      subject: 'Point 4',
      description: 'Point Description 4',
      demInfo: {
        dob: '1990-10-20T00:00:00.000Z',
        state: 'NY',
        party: 'Independent',
      },
    },
    group: [],
  },
  {
    point: {
      _id: 5,
      subject: 'Point 5',
      description: 'Point Description 5',

      demInfo: {
        dob: '1990-10-20T00:00:00.000Z',
        state: 'NY',
        party: 'Independent',
      },
    },
    group: [],
  },
]

export const canStartGroupingTheXOut = {
  args: {
    reducedPointList: pointItems,
  },
  decorators: [onDoneDecorator],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('Point 1'))
    await userEvent.click(canvas.getByText('Point 2'))
    await userEvent.click(canvas.getByText('Create Group'))
    await userEvent.click(canvas.getByTitle('Ungroup and close'))
    // make sure they are still there
    canvas.getByText('Point 1')
    canvas.getByText('Point 2')
  },
}

const groupingStepTemplate = args => {
  const { pointById, ...otherArgs } = args

  useState(() => {
    // execute this code once, before the component is initally rendered
    // the api call will provide the new data for this step
    window.socket._socketEmitHandlers['get-points-for-round'] = (discussionId, round, cb) => {
      window.socket._socketEmitHandlerResults['get-points-for-round'] = [discussionId, round]
      setTimeout(() => {
        const points = Object.values(pointById)
        cb([points])
      })
    }
    window.socket._socketEmitHandlers['post-point-groups'] = (rank, cb) => {
      window.socket._socketEmitHandlerResults['post-point-groups'] = rank
      cb && cb()
    }
  })
  return <GroupingStep {...otherArgs} />
}
export const groupingStepWithPartialDataAndUserUpdate = {
  args: { ...getGroupingArgsFrom(groupingPoints) },
  decorators: [DeliberationContextDecorator, socketEmitDecorator, onDoneDecorator],
  render: groupingStepTemplate,
}

// Test that fetchDemInfo is called after get-points-for-round
export const groupingStepFetchesDemInfo = {
  args: { ...getGroupingArgsFrom(groupingPoints) },
  decorators: [
    Story => (
      <DemInfoProvider>
        <Story />
      </DemInfoProvider>
    ),
    DeliberationContextDecorator,
    buildApiDecorator('get-points-for-round', (discussionId, round, cb) => {
      const points = groupingPoints.map(gp => gp.point)
      cb(points)
    }),
    buildApiDecorator('get-dem-info', (pointIds, cb) => {
      const demInfo = {}
      pointIds.forEach(id => {
        demInfo[id] = {
          stateOfResidence: 'California',
          politicalParty: 'Democrat',
          shareInfo: 'Yes',
        }
      })
      cb(demInfo)
    }),
  ],
  render: args => {
    const { defaultValue, ...otherArgs } = args

    // Set up uischema in DemInfoContext
    const demInfoContext = React.useContext(DemInfoContext)
    const demInfoUpsert = demInfoContext?.upsert

    React.useEffect(() => {
      if (demInfoUpsert) {
        demInfoUpsert({
          uischema: {
            type: 'VerticalLayout',
            elements: [
              { type: 'Control', scope: '#/properties/stateOfResidence' },
              { type: 'Control', scope: '#/properties/politicalParty' },
            ],
          },
        })
      }
    }, [demInfoUpsert])

    return (
      <>
        <GroupingStep round={round} {...otherArgs} />
        {/* Hidden div to expose DemInfoContext data for testing */}
        {demInfoContext && (
          <div data-testid="dem-info-context-data" style={{ display: 'none' }}>
            {JSON.stringify(demInfoContext.data)}
          </div>
        )}
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for get-points-for-round to be called
    await waitFor(() => {
      expect(window.socket._socketEmitHandlerResults['get-points-for-round']).toBeDefined()
      const [calledDiscussionId, calledRound] = window.socket._socketEmitHandlerResults['get-points-for-round'][0]
      expect([calledDiscussionId, calledRound]).toEqual([discussionId, round])
    })

    // Wait for get-dem-info to be called with the correct point IDs
    await waitFor(() => {
      expect(window.socket._socketEmitHandlerResults['get-dem-info']).toBeDefined()
      const [calledPointIds] = window.socket._socketEmitHandlerResults['get-dem-info'][0]
      expect(calledPointIds).toBeDefined()
      expect(calledPointIds.length).toBeGreaterThan(0)
      // Should include all point IDs from groupingPoints
      const expectedIds = groupingPoints.map(gp => gp.point._id)
      expect(calledPointIds.sort()).toEqual(expectedIds.sort())
    })

    // Verify dem-info is in the context
    await waitFor(() => {
      const demInfoDiv = canvas.getByTestId('dem-info-context-data')
      const demInfoData = JSON.parse(demInfoDiv.textContent)

      // Check that demInfoById has data for the points
      expect(demInfoData.demInfoById).toBeDefined()
      const pointIds = groupingPoints.map(gp => gp.point._id)
      pointIds.forEach(id => {
        expect(demInfoData.demInfoById[id]).toEqual({
          stateOfResidence: 'California',
          politicalParty: 'Democrat',
          shareInfo: 'Yes',
        })
      })
    })
  },
}

// Test that get-dem-info is only called once even when same points are fetched again
export const groupingStepCachesDemInfo = {
  args: { ...getGroupingArgsFrom(groupingPoints) },
  decorators: [
    Story => {
      // Reset the static requestedById cache before this test runs
      useState(() => {
        resetRequestedById()
      })
      return (
        <DemInfoProvider>
          <Story />
        </DemInfoProvider>
      )
    },
    DeliberationContextDecorator,
    buildApiDecorator('get-points-for-round', (discussionId, round, cb) => {
      // Always return the same points regardless of round
      const points = groupingPoints.map(gp => gp.point)
      cb(points)
    }),
    buildApiDecorator('get-dem-info', (pointIds, cb) => {
      const demInfo = {}
      pointIds.forEach(id => {
        demInfo[id] = {
          stateOfResidence: 'California',
          politicalParty: 'Democrat',
          shareInfo: 'Yes',
        }
      })
      cb(demInfo)
    }),
  ],
  render: args => {
    const { defaultValue, ...otherArgs } = args

    // Set up uischema in DemInfoContext
    const demInfoContext = React.useContext(DemInfoContext)
    const demInfoUpsert = demInfoContext?.upsert

    // Track which round we're rendering
    const [currentRound, setCurrentRound] = React.useState(0)

    React.useEffect(() => {
      if (demInfoUpsert) {
        demInfoUpsert({
          uischema: {
            type: 'VerticalLayout',
            elements: [
              { type: 'Control', scope: '#/properties/stateOfResidence' },
              { type: 'Control', scope: '#/properties/politicalParty' },
            ],
          },
        })
      }
    }, [demInfoUpsert])

    return (
      <>
        <GroupingStep round={currentRound} {...otherArgs} />
        {/* Hidden div to expose DemInfoContext data and control for testing */}
        {demInfoContext && (
          <>
            <div data-testid="dem-info-context-data" style={{ display: 'none' }}>
              {JSON.stringify(demInfoContext.data)}
            </div>
            <button data-testid="change-round-button" onClick={() => setCurrentRound(1)} style={{ display: 'none' }}>
              Change Round
            </button>
          </>
        )}
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Wait for initial get-points-for-round call (round 0)
    await waitFor(() => {
      expect(window.socket._socketEmitHandlerResults['get-points-for-round']).toBeDefined()
      expect(window.socket._socketEmitHandlerResults['get-points-for-round'].length).toBe(1)
    })

    // Wait for initial get-dem-info call
    await waitFor(() => {
      expect(window.socket._socketEmitHandlerResults['get-dem-info']).toBeDefined()
      expect(window.socket._socketEmitHandlerResults['get-dem-info'].length).toBe(1)
    })

    // Verify initial dem-info is in context
    await waitFor(() => {
      const demInfoDiv = canvas.getByTestId('dem-info-context-data')
      const demInfoData = JSON.parse(demInfoDiv.textContent)
      expect(demInfoData.demInfoById).toBeDefined()
      const pointIds = groupingPoints.map(gp => gp.point._id)
      pointIds.forEach(id => {
        expect(demInfoData.demInfoById[id]).toBeDefined()
      })
    })

    // Change round to trigger second get-points-for-round call
    const changeRoundButton = canvas.getByTestId('change-round-button')
    await userEvent.click(changeRoundButton)

    // Wait for second get-points-for-round call (round 1, same points)
    await waitFor(() => {
      expect(window.socket._socketEmitHandlerResults['get-points-for-round'].length).toBe(2)
      const [calledDiscussionId, calledRound] = window.socket._socketEmitHandlerResults['get-points-for-round'][1]
      expect([calledDiscussionId, calledRound]).toEqual([discussionId, 1])
    })

    // Verify get-dem-info was NOT called a second time (still only 1 call)
    await waitFor(() => {
      expect(window.socket._socketEmitHandlerResults['get-dem-info'].length).toBe(1)
    })

    // Verify dem-info is still in context (not lost)
    await waitFor(() => {
      const demInfoDiv = canvas.getByTestId('dem-info-context-data')
      const demInfoData = JSON.parse(demInfoDiv.textContent)
      expect(demInfoData.demInfoById).toBeDefined()
      const pointIds = groupingPoints.map(gp => gp.point._id)
      pointIds.forEach(id => {
        expect(demInfoData.demInfoById[id]).toEqual({
          stateOfResidence: 'California',
          politicalParty: 'Democrat',
          shareInfo: 'Yes',
        })
      })
    })
  },
}
