# 🔍 Framework Inspector — Quick Visual Coverage Tool

## What It Does

The **Framework Inspector** is a lightweight, standalone visual scanner. When you click it on any OHIO.edu page, it instantly draws colored outlines around every interactive element it can classify and shows a floating panel with an event-type legend and element counts. Hover any outlined element to see its event name, text content, and page location in a tooltip.

This is an **alternative view** to the Click Tracker Framework bookmarklet (documented in the main README):

| Tool | Approach | Best For |
|------|----------|----------|
| **Click Tracker Framework** | Full interactive panel with capture, CSV export, Airtable sync | Deep auditing, building a framework, exporting data |
| **Framework Inspector** | Quick one-pass visual scan with colored outlines and hover tooltips | A fast "show me everything at once" visual check |

They use **different matching rules** — the Framework Inspector has a simpler set (8 event types) compared to the full Click Tracker Framework (16 events). Results may differ slightly. Use the tool that matches your workflow.

---

## How It Works

Once you click the bookmarklet, the tool:

1. **Scans** every link, button, form, and collapsible element on the page
2. **Classifies** each one using built-in matching rules against 8 event types
3. **Outlines** every matched element with a colored border (each event type has its own color)
4. **Shows a panel** in the top-right corner with the event legend and element counts
5. **Displays a tooltip** when you hover over any outlined element, showing:
   - The event name (bold, in the event's color)
   - The element's visible text (up to 60 characters)
   - The HTML tag (e.g., `a[href]`, `button`)
   - The page location (e.g., "footer", "hero", "main-menu")

The 8 event types and their colors:

| Event | Color | Outline Color |
|-------|-------|--------------|
| `cta_button` | Green | `#00694E` |
| `cta_link` | Blue | `#2964FF` |
| `global_nav` | Purple | `#9C27B0` |
| `contact_click` | Orange | `#FF9800` |
| `web_element` | Gray | `#607D8B` |
| `generate_lead` | Red | `#D32F2F` |
| `internal_search` | Teal | `#008080` |
| `exit_link` | Pink | `#E91E63` |

Elements that don't match any rule are left alone (no outline).

---

## Installation

The Framework Inspector is a **standalone bookmarklet**. You install it the same way as the Click Tracker Framework — drag a link to your bookmarks bar, or paste a code snippet.

### Quick Install — Drag to Bookmarks

**Step 1:** Open the [`engagement-first-framework.html`](engagement-first-framework.html) page in your browser.

**Step 2:** Find the **"🔍 Framework Inspector"** link on that page.

**Step 3:** Drag that link up to your bookmarks bar.

**Step 4:** Visit any OHIO.edu page and click the bookmarklet.

### Alternative Install — Manual Bookmark

Copy this snippet and paste it into a new bookmark's URL field:

```
javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/grahamz809/universal-click-tracking@main/qa-inspector.min.js';document.body.appendChild(s);})();
```

**Step 1:** Right-click your bookmarks bar and choose "Add Page" or "New Bookmark."

**Step 2:** Give it a name like "Framework Inspector."

**Step 3:** Copy the code block above (select it, press Cmd+C / Ctrl+C).

**Step 4:** Paste it into the bookmark's URL field and save.

**Step 5:** Visit any page and click the bookmarklet.

---

## Step-by-Step Usage

### Step 1: Click the Bookmarklet

Navigate to any OHIO.edu page and click the "Framework Inspector" bookmark in your bookmarks bar. The page will briefly flash as all matched elements are outlined with colored borders.

### Step 2: Read the Panel

A panel appears in the top-right corner showing:

- **Total elements tracked** — how many elements on this page matched a rule
- **Legend** — each event type with its color swatch and element count

Use the counts to quickly see which event types are most common on the current page.

### Step 3: Hover to Inspect

Move your mouse over any outlined element. A tooltip appears above it showing:

- **Event name** — which event type it matched (bold, colored)
- **Element text** — the visible text (or "(icon)" if empty)
- **CSS info** — the HTML tag (e.g., `a[href]` for links)
- **Page location** — where on the page it sits (e.g., "footer", "hero", "main-menu")

The tooltip follows your mouse and disappears when you move away.

### Step 4: Close the Panel

Click the **✕** in the panel's header to close it. The colored outlines remain until you refresh the page or click the bookmarklet again (which re-scans).

---

## When to Use This vs. the Click Tracker Framework

| Situation | Recommended Tool |
|-----------|-----------------|
| I want a quick visual scan of all elements on one page | Framework Inspector |
| I need to capture specific elements and export to CSV | Click Tracker Framework |
| I want to see the full 16-event taxonomy classification | Click Tracker Framework |
| I just need a fast overview of what's on the page | Framework Inspector |
| I need to sync data to Airtable | Click Tracker Framework |
| I want to check if elements consistently match across pages | Either tool |

---

## Important Notes

- **This tool uses its own matching rules.** It has 8 event types — a subset of the full 16-event taxonomy. Results are directional and may differ from the Click Tracker Framework.
- **The tooltip appears above the element.** On elements near the top of the page, it may be partially cut off. Scroll the element lower on the page if needed.
- **Colored outlines persist** until the page is refreshed or the bookmarklet is clicked again (which re-scans).
- **Not a replacement for GTM testing.** This tool shows you what a simplified rule set thinks elements are. It does not load or test your actual GTM container configuration. Always use GTM Preview mode before publishing.
