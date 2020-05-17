import { PostPgBuildConfig } from '../models'
import { LOGGER_CONFIG } from './logger-config'

const rootFolder = 'dist'
const indexHtml = 'index.html'
const excludedDubFoldersForHashing = [
  'icons'
]

export const POST_PG_BUILD_CONFIG: PostPgBuildConfig = {
  logger: LOGGER_CONFIG,
  hashLength: 20,
  hashCharPool: 'abcdefghijklmnopqrstvuwxyzABCDEFGHIJKLMNOPQRSTVUWXYZ0123456789',
  // tslint:disable-next-line: max-line-length
  minifyHtmlCommand: `html-minifier ${rootFolder}/${indexHtml} --collapse-whitespace --minify-js --minify-css -o ${rootFolder}/${indexHtml}`,
  fileStringReplacement: {
    rootFolder,
    sets: [
      {
        filePath: indexHtml,
        replacementSets: [
          {
            currStr: '<base href="/playground/www/">',
            nextStr: '<base href="/playgrounds/lbdate/">'
          },
          {
            currStr: 'src="./main.js"',
            nextStr: 'src="./main.[hash].js"'
          },
          {
            currStr: 'src="./loading-script.js"',
            nextStr: 'src="./loading-script.[hash].js"'
          },
        ]
      }
    ]
  },
  fileHasher: {
    rootFolder,
    fileExtensions: [
      '.js',
      '.css',
    ],
    excludedFiles: [],
    includedFiles: [],
    excludedSubFolders: excludedDubFoldersForHashing,
    includedSubFolders: [],
  },
  hashVerifier: {
    rootFolder,
    indexHtml,
    excludedFiles: [],
    excludedSubFolders: excludedDubFoldersForHashing,
    hashSets: [],
    nonHashedFilesValidation: {
      throwError: true,
      extensionToCheck: [
        '.js',
        '.css',
      ]
    }
  },
  bannerAdder: {
    rootFolder,
    isSeparateRow: true,
    bannerSets: [
      {
        fileType: '.js',
        banner: '/*! == Copyright 2020 Leon Bernstein | LbJS == */'
      },
      {
        fileType: '.css',
        banner: '/*! == Copyright 2020 Leon Bernstein | LbJS == */'
      },
      {
        fileType: '.html',
        banner: '<!-- Copyright 2020 Leon Bernstein | LbJS -->'
      },
    ],
    excludedFiles: [],
    excludedSubFolders: [],
    includedSubFolders: [],
  }
}
