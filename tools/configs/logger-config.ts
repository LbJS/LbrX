import { LogLevels } from '../enums'
import { LoggerConfig } from '../models/logger-config'

export const LOGGER_CONFIG: LoggerConfig = {
  isActive: true,
  consoleLogLevel: LogLevels.log,
  fileLogLevel: LogLevels.none,
  logFolderLocation: 'logs',
}
