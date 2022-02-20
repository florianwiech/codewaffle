import { FC, useEffect, useMemo, useRef } from "react";
import { EditorView } from "@codemirror/view";
import { EditorStateConfig } from "@codemirror/state";
import {
  AppearanceSwitch,
  basics,
  CursorInformation,
  initialLanguageSetup,
  initialThemeSetup,
  LanguageSwitch,
  notification,
  statusbar,
  StyledEditor,
  useCodeMirror,
  useCodeMirrorTheme,
} from "@codewaffle/components";
import { getEditorChanges } from "@codewaffle/domain";
import { useObservable } from "@codewaffle/utils";
import { command$, editor$, notification$, view$ } from "./store";
import { appearance$, changeAppearance, theme$ } from "./appearance";

const StatusbarPanel: FC<{ view: EditorView }> = ({ view }) => {
  const appearance = useObservable(appearance$)!;

  return (
    <>
      <div className="spacer" />
      <CursorInformation state={view.state} />
      <AppearanceSwitch appearance={appearance} onAppearanceChange={changeAppearance} />
      <LanguageSwitch view={view} />
    </>
  );
};

export const CodeMirror: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useObservable(theme$);

  const options = useMemo<EditorStateConfig>(
    () => ({
      extensions: [
        //
        basics,
        initialThemeSetup,
        initialLanguageSetup,
        statusbar(StatusbarPanel),
        notification(notification$),
      ],
    }),
    [],
  );

  const editor = useCodeMirror({
    ref,
    editor$,
    options,
  });

  useCodeMirrorTheme({ editor, theme });

  useEffect(() => {
    const sub = getEditorChanges({ notification$, command$, view$ }).subscribe();
    return () => sub.unsubscribe();
  }, []);

  return <StyledEditor ref={ref} />;
};
