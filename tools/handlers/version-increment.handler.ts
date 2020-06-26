import { Provider } from '../provider'

export async function handleVersionIncrement(): Promise<void> {
  let arg = process.argv[3]
  if (arg) arg = arg.substr(2)
  const doInclementVersion = arg === 'increment-version'
  if (!doInclementVersion) return
  const appDetails = Provider.getAppDetailsHandler()
  const currAppVer = await appDetails.getCurrAppVer()
  if (currAppVer === appDetails.nextAppVer) appDetails.nextAppVer = incrementVersion(appDetails.nextAppVer)
}

function incrementVersion(version: string): string {
  // tslint:disable-next-line: prefer-const
  let [versionNumber, versionType]: [string, string] = version.split('-') as [string, string]
  if (version.includes('beta')) {
    let betaVersion = +versionType.split('.')[1]
    versionType = versionType.split('.')[0]
    betaVersion++
    if (betaVersion > 9) throw new Error('Max package.json beta version number exceeded.')
    return `${versionNumber}-${versionType}.${betaVersion}`
  } else {
    // tslint:disable-next-line: prefer-const
    let [majorVersion, minorVersion, patchVersion]: number[] = versionNumber.split('.').map(x => +x)
    if (patchVersion < 9) {
      patchVersion++
    } else {
      patchVersion = 0
      if (minorVersion < 9) {
        minorVersion++
      } else {
        throw new Error('Max package.json version number exceeded.')
      }
    }
    return `${majorVersion}.${minorVersion}.${patchVersion}${versionType ? '-' + versionType : ''}`
  }
}
