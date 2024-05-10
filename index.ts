export const MAX_LENGTH = 1000
const ENCODE_STRING = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#$%^&*()_-=+:;|[{]}<.>/~'

export function encodeNumber (number: number): string {
	// todo - обработка ошибок ввода

	const symbols = ENCODE_STRING
	const base = symbols.length

	let encoded = ''
	while (number > 0) {
		const remainder = number % base
		encoded = symbols[remainder] + encoded
		number = Math.floor(number / base)
	}

	return encoded || '0'
}

export function decodeNumber (encoded: string): number {
	// todo - обработка ошибок ввода и формата строки

	const symbols = ENCODE_STRING
	const base = symbols.length

	let decoded = 0
	for (let i = 0; i < encoded.length; i++) {
		const char = encoded[i]
		const digit = symbols.indexOf(char)
		decoded = decoded * base + digit
	}

	return decoded
}

export function numbersToString (input: number[]): string {
	if (input.length > 1000) {
		throw new Error(`Слишком много чисел, максимум ${MAX_LENGTH}`)
	}

	if (input.some(x => !Number.isInteger(x))) {
		const x = input.find(n => !Number.isInteger(n))
		throw new Error(`Только целые числа, ${x} не целое`)
	}

	if (input.some(x => x < 1 || x > 300)) {
		const x = input.find(n => n < 1 || n > 300)
		throw new Error(`Только от 1 до 300, ${x} вне диапазона`)
	}

	// todo - дополнительные проверки на тип данных

	const inputCopy = Array.from(input)
	const numbers = new Map<string, number>()

	while (inputCopy.length > 0) {
		const numberInitial = inputCopy.shift()
		const numberEncoded = encodeNumber(numberInitial!)
		const numberInMap = numbers.get(numberEncoded)
		numbers.set(numberEncoded, numberInMap ? numberInMap + 1 : 1)
	}

	let result = ''
	for (const [number, count] of numbers) {
		// число, или число!повторы,
		result += `${number}${count > 1 ? `!${encodeNumber(count)}` : ''},`
	}
	result = result.slice(0, -1)

	return result
}

export function stringToNumbers (input: string): number[] {
	// todo - проверки формата строки

	const result = []
	const allNumbers = input.split(',')
	for (let block of allNumbers) {
		const [number, count] = block.split('!')
		const numberDecoded = decodeNumber(number)
		const countDecoded = count ? decodeNumber(count) : 1

		for (let i = 1; i <= countDecoded; i++) {
			result.push(numberDecoded)
		}
	}

	return result
}

function randomInt (min: number, max: number) {
	return Math.floor(Math.random() * (max - min)) + min
}

for (let i of [50, 100, 500, 1000]) {
	console.log(`Строка из ${i} случайных чисел`)
	const array = []
	while (array.length < i) {
		array.push(randomInt(1, 300))
	}
	const encoded = numbersToString(array)
	console.log('Исходная строка:', array.toString())
	console.log('Сжатая строка:', encoded)
	console.log('Коэффициент сжатия:',
		(encoded.length / array.toString().length).toFixed(2), '\n')
}

for (let range of [[1, 9], [10, 99], [100, 300]]) {
	const [min, max] = range
	console.log(`Строка из 1000 чисел ${min}-${max}`)
	const array = []
	while (array.length < 1000) {
		array.push(randomInt(min, max))
	}
	const encoded = numbersToString(array)
	console.log('Исходная строка:', array.toString())
	console.log('Сжатая строка:', encoded)
	console.log('Коэффициент сжатия:',
		(encoded.length / array.toString().length).toFixed(2), '\n')
}

{
	console.log('Строка, в которой каждого числа по 3')
	const array = []
	for (let i = 1; i <= 300; i++) {
		array.push(i, i, i)
	}
	const encoded = numbersToString(array)
	console.log('Исходная строка:', array.toString())
	console.log('Сжатая строка:', encoded)
	console.log('Коэффициент сжатия:',
		(encoded.length / array.toString().length).toFixed(2), '\n')
}

