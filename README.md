# 🎯 Engagement-First Framework: Universal Click Tracking for OHIO.edu

## What This Is

This is a ready-to-use **click-tracking framework** for Ohio University's website. Instead of setting up tracking rules one page at a time, this framework gives you a consistent, repeatable system that works across every page on OHIO.edu. It's named "engagement-first" because it organizes every click by what the user is *trying to do* — not by what element they clicked on.

The framework comes with a **bookmarklet tool** — a small button you install in your web browser. Click it on any page, and it shows you in real time exactly which tracking event would fire for every link, button, and interactive element on that page. You can capture those elements, export them to a spreadsheet, or push them to Airtable for team collaboration.

You do **not** need to download any software, write any code, or set up any development tools to use the bookmarklet. Just add it to your bookmarks bar and start inspecting pages.

---

## The Five Families (User Intent Model)

Every click on OHIO.edu fits into one of five categories. These are called **families**, and they're named for the user's intent:

| # | Family | What the user is doing | Example events |
|---|--------|----------------------|----------------|
| 1 | **Conversion** | Completing a goal | Submitting an inquiry form, RSVPing for an event, downloading a PDF viewbook |
| 2 | **Engagement** | Interacting with content | Clicking a CTA button or link, using site navigation, contacting OHIO, opening an accordion or tab |
| 3 | **Discovery** | Looking for something | Using the site search, filtering programs in the program finder |
| 4 | **Content & Media** | Consuming content | Reading a news article, watching a video |
| 5 | **Utility & Support** | Getting help or using a tool | Using the net price calculator, opening live chat, clicking an external link, landing on a 404 page |

Every tracked interaction maps to exactly one of these five families. No more, no less. This keeps your analytics reporting clean and your tracking configuration manageable.

---

## The 16 Events — Complete Reference

### 1. Conversion Family — "I completed a goal"

| Event Name | What it tracks | How it's matched | Key data captured |
|------------|---------------|-----------------|-------------------|
| `generate_lead` | Form submissions for inquiries, applications, or requests for information | Detected by form CSS classes (`.form_button_submit`, `.slate_form`) or data attributes like `[data-form-type="inquiry"]` | Form name, form ID, vendor platform (Slate, Wiley, Net Natives), submission status |
| `event_rsvp` | RSVP, registration, or "Confirm attendance" button clicks | Text matching: "RSVP", "Register", "Confirm", "Yes, I'll attend" or CSS classes like `.rsvp-link` | CTA text, link URL, page location |
| `file_download` | Downloads of PDFs, Word docs, Excel files, or ZIP archives | URL ends in `.pdf`, `.docx`, `.xlsx`, `.pptx`, `.zip` or link has a `[download]` attribute | File name, file extension, link URL |

### 2. Engagement Family — "I interacted with content"

| Event Name | What it tracks | How it's matched | Key data captured |
|------------|---------------|-----------------|-------------------|
| `cta_button` | Styled CTA buttons (green, white, primary, secondary) | CSS class contains `button` AND one of the style classes | CTA goal (enrollment, donation, stakeholder), CTA type (primary/secondary), CTA text |
| `cta_link` | Text links that act as calls to action | Card links, "Learn more" links, jump links (`#anchor`), text containing "➜" | CTA text, link URL, page location |
| `global_nav` | Main navigation, utility menus, breadcrumbs, footer links | Links inside `<nav>` elements, breadcrumb lists, footer columns, logo link | Click text, link URL, location (main-nav, aux-menu, footer, breadcrumb) |
| `contact_click` | Phone, email, and address interactions | `tel:` links, `mailto:` links, phone number patterns, Google Maps URLs | Contact type (phone/email/address), contact info |
| `web_element` | UI components like accordions, tabs, info popovers, expand/collapse buttons | CSS classes: `.accordion`, `.tab-container`, `.faq-toggle`, `.fact-card`, `.checkbox-filter`, and more | Element name (accordion, tab, caption, etc.), page location |

### 3. Discovery Family — "I'm looking for something"

