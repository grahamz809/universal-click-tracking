/*
 * Universal Click-Tracking Taxonomy Inspector v2
 * Bookmarklet — Drag this into your bookmarks bar, click on any ohio.edu page
 *
 * What it does:
 *   Injects a floating diagnostics panel on the current page.
 *   Highlights every interactive element and shows which event from the
 *   OHIO.edu Universal Click-Tracking Taxonomy would fire.
 *   Every matched element always includes:
 *     - link_click_url    → the href (or empty for buttons/forms)
 *     - web_element_location → where on the page (breadcrumb, main-nav, aux-menu, hero, footer, body)
 *     - click_text        → the visible text of the element
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
    if (!el) return 'body';
    // Walk up ancestors checking for known containers
    var p = el;
    while (p && p.nodeType === 1) {
      var tag = p.tagName.toLowerCase();
      var cls = (p.className || '').toLowerCase();
      var aria = (p.getAttribute('aria-label') || '').toLowerCase();
      var role = (p.getAttribute('role') || '').toLowerCase();

      // Breadcrumb — nav[aria-label*="breadcrumb"] or class breadcrumb
      if (aria.indexOf('breadcrumb') !== -1) return 'breadcrumb';
      if (cls.indexOf('breadcrumb') !== -1 || cls.indexOf('top-confined-breadcrumb') !== -1) return 'breadcrumb';

      // Aux menu — top header utility links
      if (cls.indexOf('aux-menu') !== -1 || cls.indexOf('aux-menu-links') !== -1) return 'aux-menu';
      if (p.id && p.id.indexOf('header-top') !== -1) return 'aux-menu';
      if (p.id === 'search-desktop') return 'aux-menu';

      // Main nav — the primary megamenu
      if (p.id === 'main-menu') return 'main-nav';
      if (cls.indexOf('menu-item menu-level-1') !== -1) return 'main-nav';
      if (p.id === 'logoSpaceContent') return 'main-nav';

      // Hero area
      if (cls.indexOf('hero') !== -1) return 'hero';

      // Footer
      if (tag === 'footer' || p.id === 'global-footer' || cls.indexOf('footer') !== -1) return 'footer';

      // Header (but not interior elements already caught by aux-menu/main-nav)
      if (tag === 'header') return 'header';

      p = p.parentElement;
    }
    return 'body';
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

          // Actions — links with ➜, ,  arrows
          if (/[➜]/.test(el.textContent || '')) return true;

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
          // Determine location — global_nav fires for nav-type elements
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

  // ---- CATCH-ALL — Every other link or interactive element ----
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

  // ============================================================
  // CSV EXPORT
  // ============================================================
  function downloadCSV() {
    var rows = [];
    // Header row
    rows.push(['Family', 'Event', 'CSS Selector', 'link_click_url', 'web_element_location', 'click_text'].join(','));

    var elements = document.querySelectorAll('a[href], button, input[type="submit"], input[type="button"], form, [onclick], [role="button"], [tabindex]:not([tabindex="-1"]):not([tabindex="-2"])');
    var seen = {};

    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      // Skip elements inside the panel
      if (panel && panel.contains(el)) continue;
      // Deduplicate: skip if same tag/href/text combination
      var key = el.tagName + '|' + (el.href || '') + '|' + getClickText(el);
      if (seen[key]) continue;
      seen[key] = true;

      var match = matchElement(el);
      if (match) {
        var cssSel = getCSSSelector(el);
        // Escape CSV values (wrap in quotes if contains comma or quote)
        var row = [
          match.family,
          match.event,
          cssSel,
          match.params.link_click_url || '',
          match.params.web_element_location || '',
          match.params.click_text || ''
        ].map(function(v) {
          var s = String(v);
          if (s.indexOf(',') !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1) {
            return '"' + s.replace(/"/g, '""') + '"';
          }
          return s;
        });
        rows.push(row.join(','));
      }
    }

    var csv = rows.join('\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'click-tracker-export-' + window.location.hostname + '-' + Date.now() + '.csv';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ============================================================
  // UI
  // ============================================================
  var panel, overlay, inspectedEl, currentMatch;

  function buildPanel() {
    if (document.getElementById('hermes-taxonomy-panel')) return;

    panel = document.createElement('div');
    panel.id = 'hermes-taxonomy-panel';
    panel.style.cssText = 'position:fixed;top:10px;right:10px;width:440px;max-height:90vh;overflow-y:auto;background:#1e1e2e;color:#cdd6f4;font-family:system-ui,-apple-system,sans-serif;font-size:13px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.4);z-index:999999;padding:0;';

    var header = document.createElement('div');
    header.style.cssText = 'background:#313244;padding:12px 16px;border-radius:12px 12px 0 0;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #cba6f7;';
    header.innerHTML = '<span style="font-weight:700;font-size:14px;color:#cba6f7;">🎯 Universal Click Tracker v2</span>' +
      '<div style="display:flex;gap:4px;">' +
      '<button id="hermes-export-btn" style="background:#45475a;border:none;color:#a6e3a1;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:11px;">📥 CSV</button>' +
      '<button id="hermes-reload-btn" style="background:#45475a;border:none;color:#f9e2af;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:11px;">🔄</button>' +
      '<button id="hermes-close-btn" style="background:#45475a;border:none;color:#cdd6f4;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:12px;">✕</button>' +
      '</div>';
    panel.appendChild(header);

    var body = document.createElement('div');
    body.id = 'hermes-panel-body';
    body.style.cssText = 'padding:12px 16px;';

    // URL
    var url = document.createElement('div');
    url.style.cssText = 'margin-bottom:10px;padding:8px;background:#313244;border-radius:8px;word-break:break-all;';
    url.innerHTML = '<div style="color:#a6adc8;font-size:11px;margin-bottom:2px;">📍 Page</div><div style="font-size:12px;font-weight:500;">' + window.location.hostname + window.location.pathname + '</div>';
    body.appendChild(url);

    // Instructions
    var instr = document.createElement('div');
    instr.style.cssText = 'margin-bottom:8px;padding:6px 8px;background:#45475a;border-radius:8px;font-size:11px;color:#a6adc8;';
    instr.innerHTML = '🖱️ Hover any element → shows event, CSS selector, and 3 standard parameters. Click to log to console. Click 📥 CSV to export all matches.';
    body.appendChild(instr);

    // Count by family
    var stats = document.createElement('div');
    stats.id = 'hermes-stats';
    stats.style.cssText = 'margin-bottom:8px;';
    body.appendChild(stats);

    // Hover detail (replaced on every hover)
    var detail = document.createElement('div');
    detail.id = 'hermes-detail';
    detail.style.cssText = 'margin-bottom:8px;padding:8px;background:#313244;border-radius:8px;';
    detail.innerHTML = '<div style="color:#6c7086;font-size:11px;">Hover over an element on the page to inspect it.</div>';
    body.appendChild(detail);

    // Legend
    var legend = document.createElement('div');
    legend.style.cssText = 'margin-top:4px;padding:6px 8px;background:#181825;border-radius:6px;font-size:10px;color:#6c7086;line-height:1.5;';
    legend.innerHTML = 'Families: <span style="color:#f38ba8;">Conversion</span> · <span style="color:#89b4fa;">Engagement</span> · <span style="color:#a6e3a1;">Discovery</span> · <span style="color:#f9e2af;">Content</span> · <span style="color:#fab387;">Utility</span>';
    body.appendChild(legend);

    panel.appendChild(body);
    document.body.appendChild(panel);

    document.getElementById('hermes-close-btn').onclick = destroy;
    document.getElementById('hermes-export-btn').onclick = downloadCSV;
    document.getElementById('hermes-reload-btn').onclick = updateStats;
  }

  function familyColor(family) {
    var colors = {
      'Conversion': '#f38ba8',
      'Engagement': '#89b4fa',
      'Discovery': '#a6e3a1',
      'Content & Media': '#f9e2af',
      'Utility & Support': '#fab387'
    };
    return colors[family] || '#cdd6f4';
  }

  function updateStats() {
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

    var html = '<div style="color:#a6adc8;font-size:11px;margin-bottom:4px;">📊 Match Counts (top 500 elements)</div><div style="display:flex;flex-wrap:wrap;gap:4px;">';
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
            html += '<span style="background:' + familyColor(fam) + '22;color:' + familyColor(fam) + ';border:1px solid ' + familyColor(fam) + '44;border-radius:4px;padding:2px 6px;font-size:10px;cursor:default;" title="' + fam + '">' + evt + ': ' + c + '</span>';
          }
        });
      }
    });
    // Add unmatched count
    var unmatched = counts['(unmatched)'] || 0;
    if (unmatched > 0) {
      html += '<span style="background:#6c708622;color:#6c7086;border:1px solid #6c708644;border-radius:4px;padding:2px 6px;font-size:10px;cursor:default;">unmatched: ' + unmatched + '</span>';
    }
    html += '</div>';
    var statsEl = document.getElementById('hermes-stats');
    if (statsEl) statsEl.innerHTML = html;
  }

  /** Update the detail panel — called on every hover */
  function showDetail(match, el) {
    var detail = document.getElementById('hermes-detail');
    if (!detail) return;

    var famColor = familyColor(match ? match.family : '');
    var cssSel = el ? getCSSSelector(el) : '';

    var html = '';

    if (match) {
      // Family + Event badges
      html += '<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;">';
      html += '<span style="background:' + famColor + ';color:#1e1e2e;border-radius:4px;padding:2px 6px;font-size:10px;font-weight:700;">' + match.event + '</span>';
      html += '<span style="color:' + famColor + ';font-size:11px;">' + match.family + '</span>';
      html += '</div>';

      // Element tag + CSS selector
      html += '<div style="font-size:11px;color:#a6adc8;margin-bottom:4px;">Element: <span style="color:#cdd6f4;">&lt;' + (el.tagName || '').toLowerCase();
      if (el && el.id) html += '#' + el.id;
      html += '&gt;</span></div>';

      if (cssSel) {
        html += '<div style="font-size:10px;color:#6c7086;margin-bottom:4px;word-break:break-all;">CSS: <span style="color:#a6adc8;">' + cssSel + '</span></div>';
      }

      // 3 mandatory parameters FIRST
      html += '<div style="margin-top:4px;font-size:11px;color:#a6adc8;">Parameters:</div>';
      html += '<table style="font-size:11px;width:100%;border-collapse:collapse;margin-top:2px;">';

      // Always show the 3 core params first
      var coreParams = ['link_click_url', 'web_element_location', 'click_text'];
      coreParams.forEach(function(key) {
        var val = String(match.params[key] || '');
        if (val.length > 60) val = val.substring(0, 60) + '...';
        html += '<tr><td style="padding:2px 4px;color:#a6e3a1;border-bottom:1px solid #313244;width:120px;">' + key + '</td><td style="padding:2px 4px;color:#cdd6f4;border-bottom:1px solid #313244;word-break:break-all;">' + val + '</td></tr>';
      });

      // Then extra params (non-core)
      for (var key in match.params) {
        if (match.params.hasOwnProperty(key) && coreParams.indexOf(key) === -1) {
          var val = String(match.params[key] || '');
          if (val.length > 60) val = val.substring(0, 60) + '...';
          html += '<tr><td style="padding:2px 4px;color:#6c7086;border-bottom:1px solid #313244;width:120px;">' + key + '</td><td style="padding:2px 4px;color:#cdd6f4;border-bottom:1px solid #313244;word-break:break-all;">' + val + '</td></tr>';
        }
      }
      html += '</table>';
    } else if (el) {
      // Element exists but no match (shouldn't happen with catch-all, but handle gracefully)
      html += '<div style="font-size:11px;color:#6c7086;">&lt;' + (el.tagName || '').toLowerCase() + '&gt; <span style="color:#a6adc8;">' + getClickText(el).substring(0, 40) + '</span></div>';
      if (cssSel) {
        html += '<div style="font-size:10px;color:#6c7086;word-break:break-all;">CSS: <span style="color:#a6adc8;">' + cssSel + '</span></div>';
      }
      html += '<div style="margin-top:4px;font-size:11px;color:#fab387;">No specific event matched — catch-all rule would fire.</div>';
    } else {
      // No element passed
      html += '<div style="color:#6c7086;font-size:11px;">Canvas area (no interactive element).</div>';
    }

    detail.innerHTML = html;
  }

  function handleHover(e) {
    var el = e.target;
    if (!el || el === panel || (panel && panel.contains(el))) return;

    // Clear previous outline
    if (inspectedEl && inspectedEl !== el) {
      inspectedEl.style.outline = '';
    }

    // Get match and update panel — ALWAYS update the panel on hover
    var match = matchElement(el);
    if (match) {
      el.style.outline = '2px solid ' + familyColor(match.family) + '80';
      el.style.outlineOffset = '1px';
      inspectedEl = el;
      currentMatch = match;
    } else {
      // Still show the element info even if no match
      el.style.outline = '2px solid #6c708680';
      el.style.outlineOffset = '1px';
      inspectedEl = el;
      currentMatch = null;
    }
    showDetail(match, el);
  }

  function handleClick(e) {
    if (e.target === panel || (panel && panel.contains(e.target))) return;
    e.preventDefault();
    e.stopPropagation();

    var match = matchElement(e.target);
    if (match) {
      showDetail(match, e.target);
      console.log('🎯 Click Tracker:', JSON.stringify({ event: match.event, family: match.family, params: match.params }, null, 2));
      console.log('   CSS Selector:', getCSSSelector(e.target));
    } else {
      showDetail(null, e.target);
      console.log('🎯 Click Tracker: No event match for', e.tagName, getClickText(e.target).substring(0, 50));
    }
  }

  function destroy() {
    if (panel) { panel.remove(); panel = null; }
    if (overlay) { overlay.remove(); overlay = null; }
    if (inspectedEl) { inspectedEl.style.outline = ''; inspectedEl = null; }
    currentMatch = null;
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
      alert.style.cssText = 'margin-bottom:10px;padding:8px;background:#f38ba822;border:1px solid #f38ba8;border-radius:8px;font-size:12px;color:#f38ba8;';
      alert.innerHTML = '⚠️ 404 page — <strong>404</strong> event would fire on load.';
      var body = document.getElementById('hermes-panel-body');
      if (body && body.firstChild) {
        body.insertBefore(alert, body.firstChild.nextSibling);
      }
    }

    updateStats();
    document.addEventListener('mouseover', handleHover, true);
    document.addEventListener('click', handleClick, true);

    console.log('🎯 Universal Click Tracker v2 active. Hover any element to inspect.');
    console.log('📋 ' + TAXONOMY.rules.length + ' taxonomy rules + catch-all coverage');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
