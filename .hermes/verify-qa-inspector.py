#!/usr/bin/env python3
# hermes-verify: QA inspector files + trigger generation docs

import os, subprocess, sys

root = "/Users/grahamz/ai-agent/universal-click-tracking"
os.chdir(root)
errors = []

def check(desc, ok, detail=""):
    if ok:
        print("  PASS  " + desc)
    else:
        print("  FAIL  " + desc + "  " + detail)
        errors.append(desc)

print("═══ HERMES VERIFY: QA inspector + trigger docs ═══")
print()

# New files
print("--- New files ---")
for f in ["qa-inspector.js", "qa-inspector.min.js", "GENERATE-TRIGGERS.md", "QA-BOOKMARKLET.md"]:
    check(f + " exists", os.path.exists(f))

# JS syntax
print()
print("--- JS syntax ---")
for f in ["qa-inspector.js", "qa-inspector.min.js"]:
    r = subprocess.run(["node", "-c", f], capture_output=True, text=True)
    check(f + " syntax", r.returncode == 0)

# QA minified content
print()
print("--- QA Inspector content ---")
with open("qa-inspector.min.js") as f:
    qm = f.read()
check("Minified < 5KB", len(qm) < 5000)
check("contact_click event", "contact_click" in qm)
check("__ohioInspector guard", "__ohioInspector" in qm)
check("mouseenter handler", "mouseenter" in qm)
check("__ohioClose button", "__ohioClose" in qm)

# GENERATE-TRIGGERS.md
print()
print("--- GENERATE-TRIGGERS.md ---")
with open("GENERATE-TRIGGERS.md") as f:
    gt = f.read()
check("Taxonomy reference present", "16" in gt and "taxonomy" in gt.lower())
check("AI prompt block", "PASTE YOUR EXCEL" in gt)
check("GTM import instructions", "Import Container" in gt)
check("Testing container warning", "testing" in gt.lower())
check("No internal IDs", "G-JR43SKW92E" not in gt and "GTM-N7GZT99" not in gt)
check("No test-harness ref", "test-harness" not in gt)

# QA-BOOKMARKLET.md
print()
print("--- QA-BOOKMARKLET.md ---")
with open("QA-BOOKMARKLET.md") as f:
    qa = f.read()
check("No placeholder text", "PLACEHOLDER" not in qa.upper())
check("8 event types", "8 event" in qa.lower())
check("Color table present", "#00694E" in qa)
check("CDN loader snippet", "cdn.jsdelivr.net" in qa)
check("Comparison to Taxonomy Inspector", "Taxonomy Inspector" in qa)

# HTML page
print()
print("--- engagement-first-framework.html ---")
with open("engagement-first-framework.html") as f:
    h = f.read()
check("OHIO Inspector install link", "OHIO Inspector" in h)
check("qa-bookmarklet-link id", "qa-bookmarklet-link" in h)
check("No test-harness", "test-harness" not in h)

# Cross-doc
print()
print("--- Cross-doc consistency ---")
readme = open("README.md").read()
check("README refs qa-inspector files", "qa-inspector" in readme)
check("README refs GENERATE-TRIGGERS", "GENERATE-TRIGGERS" in readme)
check("README refs QA-BOOKMARKLET", "QA-BOOKMARKLET" in readme)

print()
if errors:
    print("FAILED: " + str(len(errors)) + " check(s)")
    for e in errors:
        print("  " + e)
    sys.exit(1)
else:
    print("PASSED: all checks OK")
