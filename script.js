/* One of Us site – EN/FR toggle.
   The language is picked before first paint by the inline script in <head>;
   this file wires the buttons, remembers the choice and swaps a few attributes. */
(function () {
  'use strict';

  var root = document.documentElement;
  var STORAGE_KEY = 'oneofus-lang';
  var TITLES = {
    en: 'One of Us – The party picker for every group decision',
    fr: 'One of Us – Le tirage au sort de toutes vos soirées'
  };

  // Attributes that can't hold two <span lang> children get a data-fr-* twin.
  var swaps = [];
  ['aria-label', 'alt'].forEach(function (attr) {
    var nodes = document.querySelectorAll('[data-fr-' + attr + ']');
    for (var i = 0; i < nodes.length; i++) {
      swaps.push({
        el: nodes[i],
        attr: attr,
        en: nodes[i].getAttribute(attr),
        fr: nodes[i].getAttribute('data-fr-' + attr)
      });
    }
  });

  var buttons = document.querySelectorAll('[data-set-lang]');

  function apply(lang) {
    root.setAttribute('data-lang', lang);
    root.lang = lang;
    document.title = TITLES[lang];
    swaps.forEach(function (s) {
      s.el.setAttribute(s.attr, s[lang]);
    });
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-set-lang') === lang));
    }
  }

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
      var lang = this.getAttribute('data-set-lang') === 'fr' ? 'fr' : 'en';
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode: ignore */ }
      apply(lang);
    });
  }

  apply(root.getAttribute('data-lang') === 'fr' ? 'fr' : 'en');

  // Turn on smooth scrolling only once the page (and any #anchor jump) has settled.
  function enableSmoothScroll() {
    setTimeout(function () { root.classList.add('smooth-scroll'); }, 0);
  }
  if (document.readyState === 'complete') {
    enableSmoothScroll();
  } else {
    window.addEventListener('load', enableSmoothScroll);
  }
})();
