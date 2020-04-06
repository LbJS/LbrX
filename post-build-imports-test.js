const registerBabel = require('@babel/register')
const fs = require('fs')

const BABEL_CONFIG = {
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
}

const LIBRARY_FOLDER = './lib'

main()

async function main() {
	registerBabel(BABEL_CONFIG)
	const jsModules = getFilesFromDir(LIBRARY_FOLDER, /^(?!.*\.map\.js).*\.js$/)
	try {
		await validateAllModules(jsModules)
		logSuccess()
	} catch (e) {
		logError(e)
	}
}

/**
 * @param {string} dir
 * @param {RegExp} regex
 * @returns {string[]}
 */
function getFilesFromDir(dir, regExp) {
	let jsFiles = []
	fs.readdirSync(dir).forEach(fileOrDir => {
		const fullPath = `${dir}/${fileOrDir}`
		if (fs.statSync(fullPath).isFile()) {
			if (!regExp || regExp.test(fullPath)) jsFiles.push(fullPath)
		} else {
			jsFiles = jsFiles.concat(getFilesFromDir(fullPath, regExp))
		}
	})
	return jsFiles
}

/**
 * @param {string[]} jsModules
 * @returns {Promise<void>}
 */
async function validateAllModules(jsModules) {
	return new Promise(async (resolve, reject) => {
		let errorMsg = null
		let error = null
		await Promise.all(jsModules.map(async module => {
			await import(module).catch(e => {
				errorMsg = `Can't resolve module name: ${module}`
				error = e
				return
			})
		}))
		error ? reject({ errorMsg, error }) : resolve()
	})
}

/**
 * @param {{ errorMsg, error }} e
 */
function logError(e) {
	console.log()
	console.error("\x1b[31m", 'ERROR!!!')
	console.error("\x1b[31m", e.errorMsg, "\x1b[0m")
	console.log()
	console.error(e.error)
	console.log()
}

function logSuccess() {
	console.log()
	console.log("\x1b[32m", 'Module validation passes successfully.', "\x1b[0m")
	console.log()
}
