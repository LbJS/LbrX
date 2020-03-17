const fs = require('fs')

// copy README.md
fs.createReadStream('README.md').pipe(fs.createWriteStream('lib/README.md'))
// copy LICENSE
fs.createReadStream('LICENSE').pipe(fs.createWriteStream('lib/LICENSE'))

// copy package.json and remove unnecessary properties
const rawJsonData = fs.readFileSync('package.json')
const packageJsonObj = JSON.parse(rawJsonData)
const unnecessaryPropertiesList = [
	'scripts',
	'devDependencies',
	'jest',
	'types'
]
unnecessaryPropertiesList.forEach(key => {
	delete packageJsonObj[key]
})
packageJsonObj.main = './index.js'
packageJsonObj.typings = './index.d.ts'
fs.writeFileSync('lib/package.json', JSON.stringify(packageJsonObj, null, 2), 'utf-8')
