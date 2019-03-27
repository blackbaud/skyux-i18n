export class SkyI18nFormat {
  public static formatText(format: string, ...args: any[]): string {
    return String(format).replace(
      /\{(\d+)\}/g,
      function (match, capture): string {
        return args[parseInt(capture, 10)];
      }
    );
  }
}