| Event Name | What it tracks | How it's matched | Key data captured |
|------------|---------------|-----------------|-------------------|
| `internal_search` | Site search submissions and result clicks | Forms with `search.ohio.edu` or `funnelback` in the action URL, search input fields | Search query, clicked result, active filters |
| `custom_filter_search` | Program finder, Experience Ohio, GoGlobal, and directory filters | CSS classes: `.program-finder`, `.filter`, `[data-module="program-finder"]` | Search query (if text input), active filter tags, site section |

### 4. Content & Media Family — "I consumed something"

| Event Name | What it tracks | How it's matched | Key data captured |
|------------|---------------|-----------------|-------------------|
| `news_content` | News article clicks, "View All Stories", category/tag filters | Links inside news listings, story cards, article grids, news search forms | Story title, click text, news category, search terms |
| `video` | Video playback actions (play, pause, progress) | YouTube or Vimeo iframes, video player elements, "Play video" buttons | Video action (play/pause/progress/complete), video title, progress percent |

### 5. Utility & Support Family — "I need help or tools"

| Event Name | What it tracks | How it's matched | Key data captured |
|------------|---------------|-----------------|-------------------|
| `tool_interaction` | Interactive tools like calculators and planners | CSS classes: `.net-price-calculator`, `.calculator`, `.interactive-tool`, `[data-tool]` | Tool name, tool purpose |
| `chat` | Opening, sending messages in, or closing a chat widget | CSS classes or aria labels containing "chat", chat widget buttons | Chat action (open/send/minimize/close) |
| `exit_link` | Clicks on links that leave OHIO.edu | Link hostname doesn't match `ohio.edu` (catmail.ohio.edu and ohiobobcats.com are also exits) | Anchor text, full external URL, page location |
| `404` | When a visitor lands on a page that doesn't exist | Page title contains "Page not found" or HTTP status is 404 | The broken URL, the referring page |

### Three Universal Parameters (every event captures these)

Every single match, no matter which family or event, always includes these three pieces of information:

- **`link_click_url`** — The URL the link points to (or the form's action URL, or empty for buttons that don't navigate)
- **`web_element_location`** — Where on the page the element is located. Detected automatically: breadcrumb → aux-menu → main-nav → hero → footer → body
- **`click_text`** — The visible text of the element (up to 150 characters)

### Catch-All Coverage

The framework uses a "catch-all" rule at the end of its matching logic. This ensures **every** interactive element on the page is captured:

- Any link not matched by a specific rule → fires `cta_link` (Engagement)
- Any button not matched → fires `web_element` (Engagement)
- Any input field, `[onclick]` element, or `[role="button"]` element → fires `web_element`
- Plus 40+ OHIO-specific element types detected by CSS class names (fact cards, card links, image tiles, tab containers, spotlight panels, promo boxes, topic previews, video galleries, contact blocks, social media icons, and more)

---

## Install the Bookmarklet Tool

> **You do NOT need to download Hermes Agent, Node.js, or any other software to use this bookmarklet.** Just follow the steps below.

The bookmarklet is a tiny **loader** (~200 characters) that fetches the full tool from a CDN when you click it. This keeps the bookmark short enough to work in every browser, including Safari.

### Quick Install — Drag to Bookmarks

**Step 1:** Open the [`engagement-first-framework.html`](engagement-first-framework.html) page in your browser.

**Step 2:** Drag the **"🎯 Click Tracker Framework"** link up to your bookmarks bar.

**Step 3:** Visit any page (try ohio.edu/admissions) and click the bookmarklet.

That's it. A panel will appear on the right side of the page. (The first click may be slightly slower while the tool loads from the CDN — subsequent clicks are instant.)

### Alternative Install — Manual Bookmark

If you prefer to create the bookmark by hand, copy this tiny snippet and paste it into a new bookmark's URL field:

```
javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/grahamz809/universal-click-tracking@80a717e/bookmarklet.min.js';document.body.appendChild(s);})();
```

**Step 1:** Right-click your bookmarks bar and choose "Add Page" or "New Bookmark."

**Step 2:** Give it a name like "OHIO Tracking Tool."

**Step 3:** Copy the code block above (select it, press Cmd+C / Ctrl+C).

