// https://github.com/EnCiv/civil-pursuit/issues/199

import { derivePointRankGroupList } from '../rank'

jest.mock('react', () => {
  const obj = {}
  return {
    // every call to useRef in this file will use the state from the first call plus updates along the way
    // the real React code throws because it's not inside a render
    useRef: jest.fn(val => (typeof obj.current === 'undefined' && (obj.current = val), obj)),
    // mocking these so it will build - they aren't used
    createElement: jest.fn(),
    createContext: jest.fn(),
    forwardRef: jest.fn(),
  }
})

// mock these so it will build - they aren't used
jest.mock('react-jss', () => {
  return {
    createUseStyles: jest.fn(),
  }
})

// Button uses this one
jest.mock('@codastic/react-positioning-portal', () => {
  return {
    PositioningPortal: jest.fn(),
  }
})

// Points and others use LEVEL and H from here
jest.mock('react-accessible-headings', () => {
  return {
    H: jest.fn(),
    Level: jest.fn(),
  }
})

const data = {}
describe('Test derivePointRankGroupList()', () => {
  test('If the input data is empty, object is not created', () => {
    const { pointRankGroupList } = derivePointRankGroupList(data)
    expect(pointRankGroupList).toBe(undefined)
  })

  test("No change to ref if data doesn't change", () => {
    data.reducedPointList = [
      { point: { _id: '1', subject: '1', description: '1' }, group: [] },
      { point: { _id: '2', subject: '2', description: '2' }, group: [] },
      {
        point: { _id: '3', subject: '3', description: '3' },
        group: [
          { _id: '4', subject: '4', description: '4' },
          { _id: '5', subject: '5', description: '5' },
        ],
      },
    ]

    const { pointRankGroupList } = derivePointRankGroupList(data)
    expect(pointRankGroupList).toStrictEqual(data.reducedPointList)

    const newRankGroupList = derivePointRankGroupList(data).pointRankGroupList
    expect(newRankGroupList).toBe(pointRankGroupList)
  })

  test("If a point changes, the ref changes and it's parent ref, but other refs not changed.", () => {
    const { pointRankGroupList } = derivePointRankGroupList(data)
    const savedPointRankGroupList = [...pointRankGroupList]
    const savedPoints = pointRankGroupList.map(pRGL => pRGL.point)

    data.reducedPointList = [...data.reducedPointList] // copy first because the ref (not a copy) is saved in local in the deriver
    data.reducedPointList[1] = { point: { ...data.reducedPointList[1].point }, group: data.reducedPointList[1].group }

    const newRankGroupList = derivePointRankGroupList(data).pointRankGroupList

    expect(newRankGroupList).not.toBe(pointRankGroupList)
    expect(newRankGroupList).toEqual(pointRankGroupList)
    expect(newRankGroupList[0]).toBe(savedPointRankGroupList[0])
    expect(newRankGroupList[1]).not.toBe(savedPointRankGroupList[1])
    expect(newRankGroupList[2]).toBe(savedPointRankGroupList[2])

    expect(newRankGroupList[0].point).toBe(savedPoints[0])
    expect(newRankGroupList[1].point).not.toBe(savedPoints[1]) // this point's ref was changed
    expect(newRankGroupList[2].point).toBe(savedPoints[2])
  })

  test('pre ranks can be added, and parent refs are updated', () => {
    const { pointRankGroupList } = derivePointRankGroupList(data)
    const savedPointRankGroupList = { ...pointRankGroupList }
    data.preRankByParentId = {
      1: { _id: '4', category: 'most', parentId: '1', stage: 'pre' },
      2: { _id: '5', category: 'neutral', parentId: '2', stage: 'pre' },
      3: { _id: '6', category: 'least', parentId: '3', stage: 'pre' },
    }
    const newPointRankGroupList = derivePointRankGroupList(data).pointRankGroupList
    expect(newPointRankGroupList).toMatchObject([
      { point: { _id: '1', subject: '1', description: '1' }, group: [], rank: { _id: '4', category: 'most', parentId: '1', stage: 'pre' } },
      { point: { _id: '2', subject: '2', description: '2' }, group: [], rank: { _id: '5', category: 'neutral', parentId: '2', stage: 'pre' } },
      {
        point: { _id: '3', subject: '3', description: '3' },
        group: [
          { _id: '4', subject: '4', description: '4' },
          { _id: '5', subject: '5', description: '5' },
        ],
        rank: { _id: '6', category: 'least', parentId: '3', stage: 'pre' },
      },
    ])
    expect(newPointRankGroupList[0]).not.toBe(savedPointRankGroupList[0])
    expect(newPointRankGroupList[1]).not.toBe(savedPointRankGroupList[1])
    expect(newPointRankGroupList[2]).not.toBe(savedPointRankGroupList[2])
  })

  test("If a rank changes, it's ref and it's parent ref change, but other refs stay the same", () => {
    const { pointRankGroupList } = derivePointRankGroupList(data)

    const savedPointRankGroupList = { ...pointRankGroupList }
    const savedPoints = pointRankGroupList.map(pRGL => pRGL.point)
    const savedRanks = pointRankGroupList.map(pRGL => pRGL.rank)
    data.preRankByParentId = { ...data.preRankByParentId } // copy first because the ref (not a copy) is saved in local in the deriver
    data.preRankByParentId[1] = { _id: '4', category: 'neutral', parentId: '1', stage: 'pre' }

    const newPointRankGroupList = derivePointRankGroupList(data).pointRankGroupList

    expect(newPointRankGroupList).toMatchObject([
      { point: { _id: '1', subject: '1', description: '1' }, group: [], rank: { _id: '4', category: 'neutral', parentId: '1', stage: 'pre' } },
      { point: { _id: '2', subject: '2', description: '2' }, group: [], rank: { _id: '5', category: 'neutral', parentId: '2', stage: 'pre' } },
      {
        point: { _id: '3', subject: '3', description: '3' },
        group: [
          { _id: '4', subject: '4', description: '4' },
          { _id: '5', subject: '5', description: '5' },
        ],
        rank: { _id: '6', category: 'least', parentId: '3', stage: 'pre' },
      },
    ])

    expect(newPointRankGroupList[0]).not.toBe(savedPointRankGroupList[0])
    expect(newPointRankGroupList[1]).toBe(savedPointRankGroupList[1])
    expect(newPointRankGroupList[2]).toBe(savedPointRankGroupList[2])
    newPointRankGroupList.forEach((pRGL, i) => {
      expect(pRGL.point).toBe(savedPoints[i])
    })
    expect(newPointRankGroupList[0].rank).not.toBe(savedRanks[0])
    expect(newPointRankGroupList[1].rank).toBe(savedRanks[1])
    expect(newPointRankGroupList[2].rank).toBe(savedRanks[2])
  })
})
