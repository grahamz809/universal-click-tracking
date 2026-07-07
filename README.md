# 🎯 Universal Click-Tracking Event Taxonomy

## Intent-First Measurement Framework for OHIO.edu

**Status:** DRAFT — awaiting review & sign-off before GTM implementation  
**Target:** OHIO.edu GA4 Property (G-JR43SKW92E) · GTM Container (GTM-N7GZT99)  
**Version:** 1.0.0  
**Last Updated:** 2026-07-07

---

## Why This Exists

This is the **foundational decision layer** for a universal click-tracking GTM deployment on OHIO.edu. Instead of hard-coding triggers page-by-page or element-by-element, we define an **intent-first taxonomy** — naming events for *what the user is trying to do*, not for what DOM element they clicked.

This approach:

- **Eliminates duplicate/overlapping tags** (the same "Apply Now" button isn't tracked by 3 competing triggers)
- **Makes reporting meaningful** (analysts can filter by intent, not by CSS class)
- **Is portable** (the same trigger patterns work on any page, any section)
- **Simplifies QA** (~16 well-defined events vs. 100+ ad-hoc triggers)

The taxonomy is organized into exactly **5 families**, named for user intent. Every interaction on OHIO.edu maps to one of these five buckets, and no sixth family is added.

---

## The Five Families

| # | Family | Intent | Example Events |
|---|--------|--------|----------------|
| 1 | **Conversion** | "I completed a goal" | generate_lead, event_rsvp, file_download |
| 2 | **Engagement** | "I interacted with content" | cta_button, cta_link, global_nav, contact_click, web_element |
| 3 | **Discovery** | "I'm looking for something" | internal_search, custom_filter_search |
| 4 | **Content & Media** | "I consumed something" | news_content, video |
| 5 | **Utility & Support** | "I need help or tools" | tool_interaction, chat, exit_link, 404 |

---

## Full Framework Table

### 1. Conversion Family

| Event Name | Matching Rule | Trigger Type | Variables Captured | Notes / Edge Cases |
|---|---|---|---|---|
| `generate_lead` | CSS: `.form_button_submit`, `.slate_form`, form elements with `#funnelback-block-search-form`, or data attributes like `[data-form-type="inquiry"]` | Form Submission / Click | `form_name`, `form_id`, `vendor` (Slate_internal \| Wiley \| Net_Natives), `form_submission_status` (complete \| abandoned), `empty_fields`, `page_url`, `web_element_location`, `site_name` | **Junk-drawer alert:** Keep separate from general form interactions. Only fire on true goal completions (RFI, inquiry, application start/confirm). Abandonment tracking requires additional form-field focus/blur listeners — optional at launch. Forms in iframes (Net Natives/Slate-hosted) require cross-origin message listeners if native DOM access is blocked. |
| `event_rsvp` | Text matching: "RSVP", "Register", "Confirm", "Yes, I'll attend" OR CSS: `.rsvp-link`, `[data-event-rsvp]` | Click — All Elements | `cta_text`, `link_click_url`, `page_url`, `web_element_location` | **Currently paused** — reactivate when event RSVP module is live. Also fires on "Add to Calendar" button clicks. |
| `file_download` | URL pattern: `\.(pdf|docx|xlsx|pptx|zip)$` OR link attributes: `[download]`, or explicit `data-tracking="download"` | Click — Just Links | `file_name` (extracted from URL), `file_extension`, `file_size` (if available in data attr), `link_click_url`, `page_url`, `web_element_location` | **Junk-drawer rescue:** File downloads were at risk of being lost in `web_element` or `cta_link`. They're their own Conversion event because downloading a viewbook/brochure/application is a goal-completion signal (the user is gathering materials to apply). PDFs that are supplementary content (syllabi, policies) still fire this event — intent is measured downstream, not filtered at trigger. |

### 2. Engagement Family

| Event Name | Matching Rule | Trigger Type | Variables Captured | Notes / Edge Cases |
|---|---|---|---|---|
| `cta_button` | CSS class contains `button` AND one of: `green`, `white`, `form-jump`, `primary`, `secondary` OR parent selector identifying styled button containers (.hero-cta, .button-wrapper) | Click — All Elements | `cta_goal` (drive_enrollment \| donation \| energize_stakeholders), `cta_type` (primary \| secondary), `cta_text`, `button_type`, `link_click_url`, `page_url`, `site_name`, `web_element_location` | Styled buttons in hero, body sections, and sticky footers. Distinguish from `cta_link` by the presence of the `button` CSS class. Social media icon links (`.social-icons`, `i.circle.fa`) are captured here when they use button styling. |
| `cta_link` | Inline text links inside card components (`.card-link-content`, `.field--name-field-call-to-action-*`), jump links (`#anchor`), quicklink items, "Learn more" links, or link text patterns like "➜" | Click — Just Links | `cta_goal`, `cta_text`, `link_click_url`, `page_url`, `web_element_location`, `cta_type`, `site_selector` | Covers text links that are CTAs but not styled as buttons. Includes "Learn more about this statistic", "Apply to Ohio University today ➜", "Not sure? Browse all our degrees & programs". Jump links (#rfi, #form) are included — their scroll-to behavior is a CTA action, not navigation. |
| `global_nav` | Links within: `nav` elements, `[role="navigation"]`, `.global-nav`, `footer` nav columns, breadcrumb lists, logo link, `.quick-links` dropdown, `.info-for` dropdown | Click — Just Links | `click_text`, `link_click_url`, `page_url`, `site_name`, `web_element_location` (main-nav \| aux-menu \| footer \| breadcrumb \| logo), `mobile_click` (true \| false via viewport detection) | Includes ALL nav levels — main nav, section sub-nav (Apply, Visit, Costs & Aid under Admissions), footer resource links, breadcrumbs, logo home link. Apply/Give/Visit in the utility bar: these are nav links, not CTAs. **Edge case:** Mega-menu sub-items that are also CTAs (e.g., "Apply Now" inside a dropdown) should still fire `global_nav` — the nav context is the primary intent. |
| `contact_click` | URL pattern: `^tel:` \| `^mailto:` \| link text containing phone number regex (\d{3}[\.-]\d{3}[\.-]\d{4}) \| `.address-link` \| text matching email regex \| Google Maps URLs | Click — Just Links | `contact_type` (phone \| email \| address), `contact_info` (the actual number/email/address), `link_click_url` (the tel:/mailto:/maps URL), `page_url`, `site_name`, `web_element_location` | **Edge case:** This is NOT exit_link — the user is contacting OHIO, not leaving the site. Mailto: links open the user's email client (a system app), not an external website. Phone numbers (tel:) dial natively. Address links go to Google Maps — these are contact methods, not exits. |
| `web_element` | CSS: `.accordion`, `.paragraph--type--accordion`, `[data-component-id*="accordion"]`, `.faq-toggle`, `.spotlight`, `.tab-container`, `.nav-tabs`, `.image-tile`, caption expand buttons, `.field--name-field-caption`, `.fact-card`, accordion trigger elements, `.checkbox-filter` | Click — All Elements | `web_element_name` (accordion \| tab \| spotlight \| image-tile \| fact-card \| caption \| checkbox), `web_element_location`, `web_element_impression` (true/false via scroll), `accordion` (section label), `checkbox_status` (checked \| unchecked for filters), `cta_text` (element label), `page_url`, `site_name` | **Junk-drawer watch:** This is the catch-all for non-navigational, non-CTA UI interactions. NOT for file downloads, CTAs, nav, or contact methods. If an element doesn't fit any other engagement event, it goes here — but every new instance should be reviewed to make sure it doesn't deserve its own event. Caption expand/collapse buttons, "Learn More About Athens, OH caption" toggles, stat counter animations — these are all `web_element`. |

### 3. Discovery Family

| Event Name | Matching Rule | Trigger Type | Variables Captured | Notes / Edge Cases |
|---|---|---|---|---|
| `internal_search` | Form: `[action*="search.ohio.edu"]`, `[action*="funnelback"]`, `input[name="query"]` or `input[type="search"]` within site chrome + `form[action*="ohio.edu/search"]` | Form Submission / Click | `internal_search_query`, `internal_search_link_click` (selected result URL/id), `filterArr` (active filters, comma-separated), `site_selector` (search scope), `page_url`, `web_element_location` | Fires on form submit (search query entered) AND on result click (which result was chosen). **Zero-result tracking:** If the results page contains "no results" or "0 results" text, fire with an empty/null `internal_search_link_click` and add a `zero_results: true` variable. This is critical for content gap analysis. The header Search button (`aria-label="Search"`) expands the search form — that's a `web_element` event, not yet a search. |
| `custom_filter_search` | CSS: `.program-finder`, `[data-module="program-finder"]`, `.academic-program-search`, `.graduate-program-filter`, `.experience-ohio-filter`, `.go-global-filter`, `.directory-filter` | Click / Form Submission / Change | `internal_search_query` (if text input), `internal_search_link_click` (result clicked), `filterArr` (selected filter tags), `site_selector` (Experience Ohio \| Graduate Programs \| GoGlobal \| Directory), `page_url`, `web_element_location` | Covers the "What are you interested in studying?" textbox on the homepage, the degree program search, Experience Ohio tool, GoGlobal filters, and directory lookup tools. Each filter change fires separately (not debounced) so analysts can see full filter journey. |

### 4. Content & Media Family

| Event Name | Matching Rule | Trigger Type | Variables Captured | Notes / Edge Cases |
|---|---|---|---|---|
| `news_content` | Links within: `.news-listing`, `.view-news-articles`, `[data-content-type="news"]`, `.featured-stories`, `.ohio-today-card`, story cards, article grid items, category/tag filter links, news search form | Click — Just Links | `story_title`, `publication_date`, `click_text`, `link_click_url`, `cta_type`, `search_term_news`, `search_category_news`, `search_story-tag_news`, `page_url`, `web_element_location` | News story card clicks, "View All Stories" links, topic/category navigation, news search, pagination through story lists. Category filter (Topics, Colleges & Campuses, University Community, Magazine) — each filter click fires this event. Story tag clicks on individual article pages also captured here. |
| `video` | YouTube iframes: `iframe[src*="youtube.com"]`, `iframe[src*="youtu.be"]`, OR video players with `[data-video-id]`, `.video-embed`, JWPlayer/YouTube JS API hooks | YouTube JS API / Custom Event Listener | `video_action` (play \| pause \| progress \| complete), `video_src`, `video_title`, `video_current_time` (seconds), `video_duration` (seconds), `video_percent` (25 \| 50 \| 75 \| 100), `page_url`, `site_name`, `web_element_location` | **Junk-drawer rescue:** Must capture progress milestones, not just play/complete. Use YouTube IFrame API to fire at 25%, 50%, 75%, and 100%. The hero video on the homepage and the "Watch full video" button — the play button press is a `web_element` or separate interaction; actual video playback tracking is this event. Pause/unpause should also fire `video_action: pause`. Auto-playing videos on scroll-in should fire `video_action: play` with a `video_autoplay: true` parameter. |

### 5. Utility & Support Family

| Event Name | Matching Rule | Trigger Type | Variables Captured | Notes / Edge Cases |
|---|---|---|---|---|
| `tool_interaction` | CSS: `.net-price-calculator`, `[data-tool="calculator"]`, `.salary-calculator`, `.interactive-tool`, iframe hosting a web app, `[data-module="interactive"]` | Click / Form Submission / Custom Event | `tool_name`, `tool_purpose`, `cta_goal`, `page_url`, `web_element_location`, `employee_type` (if HR tool) | Net Price Calculator, salary projection tools, interactive degree planners, HR tools. Distinguish from `generate_lead` — tools don't represent a goal completion on their own; they're support utilities that help the user decide. |
| `chat` | CSS: `[data-chat-widget]`, `button[aria-label*="chat"]`, `.chat-button`, `.live-chat`, `.symphony-chat`, `#tidio-chat`, any button that opens a chat widget | Click — All Elements | `chat_action` (open \| send \| minimize \| close), `chat_message` (if available), `chat_department`, `page_url`, `web_element_location` | **Junk-drawer rescue:** Chat was at risk of being lumped into `web_element` or `cta_button`. It deserves its own event because it's a distinct support pathway with different KPIs (first response time, resolution rate). The "Open chat" button on every page fires `chat_action: open`. Chat messages require widget-specific JS API — start with open/close tracking; message content requires deeper integration. |
| `exit_link` | URL host does not match `ohio.edu` (or approved subdomains). Regex: `^(?!.*\.ohio\.edu).*$` PLUS explicit allowed list exclusion (catmail.ohio.edu, ohiobobcats.com, ohio.forums.com, etc. are exits — they're different properties) | Click — Just Links | `anchor_text`, `link_click_url` (full external URL), `web_element_location`, `page_url`, `site_name` | **Edge case:** `catmail.ohio.edu`, `ohiobobcats.com`, `ohio.forums.com`, `give.ohio.edu` (if hosted externally), and search.ohio.edu (search is not exit — it's an internal search under Discovery). Links with `target="_blank"` that stay within ohio.edu are NOT exits. "Opens in a new window" icon (➚) is not the signal — the hostname is. |
| `404` | Triggered on page load where `document.title` contains "Page not found" OR HTTP status header 404 OR URL match pattern: `/404`, `/?404`, or event fired from CMS/page-not-found template | Page View / Custom Event | `page_url` (the path that 404'd), `referrer_url` (where they came from), `page_title` | Fires once per 404 page view. If the page has a search bar suggesting corrections, a `internal_search` event may follow — that's a separate event. Useful for redirect mapping and broken link identification. |

---

## Open Questions & Decisions

These need review and sign-off before moving to GTM implementation:

| # | Question | Proposed Resolution | Status |
|---|----------|-------------------|--------|
| 1 | **`file_download` vs. `cta_link` for PDF CTAs** — Some PDF links are styled as CTA buttons (e.g., "Download Viewbook"). Should these fire both `cta_button` + `file_download`, or just `file_download`? | **Proposed:** Fire only `file_download`. The CTA styling is presentation; the user intent is to download (a Conversion action). Firing both would inflate metrics. | ⬜ Pending |
| 2 | **Link to OHIO subdomains** — `catmail.ohio.edu` (student email) and `ohiobobcats.com` (athletics) — are these `exit_link` or `global_nav`? | **Proposed:** `exit_link` — they are different properties with separate GA4 tracking. Catmail is a Google Workspace app, not managed through the same GTM container. | ⬜ Pending |
| 3 | **Mailto/tel contact clicks** — Are these `contact_click` (Engagement) or `exit_link` (Utility)? | **Proposed:** `contact_click` (Engagement). The user is contacting OHIO, not "leaving" the experience. Protip: this reframes the metric positively for stakeholders. | ⬜ Pending |
| 4 | **Video autoplay tracking** — Hero video auto-plays on homepage load. Should `video_action: play` fire on autoplay (scroll-triggered), or only on explicit user play? | **Proposed:** Fire on autoplay with a `video_autoplay: true` parameter, so analysts can filter. Also fire on explicit play separately. This way we see total plays vs. intentional plays. | ⬜ Pending |
| 5 | **Accordion/FAQ expand events** — Each accordion section click fires `web_element`. Should it fire on both expand AND collapse? | **Proposed:** Fire on both, with an `accordion_state: expanded | collapsed` parameter. Collapse events are useful for measuring content engagement depth (users who expand and collapse are actively reading). | ⬜ Pending |
| 6 | **Chat message content** — Should chat message text be captured as a variable? This adds PII risk. | **Proposed:** Capture only the fact that a message was sent (`chat_action: send`), not the message content. Chat department (pre-chat survey) is OK if available as a non-PII variable. | ⬜ Pending |
| 7 | **Filter change debouncing** — The `custom_filter_search` event fires on each filter change. Should we debounce to fire only after X ms of inactivity, or fire every change? | **Proposed:** Fire every change (no debounce). Preserves the full filter journey for analysis. Reporting can always aggregate; you can't un-fire an event. | ⬜ Pending |
| 8 | **404 page with search suggestion** — The 404 page has a search box. If a user hits 404 and immediately searches, should we fire `404` AND `internal_search`? | **Proposed:** Yes, both. They're separate intents — one is "I hit a dead end" and the other is "I'm looking for something specific." The `referrer_url` on the 404 event will point to the broken link source. | ⬜ Pending |
| 9 | **Mobile vs. Desktop distinction** — `mobile_click` on `global_nav` uses viewport width detection. Should this be applied to all events as a universal variable, or only on nav? | **Proposed:** Add `mobile_viewport: true | false` as a universal variable to ALL events. Consistent device detection across all families simplifies reporting. | ⬜ Pending |
| 10 | **Engagement value scoring** — The existing reference schema mentions `engagement_value` (1-5). Should we implement this as a computed variable in GTM, or calculate it in GA4/ Looker Studio? | **Proposed:** Compute in GA4 via event-scoped custom metrics or Looker Studio. GTM should focus on raw data capture, not score calculation. | ⬜ Pending |

---

## Setting Up Hermes

This project was built using **Hermes Agent**, a tool-assisted AI agent. If you need to replicate or contribute to this work in a Hermes session, follow these steps:

### Prerequisites

- **macOS** (this setup was tested on macOS 26.5.1)
- **Git** (included with Xcode Command Line Tools)
- A **GitHub personal access token** with `repo` scope (classic token)

### Model Configuration

This project uses the following model/provider stack, configured in `~/.hermes/config.yaml`:

```yaml
model:
  default: deepseek-v4-flash-free
  provider: opencode-zen
  base_url: https://opencode.ai/zen/v1
  api_mode: chat_completions
```

**Provider:** OpenCode Zen (curated, pay-as-you-go model access)  
**Model:** `deepseek-v4-flash-free` (free-tier, fast inference)

### Installation

1. **Install Hermes** (if not already installed):

   Download the latest macOS `.dmg` from [https://hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com) or install via:

   ```bash
   brew install hermes-tui  # if available via Homebrew
   ```

   *Alternatively, if you built from source or use a managed install, the binary is typically at `/Applications/Hermes.app` or in your `$PATH`.*

2. **Set up your Hermes profile**:

   ```bash
   hermes setup
   # Follow the prompts to:
   # - Choose a provider (set to 'opencode-zen' for this stack)
   # - Enter your OpenCode Zen API key
   # - Configure your default model
   ```

3. **Configure the model** (if not using the setup wizard):

   ```bash
   hermes config set model.default deepseek-v4-flash-free
   hermes config set model.provider opencode-zen
   ```

4. **Verify the setup**:

   ```bash
   hermes model list
   # Should show deepseek-v4-flash-free as available

   hermes config show
   # Confirm model.default = deepseek-v4-flash-free
   # Confirm model.provider = opencode-zen
   ```

5. **Set up GitHub authentication** (for repository push/pull):

   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your-email@example.com"

   # Store your GitHub personal access token
   git config --global credential.helper store
   # Then do a test push — git will prompt for username and token
   ```

### Verifying Hermes is Working

```bash
# Send a test message
hermes chat -m "Hello, is Hermes working?"
# Expected: A friendly AI response confirming connectivity

# Check provider connectivity
hermes provider health
# Expected: status = OK for opencode-zen
```

---

## How to Review & Approve

### For Stakeholders / Reviewers

1. **Read the framework table above.** Each event has a clear matching rule, trigger type, and variable list.
2. **Check the "Junk-drawer" flags.** Review any items marked "Junk-drawer rescue" — these are events we intentionally pulled out of catch-all buckets to give them proper treatment.
3. **Review the Open Questions.** Each pending decision needs a response. Unresolved questions block Task 2 (GTM implementation).
4. **Sign off by:**
   - [Commenting on the GitHub Issue](#) (once opened)
   - OR adding an approval comment to this pull request
   - OR checking the box in the project tracking document

### Approval Gate

**Task 2 (GTM JSON Generation, Import & QA) will not begin until:**
- ✅ The framework table has been reviewed and explicitly approved
- ✅ All open questions/decisions have been resolved and reflected in the table
- ✅ This README (including the Hermes setup section) is published and accessible

---

---

## Working Tool: Taxonomy Inspector Bookmarklet

This project comes with a **working, testable diagnostic tool** — a browser bookmarklet that inspects *any web page* in real time and shows you which taxonomy event would fire for every clickable element.

### 📥 Installation

1. Open **`test-harness.html`** in your browser (open directly from the repo or GitHub Pages)
2. Drag the **"🎯 Inspect Tracking"** button to your bookmarks bar
3. Visit any page and click the bookmarklet

### 🖱️ Usage

| Action | What Happens |
|--------|-------------|
| **Hover** any element | Floating panel shows which event matched + family color |
| **Click** any element | Full proposed parameter object displayed in the panel |
| **View** in console | `console.log` dumps the full JSON match for each inspected element |
| **Close** | Click ✕ to remove the overlay |

### 🧪 Test It Now

Use the included **`test-harness.html`** — it contains real demo elements for every event family:
- Forms that fire `generate_lead`
- Download links that fire `file_download`
- Nav bars that fire `global_nav`
- Accordions, tabs, and carousels that fire `web_element`
- Program finder that fires `custom_filter_search`
- External links that fire `exit_link`
- Video players, chat buttons, calculators, RSVP links, news articles, phone/email links, and more

Open the test harness, install the bookmarklet, click it on the test page, and hover every element to see the matching rules in action.

---

## Portability Validation: OSU & MiamiOH

The framework was validated against two other major Ohio university websites to confirm it's general enough for any higher education site. Results are in **`PORTABILITY.md`**.

| Site | Elements Mapped | New Events Needed | New Families Needed |
|------|----------------|-------------------|-------------------|
| **OSU** (osu.edu) | Nav, CTAs, news, accordions, carousels, search, video, stats, footer | **0** | **0** |
| **MiamiOH** (miamioh.edu) | Nav, hero video, CTAs, news, events, program cards, blog, chat, search | **0** | **0** |

**Conclusion:** All 16 events and all 5 families map cleanly across three different university sites. The framework is portable.

---

## Project Structure

```
universal-click-tracking/
├── README.md                ← This file (taxonomy framework + setup guide)
├── PORTABILITY.md           ← OSU & MiamiOH validation results
├── qr-code.png              ← QR code linking to this repo
├── test-harness.html        ← Interactive test/demo page with all 16 events
├── bookmarklet.js           ← Source code for the taxonomy inspector bookmarklet
└── bookmarklet.min.js       ← Minified bookmarklet (paste into bookmark URL)
```

---

## QR Code

Scan this to open this repository on GitHub:

![QR Code](qr-code.png)

*(QR code generated — see `qr-code.png` in this repo)*

---

## License

This framework is developed for Ohio University's marketing analytics team.