**Step 4:** Paste it into the bookmark's URL field and save.

**Step 5:** Visit any page and click the bookmarklet.

---

## Using the Bookmarklet — Step by Step

Once you've installed the bookmarklet and clicked it on a page, a floating panel appears on the right side of your screen. Here's everything you can do with it:

### Step 1: Hover Over Elements

Move your mouse over any link, button, or interactive element on the page. The panel updates instantly to show:

- **Event name** — Which tracking event would fire (e.g., `cta_link`, `global_nav`, `file_download`)
- **Family** — Which of the five families it belongs to
- **CSS selector** — The technical reference for this element (useful for developers setting up tags)
- **Three universal parameters** — `link_click_url`, `web_element_location`, and `click_text`

[SCREENSHOT: hover panel showing event details for a "Learn More" link on ohio.edu/admissions — call out the event name, family, and three parameters]

Each element also gets a colored outline on the page so you can see exactly which element you're inspecting. The outline color matches its family (red for Conversion, blue for Engagement, green for Discovery, yellow for Content & Media, orange for Utility & Support).

### Step 2: Click to Capture

When you click on an element, it's added to your **framework list**. The panel's header updates to show how many elements you've captured (e.g., "Framework (7)"). You can click as many elements as you want — the list keeps growing.

Each captured element stores:
- Its event name and family
- The full CSS selector (so developers can find it later)
- The three universal parameters (link URL, location, click text)

[SCREENSHOT: panel with several elements captured, showing the Framework count in the header]

### Step 3: View the Framework List

Click the **Framework** button in the panel's header. This opens a view showing all your captured elements grouped by family, with remove buttons if you want to delete any. Click **Framework** again to return to the hover view.

[SCREENSHOT: Framework view showing grouped elements with remove buttons]

### Step 4: Export to Excel or CSV

Click the **CSV** button. This opens an export dialog with three ways to get your data:

**Option A — Copy to Excel (recommended):** Click "Copy to Excel." The data is written to your clipboard as a formatted table. Open Excel and paste (Cmd+V / Ctrl+V). The columns appear automatically — no extra steps needed.

**Option B — Download .csv:** Click "Download .csv." Your browser will either show a native Save dialog (letting you pick the filename and location) or download the file directly. Open the `.csv` in Excel.

**Option C — Manual copy:** The dialog includes a text box with all the data pre-selected. Press Cmd+C (Mac) or Ctrl+C (Windows) to copy it, then paste into Excel. If the columns don't separate automatically, use Excel's **Data > Text to Columns** feature and choose Tab as the delimiter.

The dialog automatically scans the entire page (up to 500 interactive elements), so you get a complete export even if you didn't click anything yet.

[SCREENSHOT: the CSV export dialog showing the Copy to Excel and Download .csv buttons]

### Step 5: Minimize or Close

- Click the **–** button to minimize the panel to a compact header. This is useful when you want to see the page underneath. Click **+** to restore it.
- Click the **✕** button to close the panel entirely. All your captured elements are cleared when you close it.

---

## Syncing Captured Elements to Airtable

You can push your captured framework data directly to an Airtable base for team collaboration, review, or further processing.

### Setting Up Airtable

**Step 1: Create or open an Airtable base.** If you don't have one yet, create a new base at [airtable.com](https://airtable.com). You can name it something like "OHIO Click Tracking Framework."

**Step 2: Create your table columns.** Make sure your table has at minimum these fields (column names must match exactly):

- `Event` (Single line text)
- `Family` (Single line text)
- `CSS Selector` (Single line text or Long text)
- `link_click_url` (URL or Single line text)
- `web_element_location` (Single line text)
- `click_text` (Single line text)
- `Page URL` (URL or Single line text)

