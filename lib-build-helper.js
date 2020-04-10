const fs = require('fs')
const { exec } = require('child_process')

const SOURCE_FOLDER = ''
const TARGET_FOLDER = 'lib/'

const FILES_TO_COPY = [
  'README.md',
  'LICENSE',
]

const GIT_PUBLISH_TAG = 'git-post-publish:tag:push:push-tag'

main()

async function main() {
  try {
    // copy missing files
    FILES_TO_COPY.forEach(fileName => copyFile(resolveSourcePath(fileName), resolveTargetPath(fileName)))
    // get package.json obj from file
    let packageJsonObj = readJsonFromFile(resolveSourcePath('package.json'))
    // get last published version from npm
    const lastPublishedVer = await getLastPublishedVerAsync().catch(e => { throw new Error(e) })
    // update App version if needed
    if (lastPublishedVer == packageJsonObj.version) packageJsonObj = updateAppVersion(packageJsonObj, lastPublishedVer)
    // handle properties for prod version
    packageJsonObj = handlePackageJsonProps(packageJsonObj)
    // write package.json to target
    writeJsonToFile(resolveTargetPath('package.json'), packageJsonObj)
    // log success
    logSuccess()
  } catch (e) {
    logError(e)
  }
}

/**
 * @param {string} fileName
 * @returns {string}
 */
function resolveSourcePath(fileName) {
  return SOURCE_FOLDER + fileName
}

/**
 * @param {string} fileName
 * @returns {string}
 */
function resolveTargetPath(fileName) {
  return TARGET_FOLDER + fileName
}

/**
 * @param {string} sourceFilePath
 * @param {string} targetFilePath
 */
function copyFile(sourceFilePath, targetFilePath) {
  fs.createReadStream(sourceFilePath).pipe(fs.createWriteStream(targetFilePath))
}

/**
 * @param {string} filePath
 * @returns {{}}
 */
function readJsonFromFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath))
}

/**
 * @param {string} filePath
 * @param {{}} jsonObj
 */
function writeJsonToFile(filePath, jsonObj) {
  fs.writeFileSync(filePath, JSON.stringify(jsonObj, null, 2) + '\n', 'utf-8')
}

/**
 * @returns {string}
 */
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

/**
 * @param {{}} obj
 * @returns {{}}
 */
function cloneJsonObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * @param {() => {}} callback
 */
function runAsync(callback) {
  setTimeout(() => {
    callback()
  })
}

/**
 * @param {{}} packageJsonObj
 * @param {string} lastPublishedVer
 */
function updateAppVersion(packageJsonObj, lastPublishedVer) {
  // version format: {major}.{minor}.{patch}-{release type?}
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
      throw new Error(`Max package.json version number exceeded.`)
    }
  }
  // construct new version string
  const newVersion = `${majorVersion}.${minorVersion}.${patchVersion}${versionType ? '-' + versionType : ''}`
  // set new version to package json
  packageJsonObj.version = newVersion
  if (!packageJsonObj.scripts[GIT_PUBLISH_TAG].includes(lastPublishedVer)) {
    throw new Error(`${GIT_PUBLISH_TAG} doesn't include the current last published version.`)
  }
  packageJsonObj.scripts[GIT_PUBLISH_TAG] = packageJsonObj.scripts[GIT_PUBLISH_TAG].replace(lastPublishedVer, newVersion)
  // clone packageJsonObj to disconnect reference
  const packageJsonObjCloned = cloneJsonObject(packageJsonObj)
  runAsync(() => {
    // write the new version to package.json
    writeJsonToFile(resolveSourcePath('package.json'), packageJsonObjCloned)
    // update package-lock.json
    const packageLockJsonObj = readJsonFromFile(resolveSourcePath('package-lock.json'))
    packageLockJsonObj.version = newVersion
    writeJsonToFile(resolveSourcePath('package-lock.json'), packageLockJsonObj)
  })
  return packageJsonObj
}

/**
 * @param {{}} packageJsonObj
 * @returns {{}}
 */
function handlePackageJsonProps(packageJsonObj) {
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
  return packageJsonObj
}

function logSuccess() {
  console.log()
  console.log("\x1b[32m", 'LbrX post build procedure was finished successfully.', "\x1b[0m")
  console.log()
}

/**
 * @param {Error} e
 */
function logError(e) {
  console.log()
  console.error("\x1b[31m", 'ERROR!!!')
  console.log()
  console.error(e, "\x1b[0m")
  console.log()
}
