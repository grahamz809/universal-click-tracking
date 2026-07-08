# QA Bookmarklet — Visual Trigger Inspection Tool

> **⚠️ This section is incomplete.** The QA bookmarklet's source file has not been added to the repo yet. The documentation below covers the purpose and workflow, but the install method, JSON-loading UI, and panel layout need to be confirmed from the actual source. See "How to Contribute" at the bottom.

---

## What This Tool Is For

The Taxonomy Inspector bookmarklet (documented in the main README) tells you what *should* fire on an element based on the taxonomy rules. The **QA Bookmarklet** tells you what a *specific GTM container's JSON config* says will fire.

In other words:

| Tool | Question it answers |
|------|-------------------|
| **Taxonomy Inspector** | "What event does the framework THINK this element should be?" |
| **QA Bookmarklet** | "What does MY ACTUAL GTM CONFIG say will fire on this element?" |

They're complementary. Use the Taxonomy Inspector during planning and auditing. Use the QA Bookmarklet after you've generated a GTM JSON (from the GENERATE-TRIGGERS workflow) and want to visually verify that the triggers will land on the right elements before importing to production.

**This is a supplementary visual QA tool — it does NOT replace GTM Preview mode.** GTM Preview mode is still the official verification step before publishing. This tool gives marketers a quick sanity check without needing to navigate GTM's interface.

---

## How It's Different From the Taxonomy Inspector

- **Taxonomy Inspector:** Uses built-in matching rules. No external file needed. Works offline. Shows what *should* happen based on the framework design.
- **QA Bookmarklet:** Requires you to load a GTM JSON file (the one you generated or exported). Shows what your *actual GTM config* will do. Can't work offline — needs the JSON file.
- Both use the same **install method** (drag to bookmarks bar / paste code snippet).

---

## Installation

> **Installation details depend on the actual source file.** The QA bookmarklet will use either:
> - The same loader approach as the Taxonomy Inspector (tiny ~200-char script fetching from CDN), or
> - A standalone `javascript:` URL

**[PLACEHOLDER — Confirm with developer:]**
- Is the install method identical to the Taxonomy Inspector (one drag)?
- Or does it use a separate bookmarklet URL?
- What is the bookmarklet label (e.g., "🎯 QA Triggers")?

---

## Step-by-Step Usage

> **The exact UI and button names below are assumptions based on the general pattern.** The actual steps will be updated once the source file is added to the repo.

### Step 1: Load Your GTM JSON File

After clicking the QA Bookmarklet on any OHIO.edu page, a panel appears. **[Confirm the actual mechanism:]**

- **Does the tool show a file picker / "Choose File" button?** (Upload a `.json` file from your computer)
- **Does it have a text area to paste JSON into?** (Copy-paste from GTM export)
- **Does it load from a URL / localStorage?**

**[PLACEHOLDER — Update after source review]**

### Step 2: Browse the Page

Once the JSON is loaded, hover over any element on the page. The panel shows:

- **Trigger name(s)** — Which GTM triggers from your JSON would fire on this element
- **Event name** — The GA4 event name associated with each trigger
- **Matched rule** — Which CSS selector or condition in the JSON matched this element
- **Unmatched elements** — Elements on the page with no matching GTM trigger (potential gaps)

**[SCREENSHOT: QA panel showing trigger match for a navigation link — call out trigger name, event name, matched rule]**

### Step 3: Review Coverage

The panel also shows a summary of:
- Total triggers loaded from the JSON
- Total elements matched on the current page
- Elements with no match (possible gaps in your GTM config)
- Elements matched by multiple triggers (possible overlap)

Use this to quickly spot:
- **Missing coverage:** An element you expect to be tracked shows "no match" → you may have forgotten to create a trigger for it
- **Overlap:** An element matches multiple triggers → you may have duplicate conditions

### Step 4: Iterate

If you find issues, go back to your GTM config, fix the triggers, re-export the JSON, reload it in the QA tool, and check again. This loop is faster than repeatedly entering GTM Preview mode during development.

---

## When to Use Which Tool

| Situation | Tool |
|-----------|------|
| I'm auditing a page to see what the taxonomy would suggest | Taxonomy Inspector |
| I've generated a GTM JSON and want to check triggers before import | QA Bookmarklet |
| I'm in GTM Preview mode and need the definitive answer | GTM Preview (not either bookmarklet) |
| I want to quickly check if an element has any matching trigger | Either tool, but QA is more precise |
| I need to export a framework to CSV | Taxonomy Inspector |

---

## ⚠️ Important

- **The QA Bookmarklet reads your JSON file.** It does NOT contact GTM's servers. Your container config stays on your machine.
- **This is a sanity check, not a replacement for GTM Preview.** GTM Preview mode actually runs the container and shows real tag-firing data — that's the final step before publishing.
- **Outdated JSON = outdated results.** If you change your GTM container after exporting the JSON, re-export and reload the QA tool to stay in sync.

---

## How to Contribute / Complete This Documentation

To finish this page, the repo needs:

1. **The QA bookmarklet source file** — Add it to the repo (e.g., `qa-bookmarklet.js` and `qa-bookmarklet.min.js`)
2. **Confirm the JSON format** — The GENERATE-TRIGGERS workflow outputs standard GTM container export JSON. If the QA bookmarklet expects a different schema (a custom subset or flattened format), let me know so I can add a conversion step
3. **Screenshots** of the QA panel in action for the documentation

Once those are in place, I can update this file with exact install steps, UI details, and screenshots.
