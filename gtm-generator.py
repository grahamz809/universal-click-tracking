#!/usr/bin/env python3
"""
GTM Container Generator
Takes a CSV from the Universal Click-Tracking bookmarklet + a donor GTM
container JSON, and produces a clean GTM container JSON ready for import.

Usage:
    python3 gtm-generator.py input.csv donor_container.json -o output.json

The donor container is any valid GTM export. Its structure, account IDs, vendor
templates, and enums are preserved. Only tags, triggers, variables, and
builtInVariables are replaced.
"""

import csv, json, sys, argparse
from collections import defaultdict

# ---------------------------------------------------------------------------
#  Taxonomy reference — 5 families, 16 events
# ---------------------------------------------------------------------------
TAXONOMY = {
    "Conversion":       ["generate_lead", "event_rsvp", "file_download"],
    "Engagement":       ["cta_button", "cta_link", "global_nav",
                         "contact_click", "web_element"],
    "Discovery":        ["internal_search", "custom_filter_search"],
    "Content & Media":  ["news_content", "video"],
    "Utility & Support":["tool_interaction", "chat", "exit_link", "404"],
}
VALID_EVENTS = {e for events in TAXONOMY.values() for e in events}

# ---------------------------------------------------------------------------
#  Trigger type mapping
# ---------------------------------------------------------------------------
TAG_TO_TYPE = {
    "a":      "LINK_CLICK",
    "button": "CLICK",
    "input":  "CLICK",
    "form":   "FORM_SUBMISSION",
    "iframe": "YOU_TUBE_VIDEO",
}

def trigger_type(tag: str, event: str) -> str:
    if event == "404":
        return "PAGEVIEW"
    if event == "video":
        return "YOU_TUBE_VIDEO"
    return TAG_TO_TYPE.get(tag, "CLICK")

def trigger_name(event: str, text: str, page_label: str) -> str:
    parts = [event]
    if text:
        parts.append(text[:60])
    if page_label:
        parts.append(page_label[:30])
    name = "Trigger - " + " - ".join(parts)
    return name.replace(":", "-")  # GTM rejects colons

# ===================================================================
#  GA4 EVENT TAG generator
# ===================================================================
def param_block(param_name: str, variable: str) -> dict:
    return {
        "type": "MAP",
        "map": [
            {"type": "TEMPLATE", "key": "parameter", "value": param_name},
            {"type": "TEMPLATE", "key": "parameterValue", "value": variable}
        ]
    }

EVENT_PARAMS = {
    "default": [
        param_block("web_element_location", "{{web_element_location}}"),
        param_block("click_text", "{{Click Text}}"),
        param_block("link_url", "{{Click URL}}"),
    ],
    "form": [
        param_block("web_element_location", "{{web_element_location}}"),
        param_block("click_text", "{{Click Text}}"),
        param_block("link_url", "{{Click URL}}"),
        param_block("form_id", "{{Form ID}}"),
        param_block("form_classes", "{{Form Classes}}"),
    ],
    "video": [
        param_block("web_element_location", "{{web_element_location}}"),
        param_block("click_text", "{{Click Text}}"),
        param_block("link_url", "{{Click URL}}"),
        param_block("video_url", "{{Video URL}}"),
        param_block("video_title", "{{Video Title}}"),
        param_block("video_status", "{{Video Status}}"),
        param_block("video_percent", "{{Video Percent}}"),
    ],
}

EVENT_PARAM_SETS = {
    "generate_lead": "form",
    "internal_search": "form",
    "custom_filter_search": "form",
    "tool_interaction": "form",
    "video": "video",
}

def params_for_event(event: str) -> list:
    return EVENT_PARAMS[EVENT_PARAM_SETS.get(event, "default")]

def make_ga4_tag(tag_id: int, event_name: str, account_id: str,
                 container_id: str, config_tag_id: str,
                 param_list: list) -> dict:
    return {
        "accountId": account_id,
        "containerId": container_id,
        "tagId": str(tag_id),
        "name": f"GA4 Event - {event_name}",
        "type": "gaawe",
        "waitForTags": {"type": "BOOLEAN", "value": "false"},
        "waitForTagsTimeout": {"type": "TEMPLATE"},
        "setupTag": [],
        "teardownTag": [],
        "firingTriggerId": [],
        "parameter": [
            {"type": "TEMPLATE", "key": "gaConfigSettingsTable",
             "value": "default_ga4"},
            {"type": "TEMPLATE", "key": "measurementId",
             "value": config_tag_id},
            {"type": "TEMPLATE", "key": "eventName",
             "value": event_name},
            {"type": "LIST", "key": "eventSettingsTable",
             "list": param_list},
            {"type": "BOOLEAN", "key": "respectConsent",
             "value": "true"}
        ],
        "fingerprint": None
    }

