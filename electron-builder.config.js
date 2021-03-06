module.exports = {
  productName: "CodeWaffle",
  appId: "app.codewaffle",
  copyright: "Copyright © 2022 Florian Wiech",

  afterSign: "./tools/notarize.js",

  files: [".webpack/**/*", "package.json"],

  mac: {
    artifactName: "${productName}-${version}-${os}-${arch}.${ext}",
    icon: "static/icons/mac/icon.icns",
    category: "public.app-category.developer-tools",

    target: [
      { target: "dmg", arch: ["x64", "arm64"] },
      { target: "zip", arch: ["x64", "arm64"] },
    ],

    darkModeSupport: true,
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: "./static/entitlements.plist",
    entitlementsInherit: "./static/entitlements.plist",
  },

  dmg: {
    contents: [
      { type: "link", path: "/Applications", x: 410, y: 240 },
      { type: "file", x: 130, y: 240 },
    ],
  },

  publish: [
    {
      provider: "github",
      owner: "florianwiech",
      repo: "codewaffle",
      releaseType: "release",
    },
  ],
};
