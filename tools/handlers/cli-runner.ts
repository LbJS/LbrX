import { exec } from 'child_process'
import { Provider } from '../provider'

export function runCommand(command: string, logMsg?: string): Promise<string> {
  const logger = Provider.getLoggerHandler()
  return new Promise((resolve, reject) => {
    const child = exec(command, (error, stdout, stderr) => {
      error ? reject(error || stderr) : resolve(stdout)
    })
    if (logMsg) logger.log(logMsg)
    if (child.stdout) {
      child.stdout.on('data', stdout => {
        logger.log(stdout)
      })
    }
  })
}
