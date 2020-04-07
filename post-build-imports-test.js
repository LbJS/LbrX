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
const JS_FILES_REGEX = /^(?!.*\.map\.js).*\.js$/
const DECLARATION_FILES_REGEX = /^.*\.d.ts$/
const VALID_DECLARATION_FILES_PREFIXES = [
	'./',
	'lbrx',
	'rxjs',
]

main()

async function main() {
	registerBabel(BABEL_CONFIG)
	const jsModules = getFilesFromDir(LIBRARY_FOLDER, JS_FILES_REGEX)
	const declarationFiles = getFilesFromDir(LIBRARY_FOLDER, DECLARATION_FILES_REGEX)
	try {
		await validateAllJsModules(jsModules)
		validateDeclarationFiles(declarationFiles)
	} catch (e) {
		logError(e)
		return
	}
	logSuccess()
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
async function validateAllJsModules(jsModules) {
	return new Promise(async (resolve, reject) => {
		let error = null
		await Promise.all(jsModules.map(async module => {
			await import(module).catch(e => {
				error = {
					innerError: e,
					message: `Can't resolve module name: ${module}`,
				}
				return
			})
		}))
		error ? reject(error) : resolve()
	})
}

/**
 * @param {string[]} declarationFiles
 */
function validateDeclarationFiles(declarationFiles) {
	declarationFiles.forEach(file => {
		const fileContent = fs.readFileSync(file, { encoding: 'utf8' })
		const fileLines = fileContent.split('\n')
		fileLines.forEach(line => {
			if (!line.startsWith('export *') && !line.startsWith('import')) return
			let moduleName = line.split('from ')[1]
			moduleName = moduleName.substring(1, moduleName.length - 3)
			const isFileValid = VALID_DECLARATION_FILES_PREFIXES.some(prefix => moduleName.startsWith(prefix))
			if (!isFileValid) {
				throw new Error(`Module: "${moduleName}" in file: "${file}" is invalid!`)
			}
		})
	})
}

/**
 * @param {{ error, message }} e
 */
function logError(e) {
	console.log()
	console.error("\x1b[31m", 'ERROR!!!')
	console.error("\x1b[31m", e.message, "\x1b[0m")
	console.log()
	if (e.innerError) {
		console.error(e.innerError)
		console.log()
	}
}

function logSuccess() {
	console.log()
	console.log("\x1b[32m", 'Module validation passes successfully.', "\x1b[0m")
	console.log()
}
