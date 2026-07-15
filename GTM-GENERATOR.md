# GTM Container Generator

**`gtm-generator.py`** turns a bookmarklet CSV into a Google Tag Manager
container JSON that imports cleanly — no schema errors, no "all link clicks"
triggers, no hand-editing.

## How it works

Instead of hand-authoring GTM JSON (which fails because GTM's import format
uses undocumented internal enums), this script uses **a real GTM export as a
donor template**. It clones the donor container's structure (account IDs,
container IDs, version info) and replaces only the tags, triggers, and
variables with fresh ones from the CSV.

## Requirements

- **Python 3** (stdlib only — no pip install needed)
- A **donor GTM container** JSON export (from any working GTM container —
  yours or your org's — exported via Admin > Export Container)
- The **CSV export** from the Universal Click-Tracking bookmarklet

## Usage

```bash
python3 gtm-generator.py path/to/bookmarklet.csv path/to/donor_container.json -o output.json
```

### Example

```bash
python3 gtm-generator.py \
  ~/Downloads/tracking-framework-webcms.ohio.edu-1784032420506.csv \
  ~/Downloads/GTM-N7GZT99_workspace251.json \
  -o OHIO_click_tracking_GTM_container.json
```

## Input: CSV format

The CSV must have these columns (the bookmarklet export produces them):

| Column | Description |
|--------|-------------|
| `Event` | Event name: `cta_button`, `cta_link`, `generate_lead`, `video`, etc. |
| `CSS Selector` | CSS selector for the trigger filter (e.g., `a.button.green, a.button.green *`) |
| `tag` | HTML tag: `a`, `button`, `form`, `input`, `iframe` — determines trigger type |
| `click_text` | Text content for trigger naming (optional) |
| `web_element_location` | Location label for trigger naming (optional) |

If `Event` is empty, it defaults to `web_element`.

## Output

The generated JSON contains:

- **1 GA4 Event tag** per unique event name, each firing on all triggers
  for that event
- **1 trigger** per CSV row, with the CSS selector as a `filter` condition
  (LINK_CLICK/CLICK) or `autoEventFilter` (FORM_SUBMISSION)
- **1 variable** — `web_element_location` (Custom JavaScript, ~80 CSS-rule
  location detection)
- **19 built-in variables** enabled: Click URL, Click Text, Click Element,
  Form ID, Form Classes, Video URL, Page URL, etc.
- **Dynamic GA4 parameters** — each event tag sends `web_element_location`,
  `click_text`, `link_url` in its event parameters. Form events also send
  `form_id` and `form_classes`. Video events send `video_url`, `video_title`,
  `video_status`, `video_percent`.

## Importing into GTM

1. **Admin > Import Container**
2. Select the output JSON
3. Choose **Merge** > **Rename** (to keep existing container content)
4. Review and confirm

## Why this approach?

GTM's JSON import format uses undocumented enums (`gaawe` for GA4 Event tags,
internal vendor template IDs, fingerprint formats that change across versions).
Hand-authoring this JSON always produces schema validation errors. By using a
real GTM export as a donor template, we preserve every internal enum and only
swap the content that changes.

This script is a **workaround for Google Tag Manager's lack of a proper CI/CD
API** for the free tier. Instead of manually creating 40+ triggers in the GTM
UI, you maintain a CSV and regenerate the container in seconds.
