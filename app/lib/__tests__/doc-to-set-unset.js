import { ObjectId } from 'civil-server/dist/models/iota'
import docToSetUnset from '../doc-to-set-unset'

describe('docToSetUnset', () => {
  test('should handle an empty document', () => {
    const doc = {}
    const [sets, unsets] = docToSetUnset(doc)
    expect(sets).toEqual({})
    expect(unsets).toEqual({})
  })

  test('should handle a flat document', () => {
    const doc = { key1: 'value1', key2: undefined, key3: 123 }
    const [sets, unsets] = docToSetUnset(doc)
    expect(sets).toEqual({ key1: 'value1', key3: 123 })
    expect(unsets).toEqual({ key2: '' })
  })

  test('should handle a nested document', () => {
    const doc = {
      key1: 'value1',
      key2: undefined,
      nested: {
        key3: 123,
        key4: undefined,
      },
    }
    const [sets, unsets] = docToSetUnset(doc)
    expect(sets).toEqual({ key1: 'value1', 'nested.key3': 123 })
    expect(unsets).toEqual({ key2: '', 'nested.key4': '' })
  })

  test('should skip functions', () => {
    const doc = {
      key1: 'value1',
      key2: () => {},
    }
    const [sets, unsets] = docToSetUnset(doc)
    expect(sets).toEqual({ key1: 'value1' })
    expect(unsets).toEqual({})
  })

  test('should handle special object types', () => {
    const doc = {
      key1: new Date('2025-05-06T10:20:30.000Z'),
      key2: new ObjectId('507f191e810c19729de860ea'),
    }
    const [sets, unsets] = docToSetUnset(doc)
    expect(sets).toEqual({ key1: new Date('2025-05-06T10:20:30.000Z'), key2: new ObjectId('507f191e810c19729de860ea') })
    expect(unsets).toEqual({})
  })

  test('should handle null values', () => {
    const doc = { key1: 'value1', key2: null }
    const [sets, unsets] = docToSetUnset(doc)
    expect(sets).toEqual({ key1: 'value1', key2: null })
    expect(unsets).toEqual({})
  })
})

test('should handle array elements', () => {
  const doc = {
    key1: 'value1',
    key2: [1, 2, 3],
    key3: [{ nestedKey: 'nestedValue' }, null],
  }
  const [sets, unsets] = docToSetUnset(doc)
  expect(sets).toEqual({
    key1: 'value1',
    'key2.0': 1,
    'key2.1': 2,
    'key2.2': 3,
    'key3.0.nestedKey': 'nestedValue',
    'key3.1': null,
  })
  expect(unsets).toEqual({})
})
