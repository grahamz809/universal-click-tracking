(function() {
  'use strict';
  var groups = [
    ["contact_click", "#FF9800", function(el) { return el.matches('a[href^="tel:"],a[href^="mailto:"],a[href*="maps.google.com"]'); }],
    ["generate_lead", "#D32F2F", function(el) { return el.matches('form[action*="slate"],form#rfi,form.request-info-form'); }],
    ["global_nav", "#9C27B0", function(el) { return el.closest('#main-menu,.aux-menu,.top-green-bar,.personal-links,#global-footer,footer,.top-navigation,.menu-item,nav'); }],
    ["exit_link", "#E91E63", function(el) { return el.matches('a[href^="http"]') && !el.href.includes('ohio.edu'); }],
    ["cta_button", "#00694E", function(el) { return el.matches('a.button,a.cta-button,.hero-cta a,button.cta,a[class*="btn"]'); }],
    ["cta_link", "#2964FF", function(el) { return el.closest('.card-links,.quick-links,.tile,.icon-tiles,.image-tiles,.topic-preview,.featured-media,.social-icons,.icons--link'); }],
    ["web_element", "#607D8B", function(el) { return el.matches('.collapsible-heading,.faq-button,.section-expander,.accordion summary,details summary,.pager__item a,button.arrow.next,.collapse-h2,.collapse-h3,.collapse-h4,.collapse-h5,.collapse-h6'); }],
    ["internal_search", "#008080", function(el) { return el.matches('form[role="search"],form[class*="funnelback"],.search-form,#search-desktop,#search-mobile'); }]
  ];

  var locationRules = [
    ['main-menu', '#main-menu'],
    ['top-green-bar', '.aux-menu,.top-green-bar'],
    ['footer', 'footer,#global-footer'],
    ['left-navigation', '#left-navigation'],
    ['breadcrumbs', '.breadcrumb'],
    ['hero', '.hero'],
    ['button', '.button'],
    ['card-links', '.card-links'],
    ['quick-links', '.quick-links,.quicklinks--wrapper'],
    ['tile', '.tile'],
    ['faq', '.faq-button,.faq-question'],
    ['collapsible-headings', '.collapsible-heading'],
    ['social-icons', '.social-icons'],
    ['news-row', '.news-row'],
    ['events-link', '.events-link,.event-feed'],
    ['explore-tabs', '.explore-tabs'],
    ['image-tiles', '.image-tiles'],
    ['program-finder', '.program-finder'],
    ['promo-box', '.promo-box'],
    ['video', '.video,.video-embed-field-provider-youtube'],
    ['left-navigation', '#left-navigation']
  ];

  function classify(el) {
    for (var i = 0; i < groups.length; i++) {
      try {
        var group = groups[i];
        if (group[2](el)) {
          var location = 'body';
          for (var j = 0; j < locationRules.length; j++) {
            if (el.closest(locationRules[j][1])) {
              location = locationRules[j][0];
              break;
            }
          }
          return { event: group[0], color: group[1], location: location };
        }
      } catch(e) {}
    }
    return null;
  }

  if (document.getElementById('__ohioInspector')) { return; }

  var elements = document.querySelectorAll('a,button,form,[class*="collapsible"],[class*="faq"]');
  var tracked = [];
  var counts = {};

  elements.forEach(function(el) {
    var result = classify(el);
    if (!result) return;

    var eventName = result.event;
    var color = result.color;
    var location = result.location;

    el.style.outline = '2px solid ' + color;
    el.style.outlineOffset = '2px';
    el.__color = color;

    el.addEventListener('mouseenter', function() {
      var rect = this.getBoundingClientRect();
      var tip = document.createElement('div');
      var text = (this.textContent || '').trim().substring(0, 60) || '(icon)';
      var hrefVal = this.href || this.action || this.src || '';
      var c = this.__color;

      tip.style.cssText = 'position:fixed;z-index:9999999;background:#333;color:#fff;padding:10px 14px;border-radius:8px;font:12px/1.5 monospace;pointer-events:none;box-shadow:0 2px 10px rgba(0,0,0,0.5);max-width:440px;border-top:3px solid ' + c + ';';
      tip.style.top = Math.max(4, rect.top - 52) + 'px';
      tip.style.left = Math.max(4, rect.left) + 'px';
      tip.innerHTML = '<div style="font-weight:bold;color:' + c + '">' + eventName + '</div><div style="color:#ddd;margin:2px 0">' + text + '</div><div style="color:#999;font-size:11px">CSS: ' + this.tagName.toLowerCase() + (hrefVal ? '[href]' : '') + '</div><div style="color:#00cc88;font-size:11px;margin-top:2px">📍 ' + location + '</div>';
      document.body.appendChild(tip);
      this.__tip = tip;
    });

    el.addEventListener('mouseleave', function() {
      if (this.__tip) { this.__tip.remove(); this.__tip = null; }
    });

    tracked.push(result);
    counts[eventName] = (counts[eventName] || 0) + 1;
  });

  var container = document.createElement('div');
  container.id = '__ohioInspector';

  var legendHtml = '';
  groups.forEach(function(g) {
    var name = g[0];
    var color = g[1];
    var count = counts[name] || 0;
    legendHtml += '<div style="display:flex;align-items:center;gap:6px;padding:3px 0"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:' + color + '"></span><span style="flex:1">' + name + '</span><span style="color:#666;font-size:11px">' + count + ' elem</span></div>';
  });

  container.innerHTML = '<div id="__ohioPanel" style="position:fixed;top:10px;right:10px;z-index:999999;background:#fff;border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,0.3);padding:14px 18px;font:13px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;max-height:80vh;overflow-y:auto;min-width:210px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b style="color:#00694E;font-size:15px">🔍 OHIO Inspector</b><span id="__ohioClose" style="cursor:pointer;color:#999;font-size:20px;padding:0 4px">&#10005;</span></div><div style="margin-bottom:8px;font-weight:bold;color:#333">' + tracked.length + ' elements tracked</div><div id="__ohioLegend">' + legendHtml + '</div><div style="margin-top:8px;font-size:11px;color:#999;border-top:1px solid #eee;padding-top:6px">Hover element = event + 📍 location</div></div>';

  document.body.appendChild(container);
  document.getElementById('__ohioClose').onclick = function() { container.style.display = 'none'; };
})();
