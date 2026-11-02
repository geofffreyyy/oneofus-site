/* One of Us site – EN/FR toggle and the film player.
   The language is picked before first paint by the inline script in <head>;
   this file wires the buttons, remembers the choice, swaps a few attributes
   and plays the film in the language shown. */
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

  // ---------- The film ----------
  // Never autoplayed, and nothing is fetched before the click: the video has no
  // source until then. The orientation is read at the click, so a phone turned
  // upright before pressing play gets the upright cut.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var film = (function () {
    var frame = document.getElementById('film-frame');
    var video = document.getElementById('film-video');
    var cover = document.getElementById('film-cover');
    var button = document.getElementById('film-play');
    if (!frame || !video || !cover || !button) {
      return { start: function () {}, setLanguage: function () {}, frame: null };
    }
    var portrait = window.matchMedia('(orientation: portrait)');
    var filmLang = 'en';
    var loaded = null;

    function setState(state) {
      frame.setAttribute('data-state', state);
      var playing = state === 'playing';
      video.controls = playing;
      video.tabIndex = playing ? 0 : -1;
      video.setAttribute('aria-hidden', String(!playing));
      cover.inert = playing;
      button.tabIndex = playing ? -1 : 0;
    }

    function dropTracks() {
      var tracks = video.querySelectorAll('track');
      for (var i = 0; i < tracks.length; i++) tracks[i].remove();
    }

    function start() {
      var key = filmLang + '-' + (portrait.matches ? 'portrait' : 'landscape');
      if (loaded !== key) {
        loaded = key;
        dropTracks();
        video.src = 'films/' + key + '.mp4';
        var track = document.createElement('track');
        track.kind = 'captions';
        track.src = 'films/' + filmLang + '.vtt';
        track.srclang = filmLang;
        track.label = filmLang === 'fr' ? 'Français' : 'English';
        video.appendChild(track);
      } else if (video.ended) {
        video.currentTime = 0;
      }
      setState('playing');
      // Called inside the click, which is what lets it play with sound.
      var attempt = video.play();
      if (attempt && attempt.catch) attempt.catch(function () { setState('idle'); });
      requestAnimationFrame(function () { video.focus({ preventScroll: true }); });
    }

    video.addEventListener('ended', function () { setState('ended'); });
    video.addEventListener('play', function () {
      if (frame.getAttribute('data-state') !== 'playing') setState('playing');
    });
    button.addEventListener('click', start);

    return {
      frame: frame,
      start: start,
      setLanguage: function (lang) {
        var next = lang === 'fr' ? 'fr' : 'en';
        if (next === filmLang) return;
        filmLang = next;
        if (loaded) {
          // A film in the other language was loaded: drop it, back to the poster.
          video.pause();
          video.removeAttribute('src');
          dropTracks();
          video.load();
          loaded = null;
          setState('idle');
        }
      }
    };
  })();

  var playLinks = document.querySelectorAll('[data-play-film]');
  for (var p = 0; p < playLinks.length; p++) {
    playLinks[p].addEventListener('click', function (event) {
      if (!film.frame) return;
      event.preventDefault();
      film.start();
      film.frame.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
    });
  }

  var buttons = document.querySelectorAll('[data-set-lang]');

  function apply(lang) {
    root.setAttribute('data-lang', lang);
    root.lang = lang;
    document.title = TITLES[lang];
    swaps.forEach(function (s) {
      s.el.setAttribute(s.attr, s[lang]);
    });
    film.setLanguage(lang);
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
