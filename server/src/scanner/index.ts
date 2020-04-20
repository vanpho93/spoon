/* istanbul ignore file */
import { CronJob, CronCommand } from 'cron'
import { FanCountUpdater } from './fan-count-updater'

function createJob(time: string, cb: CronCommand, runOnInit = false) {
  new CronJob(time, cb, null, true, null, undefined, runOnInit).start()
}

export async function scan() {
  const EVERY_ONE_SECOND = '*/1 * * * * *'
  createJob(EVERY_ONE_SECOND, () => FanCountUpdater.process(), true)
}
