import { mergeObjects } from 'lbrx/helpers'
import { AbcObj } from 'test-subjects'

describe('Helper Function - mergeObjects():', () => {

	it('should result the expected properties values after merging.', () => {
		const objA: AbcObj = {
			a: null,
			b: 'b',
			c: null,
			d: {},
			e: 'e',
			g: new Date(2019, 0),
		}
		const objB: AbcObj = {
			a: 'a',
			b: null,
			c: {},
			d: null,
			f: 0,
			g: new Date(2020, 0),
		}
		const mergedObj = mergeObjects(objA, objB)
		expect(mergedObj).toMatchObject(<AbcObj>{
			a: 'a',
			b: null,
			c: {},
			d: null,
			e: 'e',
			f: 0,
			g: new Date(2020, 0),
		})
	})

	it('should result the expected properties values for nested objects after merging.', () => {
		const objA: AbcObj = {
			objA: {
				a: null,
				b: 'b',
				c: null,
				d: {},
				e: 'e',
				g: null,
			}
		}
		const objB: AbcObj = {
			objA: {
				a: 'a',
				b: null,
				c: {},
				d: null,
				f: 0,
				g: new Date(2020, 0),
			}
		}
		const mergedObj = mergeObjects(objA, objB)
		expect(mergedObj).toMatchObject(<AbcObj>{
			objA: {
				a: 'a',
				b: null,
				c: {},
				d: null,
				e: 'e',
				f: 0,
				g: new Date(2020, 0),
			}
		})
	})

	it('should result the expected properties values for deep nested objects after merging.', () => {
		const objA: AbcObj = {
			objC: {
				nestedObj: {
					deepNestedObj: {
						a: 'a'
					}
				}
			}
		}
		const objB: AbcObj = {
			objC: {
				nestedObj: {
					deepNestedObj: {
						b: 'b'
					}
				}
			}
		}
		const mergedObj = mergeObjects(objA, objB)
		expect(mergedObj).toMatchObject(<AbcObj>{
			objC: {
				nestedObj: {
					deepNestedObj: {
						a: 'a',
						b: 'b',
					}
				}
			}
		})
	})

	it('should result the expected property array values after merging.', () => {
		const objA: AbcObj = {
			a: [1],
			b: [2],
			c: null,
			d: [],
			objA: {
				a: [1],
				b: [2],
				c: [3],
			}
		}
		const objB: AbcObj = {
			a: ['a'],
			b: null,
			c: ['c'],
			e: [],
			objA: {
				a: ['a'],
				b: null,
			}
		}
		const mergedObj = mergeObjects(objA, objB)
		expect(mergedObj).toMatchObject(<AbcObj>{
			a: ['a'],
			b: null,
			c: ['c'],
			d: [],
			e: [],
			objA: {
				a: ['a'],
				b: null,
				c: [3],
			}
		})
	})

	it('should result the expected properties after merging.', () => {
		const objA: AbcObj = {
			a: {},
			b: [],
			c: [{}],
			d: null,
			e: [],
			f: {},
			g: [{}],
		}
		const objB: AbcObj = {
			a: [],
			b: {},
			c: null,
			d: [{}],
			e: new Date(2000, 0),
			f: new Date(2000, 0),
		}
		const mergedObj = mergeObjects(objA, objB)
		expect(mergedObj).toMatchObject(<AbcObj>{
			a: [],
			b: {},
			c: null,
			d: [{}],
			e: new Date(2000, 0),
			f: new Date(2000, 0),
			g: [{}],
		})
	})
})
