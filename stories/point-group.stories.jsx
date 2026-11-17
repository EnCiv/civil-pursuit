import React from 'react'
import PointGroup from '../app/components/point-group'
import { onDoneDecorator } from './common'
import { within, userEvent, expect } from 'storybook/test'
import DemInfo from '../app/components/dem-info'

export default {
  component: PointGroup,
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
    _id,
    subject,
    description,
    demInfo,
  }
}

const createPointGroupDoc = (point, group = []) => {
  return { point, group }
}

const pointDoc1 = createPointDoc('1', 'Fix cracked sidewalks before winter', 'Repair damaged pavement so people using wheelchairs, strollers, or canes can travel safely.')
const pointDoc2 = createPointDoc('2', 'Run buses more often after work', 'Extend evening service and shorten waits so late-shift workers can get home without needing a car.', {
  dob: '1980-10-20T00:00:00.000Z',
  state: 'GA',
  party: 'Independent',
})
const pointDoc3 = createPointDoc('3', 'Add safer crossings near schools', 'Improve crosswalks, signs, and traffic calming where children walk to class.', {
  dob: '1995-10-20T00:00:00.000Z',
  state: 'CA',
  party: 'Independent',
})
const pointDoc4 = createPointDoc('4', 'Make childcare easier to afford', 'Expand local childcare slots and lower costs for families with young children.')
const pointDoc6 = createPointDoc('6', 'Keep library branches open later', 'Extend evening hours so students and working residents can use library services.')
const pointDoc5 = createPointDoc('5', 'Plant shade trees along busy streets', 'Choose hardy trees for sidewalks and parks to cool walking routes during summer.')
const pointGroupDoc5 = createPointGroupDoc(pointDoc5, [pointDoc2, pointDoc3, pointDoc4, pointDoc6])

export const DefaultSinglePoint = { args: { pointGroup: createPointGroupDoc(pointDoc1), vState: 'default' } }
export const SelectedSinglePoint = { args: { pointGroup: createPointGroupDoc(pointDoc1), vState: 'default', select: true } }
export const EditSinglePoint = { args: { pointGroup: createPointGroupDoc(pointDoc1), vState: 'edit' } }

export const defaultMultiplePoints = { args: { pointGroup: pointGroupDoc5, vState: 'default' } }
export const selectedDefaultMultiplePoints = { args: { pointGroup: pointGroupDoc5, vState: 'default', select: true } }
export const editMultiplePoints = { args: { pointGroup: pointGroupDoc5, vState: 'edit' } }
export const selectedEditMultiplePoints = { args: { pointGroup: pointGroupDoc5, vState: 'edit', select: true } }

export const mobileSinglePoint = {
  args: { pointGroup: createPointGroupDoc(pointDoc1), vState: 'default' },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const selectedEditMultiplePointsWithChildren = {
  args: {
    pointGroup: pointGroupDoc5,
    vState: 'edit',
    select: true,
    children: [<DemInfo dob="1995-10-20T00:00:00.000Z" state="CA" party="Independent" />],
  },
}

export const mobileDefaultPoints = {
  args: { pointGroup: pointGroupDoc5, vState: 'default' },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const collapsedPoints = {
  args: { pointGroup: pointGroupDoc5, vState: 'collapsed' },
}

export const selectLeadPoints = {
  args: { pointGroup: { point: pointDoc1, group: [pointDoc2, pointDoc3, pointDoc4, pointDoc6] }, vState: 'selectLead' },
}

export const mobileSelectLeadPoints = {
  args: { pointGroup: pointGroupDoc5, vState: 'selectLead' },
  parameters: {
    viewport: {
      defaultViewport: 'iphonex',
    },
  },
}

export const selectLeadPoint3OnDone = {
  args: { pointGroup: pointGroupDoc5, vState: 'selectLead' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const SelectedPoint = canvas.getByTitle('Select as Lead: Add safer crossings near schools')
    await userEvent.click(SelectedPoint)
    const DoneButton = canvas.getByTitle('Done')
    await userEvent.click(DoneButton)

    expect(args.onDone.mock.calls[0][0]).toMatchObject({
      valid: true,
      value: {
        pointGroup: {
          point: pointDoc3,
          group: [pointDoc2, pointDoc4, pointDoc6],
        },
      },
    })
  },
}

export const selectLeadUngroupOnDone = {
  args: { pointGroup: pointGroupDoc5, vState: 'selectLead' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByTitle('Ungroup and close')
    await userEvent.click(element)

    expect(args.onDone.mock.calls[0][0]).toMatchObject({
      valid: true,
      value: {
        removedPgs: [
          { point: pointDoc2 },
          { point: pointDoc3 },
          { point: pointDoc4 },
          { point: pointDoc6 },
        ],

      },
    })
  },
}

export const editMultiplePointsRemovePoint3OnDone = {
  args: { pointGroup: pointGroupDoc5, vState: 'edit' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByTitle('Remove from Group: Add safer crossings near schools')
    await userEvent.click(element)

    expect(args.onDone.mock.calls[0][0]).toMatchObject({
      valid: true,
      value: {
        pointGroup: {
          point: pointDoc5,
          group: [pointDoc2, pointDoc4, pointDoc6],
        },
          removedPgs: [
            {
              point: pointDoc3,
              group: [],
            },
          ],
        },
    })
  },
}
