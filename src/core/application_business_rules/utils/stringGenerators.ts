export class StringGenerators {
  static getRandomLetterId(length = 5): string {
    return Math.random()
      .toString(36)
      .slice(-length)
      .toUpperCase();
  } // end of generateRandomName

  static getRandomNumericId(length = 5): string {
    return Math.floor(1 ** length + Math.random() * 9 ** length).toString();
  } // end of getRandomNumericId
}
