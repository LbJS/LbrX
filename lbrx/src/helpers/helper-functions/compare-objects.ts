export function compareObjects(objA: {} | any[], objB: {} | any[]): boolean {
	if (!objA || !objB) return objA === objB
	if (Array.isArray(objA)) {
		if (Array.isArray(objB) &&
			objA.length == objB.length
		) {
			for (let i = 0; i < objA.length; i++) {
				return compareObjects(objA[i], objB[i])
			}
			return true
		}
		return false
	}
	for (let i = 0, keys = Object.keys(objA); i < keys.length; i++) {
		const p = keys[i]
		// check if property is missing in one of the objects
		if (objA.hasOwnProperty(p) != objB.hasOwnProperty(p)) return false
		switch (typeof objA[p]) {
			// deep compare objects
			case 'object':
				if (!compareObjects(objA[p], objB[p])) return false
				break
			// if both are functions
			case 'function':
				if (typeof objB[p] != 'function') return false
				break
			// compare values
			default:
				if (objA[p] !== objB[p]) return false
		}
	}
	// check objectB for any extra properties
	for (let i = 0, keys = Object.keys(objB); i < keys.length; i++) {
		if (!objA.hasOwnProperty(keys[i])) return false
	}
	return true
}