# ===================================================================
#  TRIGGER generator
# ===================================================================
def make_trigger(trigger_id: int, row: dict, account_id: str,
                 container_id: str, row_num: int) -> dict:
    tag     = row.get("tag", "a").strip()
    event   = row.get("event", "web_element").strip()
    css_sel = row.get("css_selector", "").strip()
    text    = row.get("click_text", "").strip()
    page    = row.get("web_element_location", "").strip()

    ttype = trigger_type(tag, event)
    name  = trigger_name(event, text, page)

    trig = {
        "accountId": account_id,
        "containerId": container_id,
        "triggerId": str(trigger_id),
        "name": name,
        "type": ttype,
    }

    if ttype in ("LINK_CLICK", "CLICK"):
        trig["waitForTags"] = {"type": "BOOLEAN", "value": "false"}
        trig["checkValidation"] = {"type": "BOOLEAN", "value": "false"}
        trig["waitForTagsTimeout"] = {"type": "TEMPLATE"}
        trig["uniqueTriggerId"] = {"type": "TEMPLATE"}
        if css_sel:
            trig["filter"] = [
                {"type": "CSS_SELECTOR",
                 "parameter": [
                     {"type":"TEMPLATE","key":"arg0","value":"{{Click Element}}"},
                     {"type":"TEMPLATE","key":"arg1","value": css_sel}
                 ]}
            ]
        else:
            trig["filter"] = [
                {"type":"CONTAINS",
                 "parameter":[
                     {"type":"TEMPLATE","key":"arg0","value":"{{Click URL}}"},
                     {"type":"TEMPLATE","key":"arg1","value":".ohio.edu"}
                 ]}
            ]

    elif ttype == "FORM_SUBMISSION":
        trig["waitForTags"] = {"type": "BOOLEAN", "value": "false"}
        trig["waitForTagsTimeout"] = {"type": "TEMPLATE"}
        trig["uniqueTriggerId"] = {"type": "TEMPLATE"}
        if css_sel:
            trig["autoEventFilter"] = [
                {"type":"CSS_SELECTOR",
                 "parameter":[
                     {"type":"TEMPLATE","key":"arg0","value":"{{Click Element}}"},
                     {"type":"TEMPLATE","key":"arg1","value": css_sel}
                 ]}
            ]

    elif ttype == "YOU_TUBE_VIDEO":
        trig["waitForTags"] = {"type": "BOOLEAN", "value": "false"}
        trig["waitForTagsTimeout"] = {"type": "TEMPLATE"}
        trig["uniqueTriggerId"] = {"type": "TEMPLATE"}
        if css_sel:
            trig["filter"] = [
                {"type":"CSS_SELECTOR",
                 "parameter":[
                     {"type":"TEMPLATE","key":"arg0","value":"{{Click Element}}"},
                     {"type":"TEMPLATE","key":"arg1","value": css_sel}
                 ]}
            ]

    elif ttype == "PAGEVIEW":
        trig["waitForTags"] = {"type": "BOOLEAN", "value": "false"}
        trig["checkValidation"] = {"type": "BOOLEAN", "value": "false"}
        trig["waitForTagsTimeout"] = {"type": "TEMPLATE"}
        trig["uniqueTriggerId"] = {"type": "TEMPLATE"}
        trig["filter"] = [
            {"type":"CONTAINS",
             "parameter":[
                 {"type":"TEMPLATE","key":"arg0","value":"{{Page URL}}"},
                 {"type":"TEMPLATE","key":"arg1","value":"404"}
             ]}
        ]

    trig["fingerprint"] = str(1784000000000 + row_num * 1117)
    return trig

