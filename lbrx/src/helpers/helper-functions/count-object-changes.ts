export function countObjectChanges(oldObj: {}, newObj: {}): number {
	let changesCount = 0
	if (Array.isArray(oldObj)) {
		if (!Array.isArray(newObj) ||
			Array.isArray(newObj) &&
			JSON.stringify(oldObj) != JSON.stringify(newObj)
		) {
			changesCount++
		}
	} else {
		Object.keys(newObj).forEach(key => {
			if (typeof oldObj[key] == 'object' &&
				typeof newObj[key] == 'object'
			) {
				changesCount += countObjectChanges(oldObj[key], newObj[key])
			}
			if (oldObj[key] !== newObj[key]) changesCount++
		})
	}
	return changesCount
}
