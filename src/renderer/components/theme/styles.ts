import { createGlobalStyle } from "styled-components";
import typography from "@primer/primitives/dist/js/typography/normal";

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;

    color: ${({ theme }) => theme.fg.default};
    background-color: ${({ theme }) => theme.canvas.default};

    font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Open Sans", "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-size: ${typography.fontSize[1]};
    line-height: ${typography.lineHeight.default};

    overflow: hidden;
    box-sizing: border-box;

    width: 100%;
    height: 100%;

    // https://stackoverflow.com/questions/30636930/disable-web-page-navigation-on-swipeback-and-forward
    overscroll-behavior-x: none;

    #root {
      height: 100%;
    }
  }
`;
