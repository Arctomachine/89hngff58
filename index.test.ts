import { describe, expect, test } from 'bun:test'
import {
	decodeNumber,
	encodeNumber,
	MAX_LENGTH,
	numbersToString, stringToNumbers,
} from './index.ts'

function randomInt (min: number, max: number) {
	return Math.floor(Math.random() * (max - min)) + min
}

test('Функции кодирования и декодирования отдельного числа', () => {
	const number = randomInt(1, 300)
	const encoded = encodeNumber(number)
	const decoded = decodeNumber(encoded)
	expect(decoded).toBe(number)
})

describe('Простые', () => {
	const cases = [50, 100, 500, 1000]
	test.each(cases)('%d чисел', (len) => {
		const array = []
		while (array.length < len) {
			array.push(randomInt(1, 300))
		}

		const string = numbersToString(array)
		const decodedArray = stringToNumbers(string)
		expect(string.length).toBeLessThan(String(array).length)
		expect(decodedArray.toSorted()).toEqual(array.toSorted())
	})
})

describe('Граничные', () => {
	const cases = [[1, 9], [10, 99], [100, 300]]
	test.each(cases)('От %d до %d', (min, max) => {
		const array = []
		while (array.length < MAX_LENGTH) {
			array.push(randomInt(min, max))
		}

		const string = numbersToString(array)
		const decodedArray = stringToNumbers(string)
		expect(string.length).toBeLessThan(String(array).length)
		expect(decodedArray.toSorted()).toEqual(array.toSorted())
	})
})

test('Каждого числа по 3', () => {
	const array = []
	for (let i = 1; i <= 300; i++) {
		array.push(i, i, i)
	}

	const string = numbersToString(array)
	const decodedArray = stringToNumbers(string)
	expect(string.length).toBeLessThan(String(array).length)
	expect(decodedArray.toSorted()).toEqual(array.toSorted())
})
