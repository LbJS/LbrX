import { isNumber, isString } from '../helpers'
import { PostPgBuildConfig } from '../models'
import { ConfigHandler } from './config.handler'

export class HashHandler {

  private _hashLength: number
  private _hashCharPool: string
  private _hash: string | null = null
  public get hash(): string {
    if (!this._hash) this._hash = this._generateHash()
    return this._hash
  }

  constructor(
    private _config: ConfigHandler<PostPgBuildConfig>
  ) {
    if (!isNumber(this._config.config.hashLength)
      || !isString(this._config.config.hashCharPool)
    ) {
      throw new Error('Hash generator is missing a configuration for hash length or hash char pool.')
    }
    this._hashLength = this._config.config.hashLength
    this._hashCharPool = this._config.config.hashCharPool
  }

  private _generateHash(): string {
    const getRandomInteger = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    let localHash = ''
    for (let i = 0; i < this._hashLength; i++) {
      const charIndex = getRandomInteger(0, this._hashCharPool.length - 1)
      localHash += this._hashCharPool[charIndex]
    }
    return localHash
  }
}
