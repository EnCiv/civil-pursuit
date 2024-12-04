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
  test('Input data empty.', () => {
    const { pointRankGroupList } = derivePointRankGroupList(data)
    expect(pointRankGroupList).toBe(undefined)
  })

  test("No change to ref if data doesn't change", () => {
    data.reducedPointList = [
      { point: { _id: '1', groupedPoints: [], subject: '1', description: '1' } },
      { point: { _id: '2', groupedPoints: [], subject: '2', description: '2' } },
      {
        point: {
          _id: '3',
          groupedPoints: [{ _id: '4', groupedPoints: [], subject: '4', description: '4' }],
          subject: '3',
          description: '3',
        },
      },
    ]

    const { pointRankGroupList } = derivePointRankGroupList(data)
    expect(pointRankGroupList).toStrictEqual(data.reducedPointList)

    const newRankGroupList = derivePointRankGroupList(data).pointRankGroupList
    expect(newRankGroupList).toBe(pointRankGroupList)
  })

  test('Change to ref if point changes.', () => {
    const pointRankGroupList = derivePointRankGroupList(data)

    data.reducedPointList[1] = { point: { ...data.reducedPointList[1].point } }
    data.reducedPointList = [...data.reducedPointList]

    const newRankGroupList = derivePointRankGroupList(data)
    expect(newRankGroupList).not.toBe(pointRankGroupList)
    expect(newRankGroupList).toEqual(pointRankGroupList)
  })

  test('Test works with pre ranks.', () => {
    data.preRankByParentId = {
      1: { _id: '4', category: 'most', parentId: '1', stage: 'pre' },
      2: { _id: '5', category: 'neutral', parentId: '2', stage: 'pre' },
      3: { _id: '6', category: 'least', parentId: '3', stage: 'pre' },
    }

    const { pointRankGroupList } = derivePointRankGroupList(data)
    const calculatedRankPoints = data.reducedPointList.map(({ point }) => {
      const result = { point }

      if (data.preRankByParentId[point._id]) result.rank = data.preRankByParentId[point._id]

      return result
    })

    expect(pointRankGroupList).toMatchObject(calculatedRankPoints)
  })
})
