import { _electron as electron, test, expect } from "@playwright/test";
import type { ElectronApplication } from "@playwright/test";

test.describe("execute commands", () => {
  let electronApp: ElectronApplication;

  test.beforeEach(async () => {
    electronApp = await electron.launch({ args: ["./build/main/main.cjs"], bypassCSP: true });
  });

  test.afterEach(async () => {
    await electronApp.close();
  });

  test("attachable script", async () => {
    const window = await electronApp.firstWindow();

    await window.press(".cm-activeLine", "Control+k");

    await window.fill('input[aria-label="Search command..."]', "timestamp");

    await window.locator("li.active").dblclick();

    const content = await window.$eval(".cm-activeLine", (el) => el.textContent);

    expect(content).toMatch(/[0-9]{10}/);
  });

  test("content replacement", async () => {
    const window = await electronApp.firstWindow();

    await window.fill(
      ".cm-activeLine",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    );

    await window.press(".cm-activeLine", "Control+k");

    await window.fill('input[aria-label="Search command..."]', "jwt decode");

    await window.locator("li.active").dblclick();

    const content = await window.$eval(".cm-activeLine", (el) => el.textContent);

    expect(content).toBe("}");
  });

  test("failed content replacement", async () => {
    const window = await electronApp.firstWindow();

    await window.fill(".cm-activeLine", "no valid token here");

    await window.press(".cm-activeLine", "Control+k");

    await window.fill('input[aria-label="Search command..."]', "jwt decode");

    await window.locator("li.active").dblclick();

    const content = await window.$eval(".danger span", (el) => el.textContent);

    expect(content).toBe("Invalid Token");
  });
});
