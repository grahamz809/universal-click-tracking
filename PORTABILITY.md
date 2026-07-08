# Portability Validation: OSU, MiamiOH & Generic Location Detection

## The 16-Event Taxonomy

The taxonomy (5 families, 16 events) was validated against two other major Ohio university websites — see below. **Zero new events or families were needed.** The click-tracking framework is fully portable.

## The `web_element_location` Variable

The location detection has **three layers**, applied in order:

### Layer 1: OHIO-Specific (highest priority)
~110 rules using OHIO.edu's Drupal theme CSS selectors (`#main-menu`, `.top-green-bar`, `#global-footer`, `.program-finder`, etc.). These are the production rules from the live GTM container's `web_element_location` Custom JavaScript Variable.

### Layer 2: Generic Higher-Ed (medium priority)
10 rules matching common university website patterns that work across most .edu sites:

| Generic Label | Matches |
|--------------|---------|
| `navigation` | `<nav>`, `[role="navigation"]`, `[class*="nav-"]`, `[class*="navbar"]`, `[class*="menu-item"]` |
| `footer` | `<footer>`, `[class*="footer"]`, `[id*="footer"]` |
| `header` | `<header>`, `[class*="header"]`, `[id*="header"]` |
| `hero` | `[class*="hero"]`, `[class*="banner"]`, `[class*="spotlight"]` |
| `breadcrumb` | `[class*="breadcrumb"]`, `[aria-label*="breadcrumb"]` |
| `search` | `form[role="search"]`, `[class*="search"]`, `[id*="search"]` |
| `main-content` | `<main>`, `[role="main"]`, `<article>`, `[class*="content-area"]` |
| `sidebar` | `<aside>`, `[role="complementary"]`, `[class*="sidebar"]` |
| `card` | `[class*="card"]`, `[class*="tile"]`, `[class*="grid-item"]` |
| `tabs-accordion` | `[class*="tab"]`, `[role="tabpanel"]`, `[class*="accordion"]` |

### Layer 3: Fallback (always applied)
If no rule matches, the location defaults to `body`.

## The Ohio State University (osu.edu)

| Site Element | Mapped Event | Framework Family | Location Label |
|-------------|-------------|-----------------|----------------|
| Main nav (About, Academics, Research, etc.) | `global_nav` | Engagement | `navigation` (generic) |
| Utility nav (Give, search toggle) | `global_nav` | Engagement | `header` (generic) |
| Hero CTAs (Schedule a visit, Register for orientation, Explore majors) | `cta_link` | Engagement | `hero` (generic) |
| News cards ("Read more") with categories | `news_content` | Content & Media | `card` (generic) |
| Campus accordion (expand/collapse) | `web_element` | Engagement | `tabs-accordion` (generic) |
| Carousel prev/next buttons | `web_element` | Engagement | `card` (generic) |
| Search button | `internal_search` | Discovery | `search` (generic) |
| Footer nav links | `global_nav` | Engagement | `footer` (generic) |
| Video carousel | `video` | Content & Media | `card` (generic) |

## Miami University (miamioh.edu)

| Site Element | Mapped Event | Framework Family | Location Label |
|-------------|-------------|-----------------|----------------|
| Primary nav (Academics, Admission and Aid, etc.) | `global_nav` | Engagement | `navigation` (generic) |
| Utility links (Request Info, Visit, Info for, Give) | `global_nav` | Engagement | `header` (generic) |
| APPLY button in nav | `cta_button` | Engagement | `navigation` (generic) |
| Hero video (pause/mute buttons) | `video` | Content & Media | `hero` (generic) |
| CTA links ("Learn More", "Read More") | `cta_link` | Engagement | `card` (generic) |
| News articles | `news_content` | Content & Media | `card` (generic) |
| "Play Video" overlay button | `video` | Content & Media | `hero` (generic) |
| Footer navigation | `global_nav` | Engagement | `footer` (generic) |
| Search button | `internal_search` | Discovery | `search` (generic) |

**Verdict:** All 16 events and 11 location labels (10 generic + body) map cleanly. Zero new events, zero new families, zero new location patterns needed.
