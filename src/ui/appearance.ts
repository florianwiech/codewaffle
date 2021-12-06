import { BehaviorSubject, merge, withLatestFrom } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { tag } from "rxjs-spy/cjs/operators";
import { convertAppearanceToTheme } from "./utils/convertAppearanceToTheme";
import {
  APPEARANCE_ATTRIBUTE,
  APPEARANCE_STORAGE,
} from "./utils/appearance-keys";

export enum AppearanceState {
  SYSTEM = "system",
  DARK = "dark",
  LIGHT = "light",
}

const getInitialAppearance = (): AppearanceState => {
  try {
    const themeAppearance = window.localStorage.getItem(APPEARANCE_STORAGE);

    if (
      themeAppearance === AppearanceState.DARK ||
      themeAppearance === AppearanceState.LIGHT
    ) {
      return themeAppearance;
    }
  } catch (e) {}
  return AppearanceState.SYSTEM;
};

export const appearance$ = new BehaviorSubject<AppearanceState>(
  getInitialAppearance(),
);
export const history$ = new BehaviorSubject<AppearanceState>(
  getInitialAppearance(),
);

export const theme$ = appearance$.pipe(convertAppearanceToTheme());

const shouldChange$ = appearance$.pipe(
  withLatestFrom(history$),
  map(([next, previous]) => ({ next, previous })),
  filter(({ next, previous }) => next !== previous),
  map(({ next }) => next),
);

const updateDocument$ = shouldChange$.pipe(
  convertAppearanceToTheme(),
  tap((theme) =>
    document.documentElement.setAttribute(
      APPEARANCE_ATTRIBUTE,
      theme.toString(),
    ),
  ),
  tag("document-updater"),
);

const updateStorage$ = shouldChange$.pipe(
  tap((appearance) =>
    appearance === AppearanceState.SYSTEM
      ? localStorage.removeItem(APPEARANCE_STORAGE)
      : localStorage.setItem(APPEARANCE_STORAGE, appearance),
  ),
  tag("storage-updater"),
);

const updateOtherTabs$ = shouldChange$.pipe(
  tap((next) => {
    if (window.BroadcastChannel === undefined) return;

    const channel = new BroadcastChannel("appearance");
    channel.postMessage(next);
    channel.close();
  }),
  tag("cross-tab-updater"),
);

const updateHistory$ = shouldChange$.pipe(
  tap((next) => history$.next(next)),
  tag("history-updater"),
);

export const updateAppearance$ = merge(
  updateDocument$,
  updateStorage$,
  updateOtherTabs$,
  updateHistory$,
);

export const changeAppearance = (next: AppearanceState, emit = true) => {
  if (!emit) history$.next(next);
  appearance$.next(next);
};
