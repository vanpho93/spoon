export class TestUtils {
  public static getTestTitle(filename: string) {
    const skipText = filename.includes('src') ? 'src' : 'dist'
    const startIndex = filename.indexOf(skipText) + skipText.length
    return filename.substring(startIndex, filename.length - '.test.ts'.length)
  }
}
