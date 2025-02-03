import { expect, test } from 'vitest'
import { expand } from './code.ts'

test('truns(0) === 0', () => {
  expect(expand([1,1,1],5).toString()).toStrictEqual([])
})