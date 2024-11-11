// https://github.com/EnCiv/civil-pursuit/issues/215
import { deriveReducedPointList } from '../deliberation-context'

const parentId = '1001'
const data = { reducedPointList: [] }
const local = {}
describe('test deriveReducedPointList', () => {
  test('initially no points in list', () => {
    const { reducedPointList } = deriveReducedPointList(data, local)
    expect(reducedPointList).toMatchObject([])
  })
  test('called with no changes should give the same ref', () => {
    const oldReducedPointList = data.reducedPointList
    const { reducedPointList } = deriveReducedPointList(data, local)
    expect(reducedPointList).toBe(oldReducedPointList)
  })
  test('called with emtpy data should give the same ref', () => {
    data.pointById = {}
    data.groupIdsLists = []
    const oldReducedPointList = data.reducedPointList
    const { reducedPointList } = deriveReducedPointList(data, local)
    expect(reducedPointList).toBe(oldReducedPointList)
  })
  test('pointIds but not groupIdsList generates a list', () => {
    const points = [
      { _id: '1', subject: '1', description: 'describe 1', parentId },
      { _id: '2', subject: '2', description: 'd2', parentId },
      { _id: '3', subject: '3', description: 'd3', parentId },
      { _id: '4', subject: '4', description: 'd4', parentId },
      { _id: '5', subject: '5', description: 'd5', parentId },
      { _id: '6', subject: '6', description: 'd6', parentId },
    ]
    data.pointById = points.reduce((pointById, point) => ((pointById[point._id] = point), pointById), {})
    const { reducedPointList } = deriveReducedPointList(data, local)
    expect(reducedPointList).toMatchObject(
      points.map(point => ({
        point,
      }))
    )
  })
  test('if a point is updated, a new pointById ref is returned, but unchanged points have unchanged refs', () => {
    const oldReducedPointList = deriveReducedPointList(data, local).reducedPointList
    const oldPointRefs = Object.values(data.pointById)
    data.pointById['1'] = { _id: '1', subject: '1', description: 'updated d1', parentId }
    data.pointById = { ...data.pointById } // needs a new ref because it changed
    const { reducedPointList } = deriveReducedPointList(data, local)
    expect(reducedPointList).not.toBe(oldReducedPointList)
    expect(reducedPointList[0].point).not.toBe(oldPointRefs[0])
    for (let i = 1; i <= 5; i++) {
      expect(reducedPointList[i].point).toBe(oldPointRefs[i])
    }
  })
  test('grouping points', () => {
    const oldReducedPointList = deriveReducedPointList(data, local).reducedPointList
    data.groupIdsLists = [
      ['1', '2'],
      ['3', '4', '5'],
    ]
    const { reducedPointList } = deriveReducedPointList(data, local)
    expect(reducedPointList).not.toBe(oldReducedPointList)
    expect(reducedPointList).toEqual([
      {
        point: { _id: '1', subject: '1', description: 'updated d1', parentId },
        group: [{ _id: '2', subject: '2', description: 'd2', parentId }],
      },
      {
        point: { _id: '3', subject: '3', description: 'd3', parentId },
        group: [
          { _id: '4', subject: '4', description: 'd4', parentId },
          { _id: '5', subject: '5', description: 'd5', parentId },
        ],
      },
      { point: { _id: '6', subject: '6', description: 'd6', parentId } },
    ])
  })
  test('grouping can change', () => {
    const oldReducedPointList = deriveReducedPointList(data, local).reducedPointList
    const oldLastPoint = oldReducedPointList[2]
    data.groupIdsLists = [
      ['1', '2', '4'],
      ['3', '5'],
    ]
    const { reducedPointList } = deriveReducedPointList(data, local)
    expect(reducedPointList).not.toBe(oldReducedPointList)
    expect(reducedPointList).toEqual([
      {
        point: { _id: '1', subject: '1', description: 'updated d1', parentId },
        group: [
          { _id: '2', subject: '2', description: 'd2', parentId },
          { _id: '4', subject: '4', description: 'd4', parentId },
        ],
      },
      {
        point: { _id: '3', subject: '3', description: 'd3', parentId },
        group: [{ _id: '5', subject: '5', description: 'd5', parentId }],
      },
      { point: { _id: '6', subject: '6', description: 'd6', parentId } },
    ])
    expect(oldLastPoint).toBe(reducedPointList[2])
  })
  test('a point in a group is updated', () => {
    const oldReducedPointList = deriveReducedPointList(data, local).reducedPointList
    const oldLastPoint = oldReducedPointList[2]
    data.pointById['2'] = { _id: '2', subject: '2 child of 1', description: 'updated d2 in group', parentId }
    data.pointById = { ...data.pointById } // needs a new ref
    const { reducedPointList } = deriveReducedPointList(data, local)
    expect(reducedPointList).not.toBe(oldReducedPointList)
    expect(reducedPointList).toEqual([
      {
        point: { _id: '1', subject: '1', description: 'updated d1', parentId },
        group: [
          { _id: '2', subject: '2 child of 1', description: 'updated d2 in group', parentId },
          { _id: '4', subject: '4', description: 'd4', parentId },
        ],
      },
      {
        point: { _id: '3', subject: '3', description: 'd3', parentId },
        group: [{ _id: '5', subject: '5', description: 'd5', parentId }],
      },
      { point: { _id: '6', subject: '6', description: 'd6', parentId } },
    ])
    expect(oldLastPoint).toBe(reducedPointList[2])
  })
  test('can be ungrouped', () => {
    const oldReducedPointList = deriveReducedPointList(data, local).reducedPointList
    const oldFirstPoint = oldReducedPointList[0]
    data.groupIdsLists = [['1', '2', '4']]
    const { reducedPointList } = deriveReducedPointList(data, local)
    expect(reducedPointList).not.toBe(oldReducedPointList)
    expect(reducedPointList).toEqual([
      {
        point: { _id: '1', subject: '1', description: 'updated d1', parentId },
        group: [
          { _id: '2', subject: '2 child of 1', description: 'updated d2 in group', parentId },
          { _id: '4', subject: '4', description: 'd4', parentId },
        ],
      },
      {
        point: { _id: '3', subject: '3', description: 'd3', parentId },
      },
      { point: { _id: '5', subject: '5', description: 'd5', parentId } },
      { point: { _id: '6', subject: '6', description: 'd6', parentId } },
    ])
    expect(oldFirstPoint).toBe(reducedPointList[0])
  })
})