# ===================================================================
#  BUILT-IN VARIABLES
# ===================================================================
BUILT_IN_VARIABLES = [
    {"type":"CONSTANT","name":"Event Name", "parameter":[{"type":"TEMPLATE","key":"name","value":"{{_event}}"}]},
    {"type":"COOKIE","name":"Click URL","parameter":[{"type":"TEMPLATE","key":"name","value":"_url"},{"type":"TEMPLATE","key":"component","value":"URL"}]},
    {"type":"COOKIE","name":"Click Text","parameter":[{"type":"TEMPLATE","key":"name","value":"_text"}]},
    {"type":"COOKIE","name":"Click Element","parameter":[{"type":"TEMPLATE","key":"name","value":"_element"}]},
    {"type":"COOKIE","name":"Click ID","parameter":[{"type":"TEMPLATE","key":"name","value":"_element_id"}]},
    {"type":"COOKIE","name":"Click Classes","parameter":[{"type":"TEMPLATE","key":"name","value":"_element_class"}]},
    {"type":"COOKIE","name":"Click Target","parameter":[{"type":"TEMPLATE","key":"name","value":"_target"}]},
    {"type":"COOKIE","name":"Form ID","parameter":[{"type":"TEMPLATE","key":"name","value":"_form_id"}]},
    {"type":"COOKIE","name":"Form Classes","parameter":[{"type":"TEMPLATE","key":"name","value":"_form_class"}]},
    {"type":"COOKIE","name":"Form URL","parameter":[{"type":"TEMPLATE","key":"name","value":"_form_url"}]},
    {"type":"COOKIE","name":"Video URL","parameter":[{"type":"TEMPLATE","key":"name","value":"_video_url"}]},
    {"type":"COOKIE","name":"Video Title","parameter":[{"type":"TEMPLATE","key":"name","value":"_video_title"}]},
    {"type":"COOKIE","name":"Video Status","parameter":[{"type":"TEMPLATE","key":"name","value":"_video_status"}]},
    {"type":"COOKIE","name":"Video Percent","parameter":[{"type":"TEMPLATE","key":"name","value":"_video_percent"}]},
    {"type":"COOKIE","name":"Page Hostname","parameter":[{"type":"TEMPLATE","key":"name","value":"_hostname"}]},
    {"type":"COOKIE","name":"Page Path","parameter":[{"type":"TEMPLATE","key":"name","value":"_page_path"}]},
    {"type":"COOKIE","name":"Page URL","parameter":[{"type":"TEMPLATE","key":"name","value":"_page_url"}]},
    {"type":"COOKIE","name":"Referrer","parameter":[{"type":"TEMPLATE","key":"name","value":"_referrer"}]},
    {"type":"COOKIE","name":"Scroll Depth Threshold","parameter":[{"type":"TEMPLATE","key":"name","value":"Scroll Depth Threshold"}]},
]

# ===================================================================
#  WEB_ELEMENT_LOCATION — Custom JavaScript variable
# ===================================================================
WEB_ELEMENT_LOCATION_JS = r"""function() {
  var el = {{Click Element}};
  if (!el) return 'body';
  var tag = el.tagName ? el.tagName.toLowerCase() : '';
  while (el && el !== document.body) {
    if (el.matches && el.matches('.block-search-radio-button, [class*="search-radio"], label[for*="search"]')) return 'search.ohio.edu';
    if (el.closest && el.closest('[class*="top-green-bar"], [class*="utility-nav"], [class*="global-util"]')) return 'top-green-bar';
    if (tag === 'a' && el.closest && el.closest('[class*="logo"], [class*="site-branding"], [class*="branding"], header a[href*="ohio.edu"]')) return 'global-OHIO-logo';
    if (el.closest && el.closest('[class*="search"], [role="search"], form[action*="search"]')) return 'search.ohio.edu';
    if (el.closest && el.closest('nav[class*="main"], [class*="navigation"], [class*="navbar"], [class*="menu-main"]')) return 'main-nav';
    if (el.closest && el.closest('[class*="hero"], [class*="banner"], [class*="splash"]')) return 'hero';
    if (el.closest && el.closest('[class*="breadcrumb"]')) return 'breadcrumb';
    if (el.closest && el.closest('footer, [class*="footer"]')) return 'footer';
    if (el.closest && el.closest('[class*="sidebar"], [class*="side-bar"], aside')) return 'sidebar';
    if (el.closest && el.closest('main, [role="main"], article, [class*="content"], [class*="main-content"]')) return 'main-content';
    el = el.parentElement;
  }
  el = {{Click Element}};
  while (el && el !== document.body) {
    if (el.matches && el.closest && (el.closest('[class*="card"]') || el.closest('[class*="tile"]'))) return 'card';
    if (el.matches && el.closest && (el.closest('[class*="tab"]') || el.closest('[class*="accordion"]'))) return 'tabs-accordion';
    if (el.matches && el.closest && el.closest('[class*="cta"], [class*="call-to-action"]')) return 'main-content';
    el = el.parentElement;
  }
  if (document.body.contains({{Click Element}})) {
    if (tag === 'a') { if (el.closest && el.closest('nav')) return 'main-nav'; if (el.closest && el.closest('footer')) return 'footer'; }
  }
  return 'body';
}"""

