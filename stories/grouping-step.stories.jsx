// https://github.com/EnCiv/civil-pursuit/issues/198

import React, { useContext, useState } from 'react'
import GroupingStep, { GroupPoints } from '../app/components/steps/grouping'
import { onDoneDecorator, onDoneResult, DeliberationContextDecorator, deliberationContextData, socketEmitDecorator, buildApiDecorator } from './common'
import { within, userEvent, expect, waitFor } from 'storybook/test'
import { DemInfoProvider, DemInfoContext } from '../app/components/dem-info-context'

const discussionId = '1101'
const round = 0

const samplePoints = [
  { subject: 'Extend evening bus service', description: 'Run high-demand routes until midnight on Fridays and Saturdays.' },
  { subject: 'Protect bike lanes on main streets', description: 'Add physical barriers where cyclists share fast-moving traffic.' },
  { subject: 'Plant shade trees along sidewalks', description: 'Prioritize blocks with low canopy and high summer temperatures.' },
  { subject: 'Create neighborhood community gardens', description: 'Convert unused public lots into shared growing spaces.' },
  { subject: 'Expand weekend library hours', description: 'Keep branches open later on Saturdays for students and working families.' },
  { subject: 'Improve crosswalk lighting', description: 'Install brighter lighting near schools, transit stops, and senior housing.' },
  { subject: 'Offer free swim lessons', description: 'Provide instruction at city pools throughout the summer.' },
  { subject: 'Add benches near transit stops', description: 'Place durable seating at high-use stops with long wait times.' },
  { subject: 'Fund after-school arts programs', description: 'Support music, theater, and visual arts programs at local schools.' },
  { subject: 'Help households weatherize homes', description: 'Offer grants for insulation and air sealing to reduce energy costs.' },
]

const pointSubject = index => samplePoints[index].subject
const pointDescription = index => samplePoints[index].description

export default {
  component: GroupPoints,
  decorators: [onDoneDecorator],
}

