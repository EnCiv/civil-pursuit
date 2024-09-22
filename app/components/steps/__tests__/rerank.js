// https://github.com/EnCiv/civil-pursuit/issues/215
import { derivePointMostsLeastsRankList } from '../rerank'
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
describe('test derivePoinMostsLeastsRankList', () => {
  test('no data yields no chanage', () => {
    const reviewPoints = derivePointMostsLeastsRankList(data)
    expect(reviewPoints).toBe(undefined)
  })
  test('partial data yields no change', () => {
    data.reducedPointList = [
      { point: { _id: '1', subject: '1', description: '1' } },
      { point: { _id: '2', subject: '2', description: '2' } },
      { point: { _id: '3', subject: '3', description: '3' } },
    ]
    const reviewPoints = derivePointMostsLeastsRankList(data)
    expect(reviewPoints).toMatchObject(data.reducedPointList)
    const newReviewPoints = derivePointMostsLeastsRankList(data)
    expect(newReviewPoints).toBe(reviewPoints)
  })
  test("ref doesn't change if data doesn't change", () => {
    const reviewPoints = derivePointMostsLeastsRankList(data)
    const newReviewPoints = derivePointMostsLeastsRankList(data)
    expect(newReviewPoints).toBe(reviewPoints)
  })
  test('ref does change if a point changes', () => {
    const reviewPoints = derivePointMostsLeastsRankList(data)
    data.reducedPointList[1] = { point: { ...data.reducedPointList[1].point } }
    data.reducedPointList = [...data.reducedPointList]
    const newReviewPoints = derivePointMostsLeastsRankList(data)
    expect(newReviewPoints).not.toBe(reviewPoints)
    expect(newReviewPoints).toEqual(reviewPoints)
  })
  test('works with top ranked whys', () => {
    data.topWhyByParentId = {
      4: { _id: '4', subject: '1.4 top most', description: '1.4 top most', parentId: '1', category: 'most' },
      5: { _id: '5', subject: '1.5 top least', description: '1.5 top least', parentId: '1', category: 'least' },
      6: { _id: '6', subject: '2.6 top most', description: '2.6 top most', parentId: '2', category: 'most' },
      7: { _id: '7', subject: '2.7 top least', description: '2.7 top least', parentId: '2', category: 'least' },
    }
    const reviewPoints = derivePointMostsLeastsRankList(data)
    const calculatedReviewPoints = data.reducedPointList.map(({ point }) => {
      // if there are no mosts or leasts, the entry should not be present
      const mosts = Object.values(data.topWhyByParentId).filter(
        why => why.parentId === point._id && why.category === 'most'
      )
      const leasts = Object.values(data.topWhyByParentId).filter(
        why => why.parentId === point._id && why.category === 'least'
      )
      const result = { point }
      if (mosts.length) result.mosts = mosts
      if (leasts.length) result.leasts = leasts
      return result
    })
    expect(reviewPoints).toMatchObject(calculatedReviewPoints)
  })
  test("ref doesn't change if point and top whys doesn't change", () => {
    const reviewPoints = derivePointMostsLeastsRankList(data)
    const newReviewPoints = derivePointMostsLeastsRankList(data)
    expect(newReviewPoints).toBe(reviewPoints)
  })
  test('ref does change if a point changes when there are ranks', () => {
    const reviewPoints = derivePointMostsLeastsRankList(data)
    data.reducedPointList[1] = { point: { ...data.reducedPointList[1].point } }
    data.reducedPointList = [...data.reducedPointList]
    const newReviewPoints = derivePointMostsLeastsRankList(data)
    expect(newReviewPoints).not.toBe(reviewPoints)
    expect(newReviewPoints).toEqual(reviewPoints)
  })
  test('ref does change if a why is changed', () => {
    const reviewPoints = derivePointMostsLeastsRankList(data)
    const reviewPoint0 = reviewPoints[0]
    data.topWhyByParentId['6'] = { ...data.topWhyByParentId['6'] }
    data.topWhyByParentId = { ...data.topWhyByParentId }
    const newReviewPoints = derivePointMostsLeastsRankList(data)
    expect(newReviewPoints).not.toBe(reviewPoints)
    expect(newReviewPoints).toEqual(reviewPoints)
    expect(newReviewPoints[0]).toEqual(reviewPoint0)
  })
  test('works with ranks added', () => {
    data.postRankByParentId = {
      1: { _id: '8', category: 'most', parentId: '1', stage: 'post' },
      2: { _id: '9', category: 'neutral', parentId: '2', stage: 'post' },
      3: { _id: '10', category: 'least', parentId: '3', stage: 'post' },
    }
    const reviewPoints = derivePointMostsLeastsRankList(data)
    const calculatedReviewPoints = data.reducedPointList.map(({ point }) => {
      // if there are no mosts or leasts, the entry should not be present
      const mosts = Object.values(data.topWhyByParentId).filter(
        why => why.parentId === point._id && why.category === 'most'
      )
      const leasts = Object.values(data.topWhyByParentId).filter(
        why => why.parentId === point._id && why.category === 'least'
      )
      const result = { point }
      if (mosts.length) result.mosts = mosts
      if (leasts.length) result.leasts = leasts
      if (data.postRankByParentId[point._id]) result.rank = data.postRankByParentId[point._id]
      return result
    })
    expect(reviewPoints).toMatchObject(calculatedReviewPoints)
  })
})
