/**
 * @type {import("@electron-forge/plugin-webpack").WebpackPluginConfig}
 */
const webpackConfig = {
  devContentSecurityPolicy: `default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:`,
  mainConfig: "./webpack.main.config.js",
  port: "3030",
  renderer: {
    config: "./webpack.renderer.config.js",
    entryPoints: [
      {
        html: "./static/index.html",
        js: "./src/renderer/pages/app.tsx",
        preload: {
          js: "./src/preload/app-preload.ts",
        },
        name: "main_window",
      },
      {
        html: "./static/index.html",
        js: "./src/renderer/pages/settings.tsx",
        preload: {
          js: "./src/preload/settings-preload.ts",
        },
        name: "settings_window",
      },
    ],
  },
};

const config = {
  packagerConfig: {
    name: "CodeWaffle",
    executableName: "codewaffle",
    appBundleId: "app.codewaffle",
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "codewaffle",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      platforms: ["linux"],
      config: {
        mimeType: ["x-scheme-handler/codewaffle"],
      },
    },
    {
      name: "@electron-forge/maker-rpm",
      platforms: ["linux"],
      config: {
        mimeType: ["x-scheme-handler/codewaffle"],
      },
    },
  ],
  plugins: [
    //
    ["@electron-forge/plugin-webpack", webpackConfig],
    ["@electron-forge/plugin-electronegativity", { isSarif: true }],
  ],
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "florianwiech",
          name: "codewaffle",
        },
      },
    },
  ],
};

module.exports = config;