const createPointDoc = (
  _id,
  subject,
  description = pointDescription(_id),
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

const pointItems = samplePoints.map(({ subject, description }, index) => createPointDoc(index, subject, description))

const getPointGroupByLead = (canvas, subject) => within(canvas.getByRole('checkbox', { name: `Select point group: ${subject}` }))

const showYourGroups = async canvas => {
  const yourGroupsTab = canvas.getByRole('tab', { name: /groups/i })
  if (yourGroupsTab.getAttribute('aria-selected') !== 'true') await userEvent.click(yourGroupsTab)
  await waitFor(() => expect(yourGroupsTab).toHaveAttribute('aria-selected', 'true'))
}

const ungroupPoint = async (canvas, subject) => {
  await showYourGroups(canvas)
  const groupedPoints = within(canvas.getByRole('group', { name: 'Your grouped responses' }))
  const card = groupedPoints.getByRole('checkbox', { name: `Select point group: ${subject}` })
  await userEvent.click(within(card).getByTitle('Ungroup'))
  await waitFor(() => expect(card.isConnected).toBe(false))
}

const selectAvailablePoint = async (canvas, subject) => {
  const availablePoints = within(canvas.getByRole('group', { name: 'Available responses to group' }))
  await userEvent.click(availablePoints.getByRole('checkbox', { name: `Select point group: ${subject}` }))
}

const selectGroupedPoint = async (canvas, subject) => {
  await showYourGroups(canvas)
  const groupedPoints = within(canvas.getByRole('group', { name: 'Your grouped responses' }))
  await userEvent.click(groupedPoints.getByRole('checkbox', { name: `Select point group: ${subject}` }))
}

const finishSelectingLead = async (canvas, subject) => {
  const picker = canvas.getByRole('region', { name: 'Select lead response' })
  const pickerContents = within(picker)
  await userEvent.click(pickerContents.getByRole('button', { name: `Select ${subject} as Lead` }))
  await userEvent.click(pickerContents.getByRole('button', { name: 'Done' }))
  await waitFor(() => expect(picker.isConnected).toBe(false))
}

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await selectAvailablePoint(canvas, pointSubject(1))
    await selectAvailablePoint(canvas, pointSubject(2))
    const createGroupButton = canvas.getByRole('button', { name: /Group Selected Responses/ })
    await userEvent.click(createGroupButton)
    await waitFor(() => expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: false,
      },
    }))
    await finishSelectingLead(canvas, pointSubject(1))
    await waitFor(() => expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: true,
        delta: [
          {
            point: {
              _id: 1,
              subject: pointSubject(1),
              description: pointDescription(1),
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [
              {
                _id: 2,
                subject: pointSubject(2),
                description: pointDescription(2),
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
    }))
    // Problem Hack - ungroup the points so this story will run again - but if you need to get the onDone data after something changes, you need to take this out.
    await ungroupPoint(canvas, pointSubject(1))
  },
}
export const canUnGroup = {
  args: {
    reducedPointList: pointItems,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await selectAvailablePoint(canvas, pointSubject(1))
    await selectAvailablePoint(canvas, pointSubject(2))
    await userEvent.click(canvas.getByRole('button', { name: /Group Selected Responses/ }))
    await finishSelectingLead(canvas, pointSubject(1))
    await ungroupPoint(canvas, pointSubject(1))
    await waitFor(() => expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: true,
        delta: [
          {
            point: {
              _id: 0,
              subject: pointSubject(0),
              description: pointDescription(0),
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
              subject: pointSubject(3),
              description: pointDescription(3),
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
              subject: pointSubject(4),
              description: pointDescription(4),
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
              subject: pointSubject(5),
              description: pointDescription(5),
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
              subject: pointSubject(6),
              description: pointDescription(6),
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
              subject: pointSubject(7),
              description: pointDescription(7),
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
              subject: pointSubject(8),
              description: pointDescription(8),
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
              subject: pointSubject(9),
              description: pointDescription(9),
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
              subject: pointSubject(2),
              description: pointDescription(2),
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
              subject: pointSubject(1),
              description: pointDescription(1),
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
    }))
  },
}

// Problem: this runs the first time, but if you go to some other story and come back to this one it fails - the pointList doesn't go back to it's initial state
export const canCreateGroupWithAGroup = {
  args: {
    reducedPointList: pointItems,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await selectAvailablePoint(canvas, pointSubject(1))
    await selectAvailablePoint(canvas, pointSubject(2))
    await userEvent.click(canvas.getByRole('button', { name: /Group Selected Responses/ }))
    await finishSelectingLead(canvas, pointSubject(1))
    await selectAvailablePoint(canvas, pointSubject(3))
    await selectGroupedPoint(canvas, pointSubject(1))
    await userEvent.click(canvas.getByRole('button', { name: /Group Selected Responses/ }))
    await finishSelectingLead(canvas, pointSubject(1))
    await waitFor(() => expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: true,
        delta: [
          {
            point: {
              _id: 1,
              subject: pointSubject(1),
              description: pointDescription(1),
              demInfo: {
                dob: '1990-10-20T00:00:00.000Z',
                state: 'NY',
                party: 'Independent',
              },
            },
            group: [
              {
                _id: 3,
                subject: pointSubject(3),
                description: pointDescription(3),
                demInfo: {
                  dob: '1990-10-20T00:00:00.000Z',
                  state: 'NY',
                  party: 'Independent',
                },
              },
              {
                _id: 2,
                subject: pointSubject(2),
                description: pointDescription(2),
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
    }))
    // Problem Hack - ungroup the points so this story will run again - but if you need to get the onDone data after something changes, you need to take this out.
    await ungroupPoint(canvas, pointSubject(1))
  },
}

// Problem: this runs the first time, but if you go to some other story and come back to this one it fails - the groupPoints doesn't go back to it's initial state
export const canRemoveOnePointFromAGroup = {
  args: {
    reducedPointList: pointItems,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await selectAvailablePoint(canvas, pointSubject(1))
    await selectAvailablePoint(canvas, pointSubject(2))
    await userEvent.click(canvas.getByRole('button', { name: /Group Selected Responses/ }))
    await finishSelectingLead(canvas, pointSubject(1))
    await selectAvailablePoint(canvas, pointSubject(3))
    await selectGroupedPoint(canvas, pointSubject(1))
    await userEvent.click(canvas.getByRole('button', { name: /Group Selected Responses/ }))
    await finishSelectingLead(canvas, pointSubject(1))
    await userEvent.click(getPointGroupByLead(canvas, pointSubject(1)).getByTitle('Edit Lead Point'))
    await userEvent.click(getPointGroupByLead(canvas, pointSubject(1)).getByTitle(`Remove from Group: ${pointSubject(2)}`))
    await waitFor(() => expect(onDoneResult(canvas)).toMatchObject({
      onDoneResult: {
        valid: true,
        delta: [
          { point: { _id: 0, subject: pointSubject(0), description: pointDescription(0), demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 4, subject: pointSubject(4), description: pointDescription(4), demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 5, subject: pointSubject(5), description: pointDescription(5), demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 6, subject: pointSubject(6), description: pointDescription(6), demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 7, subject: pointSubject(7), description: pointDescription(7), demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 8, subject: pointSubject(8), description: pointDescription(8), demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 9, subject: pointSubject(9), description: pointDescription(9), demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          { point: { _id: 2, subject: pointSubject(2), description: pointDescription(2), demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }, group: [] },
          {
            point: { _id: 1, subject: pointSubject(1), description: pointDescription(1), demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } },
            group: [{ _id: 3, subject: pointSubject(3), description: pointDescription(3), demInfo: { dob: '1990-10-20T00:00:00.000Z', state: 'NY', party: 'Independent' } }],
          },
        ],
      },
    }))
    // Problem Hack - ungroup the points so this story will run again - but if you need to get the onDone data after something changes, you need to take this out.
    await ungroupPoint(canvas, pointSubject(1))
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
      subject: pointSubject(0),
      description: pointDescription(0),
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
      subject: pointSubject(4),
      description: pointDescription(4),
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
      subject: pointSubject(5),
      description: pointDescription(5),

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await selectAvailablePoint(canvas, pointSubject(1))
    await selectAvailablePoint(canvas, pointSubject(2))
    await userEvent.click(canvas.getByRole('button', { name: /Group Selected Responses/ }))
    const picker = canvas.getByRole('region', { name: 'Select lead response' })
    await userEvent.click(within(picker).getByTitle('Ungroup and close'))
    // make sure they are still there
    const availablePoints = within(canvas.getByRole('group', { name: 'Available responses to group' }))
    expect(await availablePoints.findByRole('checkbox', { name: `Select point group: ${pointSubject(1)}` })).toBeTruthy()
    expect(await availablePoints.findByRole('checkbox', { name: `Select point group: ${pointSubject(2)}` })).toBeTruthy()
    await waitFor(() => expect(picker.isConnected).toBe(false))
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
  decorators: [DeliberationContextDecorator, socketEmitDecorator],
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
      // Each DemInfoProvider has its own requestedById tracking
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
