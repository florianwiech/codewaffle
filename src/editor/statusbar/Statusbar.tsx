import { showPanel } from "@codemirror/panel";
import { EditorView, ViewUpdate } from "@codemirror/view";
import ReactDOM from "react-dom";
import { FC } from "react";
import { CursorInformation } from "./CursorInformation";
import { LanguageSwitch } from "./LanguageSwitch";
import { AppearanceSwitch } from "./AppearanceSwitch";

const StatusbarPanel: FC<{ view: EditorView }> = ({ view }) => {
  return (
    <>
      <div className="spacer" />
      <CursorInformation state={view.state} />
      <AppearanceSwitch />
      <LanguageSwitch view={view} />
    </>
  );
};

const renderElement = (dom: HTMLElement, view: EditorView) => {
  ReactDOM.render(<StatusbarPanel view={view} />, dom);
};

export const statusbar = showPanel.of((view: EditorView) => {
  const element = document.createElement("div");
  element.className = "cm-statusbar";

  const update = (update: ViewUpdate) => renderElement(element, update.view);

  renderElement(element, view);

  return {
    dom: element,
    update,
  };
});
