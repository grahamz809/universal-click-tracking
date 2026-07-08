# Generate GTM Triggers from Captured Framework Data

This guide walks you through taking the elements you captured with the Taxonomy Inspector bookmarklet and turning them into actual GTM (Google Tag Manager) triggers — ready to import into your container.

---

## What You'll Need

- **Your exported data** — a CSV or Excel file with columns for Family, Event, CSS Selector, `link_click_url`, `web_element_location`, `click_text`, and Page URL (exported from the Taxonomy Inspector bookmarklet's CSV dialog)
- **Access to Claude or ChatGPT** (or any LLM that can output JSON) — this will generate the GTM trigger configuration
- **Access to your GTM container** (for the final import step)

---

## Step 1: Export Your Captured Elements

Open the Taxonomy Inspector bookmarklet on any OHIO.edu page. If you already have elements in your framework list, click **CSV** → **Copy to Excel** or **Download .csv**.

If you haven't captured any elements yet, the dialog automatically scans the page and exports everything anyway (up to 500 interactive elements). So you can go straight to export without clicking individual elements.

The export includes these columns:

| Column | What it is |
|--------|-----------|
| `Family` | Which of the 5 intent families the element belongs to (Conversion, Engagement, Discovery, Content & Media, Utility & Support) |
| `Event` | The suggested event name from the taxonomy (e.g., `cta_link`, `generate_lead`, `global_nav`) |
| `CSS Selector` | The CSS selector that uniquely identifies this element on the page |
| `link_click_url` | The URL the link points to, or the form action URL, or empty |
| `web_element_location` | Where on the page the element sits (breadcrumb, main-nav, aux-menu, hero, footer, body) |
| `click_text` | The visible text of the element |
| `Page URL` | The page where this element was captured |
| `tag` | The HTML tag name (a, button, input, form, etc.) |
| `element_id` | The element's ID attribute if present |
| `element_class` | The element's CSS class(es) |
| `inferred_type` | The inferred element type (button, accordion, tab, search, etc.) |

---

## Step 2: Open the AI Prompt Below and Paste in Your Data

Copy the entire prompt block below. Replace `[PASTE YOUR EXCEL DATA HERE]` with your actual data (paste the rows from your CSV export). Then send it to Claude or ChatGPT.

> **Important:** Paste the raw data as tab-separated or comma-separated rows. If you're copying from Excel, select all the data rows (not the header row) and paste them. The AI needs to see the actual element values to generate correct trigger conditions.

---

### ⚡ AI Prompt — Copy and paste this into Claude or ChatGPT

```
You are a GTM (Google Tag Manager) configuration specialist. Your task is to
analyze a list of captured web elements and generate a valid GTM container JSON
file that can be imported into an existing or new GTM container.

## INPUT DATA

Below is a CSV export from the OHIO.edu Universal Click-Tracking Taxonomy
bookmarklet. Each row represents one interactive element captured on the site,
along with its suggested taxonomy event, family, CSS selector, and page context.

[PASTE YOUR EXCEL DATA HERE]

## TAXONOMY REFERENCE — Use These Names Consistently

The framework uses exactly 5 families and 16 events. Every row's Event column
value should map to one of these. If a row's event doesn't match, flag it.

### 1. Conversion — "I completed a goal"
- `generate_lead` — Form submissions (inquiry, application, RFI)
- `event_rsvp` — RSVP, registration, "Confirm attendance"
- `file_download` — PDF, DOCX, XLSX, PPTX, ZIP downloads

### 2. Engagement — "I interacted with content"
- `cta_button` — Styled CTA buttons (green, white, primary, secondary)
- `cta_link` — Text links acting as calls to action
- `global_nav` — Main nav, utility menus, breadcrumbs, footer links
- `contact_click` — Phone (tel:), email (mailto:), address links
- `web_element` — Accordions, tabs, expand/collapse, UI components

### 3. Discovery — "I'm looking for something"
- `internal_search` — Site search submissions and result clicks
- `custom_filter_search` — Program finder, directory filters

### 4. Content & Media — "I consumed something"
- `news_content` — News article clicks, "View All Stories"
- `video` — Video playback (play, pause, progress)

### 5. Utility & Support — "I need help or tools"
- `tool_interaction` — Calculators, interactive tools
- `chat` — Chat widget (open, send, close)
- `exit_link` — Links leaving ohio.edu
- `404` — Page not found (page-level, fires on load)

## WHAT TO DO WITH EACH ROW

For every row in the input data:

1. **Read the Event and Family columns** to determine which taxonomy event
   applies.
2. **Examine the CSS Selector** — this is the primary matching condition for
   the GTM trigger. Also check `link_click_url`, `web_element_location`,
   `click_text`, and `Page URL` for additional context.
3. **Determine the trigger type:**
   - Links (tag=a with href) → "Click - Just Links"
   - Buttons and non-link interactive elements → "Click - All Elements"
   - Forms (tag=form or submit inputs) → "Form Submission"
   - 404 events → "Page View"
4. **Build the trigger condition** using the CSS selector as the main matching
   rule. Where possible, also add a page path condition based on the Page URL
   so the trigger only fires on relevant pages.
5. **Flag any row where the Event column value does not cleanly match one of
   the 16 taxonomy events listed above.** Put these in a review list. The human
   needs to decide whether to rename the event, create a new event (rare), or
   reassign to a different existing event.

## OUTPUT: VALID GTM CONTAINER JSON

Generate a complete GTM container JSON file that follows GTM's official import
schema. The JSON must include:

### Tags
Create one tag per unique event name. Each tag should:
- Use **GA4 Event** tag type
- Set the event name to the taxonomy event name (e.g., `cta_link`,
  `generate_lead`)
- Include event parameters as GTM variables where applicable
- Be associated with the correct trigger(s) from the trigger section below
- Use the existing GA4 Configuration tag as its measurement source (use a
  placeholder reference — the human will connect it to their actual GA4 tag)

### Triggers
Create one trigger per unique combination of (event name + CSS selector).
Each trigger should:
- Have the correct trigger type (Click - Just Links, Click - All Elements,
  Form Submission, etc.)
- Use the CSS selector as the "Click Element matches CSS selector" condition
  (or the equivalent condition for the trigger type)
- Include any page-path conditions derived from the Page URL column
- Be named clearly: e.g., "Trigger - cta_link - Learn More - Admissions"

### Variables
Include any custom variables needed for event parameters (click text, URL,
location, etc.) as Built-In Variable references or custom JavaScript
variables where necessary.

### JSON Structure

The output JSON must follow this structure (use placeholder values for
accountId and containerId):

```json
{
  "exportFormatVersion": 2,
  "containerVersion": {
    "accountId": "ACCOUNT_ID_PLACEHOLDER",
    "containerId": "CONTAINER_ID_PLACEHOLDER",
    "containerVersionId": "0",
    "containerVersion": {
      "accountId": "ACCOUNT_ID_PLACEHOLDER",
      "containerId": "CONTAINER_ID_PLACEHOLDER",
      "containerVersionId": "0",
      "tag": [...],
      "trigger": [...],
      "variable": [...]
    }
  }
}
```

## FINAL SUMMARY

After the JSON block, include a brief plain-language summary that covers:
1. How many triggers and tags were generated (grouped by family)
2. Which rows (if any) had event names that didn't match the 16-event
   taxonomy and need human review
3. What the human needs to do before importing:
   - Replace the placeholder accountId/containerId with real values
   - Connect the GA4 Event tags to the actual GA4 Configuration tag
   - Review any flagged rows
   - Test in GTM Preview mode before publishing
4. A reminder that this JSON is designed for GTM's Admin > Import Container >
   Merge feature, and should be imported into a TESTING container first, not
   the live production container
```

---

## Step 3: What the AI Will Give You

The AI will return two things:

1. **A JSON file** — This is a GTM container export file. It contains tags (one per event), triggers (one per element + event combination), and variables. You can download this as a `.json` file for import.

2. **A plain-language summary** — This explains what was generated, how many triggers and tags, and which rows need human review before importing.

**Before trusting the output, check:**
- Does every trigger use a CSS selector that makes sense for that element?
- Are the event names spelled consistently with the taxonomy?
- Are there any rows flagged for review? Read those and decide how to handle them.
- Does the JSON structure look valid? (It should start with `{ "exportFormatVersion": 2, ...}`)

---

## Step 4: Import the JSON Into GTM

### Option A: Merge Into an Existing Container (recommended for adding to your current setup)

1. Open your GTM container at [tagmanager.google.com](https://tagmanager.google.com)
2. Go to **Admin** (top right) → **Import Container**
3. Click **Choose container file** and select the JSON file from Step 3
4. Under **Import method**, select **Merge** — this adds the new triggers and tags without removing anything you already have
5. For **Name conflict handling**, choose **Rename** (this appends "(Imported)" to any items with the same name as existing ones, letting you review them before committing)
6. Click **Preview** to review the changes in draft mode
7. Use **GTM Preview mode** to test that the new triggers fire correctly on your site
8. Only after testing, submit and publish

### Option B: Create a Brand New Testing Container

1. Go to [tagmanager.google.com](https://tagmanager.google.com)
2. Click **Create Container** and give it a name like "OHIO Tracking — TESTING"
3. Choose **Web** as the target platform
4. Once created, go to **Admin** → **Import Container**
5. Click **Choose container file** and select the JSON file
6. Under **Import method**, select **Overwrite** — this replaces the empty container with your JSON content
7. Install the new container's GTM snippet on a test page or use GTM's Preview mode
8. Test that the triggers are firing correctly

---

## ⚠️ Important Reminders

- **This is for a TESTING container or merge — not the live production container.** Always test in a separate container or Preview mode before publishing to production.
- **The generated JSON uses placeholder account/container IDs.** You or your developer need to update these to match your real GTM account before importing.
- **GA4 Event tags will need to be connected to your actual GA4 Configuration tag.** The AI doesn't know your existing tag IDs — this connection happens after import.
- **The AI isn't perfect.** Always review the generated triggers before testing. CSS selectors might need tweaking, and the AI might occasionally assign the wrong trigger type. That's why we test in Preview mode first.
- **GTM Preview mode is still the official QA step.** This workflow automates the trigger creation, but you still need to verify the triggers actually fire on your site before publishing.

---

## Open Questions

> **If you plan to use these generated triggers with a visual inspection tool, note:** The OHIO Inspector bookmarklet (`qa-inspector.min.js`) is a standalone visual scanner with its own built-in matching rules — it does **not** load GTM JSON files or external configurations. The GENERATE-TRIGGERS prompt above outputs standard GTM container export JSON, which must be imported into GTM via Admin > Import Container to take effect. There is no separate "QA JSON" format needed.
