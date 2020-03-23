
let isDevMode: boolean = true

export function isDev(): boolean {
	return isDevMode
}

export function enableProdMode(): void {
	isDevMode = false
}
