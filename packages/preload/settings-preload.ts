import { ipcRenderer } from "electron";
import type { AppearanceState } from "../shared/appearance-state";
import { IpcEvents } from "../shared/ipc-events";
import type { ISettings } from "../../types/window";
import { apiBasics } from "./api-basics";

export const settings: ISettings = {
  ...apiBasics,
  getAppearance: () => ipcRenderer.invoke(IpcEvents.GET_APPEARANCE),
  changeAppearance: (next: AppearanceState) => ipcRenderer.invoke(IpcEvents.CHANGE_APPEARANCE, next),
  toggleLanguage: (lang: string) => ipcRenderer.invoke(IpcEvents.TOGGLE_LANGUAGE, lang),
};
