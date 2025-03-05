//https://github.com/EnCiv/civil-pursuit/issues/213
import { test } from '@jest/globals'
import { deriveMyAnswerAndMyWhy } from '../answer'
import expect from 'expect'

// Mock necessary functions
jest.mock('react', () => {
  const obj = {}
  return {
    useRef: jest.fn(val => (typeof obj.current === 'undefined' && (obj.current = val), obj)),
    createElement: jest.fn(),
    createContext: jest.fn(),
    forwardRef: jest.fn(),
  }
})

jest.mock('react-jss', () => {
  return {
    createUseStyles: jest.fn(),
  }
})

jest.mock('@codastic/react-positioning-portal', () => {
  return {
    PositioningPortal: jest.fn(),
  }
})

jest.mock('react-accessible-headings', () => {
  return {
    H: jest.fn(),
    Level: jest.fn(),
  }
})

describe('test deriveMyAnswerAndMyWhy', () => {
  // for deriver tests we keep building on the same data object, rather than a new one every time
  // because an important part of testing is to make sure what's should change is changed, and what shouldn't change doesn't change between calls
  let data = {}

  test('input data empty', () => {
    const result = deriveMyAnswerAndMyWhy(data)
    expect(result).toEqual({ myAnswer: undefined, myWhy: undefined })
  })

  test('no answer from the user', () => {
    data.userId = 'a'
    data.pointById = { 0: { _id: 0, subject: 'Not the User', description: 'not the user description', userId: 'b' } }
    const result = deriveMyAnswerAndMyWhy(data)
    expect(result).toEqual({ myAnswer: undefined, myWhy: undefined })
  })

  test('answer only', () => {
    data.pointById['1'] = { _id: '1', subject: 'Answer', description: 'Answer Description', userId: 'a' }
    data.pointById = { ...data.pointById }
    const result = deriveMyAnswerAndMyWhy(data)
    expect(result).toEqual({ myAnswer: data.pointById['1'], myWhy: undefined })
    const savedMyAnswer = result.myAnswer
    const result2 = deriveMyAnswerAndMyWhy(data)
    expect(result2.myAnswer).toBe(savedMyAnswer)
  })

  test('user why is not there', () => {
    data.myWhyByParentId = {}
    data.myWhyByParentId['0'] = { _id: '2', subject: 'Why', description: 'Why Description', userId: 'b', parentId: '0' }
    const result = deriveMyAnswerAndMyWhy(data)
    expect(result).toEqual({ myAnswer: data.pointById['1'], myWhy: undefined })
  })

  test('why only but answer not there', () => {
    delete data.pointById['1']
    data.pointById = { ...data.pointById }
    data.myWhyByParentId['1'] = { _id: '3', subject: 'Why', description: 'Why Description', userId: 'a', parentId: '1' }
    data.myWhyByParentId = { ...data.myWhyByParentId }
    const result = deriveMyAnswerAndMyWhy(data)
    expect(result).toEqual({ myAnswer: undefined, myWhy: undefined })
  })

  let savedMyAnswer
  let savedMyWhy
  test('answer and why', () => {
    data.pointById['1'] = { _id: '1', subject: 'Answer', description: 'Answer Description', userId: 'a' }
    data.pointById = { ...data.pointById }
    const result = deriveMyAnswerAndMyWhy(data)
    expect(result).toEqual({ myAnswer: data.pointById['1'], myWhy: data.myWhyByParentId['1'] })
    savedMyAnswer = result.myAnswer
    savedMyWhy = result.myWhy
    const result2 = deriveMyAnswerAndMyWhy(data)
    expect(result2.myAnswer).toBe(savedMyAnswer)
    expect(result2.myWhy).toBe(savedMyWhy)
  })

  test('answer is changed', () => {
    data.pointById['1'] = { _id: '1', subject: 'Answer Changed', description: 'Answer Changed Description', userId: 'a' }
    data.pointById = { ...data.pointById }
    const result = deriveMyAnswerAndMyWhy(data)
    expect(result).toEqual({ myAnswer: data.pointById['1'], myWhy: data.myWhyByParentId['1'] })
    expect(result.myAnswer).not.toBe(savedMyAnswer)
    expect(result.myWhy).toBe(savedMyWhy)
    savedMyAnswer = result.myAnswer
    savedMyWhy = result.myWhy
  })

  test('why is changed', () => {
    data.myWhyByParentId['1'] = { _id: '3', subject: 'Why Changed', description: 'Why Changed Description', userId: 'a', parentId: '1' }
    data.myWhyByParentId = { ...data.myWhyByParentId }
    const result = deriveMyAnswerAndMyWhy(data)
    expect(result.myAnswer).toBe(savedMyAnswer)
    expect(result.myWhy).not.toBe(savedMyWhy)
    expect(result.myWhy).toEqual(data.myWhyByParentId['1'])
  })
})
