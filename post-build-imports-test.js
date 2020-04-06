
const MODULES_LIST = [
	'./lib/public-api.js'
]

main()

async function main() {
	registerBabel()
	try {
		await validateAllModules()
	} catch (e) {
		console.log()
		console.error("\x1b[31m", 'ERROR!!!')
		console.error("\x1b[31m", e.errorMsg, "\x1b[0m")
		console.log()
		console.error(e.error)
		console.log()
		return
	}
	console.log()
	console.log("\x1b[32m", 'Module validation passes successfully.', "\x1b[0m")
	console.log()
}

function registerBabel() {
	require("@babel/register")({
		presets: ["@babel/preset-env"],
		plugins: [
			[
				"module-resolver",
				{
					root: [
						"./"
					],
					alias: {
						"lbrx/helpers": "./lib/helpers",
						"lbrx/mode": "./lib/mode",
					}
				}
			]
		]
	})
}

async function validateAllModules() {
	return new Promise(async (resolve, reject) => {
		let errorMsg = null
		let error = null
		await Promise.all(MODULES_LIST.map(async moduleName => {
			await import(moduleName).catch(e => {
				errorMsg = `Can't resolve module name: ${moduleName}`
				error = e
				return
			})
		}))
		error ? reject({ errorMsg, error }) : resolve()
	})
}


