import { Compartment, EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { useEffect, useRef } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { useLayout } from "../ui";
import { AppearanceState, getActiveAppearance } from "../ui/appearance";
import { StyledEditor } from "./Editor.style";
import { initialContent } from "./initialContent";
import { primerDark, primerLight } from "./primerTheme";
import { basics } from "./setup/basics";

const themeConf = new Compartment();

export const Editor = () => {
  const theme = useLayout();
  const ref = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView>();

  useEffect(() => {
    if (!ref.current) return;

    const appearance = getActiveAppearance();
    const prefersDarkAppearance =
      typeof window !== undefined &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const styles =
      appearance === AppearanceState.DARK ||
      (appearance === AppearanceState.SYSTEM && prefersDarkAppearance)
        ? primerDark
        : primerLight;

    const startState = EditorState.create({
      doc: initialContent,
      extensions: [basics, javascript(), themeConf.of(styles)],
    });

    viewRef.current = new EditorView({
      state: startState,
      parent: ref.current,
    });
    return () => viewRef.current?.destroy();
  }, []);

  useEffect(() => {
    if (!viewRef.current) return;

    viewRef.current.dispatch({
      effects: themeConf.reconfigure(
        theme === AppearanceState.DARK ? primerDark : primerLight
      ),
    });
  }, [theme]);

  return <StyledEditor ref={ref} />;
};
