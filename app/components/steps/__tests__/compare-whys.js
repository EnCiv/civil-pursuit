// https://github.com/EnCiv/civil-pursuit/issues/215
import { derivePointWithWhyRankListLisyByCategory } from '../compare-whys'
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
    useEffect: jest.fn(),
    useState: jest.fn(),
    default: jest.fn(),
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
describe('test derivePoinMostsLeastsRankList', () => {
  test('no data yields no chanage', () => {
    const { pointWithWhyRankListList } = derivePointWithWhyRankListLisyByCategory(data, 'most')
    expect(pointWithWhyRankListList).toBe(undefined)
  })
  test('can insert initial data', () => {
    data.reducedPointList = [{ point: { _id: '1', subject: '1', description: '1' } }, { point: { _id: '2', subject: '2', description: '2' } }, { point: { _id: '3', subject: '3', description: '3' } }]
    data.preRankByParentId = { 1: { _id: 51, stage: 'pre', category: 'most', parentId: '1' }, 2: { _id: 53, stage: 'pre', category: 'most', parentId: '2' }, 3: { _id: 53, stage: 'pre', category: 'most', parentId: '3' } }
    const { pointWithWhyRankListList } = derivePointWithWhyRankListLisyByCategory(data, 'most')
    expect(pointWithWhyRankListList).toMatchObject([
      { point: { _id: '1', subject: '1', description: '1' }, whyRankList: [] },
      { point: { _id: '2', subject: '2', description: '2' }, whyRankList: [] },
      { point: { _id: '3', subject: '3', description: '3' }, whyRankList: [] },
    ])
  })
  test("ref doesn't change if data doesn't change", () => {
    const { pointWithWhyRankListList } = derivePointWithWhyRankListLisyByCategory(data, 'most')
    const newRef = derivePointWithWhyRankListLisyByCategory(data, 'most').pointWithWhyRankListList
    expect(newRef).toBe(pointWithWhyRankListList)
  })
  test('ref does change if a point changes', () => {
    const pointWithWhyRankListList = derivePointWithWhyRankListLisyByCategory(data)
    data.reducedPointList[1] = { point: { ...data.reducedPointList[1].point } }
    data.reducedPointList = [...data.reducedPointList]
    const newRef = derivePointWithWhyRankListLisyByCategory(data, 'most')
    expect(newRef).not.toBe(pointWithWhyRankListList)
    expect(newRef).toEqual(pointWithWhyRankListList)
  })
  test('works with random ranked whys', () => {
    data.randomWhyById = {
      4: { _id: '4', subject: '1.4 random most', description: '1.4 random most', parentId: '1', category: 'most' },
      5: { _id: '5', subject: '1.5 random least', description: '1.5 random least', parentId: '1', category: 'most' },
      6: { _id: '6', subject: '2.6 random most', description: '2.6 random most', parentId: '2', category: 'most' },
      7: { _id: '7', subject: '2.7 random least', description: '2.7 random least', parentId: '2', category: 'most' },
    }
    const { pointWithWhyRankListList } = derivePointWithWhyRankListLisyByCategory(data, 'most')
    const calculatedReviewPoints = data.reducedPointList.map(({ point }) => {
      // if there are no mosts or leasts, the entry should not be present
      const mosts = Object.values(data.randomWhyById).filter(why => why.parentId === point._id && why.category === 'most')
      const result = { point }
      if (mosts.length)
        result.whyRankList = mosts.map(why => ({
          why,
        }))
      return result
    })
    expect(pointWithWhyRankListList).toMatchObject(calculatedReviewPoints)
  })
  test("ref doesn't change if point and random whys doesn't change", () => {
    const { pointWithWhyRankListList } = derivePointWithWhyRankListLisyByCategory(data, 'most')
    const newRef = derivePointWithWhyRankListLisyByCategory(data, 'most').pointWithWhyRankListList
    expect(newRef).toBe(pointWithWhyRankListList)
  })
  test('ref does change if a point changes when there are whys', () => {
    const { pointWithWhyRankListList } = derivePointWithWhyRankListLisyByCategory(data, 'most')
    data.reducedPointList[1] = { point: { ...data.reducedPointList[1].point } }
    data.reducedPointList = [...data.reducedPointList]
    const newRef = derivePointWithWhyRankListLisyByCategory(data, 'most').pointWithWhyRankListList
    expect(newRef).not.toBe(pointWithWhyRankListList)
    expect(newRef).toEqual(pointWithWhyRankListList)
  })
  test('ref does change if a why is changed', () => {
    const { pointWithWhyRankListList } = derivePointWithWhyRankListLisyByCategory(data, 'most')
    const item1 = pointWithWhyRankListList[1]
    data.randomWhyById['6'] = { ...data.randomWhyById['6'] }
    data.randomWhyById = { ...data.randomWhyById }
    const newRef = derivePointWithWhyRankListLisyByCategory(data, 'most').pointWithWhyRankListList
    expect(newRef).not.toBe(pointWithWhyRankListList)
    expect(newRef).toEqual(pointWithWhyRankListList)
    expect(newRef[1]).toEqual(item1)
  })
  test('works with ranks added', () => {
    data.whyRankByParentId = {
      4: { _id: '8', category: 'most', parentId: '4', stage: 'why' },
      5: { _id: '9', category: 'neutral', parentId: '5', stage: 'why' },
      6: { _id: '10', category: 'neutral', parentId: '6', stage: 'why' },
    }
    const { pointWithWhyRankListList } = derivePointWithWhyRankListLisyByCategory(data, 'most')
    expect(pointWithWhyRankListList).toMatchObject([
      {
        point: { _id: '1', subject: '1', description: '1' },
        whyRankList: [
          {
            why: { _id: '4', subject: '1.4 random most', description: '1.4 random most', parentId: '1', category: 'most' },
            rank: { _id: '8', category: 'most', parentId: '4', stage: 'why' },
          },
          {
            why: { _id: '5', subject: '1.5 random least', description: '1.5 random least', parentId: '1', category: 'most' },
            rank: { _id: '9', category: 'neutral', parentId: '5', stage: 'why' },
          },
        ],
      },
      {
        point: {
          _id: '2',
          subject: '2',
          description: '2',
        },
        whyRankList: [
          {
            why: { _id: '6', subject: '2.6 random most', description: '2.6 random most', parentId: '2', category: 'most' },
            rank: { _id: '10', category: 'neutral', parentId: '6', stage: 'why' },
          },
          {
            why: { _id: '7', subject: '2.7 random least', description: '2.7 random least', parentId: '2', category: 'most' },
          },
        ],
      },
      {
        point: { _id: '3', subject: '3', description: '3' },
        whyRankList: [],
      },
    ])
  })
})
