import setOrDeleteByMutatePath from '../set-or-delete-by-mutate-path'

describe('test setOrDeleteByMutatePath', () => {
  test('a simple object', () => {
    const messages = []
    const dst = { a: 1 }
    const result = setOrDeleteByMutatePath(dst, { a: 2 }, messages)
    expect(result).toEqual({ a: 2 })
    expect(result).not.toBe(dst)
    expect(messages).toMatchObject([
      //
      'a: changing 1 to 2',
      'returning mutated copy',
    ])
  })
  test('set an object', () => {
    const messages = []
    const dst = {
      a: {
        b: 1, // don't pretty this into one line
      },
    }
    const result = setOrDeleteByMutatePath(dst, { a: { b: 2 } }, messages)
    expect(result).toMatchObject({ a: { b: 2 } })
    expect(result).not.toBe(dst)
    expect(result.a).not.toBe(dst.a)
    expect(messages).toMatchObject([
      //
      'a.b: changing 1 to 2',
      'mutating a',
      'returning mutated copy',
    ])
  })
  test("set doesn't really change anything", () => {
    const messages = []
    const dst = {
      a: {
        b: 1, // don't pretty this into one line
      },
    }
    const result = setOrDeleteByMutatePath(dst, { a: { b: 1 } }, messages)
    expect(result).toMatchObject({ a: { b: 1 } })
    expect(result).toBe(dst)
    expect(result.a).toBe(dst.a)
    expect(messages).toMatchObject([])
  })
  test('set some stuff but leave others alone', () => {
    const messages = []
    const dst = {
      a: {
        b: 1, // don't pretty this into one line
        c: 2,
        d: 3,
      },
      f: {
        g: 4,
      },
    }
    const result = setOrDeleteByMutatePath(dst, { a: { b: 2 } }, messages)
    expect(result).toMatchObject({ a: { b: 2, c: 2, d: 3 }, f: { g: 4 } })
    expect(result).not.toBe(dst)
    expect(result.a).not.toBe(dst.a)
    expect(result.f).toBe(dst.f)
    expect(result.f.g).toBe(dst.f.g)
    expect(messages).toMatchObject([
      //
      'a.b: changing 1 to 2',
      'mutating a',
      'returning mutated copy',
    ])
  })
  test('can set and delete things', () => {
    const messages = []
    const dst = {
      a: {
        b: 1, // don't pretty this into one line
        c: 2,
        d: 3,
      },
      f: {
        g: 4,
      },
    }
    const result = setOrDeleteByMutatePath(dst, { a: { b: 2, c: undefined }, f: undefined }, messages)
    expect(result).toMatchObject({ a: { b: 2, d: 3 } })
    expect(result).not.toBe(dst)
    expect(result.a).not.toBe(dst.a)
    expect(messages).toMatchObject([
      //
      'a.b: changing 1 to 2',
      'deleting a.c: 2',
      'mutating a',
      'deleting f: {"g":4}',
      'returning mutated copy',
    ])
  })
  test('can set and delete things deeply', () => {
    const messages = []
    const dst = {
      z: {
        a: {
          b: 1, // don't pretty this into one line
          c: 2,
          d: 3,
        },
        f: {
          g: 4,
        },
      },
    }
    const result = setOrDeleteByMutatePath(dst, { z: { a: { b: 2, c: undefined }, f: undefined } }, messages)
    expect(result).toMatchObject({ z: { a: { b: 2, d: 3 } } })
    expect(result).not.toBe(dst)
    expect(result.z).not.toBe(dst.z)
    expect(result.z.a).not.toBe(dst.z.a)
    expect(messages).toMatchObject([
      //
      'z.a.b: changing 1 to 2',
      'deleting z.a.c: 2',
      'mutating z.a',
      'deleting z.f: {"g":4}',
      'mutating z',
      'returning mutated copy',
    ])
  })
  test('it can change arrays', () => {
    const messages = []
    const dst = ['1', '2', '3', '4']
    const result = setOrDeleteByMutatePath(dst, ['0'], messages)
    expect(result).toMatchObject(['0'])
    expect(result).not.toBe(dst)
    expect(messages).toMatchObject([
      //
      '[0]: changing "1" to "0"',
      'deleting [1]: "2"',
      'deleting [2]: "3"',
      'deleting [3]: "4"',
      'returning mutated copy',
    ])
  })
  test('it can change deep in arrays', () => {
    const messages = []
    const dst = [{ a: 1 }, { b: 2 }, { c: { d: 7 } }]
    const result = setOrDeleteByMutatePath(dst, [{ a: 1 }, { b: 2 }, { c: { f: 8 } }], messages)
    expect(result).toMatchObject([{ a: 1 }, { b: 2 }, { c: { d: 7, f: 8 } }])
    expect(result).not.toBe(dst)
    expect(result[0]).toBe(dst[0])
    expect(result[1]).toBe(dst[1])
    expect(result[2]).not.toBe(dst[2])
    expect(messages).toMatchObject([
      //don't pretty this into one line
      '[2].c.f: changing not-present to 8',
      'mutating [2].c',
      'mutating [2]',
      'returning mutated copy',
    ])
  })
})
