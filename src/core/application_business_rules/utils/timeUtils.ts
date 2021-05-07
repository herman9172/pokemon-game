// istanbul ignore file

export class TimeUtils {
  /**
   * Sleep for a certain amount of time
   * If `jitterMaxMs` is specified, a random jitter will be included
   * between the minimum ms and this max ms
   *
   * @param minMs time in milliseconds to wait
   * @param jitterMaxMs maximum time in milliseconds to add jitter
   */
  static async sleep(minMs = 0, jitterMaxMs = 0): Promise<void> {
    const jitter = Math.floor(Math.random() * jitterMaxMs) + minMs;

    return new Promise((resolve) => setTimeout(resolve, jitter));
  }
}