**Step 3: Get your Base ID.** Go to [airtable.com/api](https://airtable.com/api), select your base, and find the Base ID in the URL or the API documentation. It looks like `appXXXXXXXXXXXXXX`.

**Step 4: Generate a Personal Access Token.** Go to [airtable.com/create/tokens](https://airtable.com/create/tokens), click "Create token," give it a name (like "OHIO Tracking Sync"), and add these scopes: `data.records:write` and `data.records:read`. Select the base you created in Step 2.

**Step 5: Configure the tool.** In the bookmarklet panel, click the **Airtable** icon or button (or look for the "Airtable Setup" option). Enter:

- Your **API key** (the Personal Access Token from Step 4)
- Your **Base ID** (from Step 3)
- Your **Table name** (the name of your table from Step 2)

**Step 6: Sync your data.** With elements already captured in your framework list, click the **Sync to Airtable** button. Each captured element is sent as a new row in your Airtable table. A progress indicator shows how many records were successfully synced.

### Downloading the Complete Framework

Once your data is in Airtable, you can:

- **Export to CSV** directly from Airtable (click your table's name → Download CSV)
- **Share the Airtable base** with your team for collaborative review
- **Connect Airtable to other tools** like Looker Studio or Google Sheets for reporting

Alternatively, use the **CSV Export Dialog** described in Step 4 above to download a `.csv` file at any time, without needing Airtable.

---

## Portability: Works on Any Higher Education Site

The framework was tested on two other major Ohio university websites to confirm it works outside OHIO.edu:

- **Ohio State University (osu.edu):** Every element — navigation, CTAs, news cards, accordions, search, video, footer — mapped cleanly to the 16 events. Zero new events or families needed.
- **Miami University (miamioh.edu):** Same result. Hero video, stat counters, blog cards, program cards, events — all fit within the existing framework.

**Conclusion:** This framework is designed for any higher education website. If it works across Ohio University, Ohio State, and Miami University, it will work for you.

---

## Project Files

```
universal-click-tracking/
├── README.md                          ← This file
├── GENERATE-TRIGGERS.md              ← Workflow: turn captured elements into GTM triggers
├── QA-BOOKMARKLET.md                 ← Framework Inspector: quick visual coverage scan tool
├── engagement-first-framework.html    ← Install page + interactive demo (open in browser)
├── PORTABILITY.md                     ← OSU & MiamiOH validation details
├── qr-code.png                        ← QR code for this repository
├── bookmarklet.js                     ← Source code for the Click Tracker Framework bookmarklet
├── bookmarklet.min.js                 ← Minified Click Tracker Framework (served via CDN)
├── qa-inspector.js                    ← Source code for the Framework Inspector bookmarklet
├── qa-inspector.min.js                ← Minified Framework Inspector (served via CDN)
└── taxonomy-map.js                    ← Taxonomy mapping used for GTM tag generation
```

---

## For Developers: Editing the Bookmarklet

> The steps in this section are **only needed if you want to modify the bookmarklet's source code and rebuild it.** If you just want to use the tool, skip this section — the bookmarklet works as-is from the install page above.

### What is Hermes Agent?

Hermes Agent is the AI tool that was used to build this project. It's a development assistant that helps write and debug code through conversation. You don't need Hermes Agent to **use** the bookmarklet, but if you want to edit the source JavaScript and rebuild the minified version, you'll need:

- **Node.js** (a JavaScript runtime that includes `npx`)
- A web browser (Chrome is recommended for full Clipboard API support)

### How to Rebuild

The bookmarklet lives in two files:
- **`bookmarklet.js`** — The human-readable source code (edit this one)
- **`bookmarklet.min.js`** — The compressed, minified version (the browser runs this)

After making changes to `bookmarklet.js`, rebuild the minified version by running this command from the project folder:

```bash
npx terser bookmarklet.js --compress --mangle -o bookmarklet.min.js
```

This command also updates the base64-encoded version embedded in `engagement-first-framework.html`, so the install page stays in sync. After rebuilding, you (or anyone using the tool) will need to re-drag the bookmarklet link from the install page to get the updated version.

### Hermes Agent Configuration Used for This Project

If you want to replicate the development environment that built this project, these are the settings used:

- **Provider:** OpenCode Zen
- **Model:** deepseek-v4-flash-free
- **Base URL:** https://opencode.ai/zen/v1
- **API mode:** chat_completions

This was configured in Hermes Agent's `~/.hermes/config.yaml` file and is shown here for reference only. You can use any code editor or development workflow to modify the bookmarklet source.
