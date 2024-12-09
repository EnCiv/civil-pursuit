//https://github.com/EnCiv/civil-pursuit/issues/103
//https://github.com/EnCiv/civil-pursuit/issues/214

import { userDeriver } from '../why'

jest.mock('react', () => {
  const actualReact = jest.requireActual('react')
  let obj
  return {
    ...actualReact,
    useRef: jest.fn(initialValue => {
      if (!obj) {
        obj = { current: initialValue }
      }
      return obj
    }),
    __resetLocal: () => {
      obj = null
    },
  }
})

describe('deriver function tests', () => {
  let data

  beforeEach(() => {
    data = {}
    const reactMock = require('react')
    reactMock.__resetLocal()
  })

  test('input data undefined', () => {
    const result = userDeriver(undefined)
    expect(result).toEqual({
      pointWhyList: [],
      category: undefined,
      intro: undefined,
    })
  })

  test('input data empty', () => {
    const result = userDeriver({})
    expect(result).toEqual({
      pointWhyList: [],
      category: undefined,
      intro: undefined,
    })
  })

  test('input data present - output data not there yet', () => {
    data = {
      reducedPointList: [{ _id: '1', subject: 'Subject 1', description: 'Description 1' }],
      myWhyByParentId: {},
      category: 'most',
      intro: 'This is the intro text.',
    }

    const result = userDeriver(data)
    expect(result).toEqual({
      pointWhyList: [
        {
          point: { _id: '1', subject: 'Subject 1', description: 'Description 1' },
          why: undefined,
        },
      ],
      category: 'most',
      intro: 'This is the intro text.',
    })
  })

  test('input data unchanged', () => {
    data = {
      reducedPointList: [{ _id: '1', subject: 'Subject 1', description: 'Description 1' }],
      myWhyByParentId: {
        1: { _id: 'why1', parentId: '1', subject: 'Why Subject 1', description: 'Why Description 1' },
      },
      category: 'most',
      intro: 'This is the intro text.',
    }

    const result1 = userDeriver(data)
    const result2 = userDeriver(data)

    expect(result2).toBe(result1)
  })

  test('subset of input data changes - only affected part of output changes', () => {
    data = {
      reducedPointList: [
        { _id: '1', subject: 'Subject 1', description: 'Description 1' },
        { _id: '2', subject: 'Subject 2', description: 'Description 2' },
      ],
      myWhyByParentId: {
        1: { _id: 'why1', parentId: '1', subject: 'Why Subject 1', description: 'Why Description 1' },
        2: { _id: 'why2', parentId: '2', subject: 'Why Subject 2', description: 'Why Description 2' },
      },
      category: 'most',
      intro: 'This is the intro text.',
    }

    const result1 = userDeriver(data)

    data = {
      ...data,
      myWhyByParentId: {
        ...data.myWhyByParentId,
        1: {
          _id: 'why1',
          parentId: '1',
          subject: 'Updated Why Subject 1',
          description: 'Updated Why Description 1',
        },
      },
    }

    const result2 = userDeriver(data)

    expect(result2).not.toBe(result1)
    expect(result2.pointWhyList[0]).not.toBe(result1.pointWhyList[0])
    expect(result2.pointWhyList[1]).toBe(result1.pointWhyList[1])
  })
})
