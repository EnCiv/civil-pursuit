import { getRandomUniqueList } from '../dturn'

describe('generate a random unique list', () => {
  test('can generate a random unique list', () => {
    const list = getRandomUniqueList(10, 4)
    expect(list.length).toBe(4)
    expect(new Set(list).size).toBe(4) // all elements should be unique
  })

  test('Can do it over and over again and always get the same number of results', () => {
    for (let i = 0; i < 100; i++) {
      const list = getRandomUniqueList(10, 4)
      expect(list.length).toBe(4)
      expect(new Set(list).size).toBe(4) // all elements should be unique
    }
  })
})
