/* istanbul ignore file */
import { handleUnexpectedError } from '../global'

export class OneAtATime {
  protected static isRunning: boolean

  public static async process() {
    if (this.isRunning) return
    this.isRunning = true
    try {
      await this.doWhenAvailable()
    } catch (error) {
      handleUnexpectedError(error)
    }
    this.isRunning = false
  }

  protected static async doWhenAvailable() { return }
}
