/*
 * Universal Click-Tracking Taxonomy Inspector v2
 * Bookmarklet &#8212; Drag this into your bookmarks bar, click on any ohio.edu page
 *
 * What it does:
 *   Injects a floating diagnostics panel on the current page.
 *   Highlights every interactive element and shows which event from the
 *   OHIO.edu Universal Click-Tracking Taxonomy would fire.
 *   Every matched element always includes:
 *     - link_click_url    -> the href (or empty for buttons/forms)
 *     - web_element_location -> where on the page (breadcrumb, main-nav, aux-menu, hero, footer, body)
 *     - click_text        -> the visible text of the element
 *   Also displays the CSS selector for GTM trigger setup.
 *   Exports all data as a CSV grouped by family/trigger.
 *
 * Families & Events:
 *   Conversion:    generate_lead, event_rsvp, file_download
 *   Engagement:    cta_link, global_nav, contact_click, web_element, anchored_spotlight, tab_container, accordion
 *   Discovery:     internal_search, custom_filter_search
 *   Content&Media: news_content, video
 *   Utility&Support: tool_interaction, chat, exit_link, 404
 *
 * Usage:
 *   1. Copy the ENTIRE contents of this file
 *   2. Create a new bookmark
 *   3. Set the URL/Address to:  javascript:(function(){...paste here...})()
 *   4. Click the bookmark on any OHIO page to run
 */