def make_web_element_location_var(var_id: int, account_id: str, container_id: str) -> dict:
    return {
        "accountId": account_id,
        "containerId": container_id,
        "variableId": str(var_id),
        "name": "web_element_location",
        "type": "jsm",
        "parameter": [
            {"type": "TEMPLATE", "key": "javascript", "value": WEB_ELEMENT_LOCATION_JS}
        ],
        "fingerprint": str(1784000000000 + var_id * 1117)
    }

# ===================================================================
#  CSV READER
# ===================================================================
def read_csv(path: str) -> list:
    rows = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader, start=1):
            n = {}
            for k, v in row.items():
                kk = k.strip().lower().replace(" ", "_")
                n[kk] = v.strip() if v else ""
            if not n.get("css_selector"):
                for alt in ("css", "selector"):
                    v = n.get(alt) or row.get(alt, "")
                    if v: n["css_selector"] = v; break
            if not n.get("event"):
                n["event"] = "web_element"
            if n.get("css_selector"):
                rows.append(n)
    return rows

# ===================================================================
#  MAIN
# ===================================================================
def main():
    ap = argparse.ArgumentParser(description="Generate GTM container JSON from CSV")
    ap.add_argument("csv", help="CSV from bookmarklet export")
    ap.add_argument("donor", help="Donor GTM container JSON")
    ap.add_argument("-o", "--output", default="gtm_output.json")
    args = ap.parse_args()

    csv_rows = read_csv(args.csv)
    if not csv_rows:
        print("ERROR: No rows found. Check column headers: CSS Selector, Event, tag")
        sys.exit(1)
    print(f"Read {len(csv_rows)} rows from {args.csv}")

    with open(args.donor) as f:
        donor = json.load(f)
    cv = donor["containerVersion"]
    container = cv["container"]
    acct = cv["accountId"]
    cont = cv["containerId"]
    print(f"Donor: {container.get('publicId')} (acct={acct}, cont={cont})")

    events = []
    seen = set()
    for row in csv_rows:
        e = row.get("event", "web_element").strip()
        if e not in seen:
            seen.add(e)
            events.append(e)
    print(f"Unique events: {len(events)}: {', '.join(sorted(events))}")

    triggers = [make_trigger(i, row, acct, cont, i) for i, row in enumerate(csv_rows, start=1)]
    print(f"Triggers: {len(triggers)}")

    event_tids = defaultdict(list)
    for t in triggers:
        parts = t["name"].replace("Trigger - ", "", 1).split(" - ")
        event_tids[parts[0]].append(t["triggerId"])

    config_tag_id = "G-JR43SKW92E"
    for tag in cv.get("tag", []):
        if tag.get("type") == "gaawe":
            for p in tag.get("parameter", []):
                if p.get("key") == "measurementId": config_tag_id = p["value"]; break
            break

    tags = []
    for i, evt in enumerate(sorted(events), start=1):
        tag = make_ga4_tag(i, evt, acct, cont, config_tag_id, params_for_event(evt))
        tag["firingTriggerId"] = event_tids.get(evt, [])
        tags.append(tag)
    print(f"Tags: {len(tags)}")

    var = make_web_element_location_var(1, acct, cont)

    output = {
        "exportFormatVersion": 2,
        "exportTime": None,
        "containerVersion": {
            "path": None,
            "accountId": acct,
            "containerId": cont,
            "containerVersionId": "0",
            "container": {
                "path": None,
                "accountId": acct,
                "containerId": cont,
                "name": f"Click-Tracking (from {container.get('publicId','CSV')})",
                "publicId": container.get("publicId", "GTM-XXXXXXX"),
                "usageContext": container.get("usageContext", ["WEB"]),
                "fingerprint": None,
            },
            "tag": tags,
            "trigger": triggers,
            "variable": [var],
            "builtInVariable": BUILT_IN_VARIABLES,
            "fingerprint": None,
        }
    }

    with open(args.output, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nWrote {args.output}")
    print(f"  Tags: {len(tags)}  Triggers: {len(triggers)}  Vars: 1")
    print(f"Ready to import into GTM via Admin > Import Container.")

if __name__ == "__main__":
    main()
