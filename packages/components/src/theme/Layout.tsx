import React from "react";
import { ThemeProvider } from "styled-components";
import dark from "@primer/primitives/dist/js/colors/dark";
import light from "@primer/primitives/dist/js/colors/light";
import { AppearanceState } from "../appearance";
import { GlobalStyle } from "./styles";

export const Layout: React.FC<{ theme?: Omit<AppearanceState, "system"> }> = ({ theme, children }) => {
  return (
    <ThemeProvider theme={theme === AppearanceState.DARK ? dark : light}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};