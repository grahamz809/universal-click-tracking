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

  var         locationRules = [
    ['#acalog-navigation', 'left-navigation'],
    ['#block-ohio-theme-ohiotoday li.logo-list-element a', 'ohio-today-logo'],
    ['#block-ohio-theme-ohiotoday li.menu-item > a', 'main-menu'],
    ['#calendar-tabs *:not(:empty)', 'calendar-tabs'],
    ['#community-popover-panel', 'forever-community'],
    ['#experience-data', 'experience-details-link'],
    ['#experience-details #experience-supplement .field--name-field-industry-focus-tag .field__item a', 'experience-tag'],
    ['#featured-experience', 'featured-experience'],
    ['#funnelback-block-search-form', 'top-green-bar-search'],
    ['#global-footer', 'footer'],
    ['#header-top #logo > a > img', 'global-OHIO-logo'],
    ['#header-top button#search-mobile', 'top-green-bar'],
    ['#left-navigation', 'left-navigation'],
    ['#main-menu', 'main-menu'],
    ['#mainContentContainer app-home form', 'compensation-estimator'],
    ['#ogo-study-away-programs', 'ogo-study-away-programs'],
    ['#ogo-study-away-programs a.card.svelte-1byw2gh', 'ogo-study-away-program-link'],
    ['#snowstart', 'snow-start'],
    ['#snowstop', 'snow-stop'],
    ['.academics-row', 'academics-row'],
    ['.affordability-row', 'affordability-row'],
    ['.alert-more-info', 'alert'],
    ['.all-programs-search-link', 'program-link-view-all'],
    ['.anchored-spotlights-container', 'anchored-spotlights'],
    ['.appsel-option-header', 'UGRD-appsel'],
    ['.archives-row a', 'OT-archives-row'],
    ['.aux-menu', 'top-green-bar'],
    ['.card-links', 'card-links'],
    ['.collapse-h2', 'old-collapse-heading'],
    ['.collapse-h3', 'old-collapse-heading'],
    ['.collapse-h4', 'old-collapse-heading'],
    ['.collapse-h5', 'old-collapse-heading'],
    ['.collapse-h6', 'old-collapse-heading'],
    ['.collapsible-heading', 'collapsible-headings'],
    ['.colleges-row', 'colleges-row'],
    ['.community-popover-button', 'forever-community'],
    ['.community-row', 'community-row'],
    ['.cta-container', 'Become a Bobcat, for life'],
    ['.cta-row', 'Become a Bobcat, for life'],
    ['.event-feed', 'event-feed'],
    ['.event-feed .event-link a', 'events-link'],
    ['.events-link a.action', 'events-link'],
    ['.experience-grid', 'experience-grid'],
    ['.experiences-row', 'experiences-row'],
    ['.expert-callout a', 'experts-callout'],
    ['.explore-tabs', 'explore-tabs'],
    ['.facts-container', 'facts-container'],
    ['.faq-icon', 'faq'],
    ['.faq-question', 'faq'],
    ['.fast-facts a', 'fast-facts'],
    ['.featured-media a.button.green', 'featured-media'],
    ['.featured-media--large-image-wrapper', 'featured-media'],
    ['.foodpro-container', 'food-menu'],
    ['.gifts-row', 'gifts-row'],
    ['.graduate-program-finder-links', 'graduate-program-finder-link'],
    ['.hero-subtitle', 'hero'],
    ['.hero-text', 'hero'],
    ['.hero-title', 'hero'],
    ['.hero-video-container', 'hero-video'],
    ['.hero-wrapper', 'hero'],
    ['.icons--link', 'icon'],
    ['.image-tiles', 'image-tiles'],
    ['.image-tiles--item', 'image-tiles'],
    ['.learn-row', 'learn-row'],
    ['.locations-row', 'locations-row'],
    ['.lookbook-header', 'lookbook-header'],
    ['.lsh-hero .lsh-cta a.button', 'hero'],
    ['.majors-row', 'majors-row'],
    ['.news-intro .news-link a.action', 'news-row'],
    ['.news-row', 'news-row'],
    ['.ohio-table-sortable', 'sortable-table'],
    ['.ohio-today-footer', 'OT-footer'],
    ['.ohio-today-logo', 'OT-Logo'],
    ['.ohio_image_overlay_body', 'image-overlay'],
    ['.pager__item', 'pager'],
    ['.personal-links a', 'personal-links'],
    ['.pride-row', 'pride-row'],
    ['.program-finder', 'program-finder'],
    ['.program-link', 'program-link'],
    ['.programs-row', 'program-link'],
    ['.promo-box', 'promo-box'],
    ['.quicklinks--wrapper', 'quick-links'],
    ['.related-story-link', 'related-story-link'],
    ['.request-info-form#rfi', 'RFI'],
    ['.search-results__link', 'search.ohio.edu'],
    ['.section-expander', 'section-expander'],
    ['.social-icons', 'social-icons'],
    ['.social-icons a.icons--link', 'social-row'],
    ['.social-row', 'social-row'],
    ['.special-statement', 'special-statement-bar'],
    ['.story-listing-item', 'story-listing'],
    ['.subscribe-row a', 'OT-subscribe-row'],
    ['.tag-link', 'OT-popular-topics'],
    ['.tile', 'tile'],
    ['.tiles--small a.tile', 'tile'],
    ['.top-green-bar', 'top-green-bar'],
    ['.top-navigation', 'main-menu-catalogs'],
    ['.topic-preview', 'topic-preview'],
    ['.topic-preview a.button.green', 'topic-preview'],
    ['.value-row', 'value-row'],
    ['.video-embed-field-provider-youtube iframe', 'video'],
    ['.view-experience-directory', 'experience-card'],
    ['.view-profiles #edit-submit-profiles', 'directory-search'],
    ['.view-profiles input.form-checkbox', 'directory-search'],
    ['.visit-app-row', 'visit-application-row'],
    ['a.alumni-news-story', 'OT-alumni-news-story'],
    ['a.button.green', 'button'],
    ['a.button.moss', 'button'],
    ['a.button.white', 'button'],
    ['a.explore-tabs--tab.active', 'explore-tabs'],
    ['a.fact[class*="background--"].half', 'fact-card'],
    ['a.fact[class*="background--"].quarter', 'fact-card'],
    ['a.green-scenes-story', 'OT-green-scenes-story'],
    ['a.profile-card', 'profile-card'],
    ['a.reference', 'ohio-in-the-news'],
    ['a[id^="taxonomy-term"]', 'ohio-story-tag'],
    ['button#closeSearch', 'top-green-bar-search-close'],
    ['button.arrow.next', 'image-slideshow-arrows'],
    ['div#logoSpaceContent a', 'site-name'],
    ['div#related-experiences a', 'experience-card-related'],
    ['div.ad-lp-hero-form.request-info-form.slate#rfi', 'slate_rfi'],
    ['div.gallery-wrapper *', 'image-gallery'],
    ['div.view.view-programs-non-standard a', 'program-link'],
    ['form.funnelback-block-search-form input.form-radio', 'top-green-bar-search-radio-button'],
    ['li.pager__item > a', 'pager'],
    ['nav.breadcrumb ol li a', 'breadcrumbs'],
    ['section.facts-section', 'facts-section'],
    ['section.facts-section a.info-link', 'facts-container-info-link'],
    ['section.tabs-container *', 'tabs-container'],
    ['summary.faq-button *', 'faq'],
    ['summary.faq-button section *', 'faq'],
    ['ul.feature-stories', 'OT-feature-story'],
    ['ul.footer-share-links', 'News-OT-share-links-footer'],
    ['ul.share-links a', 'News-OT-share-links'],
    ['ul.top-feature-story', 'OT-top-feature-story'],
    ['ul.top-social a *', 'top-green-bar-social-icons'],
  ];
    ['navigation', 'nav, [role=\'navigation\'], [class*=\'nav-\'], [class*=\'navbar\'], [class*=\'navigation\'], [class*=\'menu-item\']'],
    ['footer', 'footer, [class*=\'footer\'], [id*=\'footer\']'],
    ['header', 'header, [class*=\'header\'], [id*=\'header\']'],
    ['hero', '[class*=\'hero\'], [class*=\'banner\'], [class*=\'spotlight\']'],
    ['breadcrumb', '[class*=\'breadcrumb\'], [aria-label*=\'breadcrumb\'], [class*=\'bread-crumb\']'],
    ['search', 'form[role=\'search\'], [class*=\'search\'], [id*=\'search\'], [class*=\'funnelback\']'],
    ['main-content', 'main, [role=\'main\'], article, [class*=\'content-area\'], [class*=\'main-content\']'],
    ['sidebar', 'aside, [role=\'complementary\'], [class*=\'sidebar\'], [class*=\'side-bar\']'],
    ['card', '[class*=\'card\'], [class*=\'tile\'], [class*=\'grid-item\']'],
    ['tabs-accordion', '[class*=\'tab\'], [role=\'tabpanel\'], [class*=\'accordion\']'],






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

  container.innerHTML = '<div id="__ohioPanel" style="position:fixed;top:10px;right:10px;z-index:999999;background:#fff;border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,0.3);padding:14px 18px;font:13px/1.5 -apple-system,BlinkMacSystemFont,sans-serif;max-height:80vh;overflow-y:auto;min-width:210px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b style="color:#00694E;font-size:15px">🔍 Framework Inspector</b><span id="__ohioClose" style="cursor:pointer;color:#999;font-size:20px;padding:0 4px">&#10005;</span></div><div style="margin-bottom:8px;font-weight:bold;color:#333">' + tracked.length + ' elements tracked</div><div id="__ohioLegend">' + legendHtml + '</div><div style="margin-top:8px;font-size:11px;color:#999;border-top:1px solid #eee;padding-top:6px">Hover element = event + 📍 location</div></div>';

  document.body.appendChild(container);
  document.getElementById('__ohioClose').onclick = function() { container.style.display = 'none'; };
})();
