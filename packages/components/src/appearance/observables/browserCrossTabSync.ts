import { useEffect } from "react";
import { APPEARANCE_CHANNEL } from "../utils/appearance-keys";
import { changeAppearance } from "../appearance-subjects";
import { AppearanceState } from "../appearance-types";

export const useBrowserCrossTabSync = () => {
  useEffect(() => {
    if (typeof window === undefined || window?.BroadcastChannel === undefined) {
      return;
    }

    const channel = new BroadcastChannel(APPEARANCE_CHANNEL);

    channel.onmessage = function (message: MessageEvent<AppearanceState>) {
      let { data } = message;

      changeAppearance(data, false);
    };

    return () => {
      channel.close();
    };
  }, []);
};