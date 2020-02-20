export function compareObjects(obj1: {} | [], obj2: {} | []): boolean {
	if (!obj1 || !obj2) return false
	if (Array.isArray(obj1)) {
		if (Array.isArray(obj2) &&
			obj1.length == obj2.length
		) {
			for (let i = 0; i < obj1.length; i++) {
				return compareObjects(obj1[i], obj2[i])
			}
			return true
		} else {
			return false
		}
	} else {
		for (const p in obj1) {
			if (obj1.hasOwnProperty(p)) {
				// Check property exists on both objects
				if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
					return false;
				}
				switch (typeof (obj1[p])) {
					// Deep compare objects
					case 'object':
						if (!compareObjects(obj1[p], obj2[p])) return false
						break
					// skip function
					case 'function':
						break
					// Compare values
					default:
						if (obj1[p] != obj2[p]) return false
				}
			}
		}
		// Check object 2 for any extra properties
		for (const o in obj2) {
			if (typeof (obj1[o]) == 'undefined') {
				return false
			}
		}
		return true
	}
}
