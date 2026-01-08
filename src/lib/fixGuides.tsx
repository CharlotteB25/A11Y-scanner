/**
 * Accessibility Fix Guides Module
 *
 * This module defines and exports fix guides for common web accessibility (a11y) issues.
 * It is part of an accessibility scanning tool that helps developers identify and remediate
 * violations detected by tools like axe-core. Each guide provides actionable advice on how
 * to fix specific accessibility problems, improving the usability of web content for users
 * with disabilities.
 *
 * Key Components:
 * - FixGuide: A TypeScript type defining the structure of a fix guide, including:
 *   - title: A brief, descriptive title for the issue.
 *   - why: Explanation of why the issue matters for accessibility.
 *   - how: An array of step-by-step instructions on how to fix the issue.
 *   - example (optional): Code or markup examples demonstrating the fix.
 *   - links (optional): Array of related resources with labels and URLs.
 *
 * - FIX_GUIDES: A record object mapping accessibility rule IDs (e.g., "image-alt", "link-name")
 *   to their corresponding FixGuide objects. These guides cover a wide range of common issues,
 *   including:
 *   - Image accessibility (alt text requirements).
 *   - Link and button naming for screen readers.
 *   - Form labeling and structure.
 *   - Document language attributes.
 *   - Semantic HTML landmarks.
 *   - Color contrast for readability.
 *
 * Usage:
 * This module is imported and used by other parts of the application, such as the scanner
 * or UI components, to display remediation advice when accessibility issues are detected.
 * For example, when a scan identifies a missing alt attribute on an image, the corresponding
 * "image-alt" guide can be retrieved and presented to the user.
 *
 * Dependencies:
 * - None external; relies on standard TypeScript types.
 *
 * Notes:
 * - Guides are based on WCAG (Web Content Accessibility Guidelines) principles and best practices.
 * - Examples are provided in HTML/JSX format where applicable.
 * - This file is intended to be extensible; new guides can be added as needed for additional rules.
 */

export type FixGuide = {
  title: string;
  why: string;
  how: string[];
  example?: string;
  links?: { label: string; href: string }[];
};

export const FIX_GUIDES: Record<string, FixGuide> = {
  "image-alt": {
    title: "Images need alternative text",
    why: "Screen readers rely on alt text to describe images. Without it, non-visual users miss content or context.",
    how: [
      "If the image conveys meaning, add a descriptive alt.",
      'If the image is decorative, use alt="".',
      'Avoid repeating nearby text (e.g., don’t alt="Buy now" if the button already says it).',
    ],
    example: `<img src="/team.jpg" alt="Team standing in front of the office" />
<img src="/divider.png" alt="" />`,
  },

  "link-name": {
    title: "Links need discernible text",
    why: "Screen readers often list links out of context. “Click here” or icon-only links make navigation confusing.",
    how: [
      "Ensure the link has visible text, OR",
      "Provide an accessible name using aria-label, OR",
      "If it contains only an icon/image, add alt text to the image (and/or aria-label on the link).",
    ],
    example: `<a href="/pricing">View pricing</a>

<a href="/home" aria-label="Home">
  <svg aria-hidden="true" ...></svg>
</a>`,
  },

  "button-name": {
    title: "Buttons need an accessible name",
    why: "Without a name, assistive tech can’t announce what the button does.",
    how: [
      "Use visible text inside the button where possible.",
      "If it’s icon-only, add aria-label.",
      "If you use an SVG, make it aria-hidden and label the button.",
    ],
    example: `<button type="button">Save</button>

<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true" ...></svg>
</button>`,
  },

  label: {
    title: "Form controls need labels",
    why: "Labels let screen reader users understand what information a field expects and improve click/tap targets.",
    how: [
      "Prefer a <label> with for= that matches the input id.",
      "Alternatively, wrap the input with <label>…</label>.",
      "Use aria-label only when a visible label truly isn’t possible.",
    ],
    example: `<label for="email">Email</label>
<input id="email" name="email" type="email" autocomplete="email" />

<label>
  Password
  <input name="password" type="password" />
</label>`,
  },

  "select-name": {
    title: "Select elements need an accessible name",
    why: "A select without a name is announced ambiguously (e.g., “combo box”) without context.",
    how: [
      "Add a <label> connected by for/id (recommended).",
      "Or provide aria-label / aria-labelledby if a visible label isn't possible.",
    ],
    example: `<label for="country">Country</label>
<select id="country" name="country">
  <option>Belgium</option>
</select>`,
  },

  "html-has-lang": {
    title: "HTML document needs lang",
    why: "Screen readers use lang to pick correct pronunciation rules and voice models.",
    how: [
      'Add lang to the <html> element (e.g., lang="en", lang="nl", lang="fr").',
      "If your page mixes languages, mark specific parts with lang attributes too.",
    ],
    example: `<html lang="en">
  ...
</html>

<p lang="fr">Bonjour tout le monde</p>`,
  },

  "landmark-one-main": {
    title: "Page should have one main landmark",
    why: "Landmarks allow keyboard and screen reader users to jump to major sections quickly.",
    how: [
      "Wrap primary page content in <main>.",
      "Only use one <main> per page.",
      "Use <header>, <nav>, <aside>, <footer> for other sections.",
    ],
    example: `<header>...</header>
<nav>...</nav>
<main id="content">...</main>
<footer>...</footer>`,
  },

  region: {
    title: "Content should be contained by landmarks",
    why: "Landmarks create a navigable structure for assistive tech (like headings, but for page regions).",
    how: [
      "Use semantic landmarks (<main>, <nav>, <header>, <footer>, <aside>).",
      "If you must use a generic container, add role='region' and a label (aria-label).",
    ],
    example: `<section aria-label="Featured products">
  ...
</section>`,
  },

  "color-contrast": {
    title: "Insufficient color contrast",
    why: "Low contrast makes text hard to read, especially for low vision users or bright screens.",
    how: [
      "Increase text color darkness/lightness relative to background.",
      "Increase font size/weight (large text has lower ratio requirements).",
      "Avoid placing text over busy images without a solid overlay.",
    ],
    example: `/* Example: darken text or lighten background */
.card-title { color: #0b1220; }
.card { background: #ffffff; }`,
  },
};
