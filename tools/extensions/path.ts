import { resolve } from 'path'
import { isNull } from '../helpers'

export function resolvePathsList(pathsList: string[], rootFolder: string | null = null): string[] {
  if (isNull(rootFolder)) {
    return pathsList.map(unresolvedPath => resolvePath(unresolvedPath))
  } else {
    return pathsList.map(unresolvedPath => resolvePath(rootFolder, unresolvedPath))
  }
}

export function resolvePath(...pathsSegments: string[]): string {
  return resolve(...pathsSegments)
}
