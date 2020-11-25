import { LOGGER_CONFIG, POST_PG_BUILD_CONFIG, POST_SRC_BUILD_CONFIG, SRC_BUILD_CONFIG } from './configs'
import { AppDetails, ConfigHandler, HashHandler, LoggerHandler } from './handlers'
import { PostPgBuildConfig, PostSrcBuildConfig, SrcBuildConfig } from './models'

export class Provider {

  private static container: { [key: string]: {} } = {}

  public static getPostPgBuildConfigHandler = (): ConfigHandler<PostPgBuildConfig> => {
    if (!Provider.container[ConfigHandler.name + 'A']) {
      Provider.container[ConfigHandler.name + 'A'] = new ConfigHandler<PostPgBuildConfig>(POST_PG_BUILD_CONFIG)
    }
    return Provider.container[ConfigHandler.name + 'A'] as ConfigHandler<PostPgBuildConfig>
  }
  public static getPostSrcBuildConfigHandler = (): ConfigHandler<PostSrcBuildConfig> => {
    if (!Provider.container[ConfigHandler.name + 'B']) {
      Provider.container[ConfigHandler.name + 'B'] = new ConfigHandler<PostSrcBuildConfig>(POST_SRC_BUILD_CONFIG)
    }
    return Provider.container[ConfigHandler.name + 'B'] as ConfigHandler<PostSrcBuildConfig>
  }
  public static getSrcBuildConfigHandler = (): ConfigHandler<SrcBuildConfig> => {
    if (!Provider.container[ConfigHandler.name + 'C']) {
      Provider.container[ConfigHandler.name + 'C'] = new ConfigHandler<SrcBuildConfig>(SRC_BUILD_CONFIG)
    }
    return Provider.container[ConfigHandler.name + 'C'] as ConfigHandler<SrcBuildConfig>
  }
  public static getLoggerHandler = (): LoggerHandler => {
    if (!Provider.container[LoggerHandler.name]) {
      Provider.container[LoggerHandler.name] = new LoggerHandler(LOGGER_CONFIG)
    }
    return Provider.container[LoggerHandler.name] as LoggerHandler
  }
  public static getHashHandler = (): HashHandler => {
    if (!Provider.container[HashHandler.name]) {
      Provider.container[HashHandler.name] = new HashHandler(Provider.getPostPgBuildConfigHandler())
    }
    return Provider.container[HashHandler.name] as HashHandler
  }
  public static getAppDetailsHandler = (): AppDetails => {
    if (!Provider.container[AppDetails.name]) {
      Provider.container[AppDetails.name] = new AppDetails(Provider.getPostSrcBuildConfigHandler())
    }
    return Provider.container[AppDetails.name] as AppDetails
  }

  private constructor() { }
}
