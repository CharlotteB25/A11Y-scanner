/**
 * Accessibility Scanner Module using Axe-Core
 *
 * This module provides functionality to scan web pages for accessibility violations
 * using the axe-core library integrated with Playwright for browser automation.
 *
 * Purpose:
 * - Scans a given URL for accessibility issues based on WCAG guidelines.
 * - Returns a structured response containing detected violations, their impact,
 *   descriptions, and remediation help.
 *
 * How it works:
 * 1. Normalizes the input URL to ensure it has a protocol (http/https).
 * 2. Launches a headless Chromium browser using Playwright.
 * 3. Navigates to the target URL and waits for the DOM to load.
 * 4. Injects the axe-core JavaScript bundle into the page.
 * 5. Executes axe-core's accessibility audit on the document.
 * 6. Processes the results into a standardized ScanResponse format.
 * 7. Handles errors gracefully, returning an error message if the scan fails.
 * 8. Closes the browser instance after the scan.
 *
 * Dependencies:
 * - Playwright: For browser automation and page interaction.
 * - axe-core: The core accessibility testing engine.
 * - Node.js path module: For resolving the axe-core script path.
 *
 * Usage:
 * This function is typically called from an API endpoint (e.g., /api/scan) to
 * perform on-demand accessibility scans of web pages.
 */

import type { ScanResponse, AxeViolation } from "@/lib/types";
import { chromium, type Browser } from "playwright";
import path from "node:path";

type AxeRunResult = {
  url?: string;
  violations: Array<{
    id: string;
    impact?: "minor" | "moderate" | "serious" | "critical";
    description: string;
    help: string;
    helpUrl?: string;
    tags: string[];
    nodes: Array<{
      html?: string;
      target?: string[];
      failureSummary?: string;
    }>;
  }>;
};

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

function toScanResponse(url: string, result: AxeRunResult): ScanResponse {
  const violations: AxeViolation[] = (result.violations ?? []).map((v) => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    help: v.help,
    helpUrl: v.helpUrl,
    tags: v.tags ?? [],
    nodes: (v.nodes ?? []).map((n) => ({
      html: n.html,
      target: n.target,
      failureSummary: n.failureSummary,
    })),
  }));

  return {
    ok: true,
    url,
    timestamp: new Date().toISOString(),
    violations,
  };
}

export async function scanWithAxe(url: string): Promise<ScanResponse> {
  const targetUrl = normalizeUrl(url);
  let browser: Browser | null = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
    });

    const page = await context.newPage();
    page.setDefaultTimeout(30_000);
    page.setDefaultNavigationTimeout(30_000);

    await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);

    // ✅ Inject the browser bundle (UMD) from axe-core
    const axePath = path.join(
      process.cwd(),
      "node_modules",
      "axe-core",
      "axe.min.js"
    );

    await page.addScriptTag({ path: axePath });

    // ✅ Run axe
    const axeResult = await page.evaluate(async () => {
      // @ts-expect-error injected by axe.min.js
      return await window.axe.run(document, { resultTypes: ["violations"] });
    });

    return toScanResponse(targetUrl, axeResult as AxeRunResult);
  } catch (e: any) {
    return {
      ok: false,
      url: targetUrl,
      timestamp: new Date().toISOString(),
      violations: [],
      error: e?.message ?? "Scan failed",
    };
  } finally {
    if (browser) await browser.close();
  }
}
