import { PostSrcBuildConfig } from '../models'
import { LOGGER_CONFIG } from './logger-config'

const rootFolder = './'
const buildFolder = 'build'
const sourceFolderName = 'src'

export const POST_SRC_BUILD_CONFIG: PostSrcBuildConfig = {
  logger: LOGGER_CONFIG,
  rootFolder,
  buildFolder,
  packageJsonPath: 'package.json',
  packageLockJsonPath: 'package-lock.json',
  filesToCopy: [
    {
      rootFolder,
      targetFolder: buildFolder,
      files: [
        'README.md',
        'LICENSE',
      ],
    },
    {
      rootFolder,
      targetFolder: `${buildFolder}/${sourceFolderName}`,
      sourceFolder: {
        name: sourceFolderName,
        excludedFileNamesByPattern: 'tsconfig.*.json',
        excludeFilesThatStartsWith: 'rollup-',
        excludedFiles: [
          'tsconfig.json'
        ],
      }
    }
  ],
  npmGetVerCommand: 'npm show [appName] version',
  buildPackageJsonConfig: {
    propertiesToDelete: [
      'scripts',
      'devDependencies',
      'jest',
      'types',
    ],
    propertiesToAddOrUpdate: [
      {
        key: 'main',
        value: './es2018/index.js'
      },
      {
        key: 'module',
        value: './esm2018/index.js'
      },
      {
        key: 'types',
        value: './types/index.d.ts'
      },
      {
        key: 'es2015',
        value: './es2015/index.js'
      },
      {
        key: 'esm2015',
        value: './esm2015/index.js'
      },
      {
        key: 'es5',
        value: './es5/index.js'
      },
      {
        key: 'esm5',
        value: './esm5/index.js'
      },
    ]
  },
  rootPackageJsonConfig: {
    propertiesToDelete: [],
    propertiesToAddOrUpdate: [
      {
        key: 'version',
        value: '[appVer]'
      },
      {
        key: 'scripts.git:tag&push&push-tag',
        value: 'git tag [appVer] && git push && git push --tags'
      },
    ]
  },
  packageLockJsonConfig: {
    propertiesToDelete: [],
    propertiesToAddOrUpdate: [
      {
        key: 'version',
        value: '[appVer]'
      },
    ]
  },
  bannerAdder: {
    rootFolder: `${rootFolder}/${buildFolder}/bundles`,
    isSeparateRow: true,
    bannerSets: [
      {
        fileType: '.js',
        banner: '/*! == LbDate version: [appVer] | Copyright (c) 2020 Leon Bernstein | StaffOfFrost | Released under the MIT license == */'
      },
    ],
    excludedFiles: [],
    excludedSubFolders: [],
    includedSubFolders: [],
  }
}
