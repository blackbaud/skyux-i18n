export class SkyBrowserDetector {
  public static isIE = (
    !!(window as any).MSInputMethodContext &&
    !!(document as any).documentMode
  );

  public static isWindows7 = (
    navigator.userAgent.indexOf('Windows NT 6.1') > -1
  );
}
