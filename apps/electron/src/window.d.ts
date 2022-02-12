import { Platform } from "process";
import { AppearanceState } from "./types";

export interface IApi {
  platform: Platform;
  onTitleBarClick: () => void;
}

export interface ISettings extends IApi {
  changeAppearance: (next: AppearanceState) => Promise<boolean>;
}

declare global {
  interface Window {
    api: IApi;
    settings: ISettings;
  }
}
