//https://github.com/EnCiv/civil-pursuit/issues/103
//https://github.com/EnCiv/civil-pursuit/issues/214

import { derivePointWhyListByCategory } from '../why'

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
    const result = derivePointWhyListByCategory(undefined)
    expect(result).toBeUndefined()
  })

  test('input data empty', () => {
    const result = derivePointWhyListByCategory({})
    expect(result).toBeUndefined()
  })

  test('input data present - output data not there yet', () => {
    data = {
      reducedPointList: [
        {
          _id: '64a81ca0cbad4414b3dc8d75',
          subject: 'Subject 1',
          description: 'Description 1',
        },
      ],
      myWhyByParentId: {},
      category: 'most',
      intro: 'This is the intro text.',
    }

    const result = derivePointWhyListByCategory(data)

    expect(result).toEqual({
      pointWhyList: [
        {
          point: {
            _id: '64a81ca0cbad4414b3dc8d75',
            subject: 'Subject 1',
            description: 'Description 1',
          },
          why: undefined,
        },
      ],
    })
  })

  test('input data unchanged', () => {
    data = {
      reducedPointList: [
        {
          _id: '64a81ca0cbad4414b3dc8d75',
          subject: 'Subject 1',
          description: 'Description 1',
        },
      ],
      myWhyByParentId: {
        '64a81ca0cbad4414b3dc8d75': {
          _id: '641f9b3dfb8ce2f3a42ed816',
          parentId: '64a81ca0cbad4414b3dc8d75',
          subject: 'Why Subject 1',
          description: 'Why Description 1',
        },
      },
      category: 'most',
      intro: 'This is the intro text.',
    }

    const result1 = derivePointWhyListByCategory(data)
    const result2 = derivePointWhyListByCategory(data)

    expect(result2).toBe(result1)

    expect(result2).toMatchObject({
      pointWhyList: [
        {
          point: {
            _id: '64a81ca0cbad4414b3dc8d75',
            subject: 'Subject 1',
            description: 'Description 1',
          },
          why: {
            _id: '641f9b3dfb8ce2f3a42ed816',
            parentId: '64a81ca0cbad4414b3dc8d75',
            subject: 'Why Subject 1',
            description: 'Why Description 1',
          },
        },
      ],
    })
  })

  test('subset of input data changes - only affected part of output changes', () => {
    data = {
      reducedPointList: [
        {
          _id: '64a81ca0cbad4414b3dc8d75',
          subject: 'Subject 1',
          description: 'Description 1',
        },
        {
          _id: '64a81ca0cbad4414b3dc8d76',
          subject: 'Subject 2',
          description: 'Description 2',
        },
      ],
      myWhyByParentId: {
        '64a81ca0cbad4414b3dc8d75': {
          _id: '641f9b3dfb8ce2f3a42ed816',
          parentId: '64a81ca0cbad4414b3dc8d75',
          subject: 'Why Subject 1',
          description: 'Why Description 1',
        },
        '64a81ca0cbad4414b3dc8d76': {
          _id: '641f9b3dfb8ce2f3a42ed817',
          parentId: '64a81ca0cbad4414b3dc8d76',
          subject: 'Why Subject 2',
          description: 'Why Description 2',
        },
      },
      category: 'most',
      intro: 'This is the intro text.',
    }

    const result1 = derivePointWhyListByCategory(data)

    data = {
      ...data,
      myWhyByParentId: {
        ...data.myWhyByParentId,
        '64a81ca0cbad4414b3dc8d75': {
          _id: '641f9b3dfb8ce2f3a42ed816',
          parentId: '64a81ca0cbad4414b3dc8d75',
          subject: 'Updated Why Subject 1',
          description: 'Updated Why Description 1',
        },
      },
    }

    const savedPoints = result1.pointWhyList.map(pw => pw.point)
    const savedWhys = result1.pointWhyList.map(pw => pw.why)

    const result2 = derivePointWhyListByCategory(data)

    expect(result2).not.toBe(result1)
    expect(result2.pointWhyList[0]).not.toBe(result1.pointWhyList[0])
    expect(result2.pointWhyList[1]).toBe(result1.pointWhyList[1])

    expect(result2.pointWhyList[0].point).toBe(savedPoints[0])
    expect(result2.pointWhyList[0].why).not.toBe(savedWhys[0])
    expect(result2.pointWhyList[1].point).toBe(savedPoints[1])
    expect(result2.pointWhyList[1].why).toBe(savedWhys[1])

    expect(result2).toMatchObject({
      pointWhyList: [
        {
          point: {
            _id: '64a81ca0cbad4414b3dc8d75',
            subject: 'Subject 1',
            description: 'Description 1',
          },
          why: {
            _id: '641f9b3dfb8ce2f3a42ed816',
            parentId: '64a81ca0cbad4414b3dc8d75',
            subject: 'Updated Why Subject 1',
            description: 'Updated Why Description 1',
          },
        },
        {
          point: {
            _id: '64a81ca0cbad4414b3dc8d76',
            subject: 'Subject 2',
            description: 'Description 2',
          },
          why: {
            _id: '641f9b3dfb8ce2f3a42ed817',
            parentId: '64a81ca0cbad4414b3dc8d76',
            subject: 'Why Subject 2',
            description: 'Why Description 2',
          },
        },
      ],
    })
  })
})
