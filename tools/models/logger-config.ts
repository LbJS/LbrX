import { LogLevels } from '../enums'

export interface LoggerConfig {
  isActive: boolean,
  consoleLogLevel: LogLevels,
  fileLogLevel: LogLevels,
  logFolderLocation: string,
}
