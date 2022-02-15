import { BrowserWindow, nativeTheme } from "electron";
import { getBackgroundColor } from "@codewaffle/components";
import { isDevMode } from "../utils/devmode";

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Keep a global reference of the window objects, if we don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
export let browserWindows: Array<BrowserWindow | null> = [];

/**
 * Gets default options for the main window
 */
export function getMainWindowOptions(): Electron.BrowserWindowConstructorOptions {
  return {
    width: isDevMode() ? 1355 : 800,
    height: 900,
    minHeight: 600,
    minWidth: 320,
    titleBarStyle: process.platform === "darwin" ? "hidden" : undefined,
    acceptFirstMouse: true,
    show: false,
    backgroundColor: getBackgroundColor(nativeTheme.shouldUseDarkColors),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  };
}

/**
 * Creates a new main window.
 */
export function createMainWindow(): Electron.BrowserWindow {
  let browserWindow: BrowserWindow | null;
  browserWindow = new BrowserWindow(getMainWindowOptions());

  // and load the index.html of the app.
  browserWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY).then();

  if (isDevMode()) {
    // Open the DevTools.
    browserWindow.webContents.openDevTools();
  }

  browserWindow.webContents.once("dom-ready", () => {
    if (browserWindow) {
      browserWindow.show();
    }
  });

  browserWindow.on("closed", () => {
    browserWindows = browserWindows.filter((bw) => browserWindow !== bw);

    browserWindow = null;
  });

  browserWindows.push(browserWindow);

  return browserWindow;
}

/**
 * Gets or creates the main window, returning it in both cases.
 */
export function getOrCreateMainWindow(): Electron.BrowserWindow {
  return BrowserWindow.getFocusedWindow() || browserWindows[0] || createMainWindow();
}
