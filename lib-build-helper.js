const fs = require('fs')
const { exec } = require('child_process')

const SOURCE_FOLDER = ''
const TARGET_FOLDER = 'lib/'

const FILES_TO_COPY = [
	'README.md',
	'LICENSE',
]

main()

async function main() {
	// copy files
	FILES_TO_COPY.forEach(fileName => copyFile(resolveSourcePath(fileName), resolveTargetPath(fileName)))
	// get package.json file
	const packageJsonObj = readJsonFromFile(resolveSourcePath('package.json'))
	// update package.json version if needed
	// version format: {major}.{minor}.{patch}-{release type}
	const lastPublishedVer = await getLastPublishedVerAsync().catch(e => { throw new Error(e) })
	if (lastPublishedVer == packageJsonObj.version) {
		// increment version
		let [versionNumber, versionType] = lastPublishedVer.split('-')
		let [majorVersion, minorVersion, patchVersion] = versionNumber.split('.').map(x => +x)
		if (patchVersion < 9) {
			patchVersion++
		} else {
			patchVersion = 0
			if (minorVersion < 9) {
				minorVersion++
			} else {
				throw new Error(`Max package.json version exceeded.`)
			}
		}
		const newVersion = `${majorVersion}.${minorVersion}.${patchVersion}${versionType ? '-' + versionType : ''}`
		packageJsonObj.version = newVersion
		const packageJsonObjCloned = cloneJsonObject(packageJsonObj)
		runAsync(() => {
			writeJsonToFile(resolveSourcePath('package.json'), packageJsonObjCloned)
			const packageLockJsonObj = readJsonFromFile(resolveSourcePath('package-lock.json'))
			packageLockJsonObj.version = newVersion
			writeJsonToFile(resolveSourcePath('package-lock.json'), packageLockJsonObj)
		})
	}
	// delete unnecessary properties from package.json
	const unnecessaryPropertiesList = [
		'scripts',
		'devDependencies',
		'jest',
		'types'
	]
	unnecessaryPropertiesList.forEach(key => {
		delete packageJsonObj[key]
	})
	// add and replace properties in package.json
	packageJsonObj.main = './index.js'
	packageJsonObj.typings = './index.d.ts'
	// write package.json to target
	writeJsonToFile(resolveTargetPath('package.json'), packageJsonObj)
}

function resolveSourcePath(fileName) {
	return SOURCE_FOLDER + fileName
}

function resolveTargetPath(fileName) {
	return TARGET_FOLDER + fileName
}

function copyFile(sourceFilePath, targetFilePath) {
	fs.createReadStream(sourceFilePath).pipe(fs.createWriteStream(targetFilePath))
}

function readJsonFromFile(filePath) {
	return JSON.parse(fs.readFileSync(filePath))
}

function writeJsonToFile(filePath, jsonObj) {
	fs.writeFileSync(filePath, JSON.stringify(jsonObj, null, '\t') + '\n', 'utf-8')
}

function getLastPublishedVerAsync() {
	return new Promise((resolve, reject) => {
		exec('npm show lbrx version', (error, stdout, stderr) => {
			if (error || stderr || !stdout) {
				reject(error || stderr || null)
			} else {
				resolve(stdout.trim())
			}
		})
	})
}

function cloneJsonObject(obj) {
	return JSON.parse(JSON.stringify(obj))
}

function runAsync(callback) {
	setTimeout(() => {
		callback()
	})
}
