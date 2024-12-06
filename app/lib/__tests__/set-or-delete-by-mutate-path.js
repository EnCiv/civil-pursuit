import setOrDeleteByMutatePath from '../set-or-delete-by-mutate-path'

describe('test setOrDeleteByMutatePath', () => {
  test('set an object', () => {
    const dst = {
      a: {
        b: 1, // don't pretty this into one line
        c: 2,
      },
    }
    const result = setOrDeleteByMutatePath(dst, { a: { b: 2 } })
    expect(result).toMatchObject({ a: { b: 2, c: 2 } })
    expect(result).not.toBe(dst)
    expect(result.a.c).toBe(dst.a.c)
    expect(result.a).not.toBe(dst.a)
  })
})
