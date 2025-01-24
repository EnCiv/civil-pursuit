//https://github.com/EnCiv/civil-pursuit/issues/213
import { deriver } from '../answer'

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
describe('deriver function', () => {
  let props = {}
  let data = {}

  beforeEach(() => {
    // Reset data and props before each test
    props = { question: { _id: '12345' } }
    data = {
      shared: {
        startingPoint: {
          _id: '123',
          subject: 'Test Subject',
          description: 'Test Description',
          parentId: '12345',
        },
        whyMosts: [],
      },
    }
  })

  test('input data undefined', () => {
    const result = deriver(undefined, props)
    expect(result).toBeNull()
  })

  test('input data empty', () => {
    const data = {}
    const result = deriver(data, props)
    expect(result).toBeNull()
  })

  test('input data present - output data not there yet', () => {
    data.shared.startingPoint = { ...data.shared.startingPoint, subject: '' } // Ensure starting point is defined
    const result = deriver(data, props)
    expect(result).toBeTruthy()
    expect(result.pointByPart).toBeDefined()
    expect(result.pointByPart.answer.subject).toBe('')
  })

  test('input data unchanged', () => {
    const data = {
      shared: {
        startingPoint: {
          _id: '123',
          subject: 'Test Subject',
          description: 'Test Description',
          parentId: '12345',
        },
        whyMosts: [
          {
            _id: '6784d6ac75dda8871cd6b3f2',
            description: '',
            parentId: '123',
            subject: '',
          },
        ],
      },
    }
    const props = {
      question: { _id: '12345' },
    }

    const result = deriver(data, props) // Call deriver function and assign to result
    const previousResult = result?.pointByPart // Ensure result has pointByPart

    const newResult = deriver(data, props)
    expect(newResult?.pointByPart).toBe(previousResult) // Should not change if input is the same
  })

  test('subset(s) of input data changes testing that only the affected part of the output has changed', () => {
    const result = deriver(data, props)
    const previousAnswer = result.pointByPart.answer

    // Simulate a change in the answer
    data.shared.startingPoint.subject = 'Updated Subject'
    const updatedResult = deriver(data, props)

    expect(updatedResult.pointByPart.answer).not.toBe(previousAnswer) // answer should change
    expect(updatedResult.pointByPart.answer.subject).toBe('Updated Subject')
    expect(updatedResult.pointByPart.why).toEqual(result.pointByPart.why) // 'why' should stay the same
  })
})