(function() {
  'use strict';

  // ============================================================
  // HELPERS
  // ============================================================

  /** Detect the page region an element belongs to */
  function getLocation(el) {
  var element=el
  var path=window.location.pathname
  var elementUrl=(el.href || el.action || '')
  var label

  if(element.closest('#global-footer'))
  { label = 'footer'
  }
  else if(elementUrl.includes('#tab'))
  { label = 'nav-tab'
  }
  else if(elementUrl.includes('.navigate-ohio-links'))
  { label = 'navigate-ohio-links-mobile'
  }
  else if(elementUrl.includes('button#statement-toggle'))
  { label = 'rfi-privacy-statement'
  }
  else if(elementUrl.includes('.privacy-statement a'))
  { label = 'rfi-privacy-statement'
  }
  else if(element.closest('#left-navigation'))
  { label = 'left-navigation'
  }
  else if(element.closest('.cta-row'))
  { label = 'Become a Bobcat, for life'
  }
  else if(element.closest('.cta-container'))
  { label = 'Become a Bobcat, for life'
  }
  else if(element.closest('#block-ohio-theme-ohiotoday li.logo-list-element a'))
  { label = 'ohio-today-logo'
  }
  else if(element.closest('.lookbook-header'))
  { label = 'lookbook-header'
  }
  else if(element.closest('#main-menu'))
  { label = 'main-menu'
  }
  else if(element.closest('.social-icons a.icons--link'))
  { label = 'social-row'
  }
  else if(element.closest('nav.breadcrumb ol li a'))
  { label = 'breadcrumbs'
  }
  else if (element.closest('#search-desktop, #search-mobile')) {
    label = 'top-green-bar-search';
  }
  else if (element.closest('button#closeSearch')) 
  {  label = 'top-green-bar-search-close';
  }
  else if(element.closest('.top-green-bar'))
  { label = 'top-green-bar'
  }
  else if(element.closest('form.funnelback-block-search-form input.form-radio'))
  { label = 'top-green-bar-search-radio-button'
  }
  else if(element.closest('ul.top-social a *'))
  { label = 'top-green-bar-social-icons'
  }
  else if(element.closest('.aux-menu'))
  { label = 'top-green-bar'
  }
  else if(element.closest('.majors-row'))
  { label = 'majors-row'
  }
  else if(element.closest('.colleges-row'))
  { label = 'colleges-row'
  }
  else if(element.closest('#featured-experience'))
  { label = 'featured-experience'
  }
  else if(element.closest('section.facts-section a.info-link'))
  { label = 'facts-container-info-link'
  }
  else if(element.closest('.facts-container'))
  { label = 'facts-container'
  }
  else if(element.closest('.locations-row'))
  { label = 'locations-row'
  }
  else if(element.closest('.news-row'))
  { label = 'news-row'
  }
  else if(element.closest('.news-intro .news-link a.action'))
  { label = 'news-row'
  }
  else if(element.closest('.events-link a.action'))
  { label = 'events-link'
  }
  else if(element.closest('.event-feed .event-link a'))
  { label = 'events-link'
  }
  else if(element.closest('.social-row'))
  { label = 'social-row'
  }
  else if(element.closest('.section-expander'))
  { label = 'section-expander'
  }
  else if(element.closest('div.gallery-wrapper *'))
  { label = 'image-gallery'
  }
  else if(element.closest('.hero-text'))
  { label = 'hero'
  }
  else if(element.closest('.hero-title'))
  { label = 'hero'
  }
  else if(element.closest('.hero-subtitle'))
  { label = 'hero'
  }
  else if(element.closest('.lsh-hero .lsh-cta a.button'))
  { label = 'hero'
  }
  else if(element.closest('.special-statement'))
  { label = 'special-statement-bar'
  }
  else if(element.closest('.ohio-table-sortable'))
  { label = 'sortable-table'
  }
  else if(element.closest('.promo-box'))
  { label = 'promo-box'
  }
  else if(element.closest('.explore-tabs'))
  { label = 'explore-tabs'
  }
  else if(element.closest('.ohio_image_overlay_body'))
  { label = 'image-overlay'
  }
  else if(element.closest('.topic-preview'))
  { label = 'topic-preview'
  }
  else if(element.closest('.event-feed'))
  { label = 'event-feed'
  }
  else if(element.closest('#ogo-study-away-programs a.card.svelte-1byw2gh'))
  { label = 'ogo-study-away-program-link'
  }
  else if(element.closest('.featured-media--large-image-wrapper'))
  { label = 'featured-media'
  }
  else if(element.closest('#block-ohio-theme-ohiotoday li.menu-item > a'))
  { label = 'main-menu'
  }
  else if(element.closest('.story-listing-item'))
  { label = 'story-listing'
  }
  else if(element.closest('.related-story-link'))
  { label = 'related-story-link'
  }
  else if(element.closest('#experience-details #experience-supplement .field--name-field-industry-focus-tag .field__item a'))
  { label = 'experience-tag'
  }
  else if(element.closest('a[id^="taxonomy-term"]'))
  { label = 'ohio-story-tag'
  }
  else if(element.closest('.quicklinks--wrapper'))
  { label = 'quick-links'
  }
  else if(element.closest('.card-links'))
  { label = 'card-links'
  }
  else if(element.closest('li.pager__item > a'))
  { label = 'pager'
  }
  else if(element.closest('div#related-experiences a'))
  { label = 'experience-card-related'
  }
  else if(element.closest('.view-experience-directory'))
  { label = 'experience-card'
  }
  else if(element.closest('#experience-data'))
  { label = 'experience-details-link'
  }
  else if(element.closest('.social-icons'))
  { label = 'social-icons'
  }
  else if(element.closest('.tile'))
  { label = 'tile'
  }
  else if(element.closest('a.reference'))
  { label = 'ohio-in-the-news'
  }
  else if(element.closest('.program-finder'))
  { label = 'program-finder'
  }
  else if(element.closest('a.explore-tabs--tab.active'))
  { label = 'explore-tabs'
  }
  else if(element.closest('.image-tiles'))
  { label = 'image-tiles'
  }
  else if(element.closest('.image-tiles--item'))
  { label = 'image-tiles'
  }
  else if(element.closest('.icons--link'))
  { label = 'icon'
  }
  else if(element.closest('.topic-preview a.button.green'))
  { label = 'topic-preview'
  }
  else if(element.closest('.tiles--small a.tile'))
  { label = 'tile'
  }
  else if(element.closest('.featured-media a.button.green'))
  { label = 'featured-media'
  }
  else if(element.closest('#funnelback-block-search-form'))
  { label = 'top-green-bar-search'
  }
  else if(element.closest('.anchored-spotlights-container'))
  { label = 'anchored-spotlights'
  }
  else if(element.closest('.collapsible-heading'))
  { label = 'collapsible-headings'
  }
  else if(element.closest('.collapse-h6'))
  { label = 'old-collapse-heading'
  }
  else if(element.closest('.collapse-h5'))
  { label = 'old-collapse-heading'
  }
  else if(element.closest('.collapse-h4'))
  { label = 'old-collapse-heading'
  }
  else if(element.closest('.collapse-h3'))
  { label = 'old-collapse-heading'
  }
  else if(element.closest('.collapse-h2'))
  { label = 'old-collapse-heading'
  }
  else if(element.closest('summary.faq-button section *'))
  { label = 'faq'
  }
  else if(element.closest('summary.faq-button *'))
  { label = 'faq'
  }
  else if(element.closest('.archives-row a'))
  { label = 'OT-archives-row'
  }
  else if(element.closest('ul.top-feature-story'))
  { label = 'OT-top-feature-story'
  }
  else if(element.closest('a.green-scenes-story'))
  { label = 'OT-green-scenes-story'
  }
  else if(element.closest('.ohio-today-footer'))
  { label = 'OT-footer'
  }
  else if(element.closest('ul.feature-stories'))
  { label = 'OT-feature-story'
  }
  else if(element.closest('a.alumni-news-story'))
  { label = 'OT-alumni-news-story'
  }
  else if(element.closest('.subscribe-row a'))
  { label = 'OT-subscribe-row'
  }
  else if(element.closest('.ohio-today-logo'))
  { label = 'OT-Logo'
  }
  else if(element.closest('ul.share-links a'))
  { label = 'News-OT-share-links'
  }
  else if(element.closest('ul.footer-share-links'))
  { label = 'News-OT-share-links-footer'
  }
  else if(element.closest('.tag-link'))
  { label = 'OT-popular-topics'
  }
  else if(element.closest('.search-results__link'))
  { label = 'search.ohio.edu'
  }
  else if(element.closest('.experience-grid'))
  { label = 'experience-grid'
  }
  else if(element.closest('.view-profiles input.form-checkbox'))
  { label = 'directory-search'
  }
  else if(element.closest('.view-profiles #edit-submit-profiles'))
  { label = 'directory-search'
  }
  else if(element.closest('#header-top #logo > a > img'))
  { label = 'global-OHIO-logo'
  }
  else if(element.closest('#calendar-tabs *:not(:empty)'))
  { label = 'calendar-tabs'
  }
  else if(element.closest('.expert-callout a'))
  { label = 'experts-callout'
  }
  else if(element.closest('.personal-links a'))
  { label = 'personal-links'
  }
  else if(element.closest('a.profile-card'))
  { label = 'profile-card'
  }
  else if(element.closest('#header-top button#search-mobile'))
  { label = 'top-green-bar'
  }
  else if(element.closest('.program-link'))
  { label = 'program-link'
  }
  else if(element.closest('section.facts-section'))
  { label = 'facts-section'
  }
  else if(element.closest('.faq-icon'))
  { label = 'faq'
  }
  else if(element.closest('.faq-question'))
  { label = 'faq'
  }
  else if(element.closest('.video-embed-field-provider-youtube iframe'))
  { label = 'video'
  }
  else if(element.closest('button.arrow.next'))
  { label = 'image-slideshow-arrows'
  }
  else if(element.closest('a.fact[class*="background--"].quarter'))
  { label = 'fact-card'
  }
  else if(element.closest('a.fact[class*="background--"].half'))
  { label = 'fact-card'
  }
  else if(element.closest('.fast-facts a'))
  { label = 'fast-facts'
  }
  else if (
    (element.closest && element.closest('form#form_749eb3ef-eb5d-4c02-ad4e-4494209f68d2')) ||
    (element.getAttribute && element.getAttribute('form') === 'form_749eb3ef-eb5d-4c02-ad4e-4494209f68d2') ||
    (element.outerHTML && element.outerHTML.includes('form_749eb3ef-eb5d-4c02-ad4e-4494209f68d2'))
  ) {
    label = 'pop-up';
  }
  else if(element.closest('div.ad-lp-hero-form.request-info-form.slate#rfi'))
  { label = 'slate_rfi'
  }
  else if(element.closest('.pager__item'))
  { label = 'pager'
  }
  else if(element.closest('.top-navigation'))
  { label = 'main-menu-catalogs'
  }
  else if(element.closest('#acalog-navigation'))
  { label = 'left-navigation'
  }
  else if(element.closest('.appsel-option-header'))
  { label = 'UGRD-appsel'
  }
  else if(element.closest('.foodpro-container'))
  { label = 'food-menu'
  }
  else if(element.closest('.hero-video-container'))
  { label = 'hero-video'
  }
  else if(element.closest('div#logoSpaceContent a'))
  { label = 'site-name'
  }
  else if(element.closest('.community-popover-button'))
  { label = 'forever-community'
  }
  else if(element.closest('#community-popover-panel'))
  { label = 'forever-community'
  }
  else if(element.closest('.request-info-form#rfi'))
  { label = 'RFI'
  }
  else if(element.closest('.alert-more-info'))
  { label = 'alert'
  }
  else if(element.closest('.hero-wrapper'))
  { label = 'hero'
  }
  else if(element.closest('#ogo-study-away-programs'))
  { label = 'ogo-study-away-programs'
  }
  else if(element.closest('.programs-row'))
  { label = 'program-link'
  }
  else if(element.closest('div.view.view-programs-non-standard a'))
  { label = 'program-link'
  }
  else if(element.closest('.experiences-row'))
  { label = 'experiences-row'
  }
  else if(element.closest('.all-programs-search-link'))
  { label = 'program-link-view-all'
  }
  else if(element.closest('.graduate-program-finder-links'))
  { label = 'graduate-program-finder-link'
  }
  else if(element.closest('.gifts-row'))
  { label = 'gifts-row'
  }
  else if(element.closest('.visit-app-row'))
  { label = 'visit-application-row'
  }
  else if(element.closest('.affordability-row'))
  { label = 'affordability-row'
  }
  else if(element.closest('.value-row'))
  { label = 'value-row'
  }
  else if(element.closest('.learn-row'))
  { label = 'learn-row'
  }
  else if(element.closest('.pride-row'))
  { label = 'pride-row'
  }
  else if(element.closest('.academics-row'))
  { label = 'academics-row'
  }
  else if(element.closest('.community-row'))
  { label = 'community-row'
  }
  else if(element.closest('section.tabs-container *'))
  { label = 'tabs-container'
  }
  else if(element.closest('#mainContentContainer app-home form'))
  { label = 'compensation-estimator'
  }
  else if(element.closest('#snowstop'))
  { label = 'snow-stop'
  }
  else if(element.closest('#snowstart'))
  { label = 'snow-start'
  }
  else if(element.closest('a.button.green'))
  { label = 'button'
  }
  else if(element.closest('a.button.white'))
  { label = 'button'
  }
  else if(element.closest('a.button.moss'))
  { label = 'button'
  }
  else if (elementUrl === '#' || elementUrl.includes('#') && !elementUrl.includes('some-unique-id')) 
  { label = 'jump-link'
  }
  else{ label = 'body'}
  return label

  }


  /** Generate a CSS selector path for an element */
  function getCSSSelector(el) {
    if (!el || el.nodeType !== 1) return '';
    if (el.id) return '#' + CSS.escape(el.id);
    var path = [];
    var current = el;
    while (current && current.nodeType === 1 && current.tagName.toLowerCase() !== 'html') {
      var tag = current.tagName.toLowerCase();
      var sel = tag;

      if (current.id) {
        sel = '#' + CSS.escape(current.id);
        path.unshift(sel);
        break;
      }

      // Add meaningful classes (skip Drupal noise: js-, clearfix, etc.)
      var classes = [];
      if (typeof current.className === 'string') {
        classes = current.className.trim().split(/\s+/).filter(function(c) {
          return c.length > 0 && c.indexOf('js-') !== 0 && c !== 'clearfix' && c !== 'visually-hidden' && c !== 'sr-only' && c !== 'd-none' && c !== 'hidden';
        });
        // Use at most 2 most specific classes
        if (classes.length > 0) {
          sel += '.' + classes.slice(0, 2).map(function(c) { return CSS.escape(c); }).join('.');
        }
      }

      // Add nth-child if there are siblings with same tag
      var parent = current.parentElement;
      if (parent) {
        var sameTagSiblings = Array.prototype.filter.call(parent.children, function(s) {
          return s.tagName === current.tagName;
        });
        if (sameTagSiblings.length > 1) {
          var index = Array.prototype.indexOf.call(parent.children, current) + 1;
          sel += ':nth-child(' + index + ')';
        }
      }

      path.unshift(sel);
      current = current.parentElement;
    }
    return path.join(' > ');
  }

  /** Get clean link_click_url from an element */
  function getLinkUrl(el) {
    if (el.tagName === 'A') return el.href || '';
    if (el.tagName === 'FORM') return el.action || '';
    if (el.form) return el.form.action || '';
    return '';
  }

  /** Get clickable text from an element */
  function getClickText(el) {
    return (el.textContent || el.innerText || '').trim().replace(/\s+/g, ' ').substring(0, 150);
  }

  /** Detect the OHIO web element type from an element's ancestor tree */
  function getWebElementName(el) {
    var p = el;
    while (p && p.nodeType === 1 && p.tagName.toLowerCase() !== 'html') {
      var cls = (p.className || '').toLowerCase();
      var id = p.id || '';

      // Drupal paragraph types
      if (cls.indexOf('paragraph--type--collapsible-headings') !== -1) return 'collapsible-headings';
      if (cls.indexOf('paragraph--type--fact-cards') !== -1) return 'fact-card';
      if (cls.indexOf('paragraph--type--faq') !== -1) return 'faq';
      if (cls.indexOf('paragraph--type--card-links') !== -1) return 'card-link';
      if (cls.indexOf('paragraph--type--image-tiles') !== -1) return 'image-tile';
      if (cls.indexOf('paragraph--type--tab-container') !== -1) return 'tab-container';
      if (cls.indexOf('paragraph--type--anchored-spotlights') !== -1) return 'anchored-spotlight';
      if (cls.indexOf('paragraph--type--hero-images') !== -1) return 'hero-image';
      if (cls.indexOf('paragraph--type--image-gallery') !== -1) return 'image-gallery';
      if (cls.indexOf('paragraph--type--icon-tiles') !== -1) return 'icon-tile';
      if (cls.indexOf('paragraph--type--icon-groups') !== -1) return 'icon-group';
      if (cls.indexOf('paragraph--type--promo-boxes') !== -1) return 'promo-box';
      if (cls.indexOf('paragraph--type--topic-preview') !== -1) return 'topic-preview';
      if (cls.indexOf('paragraph--type--fast-facts') !== -1) return 'fast-fact';
      if (cls.indexOf('paragraph--type--timeline') !== -1) return 'timeline';
      if (cls.indexOf('paragraph--type--video-gallery') !== -1) return 'video-gallery';
      if (cls.indexOf('paragraph--type--contact-us') !== -1) return 'contact-us';
      if (cls.indexOf('paragraph--type--featured-media') !== -1) return 'featured-media';
      if (cls.indexOf('paragraph--type--explore-tabs') !== -1) return 'explore-tab';
      if (cls.indexOf('paragraph--type--large-quick-links') !== -1) return 'large-quick-link';
      if (cls.indexOf('paragraph--type--quick-links') !== -1) return 'quick-link';
      if (cls.indexOf('paragraph--type--jump-links') !== -1) return 'jump-link';
      if (cls.indexOf('paragraph--type--image-slideshow') !== -1) return 'image-slideshow';
      if (cls.indexOf('paragraph--type--social-media-icons') !== -1) return 'social-media-icon';
      if (cls.indexOf('paragraph--type--image-with-text-overlay') !== -1) return 'image-text-overlay';
      if (cls.indexOf('paragraph--type--calendar-of-events') !== -1) return 'calendar-event';
      if (cls.indexOf('paragraph--type--news') !== -1) return 'news';

      // Common section classes used by OHIO theme
      if (cls.indexOf('facts-section') !== -1 || cls.indexOf('facts-row') !== -1) return 'fact-card';
      if (cls.indexOf('news-row') !== -1 || cls.indexOf('news-intro') !== -1) return 'news';
      if (cls.indexOf('programs-row') !== -1 || cls.indexOf('program-finder') !== -1) return 'program-finder';
      if (cls.indexOf('experiences-row') !== -1) return 'featured-media';
      if (cls.indexOf('hero') !== -1 && cls.indexOf('mod-page-container') !== -1) return 'hero-image';
      if (cls.indexOf('more-news-item') !== -1) return 'news';
      if (cls.indexOf('cta-container') !== -1 || cls.indexOf('cta-links') !== -1) return 'cta-button';

      p = p.parentElement;
    }
    return '';
  }

  // ============================================================
  // TAXONOMY RULES
  // ============================================================
  var TAXONOMY = {
    ohio_domain: 'ohio.edu',

    rules: [
      // ---- CONVERSION: generate_lead ----
      {
        event: 'generate_lead',
        family: 'Conversion',
        match: function(el) {
          if (el.tagName === 'FORM') return true;
          if (el.matches('.form_button_submit, .slate_form, [data-form-type="inquiry"], [data-form-type="lead"]')) return true;
          if (el.closest('form') && (el.type === 'submit' || el.matches('button[type="submit"], input[type="submit"]'))) return true;
          return false;
        },
        params: function(el) {
          var form = el.tagName === 'FORM' ? el : el.closest('form');
          return {
            link_click_url: getLinkUrl(el),
            web_element_location: getLocation(el),
            click_text: getClickText(el),
            form_name: form ? (form.name || form.id || form.getAttribute('aria-label') || 'unknown') : 'unknown',
            vendor: form && form.id && form.id.indexOf('funnelback') !== -1 ? 'Funnelback' : 'Slate_internal'
          };
        }
      },

      // ---- CONVERSION: event_rsvp ----
      {
        event: 'event_rsvp',
        family: 'Conversion',
        match: function(el) {
          if (el.tagName !== 'A') return false;
          var t = (el.textContent || el.innerText || '').trim().toLowerCase();
          return /rsvp|register|confirm.*attend|add.*calendar|yes.*attend/.test(t);
        },
        params: function(el) {
          return {
            link_click_url: el.href || '',
            web_element_location: getLocation(el),
            click_text: getClickText(el)
          };
        }
      },

      // ---- CONVERSION: file_download ----
      {
        event: 'file_download',
        family: 'Conversion',
        match: function(el) {
          if (el.tagName !== 'A') return false;
          var href = el.href || '';
          if (el.hasAttribute('download')) return true;
          if (/\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z)$/i.test(href)) return true;
          return false;
        },
        params: function(el) {
          var href = el.href || '';
          return {
            link_click_url: href,
            web_element_location: getLocation(el),
            click_text: getClickText(el),
            file_name: href.split('/').pop() || 'unknown',
            file_extension: (href.match(/\.(\w+)$/) || [])[1] || ''
          };
        }
      },

      // ---- ENGAGEMENT: cta_link ----
      // Catches styled links, "Learn More", card links, arrows, action links
      {
        event: 'cta_link',
        family: 'Engagement',
        match: function(el) {
          if (el.tagName !== 'A' || !el.href) return false;
          var t = (el.textContent || el.innerText || '').trim().toLowerCase();
          var cls = (el.className || '').toLowerCase();
          var parent = el.parentElement;
          var parentCls = parent ? (parent.className || '').toLowerCase() : '';

          // Button-styled links
          if (cls.indexOf('button') !== -1 || cls.indexOf('btn') !== -1) return true;
          if (parentCls.indexOf('button') !== -1 || parentCls.indexOf('btn') !== -1) return true;

          // "Learn More", "Read More", "View All", "Apply Now", "Plan a Visit"
          if (/^(learn more|read more|view all|apply now|plan a visit|schedule|explore|browse|all programs|view more)/.test(t)) return true;

          // Card link content areas
          if (el.matches('.card-link-content a, .field--name-field-call-to-action a, [class*="card"] a, .fact-content a')) return true;
          if (parentCls.indexOf('card') !== -1 || parentCls.indexOf('cta') !== -1 || parentCls.indexOf('cta-links') !== -1) return true;

          // Actions &#8212; links with ➜, ,  arrows
          if (/[\u279c\uf105\uf061]/.test(el.textContent || '')) return true;

          // Links inside info overlays/popovers
          if (parentCls.indexOf('info-link') !== -1 || cls.indexOf('info-link') !== -1) return true;

          // Action links
          if (cls.indexOf('action') !== -1 || parentCls.indexOf('action') !== -1) return true;

          // News "link to story" (usually hidden, skip)
          if (t === 'link to story') return false;

          // Any link with an arrow character or chevron
          if (el.querySelector('.fa-chevron-right, .fa-arrow-right, [class*="chevron"]')) return true;

          // Text links in body content (not nav)
          if (el.closest('.field--name-body, .text-formatted, .field--name-field-content-blurb-body') && t.length >= 3) return true;

          return false;
        },
        params: function(el) {
          return {
            link_click_url: el.href || '',
            web_element_location: getLocation(el),
            click_text: getClickText(el)
          };
        }
      },

      // ---- ENGAGEMENT: global_nav ----
      // Navigation links in main-menu, aux-menu, breadcrumb, footer
      {
        event: 'global_nav',
        family: 'Engagement',
        match: function(el) {
          if (el.tagName !== 'A') return false;
          // Determine location &#8212; global_nav fires for nav-type elements
          var loc = getLocation(el);
          if (loc === 'main-nav' || loc === 'aux-menu' || loc === 'breadcrumb' || loc === 'footer') return true;
          // Links inside aria-navigation
          if (el.closest('[role="navigation"], nav')) return true;
          return false;
        },
        params: function(el) {
          return {
            link_click_url: el.href || '',
            web_element_location: getLocation(el),
            click_text: getClickText(el)
          };
        }
      },

      // ---- ENGAGEMENT: contact_click ----
      {
        event: 'contact_click',
        family: 'Engagement',
        match: function(el) {
          if (el.tagName !== 'A') return false;
          var href = el.href || '';
          if (/^tel:/.test(href)) return true;
          if (/^mailto:/.test(href)) return true;
          if (/\d{3}[\.-]\d{3}[\.-]\d{4}/.test(el.textContent || '')) return true;
          if (/@/.test(el.textContent || '') && /\.(edu|com|org)/.test(el.textContent || '')) return true;
          return false;
        },
        params: function(el) {
          var href = el.href || '';
          return {
            link_click_url: href,
            web_element_location: getLocation(el),
            click_text: getClickText(el),
            contact_type: href.indexOf('tel:') === 0 ? 'phone' : (href.indexOf('mailto:') === 0 ? 'email' : 'address')
          };
        }
      },

      // ---- ENGAGEMENT: web_element ----
      // Interactive UI components: accordions, tabs, carousels, expand/collapse, info popovers
      {
        event: 'web_element',
        family: 'Engagement',
        match: function(el) {
          if (el.tagName !== 'BUTTON' && el.tagName !== 'A') return false;
          var t = (el.textContent || el.innerText || '').trim().toLowerCase();
          var ariaExpanded = el.getAttribute('aria-expanded');
          var cls = (el.className || '').toLowerCase();

          // Expand/collapse buttons (accordion, FAQ, info popover)
          if (ariaExpanded !== null) return true;
          if (/expand|collapse|accordion|toggle|show more|show less/i.test(t)) return true;

          // Tab buttons
          if (el.matches('[role="tab"], [data-toggle="tab"], [class*="tab"]') && el.tagName === 'BUTTON') return true;

          // Carousel/directional
          if (/previous|next|slide/i.test(t)) return true;

          // Info indicators (i buttons on fact cards)
          if (cls.indexOf('info-indicator') !== -1) return true;

          // Close/search buttons within modals/overlays
          if (p && (p.className || '').indexOf('video-modal') !== -1) return true;

          // Accordion headings (disclosure triangles)
          if (el.closest('[role="region"]') && ariaExpanded !== null) return true;

          return false;
        },
        params: function(el) {
          return {
            link_click_url: getLinkUrl(el),
            web_element_location: getLocation(el),
            click_text: getClickText(el),
            web_element_name: getWebElementName(el) || el.className.split(/\s+/)[0] || el.tagName.toLowerCase()
          };
        }
      },

      // ---- DISCOVERY: internal_search ----
      {
        event: 'internal_search',
        family: 'Discovery',
        match: function(el) {
          if (el.tagName === 'FORM' && (el.action || '').indexOf('search') !== -1) return true;
          if (el.type === 'submit' && el.closest('form') && ((el.closest('form').action || '').indexOf('search') !== -1)) return true;
          if (el.matches('[class*="search"] button, [class*="search"] input[type="submit"], [aria-label*="search"] button')) return true;
          if (el.closest('.block-funnelback-search-block')) return true;
          return false;
        },
        params: function(el) {
          var form = el.closest('form');
          var query = '';
          if (form) {
            var input = form.querySelector('input[type="search"], input[name*="query"], input[name="search"]');
            if (input) query = input.value || '';
          }
          return {
            link_click_url: getLinkUrl(el),
            web_element_location: getLocation(el),
            click_text: getClickText(el),
            search_query: query
          };
        }
      },

      // ---- DISCOVERY: custom_filter_search ----
      {
        event: 'custom_filter_search',
        family: 'Discovery',
        match: function(el) {
          if (el.matches('[data-module*="filter"], [data-module*="finder"], [class*="filter"], [class*="finder"], .program-finder')) return true;
          if (el.closest('[data-module*="filter"], [data-module*="finder"], .program-finder')) return true;
          return false;
        },
        params: function(el) {
          return {
            link_click_url: getLinkUrl(el),
            web_element_location: getLocation(el),
            click_text: getClickText(el),
            filter_type: el.closest('.program-finder') ? 'program-finder' : (el.closest('[class*="filter"]') ? 'content-filter' : 'custom')
          };
        }
      },

      // ---- CONTENT & MEDIA: news_content ----
      {
        event: 'news_content',
        family: 'Content & Media',
        match: function(el) {
          if (el.tagName !== 'A') return false;
          if (el.closest('.news-listing, .view-news, .featured-stories, .ohio-today-card, [class*="news"], [class*="story"], article, [class*="blog"]')) return true;
          if (el.closest('.more-news-item') || el.closest('.news-featured-story')) return true;
          var t = (el.textContent || '').trim().toLowerCase();
          if (/view all stories|more news|view more news|more stories/i.test(t)) return true;
          return false;
        },
        params: function(el) {
          return {
            link_click_url: el.href || '',
            web_element_location: getLocation(el),
            click_text: getClickText(el)
          };
        }
      },

      // ---- CONTENT & MEDIA: content_element (broad pattern) ----
      {
        event: 'content_element',
        family: 'Content & Media',
        match: function(el) {
          var cls = (el.className || '').toLowerCase();
          var id = (el.id || '').toLowerCase();
          var tag = el.tagName.toLowerCase();
          if (tag === 'article') return true;
          if (/content.hub/.test(cls) || /content.hub/.test(id)) return true;
          if (/article/.test(cls) || /article/.test(id)) return true;
          if (/news/.test(cls) || /news/.test(id)) return true;
          return false;
        },
        params: function(el) {
          return {
            link_click_url: getLinkUrl(el),
            web_element_location: getLocation(el),
            click_text: getClickText(el)
          };
        }
      },

      // ---- CONTENT & MEDIA: video ----
      {
        event: 'video',
        family: 'Content & Media',
        match: function(el) {
          if (el.tagName === 'IFRAME' && /youtube|youtu\.be|vimeo/.test(el.src || '')) return true;
          if (el.closest('[class*="video"], .hero-video-container')) return true;
          if (/play video|watch video|pause/i.test(el.textContent || '')) return true;
          if (el.closest('.video-modal') || el.id === 'play-pause-button') return true;
          return false;
        },
        params: function(el) {
          return {
            link_click_url: getLinkUrl(el),
            web_element_location: getLocation(el),
            click_text: getClickText(el),
            video_action: (el.textContent || '').toLowerCase().indexOf('pause') !== -1 ? 'pause' : 'play'
          };
        }
      },

      // ---- UTILITY & SUPPORT: tool_interaction ----
      {
        event: 'tool_interaction',
        family: 'Utility & Support',
        match: function(el) {
          if (el.matches('[data-tool], [class*="calculator"], [class*="tool"], .interactive-tool')) return true;
          if (el.closest('[data-tool], [class*="calculator"], .interactive-tool')) return true;
          return false;
        },
        params: function(el) {
          return {
            link_click_url: getLinkUrl(el),
            web_element_location: getLocation(el),
            click_text: getClickText(el)
          };
        }
      },

      // ---- UTILITY & SUPPORT: chat ----
      {
        event: 'chat',
        family: 'Utility & Support',
        match: function(el) {
          if (el.matches('[class*="chat"], [aria-label*="chat"], [data-chat], #chat, [id*="chat"]')) return true;
          if (el.closest('[class*="chat"], [id*="chat"]')) return true;
          if (/open chat|chat/i.test(el.textContent || '') && el.tagName === 'BUTTON') return true;
          return false;
        },
        params: function(el) {
          return {
            link_click_url: getLinkUrl(el),
            web_element_location: getLocation(el),
            click_text: getClickText(el)
          };
        }
      },

      // ---- UTILITY & SUPPORT: exit_link ----
      {
        event: 'exit_link',
        family: 'Utility & Support',
        match: function(el) {
          if (el.tagName !== 'A' || !el.href) return false;
          try {
            var hostname = new URL(el.href).hostname;
            if (hostname === window.location.hostname) return false;
            if (hostname.indexOf('search.ohio.edu') !== -1) return false;
            return true;
          } catch (e) { return false; }
        },
        params: function(el) {
          return {
            link_click_url: el.href || '',
            web_element_location: getLocation(el),
            click_text: getClickText(el)
          };
        }
      },

      // ---- UTILITY & SUPPORT: 404 ----
      {
        event: '404',
        family: 'Utility & Support',
        match: function() { return false; }, // fired on page load
        params: function() {
          return {
            link_click_url: '',
            web_element_location: 'body',
            click_text: document.title,
            page_url: window.location.pathname
          };
        }
      }
    ]
  };

  // ---- CATCH-ALL &#8212; Every other link or interactive element ----
  // This ensures 100% coverage. Runs last in priority order.
  function catchAll(el) {
    // Assign to the most appropriate event
    if (el.tagName === 'A' && el.href) {
      var t = getClickText(el).toLowerCase();
      // Text links in body content
      if (t.length > 0 && !el.closest('nav, footer, header, [role="navigation"]')) {
        return {
          event: 'cta_link',
          family: 'Engagement',
          params: {
            link_click_url: el.href || '',
            web_element_location: getLocation(el),
            click_text: getClickText(el)
          }
        };
      }
      // Any other link
      return {
        event: 'cta_link',
        family: 'Engagement',
        params: {
          link_click_url: el.href || '',
          web_element_location: getLocation(el),
          click_text: getClickText(el)
        }
      };
    }
    if (el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.hasAttribute('onclick') || el.getAttribute('role') === 'button' || el.getAttribute('tabindex')) {
      return {
        event: 'web_element',
        family: 'Engagement',
        params: {
          link_click_url: getLinkUrl(el),
          web_element_location: getLocation(el),
          click_text: getClickText(el),
          web_element_name: getWebElementName(el) || el.className.split(/\s+/)[0] || el.tagName.toLowerCase()
        }
      };
    }
    return null;
  }

  // ============================================================
  // MATCHING ENGINE
  // ============================================================
  function matchElement(el) {
    // Try taxonomy rules first (ordered by priority)
    for (var i = 0; i < TAXONOMY.rules.length; i++) {
      var rule = TAXONOMY.rules[i];
      try {
        if (rule.match(el)) {
          return { event: rule.event, family: rule.family, params: rule.params(el) };
        }
      } catch (e) { continue; }
    }
    // Fall through to catch-all
    return catchAll(el);
  }

  function classifyPage() {
    var title = document.title.toLowerCase();
    if (title.indexOf('page not found') !== -1 || title.indexOf('404') !== -1) {
      return { event: '404', family: 'Utility & Support', params: { link_click_url: '', web_element_location: 'body', click_text: document.title, page_url: window.location.pathname } };
    }
    return null;
  }

  // Infer element type from class names and tag
  function inferElementType(el) {
    var tag = (el.tagName || '').toLowerCase();
    var cls = (el.className || '').toLowerCase();
    var id = (el.id || '').toLowerCase();

    if (tag === 'button') return 'button';
    if (tag === 'img') return 'image';
    if (tag === 'form') return 'form';
    if (tag === 'nav' || /nav|menu/.test(cls)) return 'navigation';
    if (tag === 'select' || /dropdown|select/.test(cls)) return 'dropdown';
    if (tag === 'a' && /btn|button/.test(cls)) return 'button';

    if (/tile/.test(cls)) return 'tile';
    if (/card/.test(cls)) return 'card';
    if (/accordion|accordian/.test(cls)) return 'accordion';
    if (/tab/.test(cls) && !/table/.test(cls)) return 'tab';
    if (/modal|popup|dialog|overlay/.test(cls)) return 'modal';
    if (/banner|hero/.test(cls)) return 'banner';
    if (/carousel|slider/.test(cls)) return 'carousel';
    if (/search/.test(cls)) return 'search';
    if (/icon/.test(cls)) return 'icon';
    if (/badge/.test(cls)) return 'badge';
    if (/pagination/.test(cls)) return 'pagination';
    if (/breadcrumb/.test(cls)) return 'breadcrumb';
    if (/sidebar/.test(cls)) return 'sidebar';
    if (/social|share/.test(cls)) return 'social';
    if (/video/.test(cls)) return 'video';
    if (/footer/.test(cls)) return 'footer';
    if (/header/.test(cls)) return 'header';
    if (/list/.test(cls)) return 'list';
    if (/tooltip/.test(cls)) return 'tooltip';
    if (/progress/.test(cls)) return 'progress';
    if (/table/.test(cls)) return 'table';
    if (/map/.test(cls)) return 'map';
    if (/audio/.test(cls)) return 'audio';
    if (/pagination/.test(cls)) return 'pagination';
    if (/form/.test(cls)) return 'form';

    return '';
  }

  // Build params from the DOM even when no taxonomy rule matched
  function buildGenericParams(el) {
    return {
      link_click_url: getLinkUrl(el),
      web_element_location: getLocation(el),
      click_text: getClickText(el),
      page_url: window.location.href,
      tag: (el.tagName || '').toLowerCase(),
      element_id: el.id || '',
      element_class: el.className || '',
      inferred_type: inferElementType(el)
    };
  }

  // ============================================================
  // FRAMEWORK &#8212; selected elements for export / Airtable sync
  // ============================================================
  var frameworkItems = [];
  var frameworkViewActive = false;

  function csvEscape(v) {
    var s = String(v || '');
    if (s.indexOf(',') !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function tsvEscape(v) {
    var s = String(v || '');
    if (s.indexOf('\t') !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function htmlEscape(v) {
    return String(v || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function buildTableHTML(header, items) {
    var h = '<table>';
    h += '<thead><tr>';
    for (var i = 0; i < header.length; i++) { h += '<th>' + htmlEscape(header[i]) + '</th>'; }
    h += '</tr></thead><tbody>';
    for (var r = 0; r < items.length; r++) {
      var item = items[r];
      var row = [
        item.family, item.event, item.cssSel,
        item.params.link_click_url || '',
        item.params.web_element_location || '',
        item.params.click_text || '',
        item.url || '',
        item.params.tag || '',
        item.params.element_id || '',
        item.params.element_class || '',
        item.params.inferred_type || ''
      ];
      h += '<tr>';
      for (var c = 0; c < row.length; c++) { h += '<td>' + htmlEscape(String(row[c])) + '</td>'; }
      h += '</tr>';
    }
    h += '</tbody></table>';
    return h;
  }

  function showCSVDialog(csv, tsv, tableHTML, items, filename) {
    var existing = document.getElementById('hermes-csv-modal');
    if (existing) existing.remove();
    var m = document.createElement('div');
    m.id = 'hermes-csv-modal';
    m.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.65);z-index:999999;display:flex;align-items:center;justify-content:center;';
    var box = document.createElement('div');
    box.style.cssText = 'background:#1a1b26;color:#c0caf5;border:1px solid #3b4261;border-radius:10px;padding:16px;max-width:850px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column;font-family:sans-serif;font-size:13px;box-shadow:0 8px 30px rgba(0,0,0,0.6);';
    box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><strong style="font-size:14px;">' + filename + '</strong><span id="hermes-csv-close" style="cursor:pointer;color:#565f89;font-size:20px;line-height:18px;">&#215;</span></div><textarea readonly id="hermes-csv-textarea" style="flex:1;background:#24283b;color:#c0caf5;border:1px solid #3b4261;border-radius:4px;padding:8px;font-family:monospace;font-size:11px;width:800px;min-height:300px;resize:both;">' + csv.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</textarea><div style="margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;"><button id="hermes-csv-copy3" style="background:#7dcfff;border:none;color:#1a1b26;border-radius:5px;padding:7px 16px;cursor:pointer;font-size:13px;">Copy to Excel</button><button id="hermes-csv-dl3" style="background:#73daca;border:none;color:#1a1b26;border-radius:5px;padding:7px 16px;cursor:pointer;font-size:13px;">Download .csv</button><span id="hermes-csv-status" style="color:#a9b1d6;font-size:12px;margin-left:4px;">Select text or use buttons above.</span></div>';
    m.appendChild(box);
    document.body.appendChild(m);
    csvModal = m;
    m.onclick = function(e) { if (e.target === m) { m.remove(); csvModal = null; } };
    setTimeout(function() {
      document.getElementById('hermes-csv-close').onclick = function(){ m.remove(); csvModal = null; };
      document.getElementById('hermes-csv-textarea').onfocus = function(){ this.select(); };
      document.getElementById('hermes-csv-copy3').onclick = function() {
        var status = document.getElementById('hermes-csv-status');
        status.textContent = 'Copying...';
        try {
          if (navigator.clipboard.write && window.ClipboardItem) {
            navigator.clipboard.write([
              new ClipboardItem({
                'text/html': new Blob([tableHTML], {type: 'text/html'}),
                'text/plain': new Blob([tsv], {type: 'text/plain'})
              })
            ]).then(function() {
              status.textContent = 'Copied! Paste into Excel (columns preserved).';
            }).catch(function(e) {
              try {
                navigator.clipboard.writeText(tsv);
                status.textContent = 'Copied (plain text). Excel: paste & use Data > Text to Columns.';
              } catch(e2) {
                status.textContent = 'Copy blocked. Select text above and press Cmd/Ctrl+C.';
              }
            });
          } else {
            navigator.clipboard.writeText(tsv);
            status.textContent = 'Copied (plain text). Excel: paste & use Data > Text to Columns.';
          }
        } catch(e) {
          status.textContent = 'Copy failed. Select text above and press Cmd/Ctrl+C.';
        }
      };
      document.getElementById('hermes-csv-dl3').onclick = function() {
        var status = document.getElementById('hermes-csv-status');
        status.textContent = 'Preparing download...';
        var csvContent = '\uFEFF' + csv;
        if (window.showSaveFilePicker) {
          window.showSaveFilePicker({
            suggestedName: filename,
            types: [{description: 'CSV File', accept: {'text/csv': ['.csv']}}]
          }).then(function(handle) {
            return handle.createWritable().then(function(writable) {
              return writable.write(csvContent).then(function() { return writable.close(); });
            });
          }).then(function() {
            status.textContent = 'File saved! Open it in Excel.';
          }).catch(function(e) {
            if (e.name === 'AbortError') {
              status.textContent = 'Save cancelled. Try Download or copy from textarea.';
            } else {
              status.textContent = 'Save dialog failed. Trying alternative...';
              doBlobDownload();
            }
          });
          return;
        }
        doBlobDownload();
        function doBlobDownload() {
          try {
            var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              status.textContent = 'Download triggered. Check Downloads folder, open in Excel.';
              var ta = document.getElementById('hermes-csv-textarea');
              if (ta) { ta.focus(); ta.select(); }
            }, 300);
          } catch(e) {
            status.textContent = 'Download blocked. Select text above, copy, paste into editor, save as .csv, open in Excel.';
            var ta = document.getElementById('hermes-csv-textarea');
            if (ta) { ta.focus(); ta.select(); }
          }
        }
      };
    }, 50);
  }

  function downloadCSV() {
    var items = frameworkItems.length > 0 ? frameworkItems : scanAllElements();
    if (items.length === 0) {
      alert('No elements to export. Hover and click to build your framework, or close the panel to scan all page elements.');
      return;
    }
    var header = ['Family','Event','CSS Selector','link_click_url','web_element_location','click_text','Page URL','tag','element_id','element_class','inferred_type'];
    var csvRows = [];
    csvRows.push(header.join(','));
    var tsvRows = [];
    tsvRows.push(header.join('\t'));
    var tableHTML = buildTableHTML(header, items);
    items.forEach(function(item) {
      var row = [
        item.family, item.event, item.cssSel,
        item.params.link_click_url || '',
        item.params.web_element_location || '',
        item.params.click_text || '',
        item.url || '',
        item.params.tag || '',
        item.params.element_id || '',
        item.params.element_class || '',
        item.params.inferred_type || ''
      ];
      csvRows.push(row.map(csvEscape).join(','));
      tsvRows.push(row.map(tsvEscape).join('\t'));
    });
    var csv = csvRows.join('\n');
    var tsv = tsvRows.join('\n');
    var filename = 'tracking-framework-' + window.location.hostname + '-' + Date.now() + '.csv';
    showCSVDialog(csv, tsv, tableHTML, items, filename);
  }

  function scanAllElements() {
    var items = [];
    var elements = document.querySelectorAll('a[href], button, input[type="submit"], input[type="button"], form, [onclick], [role="button"], [tabindex]:not([tabindex="-1"]):not([tabindex="-2"])');
    var seen = {};
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (panel && panel.contains(el)) continue;
      var key = el.tagName + '|' + (el.href || '') + '|' + getClickText(el);
      if (seen[key]) continue;
      seen[key] = true;
      var match = matchElement(el);
      if (match) {
        items.push({
          family: match.family,
          event: match.event,
          cssSel: getCSSSelector(el),
          params: match.params,
          url: window.location.href
        });
      }
    }
    return items;
  }

  function addToFramework(match, el) {
    var cssSel = getCSSSelector(el);
    for (var i = 0; i < frameworkItems.length; i++) {
      if (frameworkItems[i].cssSel === cssSel) return false;
    }
    frameworkItems.push({
      family: match.family,
      event: match.event,
      cssSel: cssSel,
      params: match.params,
      url: window.location.href,
      timestamp: Date.now()
    });
    updateFrameworkCount();
    return true;
  }

  function removeFromFramework(cssSel) {
    frameworkItems = frameworkItems.filter(function(item) {
      return item.cssSel !== cssSel;
    });
    updateFrameworkCount();
  }

  function updateFrameworkCount() {
    var btn = document.getElementById('hermes-framework-btn');
    if (btn) {
      btn.textContent = frameworkItems.length > 0
        ? 'Framework (' + frameworkItems.length + ')'
        : 'Framework';
    }
  }

  function showFrameworkPanel() {
    frameworkViewActive = !frameworkViewActive;
    if (frameworkViewActive) {
      renderFrameworkView();
    } else {
      // Return to hover view &#8212; re-show current match if there is one
      if (inspectedEl && currentMatch) {
        showDetail(currentMatch, inspectedEl);
      } else {
        var detail = document.getElementById('hermes-detail');
        if (detail) detail.innerHTML = '<div style="color:#565f89;font-size:11px;">Hover over an element on the page.</div>';
      }
    }
  }

  function renderFrameworkView() {
    var detail = document.getElementById('hermes-detail');
    if (!detail) return;

    if (frameworkItems.length === 0) {
      detail.innerHTML = '<div style="color:#565f89;font-size:11px;">No elements added yet. Hover an element, then click to add it to your framework.</div>';
      return;
    }

    var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
    html += '<span style="color:#a9b1d6;font-size:12px;font-weight:600;">Framework (' + frameworkItems.length + ')</span>';
    html += '<div style="display:flex;gap:3px;">';
    html += '<button id="hermes-csv-btn" style="background:#292e42;border:none;color:#9ece6a;border-radius:5px;padding:3px 8px;cursor:pointer;font-size:11px;">CSV</button>';
    html += '<button id="hermes-sync-btn" style="background:#292e42;border:none;color:#73daca;border-radius:5px;padding:3px 8px;cursor:pointer;font-size:11px;">Sync to Airtable</button>';
    html += '<button id="hermes-at-config-btn" style="background:#292e42;border:none;color:#565f89;border-radius:5px;padding:3px 8px;cursor:pointer;font-size:11px;line-height:1;" title="Airtable Settings">Setup</button>';
    html += '</div></div>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:11px;">';
    html += '<tr style="color:#565f89;border-bottom:1px solid #2a2b3e;">';
    html += '<th style="text-align:left;padding:3px 4px;font-weight:500;">Event</th>';
    html += '<th style="text-align:left;padding:3px 4px;font-weight:500;">Family</th>';
    html += '<th style="text-align:left;padding:3px 4px;font-weight:500;">CSS</th>';
    html += '<th style="text-align:left;padding:3px 4px;font-weight:500;">Location</th>';
    html += '<th style="width:20px;"></th>';
    html += '</tr>';
    frameworkItems.forEach(function(item) {
      var fc = item.family ? familyColor(item.family) : '#6c7086';
      var cssShort = item.cssSel.length > 30 ? item.cssSel.substring(0, 30) + '...' : item.cssSel;
      var evt = item.event || '';
      var fam = item.family || 'Uncategorized';
      var loc = (item.params && item.params.web_element_location) || (item.params && item.params.element_class) || (item.params && item.params.tag) || '&#8212;';
      html += '<tr style="border-bottom:1px solid #1f2035;">';
      html += '<td style="padding:3px 4px;color:' + (evt ? '#c0caf5' : '#6c7086') + ';">' + (evt || '&#8212;') + '</td>';
      html += '<td style="padding:3px 4px;color:' + fc + ';">' + fam + '</td>';
      html += '<td style="padding:3px 4px;color:#565f89;font-family:monospace;font-size:10px;word-break:break-all;">' + cssShort + '</td>';
      html += '<td style="padding:3px 4px;color:#565f89;">' + loc + '</td>';
      html += '<td style="padding:3px 4px;"><button class="hermes-remove-btn" data-css="' + item.cssSel.replace(/"/g,'&quot;') + '" style="background:none;border:none;color:#f7768e;cursor:pointer;font-size:13px;padding:0;line-height:1;">&times;</button></td>';
      html += '</tr>';
    });
    html += '</table>';

    if (frameworkItems.length > 0) {
      html += '<div style="margin-top:6px;padding:4px 6px;background:#1f2035;border-radius:4px;font-size:10px;color:#565f89;">';
      html += 'Import this CSV into Google Sheets, or sync directly to Airtable.';
      html += '</div>';
    }

    detail.innerHTML = html;

    document.getElementById('hermes-csv-btn').onclick = downloadCSV;
    document.getElementById('hermes-sync-btn').onclick = syncToAirtable;
    var configBtn = document.getElementById('hermes-at-config-btn');
    if (configBtn) configBtn.onclick = showAirtableSetup;
    var removeBtns = detail.querySelectorAll('.hermes-remove-btn');
    for (var i = 0; i < removeBtns.length; i++) {
      (function(btn) {
        btn.onclick = function() {
          removeFromFramework(btn.getAttribute('data-css'));
          renderFrameworkView();
        };
      })(removeBtns[i]);
    }
  }

  function getAirtableConfig() {
    return {
      apiKey: localStorage.getItem('hermes_airtable_key') || '',
      baseId: localStorage.getItem('hermes_airtable_base') || '',
      tableName: localStorage.getItem('hermes_airtable_table') || ''
    };
  }

  function setAirtableConfig(apiKey, baseId, tableName) {
    if (apiKey) localStorage.setItem('hermes_airtable_key', apiKey);
    if (baseId) localStorage.setItem('hermes_airtable_base', baseId);
    if (tableName) localStorage.setItem('hermes_airtable_table', tableName);
  }

  function syncToAirtable() {
    var config = getAirtableConfig();
    if (!config.apiKey || !config.baseId || !config.tableName) {
      showAirtableSetup();
      return;
    }

    if (frameworkItems.length === 0) {
      alert('No framework items to sync. Add some elements first.');
      return;
    }

    var totalItems = frameworkItems.length;
    var btn = document.getElementById('hermes-sync-btn');
    if (btn) btn.textContent = 'Syncing 0/' + totalItems + '...';

    var success = 0;
    var failed = 0;
    var pending = totalItems;

    function updateSyncProgress() {
      if (btn) {
        btn.textContent = 'Syncing ' + (success + failed) + '/' + totalItems + '...';
      }
    }

    function checkDone() {
      pending--;
      if (pending === 0) {
        if (btn) {
          btn.textContent = 'Done (' + success + '/' + totalItems + ')';
        }
        setTimeout(function() {
          if (btn && frameworkViewActive) btn.textContent = 'Sync to Airtable';
        }, 3000);
      }
    }

    frameworkItems.forEach(function(item) {
      var fields = {
        'Event': item.event,
        'Family': item.family,
        'CSS Selector': item.cssSel,
        'element_class': item.params.element_class || '',
        'link_click_url': item.params.link_click_url || '',
        'web_element_location': item.params.web_element_location || '',
        'click_text': item.params.click_text || '',
        'Page URL': item.url || ''
      };
      // Airtable rejects the entire record if a field name doesn't match.
      // Create columns in your table to match the fields above (exact names).

      fetch('https://api.airtable.com/v0/' + config.baseId + '/' + encodeURIComponent(config.tableName), {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + config.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields: fields })
      }).then(function(resp) {
        if (resp.ok) { success++; updateSyncProgress(); checkDone(); }
        else {
          failed++;
          updateSyncProgress();
          checkDone();
          resp.text().then(function(body) {
            var msg = 'Sync error: HTTP ' + resp.status + ' - see console';
            try {
              var j = JSON.parse(body);
              if (j.error && j.error.message) msg = j.error.message;
            } catch(e) {}
            if (btn) btn.textContent = msg;
            setTimeout(function() {
              if (btn && frameworkViewActive) btn.textContent = 'Sync to Airtable';
            }, 6000);
          });
        }
      }).catch(function(err) {
        failed++;
        updateSyncProgress();
        checkDone();
        if (btn) btn.textContent = 'Network error - check console';
        setTimeout(function() {
          if (btn && frameworkViewActive) btn.textContent = 'Sync to Airtable';
        }, 6000);
      });
    });
  }

  function showAirtableSetup() {
    var config = getAirtableConfig();
    var detail = document.getElementById('hermes-detail');
    if (!detail) return;

    frameworkViewActive = true;

    var html = '<div style="color:#a9b1d6;font-size:12px;font-weight:600;margin-bottom:8px;">Airtable Settings</div>';
    html += '<div style="font-size:11px;color:#565f89;margin-bottom:8px;line-height:1.4;">Enter your Airtable credentials once. They are saved in your browser and reused on future syncs.</div>';

    html += '<div style="margin-bottom:6px;">';
    html += '<label style="display:block;font-size:11px;color:#565f89;margin-bottom:2px;">Personal Access Token</label>';
    html += '<input id="hermes-at-key" type="text" value="' + (config.apiKey || '') + '" placeholder="patXXXXXXX..." style="width:100%;padding:5px 8px;background:#13131f;border:1px solid #2a2b3e;border-radius:4px;color:#c0caf5;font-size:12px;box-sizing:border-box;">';
    html += '</div>';

    html += '<div style="margin-bottom:6px;">';
    html += '<label style="display:block;font-size:11px;color:#565f89;margin-bottom:2px;">Base ID</label>';
    html += '<input id="hermes-at-base" type="text" value="' + (config.baseId || '') + '" placeholder="appXXXXXXXXXXXXXX" style="width:100%;padding:5px 8px;background:#13131f;border:1px solid #2a2b3e;border-radius:4px;color:#c0caf5;font-size:12px;box-sizing:border-box;">';
    html += '</div>';

    html += '<div style="margin-bottom:10px;">';
    html += '<label style="display:block;font-size:11px;color:#565f89;margin-bottom:2px;">Table Name</label>';
    html += '<input id="hermes-at-table" type="text" value="' + (config.tableName || '') + '" placeholder="e.g. Tracking Framework" style="width:100%;padding:5px 8px;background:#13131f;border:1px solid #2a2b3e;border-radius:4px;color:#c0caf5;font-size:12px;box-sizing:border-box;">';
    html += '</div>';

    html += '<div style="font-size:10px;color:#565f89;line-height:1.5;margin-bottom:8px;padding:6px;background:#1a1b26;border-radius:4px;">';
    html += '<div style="font-weight:600;margin-bottom:2px;">Your table needs these columns:</div>';
    html += '<code style="color:#9ece6a;">Event</code>, <code style="color:#7aa2f7;">Family</code>, <code style="color:#e0af68;">CSS Selector</code>, <code style="color:#f7768e;">link_click_url</code>, <code style="color:#bb9af7;">web_element_location</code>, <code style="color:#73daca;">click_text</code>, <code style="color:#ff9e64;">Page URL</code>';
    html += '<div style="color:#565f89;margin-top:3px;">Extra params (<code>tag</code>, <code>inferred_type</code>, etc.) are auto-added as columns &#8212; or ignored if they don\'t exist.</div>';
    html += '</div>';

    html += '<div style="display:flex;gap:6px;">';
    html += '<button id="hermes-at-save-btn" style="flex:1;background:#7aa2f7;border:none;color:#1a1b26;border-radius:5px;padding:6px 10px;cursor:pointer;font-size:12px;font-weight:600;">Save &amp; Sync</button>';
    if (config.apiKey) {
      html += '<button id="hermes-at-clear-btn" style="background:#f7768e18;border:1px solid #f7768e44;color:#f7768e;border-radius:5px;padding:6px 10px;cursor:pointer;font-size:11px;">Clear</button>';
    }
    html += '<button id="hermes-at-back-btn" style="background:#292e42;border:none;color:#565f89;border-radius:5px;padding:6px 10px;cursor:pointer;font-size:11px;">Back</button>';
    html += '</div>';

    detail.innerHTML = html;

    document.getElementById('hermes-at-save-btn').onclick = function() {
      var key = document.getElementById('hermes-at-key').value.trim();
      var base = document.getElementById('hermes-at-base').value.trim();
      var table = document.getElementById('hermes-at-table').value.trim();
      if (!key || !base || !table) { alert('All three fields are required.'); return; }
      setAirtableConfig(key, base, table);
      // Re-run sync
      syncToAirtable();
    };

    var clearBtn = document.getElementById('hermes-at-clear-btn');
    if (clearBtn) {
      clearBtn.onclick = function() {
        localStorage.removeItem('hermes_airtable_key');
        localStorage.removeItem('hermes_airtable_base');
        localStorage.removeItem('hermes_airtable_table');
        showAirtableSetup();
      };
    }

    document.getElementById('hermes-at-back-btn').onclick = function() {
      renderFrameworkView();
    };
  }

  // ============================================================
  // UI
  // ============================================================
  var panel, overlay, inspectedEl, currentMatch, csvModal;

  function buildPanel() {
    if (document.getElementById('hermes-taxonomy-panel')) return;

    panel = document.createElement('div');
    panel.id = 'hermes-taxonomy-panel';
    panel.style.cssText = [
      'position:fixed;top:12px;right:12px;width:420px;max-height:88vh;',
      'overflow-y:auto;overflow-x:hidden;',
      'background:#1a1b26;color:#c0caf5;',
      'font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
      'font-size:12px;line-height:1.5;',
      'border-radius:10px;',
      'border:1px solid #2a2b3e;',
      'box-shadow:0 12px 40px rgba(0,0,0,0.5);',
      'z-index:999999;padding:0;'
    ].join('');

    var hdr = document.createElement('div');
    hdr.style.cssText = [
      'display:flex;align-items:center;gap:6px;',
      'padding:10px 14px;',
      'background:#1f2035;',
      'border-bottom:1px solid #2a2b3e;',
      'border-radius:10px 10px 0 0;',
      'user-select:none;'
    ].join('');
    hdr.innerHTML = [
      '<span style="font-weight:600;font-size:13px;color:#a9b1d6;">Click Tracker Framework</span>',
      '<span style="font-size:10px;color:#565f89;background:#292e42;padding:1px 6px;border-radius:4px;">v2</span>',
      '<div style="display:flex;gap:3px;margin-left:auto;">',
      '<button id="hermes-framework-btn" style="background:#292e42;border:none;color:#bb9af7;border-radius:5px;padding:3px 8px;cursor:pointer;font-size:11px;">Framework</button>',
      '<button id="hermes-export-btn" style="background:#292e42;border:none;color:#73daca;border-radius:5px;padding:3px 8px;cursor:pointer;font-size:11px;">CSV</button>',
      '<button id="hermes-min-btn" style="background:transparent;border:none;color:#565f89;border-radius:5px;padding:3px 8px;cursor:pointer;font-size:13px;line-height:1;">&#8212;</button><button id="hermes-close-btn" style="background:transparent;border:none;color:#565f89;border-radius:5px;padding:3px 8px;cursor:pointer;font-size:15px;line-height:1;">&times;</button>',
      '</div>'
    ].join('');
    panel.appendChild(hdr);

    var body = document.createElement('div');
    body.id = 'hermes-panel-body';
    body.style.cssText = 'padding:10px 14px;overflow-y:auto;max-height:calc(100vh - 200px);';

    // URL bar
    var urlBar = document.createElement('div');
    urlBar.style.cssText = [
      'margin-bottom:8px;padding:6px 10px;',
      'background:#1f2035;border-radius:6px;',
      'font-size:11px;color:#565f89;',
      'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'
    ].join('');
    urlBar.textContent = window.location.hostname + window.location.pathname;
    body.appendChild(urlBar);

    // Instructions
    var hint = document.createElement('div');
    hint.style.cssText = [
      'margin-bottom:8px;padding:6px 10px;',
      'background:#1f2035;border-radius:6px;',
      'font-size:11px;color:#565f89;line-height:1.4;'
    ].join('');
    hint.textContent = 'Hover any element to see its tracking classification. Click on it to add to your framework sheet.';
    body.appendChild(hint);

    // Stats area
    var stats = document.createElement('div');
    stats.id = 'hermes-stats';
    stats.style.cssText = 'margin-bottom:8px;';
    body.appendChild(stats);

    // Detail area (replaced on hover or framework view)
    var detail = document.createElement('div');
    detail.id = 'hermes-detail';
    detail.style.cssText = [
      'margin-bottom:8px;padding:8px 10px;',
      'background:#1f2035;border-radius:6px;',
      'min-height:40px;'
    ].join('');
    detail.innerHTML = '<div style="color:#565f89;font-size:11px;">Hover over an element on the page.</div>';
    body.appendChild(detail);


    // Legend footer
    var legend = document.createElement('div');
    legend.style.cssText = [
      'padding:5px 10px;background:#13131f;border-radius:6px;',
      'font-size:10px;color:#565f89;line-height:1.6;'
    ].join('');
    legend.innerHTML = [
      '<span style="color:#f7768e;">Conversion</span>',
      ' <span style="color:#2a2b3e;">&middot;</span> ',
      '<span style="color:#7aa2f7;">Engagement</span>',
      ' <span style="color:#2a2b3e;">&middot;</span> ',
      '<span style="color:#9ece6a;">Discovery</span>',
      ' <span style="color:#2a2b3e;">&middot;</span> ',
      '<span style="color:#e0af68;">Content & Media</span>',
      ' <span style="color:#2a2b3e;">&middot;</span> ',
      '<span style="color:#ff9e64;">Utility & Support</span>'
    ].join('');
    body.appendChild(legend);

    panel.appendChild(body);
    document.body.appendChild(panel);

    document.getElementById('hermes-close-btn').onclick = destroy;
    document.getElementById('hermes-export-btn').onclick = downloadCSV;
    document.getElementById('hermes-framework-btn').onclick = showFrameworkPanel;

    // Minimize/Restore
    var minBtn = document.getElementById('hermes-min-btn');
    var panelBody = document.getElementById('hermes-panel-body');
    var hdr = panel.querySelector('div:first-child');
    var minimized = false;
    minBtn.onclick = function(e) {
      e.stopPropagation();
      minimized = !minimized;
      if (minimized) {
        panelBody.style.display = 'none';
        panel.style.height = hdr.offsetHeight + 'px';
        panel.style.overflow = 'hidden';
        minBtn.textContent = '+';
        minBtn.title = 'Restore panel';
        var countSpan = document.getElementById('hermes-min-count');
        if (!countSpan) {
          countSpan = document.createElement('span');
          countSpan.id = 'hermes-min-count';
          countSpan.style.cssText = 'font-size:10px;color:#565f89;margin-left:auto;';
          hdr.insertBefore(countSpan, hdr.querySelector('div:last-child'));
        }
        countSpan.textContent = frameworkItems.length + ' tracked';
      } else {
        panelBody.style.display = '';
        panel.style.height = '';
        panel.style.overflow = '';
        minBtn.textContent = String.fromCharCode(8212);
        minBtn.title = 'Minimize panel';
        var cs = document.getElementById('hermes-min-count');
        if (cs) cs.textContent = '';
        if (frameworkViewActive) renderFrameworkView();
      }
    };
  }

  function familyColor(family) {
    var colors = {
      'Conversion': '#f7768e',
      'Engagement': '#7aa2f7',
      'Discovery': '#9ece6a',
      'Content & Media': '#e0af68',
      'Utility & Support': '#ff9e64'
    };
    return colors[family] || '#c0caf5';
  }

  function updateStats() {
    var countEl = document.getElementById('hermes-min-count');
    if (countEl) countEl.textContent = frameworkItems.length + ' tracked';

    var counts = {};
    TAXONOMY.rules.forEach(function(r) {
      counts[r.event] = 0;
    });

    var elements = document.querySelectorAll('a[href], button, input[type="submit"], form, [onclick], [role="button"]');
    for (var j = 0; j < elements.length && j < 500; j++) {
      if (panel && panel.contains(elements[j])) continue;
      var match = matchElement(elements[j]);
      if (match) {
        counts[match.event] = (counts[match.event] || 0) + 1;
      } else {
        counts['(unmatched)'] = (counts['(unmatched)'] || 0) + 1;
      }
    }

    var html = '<div style="color:#565f89;font-size:11px;margin-bottom:4px;">Matches (top 500 elements)</div><div style="display:flex;flex-wrap:wrap;gap:4px;">';
    var familyOrder = ['Conversion', 'Engagement', 'Discovery', 'Content & Media', 'Utility & Support'];
    var sortedEvents = {};
    TAXONOMY.rules.forEach(function(r) {
      if (!sortedEvents[r.family]) sortedEvents[r.family] = [];
      sortedEvents[r.family].push(r.event);
    });
    familyOrder.forEach(function(fam) {
      if (sortedEvents[fam]) {
        sortedEvents[fam].forEach(function(evt) {
          var c = counts[evt] || 0;
          if (c > 0) {
            html += '<span style="background:' + familyColor(fam) + '18;color:' + familyColor(fam) + ';border:1px solid ' + familyColor(fam) + '44;border-radius:4px;padding:2px 6px;font-size:10px;cursor:default;" title="' + fam + '">' + evt + ': ' + c + '</span>';
          }
        });
      }
    });
    var unmatched = counts['(unmatched)'] || 0;
    if (unmatched > 0) {
      html += '<span style="background:#565f8918;color:#565f89;border:1px solid #565f8944;border-radius:4px;padding:2px 6px;font-size:10px;cursor:default;">unmatched: ' + unmatched + '</span>';
    }
    html += '</div>';
    var statsEl = document.getElementById('hermes-stats');
    if (statsEl) statsEl.innerHTML = html;
  }

  /** Update the detail panel &#8212; called on every hover */
  function showDetail(match, el) {
    var detail = document.getElementById('hermes-detail');
    if (!detail) return;

    if (frameworkViewActive) return;

    // If no match but we have an element, build generic params
    if (!match && el) {
      match = { event: '', family: '', params: buildGenericParams(el) };
    }

    var famColor = familyColor(match ? match.family : '');
    var cssSel = el ? getCSSSelector(el) : '';

    var html = '';

    if (match) {
      var isUnmatched = !match.event;
      // Event badge + family
      html += '<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;">';
      if (isUnmatched) {
        html += '<span style="background:#6c7086;color:#1a1b26;border-radius:4px;padding:2px 6px;font-size:10px;font-weight:700;">unmatched</span>';
        html += '<span style="color:#6c7086;font-size:11px;">Uncategorized</span>';
      } else {
        html += '<span style="background:' + famColor + ';color:#1a1b26;border-radius:4px;padding:2px 6px;font-size:10px;font-weight:700;">' + match.event + '</span>';
        html += '<span style="color:' + famColor + ';font-size:11px;">' + match.family + '</span>';
      }

      // Add to Framework button
      var alreadyAdded = false;
      for (var fi = 0; fi < frameworkItems.length; fi++) {
        if (frameworkItems[fi].cssSel === cssSel) { alreadyAdded = true; break; }
      }
      if (alreadyAdded) {
        html += '<span style="margin-left:auto;color:#73daca;font-size:10px;">added</span>';
      } else {
        html += '<button id="hermes-add-btn" style="margin-left:auto;background:#292e42;border:none;color:#bb9af7;border-radius:5px;padding:3px 8px;cursor:pointer;font-size:11px;">Add to Framework</button>';
      }
      html += '</div>';

      // Element tag
      html += '<div style="font-size:11px;color:#565f89;margin-bottom:3px;">&lt;' + (el.tagName || '').toLowerCase();
      if (el && el.id) html += '#' + el.id;
      html += '&gt;</div>';

      // CSS selector
      if (cssSel) {
        html += '<div style="font-size:10px;color:#565f89;margin-bottom:4px;word-break:break-all;font-family:monospace;">' + cssSel + '</div>';
      }

      // Inferred type hint for unmatched elements
      if (isUnmatched && match.params && match.params.inferred_type) {
        html += '<div style="margin-top:4px;font-size:10px;color:#6c7086;">Looks like: ' + match.params.inferred_type + '</div>';
      }

      // Parameters
      html += '<div style="margin-top:4px;font-size:11px;color:#565f89;">Parameters</div>';
      html += '<table style="font-size:11px;width:100%;border-collapse:collapse;margin-top:2px;">';

      var coreParams = ['link_click_url', 'web_element_location', 'click_text'];
      coreParams.forEach(function(key) {
        var val = String(match.params[key] || '');
        if (val.length > 60) val = val.substring(0, 60) + '...';
        html += '<tr><td style="padding:2px 4px;color:#9ece6a;border-bottom:1px solid #1f2035;width:120px;">' + key + '</td><td style="padding:2px 4px;color:#c0caf5;border-bottom:1px solid #1f2035;word-break:break-all;">' + val + '</td></tr>';
      });

      for (var key in match.params) {
        if (match.params.hasOwnProperty(key) && coreParams.indexOf(key) === -1) {
          var val = String(match.params[key] || '');
          if (val.length > 60) val = val.substring(0, 60) + '...';
          html += '<tr><td style="padding:2px 4px;color:#565f89;border-bottom:1px solid #1f2035;width:120px;">' + key + '</td><td style="padding:2px 4px;color:#c0caf5;border-bottom:1px solid #1f2035;word-break:break-all;">' + val + '</td></tr>';
        }
      }
      html += '</table>';
    } else {
      html += '<div style="color:#565f89;font-size:11px;">Canvas area (no interactive element).</div>';
    }

    detail.innerHTML = html;

    // Wire the Add to Framework button
    var addBtn = document.getElementById('hermes-add-btn');
    if (addBtn && match && el) {
      addBtn.onclick = function(e) {
        e.stopPropagation();
        var added = addToFramework(match, el);
        if (added) {
          showDetail(match, el); // re-render to show "added" state
        }
      };
    }
  }

  function handleHover(e) {
    var el = e.target;
    if (!el || el === panel || (panel && panel.contains(el)) || (csvModal && csvModal.contains(el))) return;

    // Clear previous outline
    if (inspectedEl && inspectedEl !== el) {
      inspectedEl.style.outline = '';
    }

    // Get match and update panel &#8212; ALWAYS update the panel on hover
    var match = matchElement(el);
    if (match) {
      el.style.outline = '2px solid ' + familyColor(match.family) + '80';
      el.style.outlineOffset = '1px';
    } else {
      // Still show element info even if no match
      match = { event: '', family: '', params: buildGenericParams(el) };
      el.style.outline = '2px solid #6c708680';
      el.style.outlineOffset = '1px';
    }
    inspectedEl = el;
    currentMatch = match;
    showDetail(match, el);
  }

  function handleClick(e) {
    if (e.target === panel || (panel && panel.contains(e.target)) || (csvModal && csvModal.contains(e.target))) return;
    e.preventDefault();
    e.stopPropagation();

    var match = matchElement(e.target);
    if (!match) {
      match = { event: '', family: '', params: buildGenericParams(e.target) };
    }
    var added = addToFramework(match, e.target);
    showDetail(match, e.target);
    if (added) {
      console.log('[Tracker] Added to framework:', match.event || 'unmatched', getCSSSelector(e.target));
    }
  }

  function destroy() {
    if (panel) { panel.remove(); panel = null; }
    if (overlay) { overlay.remove(); overlay = null; }
    if (inspectedEl) { inspectedEl.style.outline = ''; inspectedEl = null; }
    currentMatch = null;
    frameworkItems = [];
    frameworkViewActive = false;
    document.removeEventListener('mouseover', handleHover, true);
    document.removeEventListener('click', handleClick, true);
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    buildPanel();

    var pageEvent = classifyPage();
    if (pageEvent) {
      var alert = document.createElement('div');
      alert.style.cssText = 'margin-bottom:8px;padding:6px 10px;background:#f7768e18;border:1px solid #f7768e44;border-radius:6px;font-size:11px;color:#f7768e;';
      alert.innerHTML = '404 page &#8212; <strong>404</strong> event would fire on load.';
      var body = document.getElementById('hermes-panel-body');
      if (body && body.firstChild) {
        body.insertBefore(alert, body.firstChild.nextSibling);
      }
    }

    updateStats();
    document.addEventListener('mouseover', handleHover, true);
    document.addEventListener('click', handleClick, true);

    console.log('[Click Tracker Framework] Active. Hover to inspect, click to add to framework.');
    console.log('[Click Tracker Framework] ' + TAXONOMY.rules.length + ' taxonomy rules + catch-all coverage.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
