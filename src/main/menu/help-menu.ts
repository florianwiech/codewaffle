import { MenuItemConstructorOptions, shell } from "electron";

export function getHelpMenu(): MenuItemConstructorOptions {
  return {
    label: "Help",
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: function () {
          shell.openExternal("https://electronjs.org").then();
        },
      },
    ],
  };
}
