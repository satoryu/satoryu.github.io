/* satoryu.com - サイト共通スクリプト
 * 1. モバイルナビの開閉
 * 2. 目次（TOC）の自動生成
 * 3. Google Analytics 4 のイベント計測（問い合わせ導線の集計）
 */
(function () {
  'use strict';

  /* ---------- 1. ナビゲーション ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      document.body.classList.toggle('nav-open', !open);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
  }

  /* ---------- 2. 目次 ---------- */
  document.querySelectorAll('[data-toc]').forEach(function (tocEl) {
    var source = document.querySelector(tocEl.getAttribute('data-toc-source') || '.prose');
    if (!source) return;
    var headings = source.querySelectorAll('h1, h2, h3');
    if (headings.length < 2) {
      // 見出しが少ないページでは目次を出さず、本文を 1 カラムにする
      var aside = tocEl.closest('.toc-aside');
      if (aside) aside.hidden = true;
      var pageEl = tocEl.closest('.page');
      if (pageEl) pageEl.classList.remove('page--with-toc');
      return;
    }
    var used = {};
    var list = document.createElement('ol');
    var current = null;
    headings.forEach(function (h) {
      if (!h.id) {
        var base = (h.textContent || 'section').trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w぀-ヿ㐀-鿿-]/g, '');
        var id = base || 'section';
        var n = 1;
        while (document.getElementById(id) || used[id]) { id = base + '-' + (n++); }
        h.id = id;
      }
      used[h.id] = true;
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.trim();
      li.appendChild(a);
      if (h.tagName !== 'H3' || !current) {
        list.appendChild(li);
        current = li;
      } else {
        var sub = current.querySelector('ol');
        if (!sub) { sub = document.createElement('ol'); current.appendChild(sub); }
        sub.appendChild(li);
      }
    });
    var title = document.createElement('p');
    title.className = 'toc__title';
    title.textContent = '目次';
    tocEl.appendChild(title);
    tocEl.appendChild(list);

    // スクロール位置に応じて現在の見出しを強調
    if ('IntersectionObserver' in window) {
      var links = tocEl.querySelectorAll('a');
      var byId = {};
      links.forEach(function (l) { byId[l.getAttribute('href').slice(1)] = l; });
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var link = byId[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.classList.remove('is-active'); });
            link.classList.add('is-active');
          }
        });
      }, { rootMargin: '-10% 0px -70% 0px' });
      headings.forEach(function (h) { observer.observe(h); });
    }
  });

  /* ---------- 3. Google Analytics イベント ---------- */
  function track(name, params) {
    params = params || {};
    params.page_path = params.page_path || location.pathname;
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    } else if (window.__gaDebug && window.console) {
      console.log('[GA debug] ' + name, params);
    }
  }
  window.satoryuTrack = track;

  // data-ga 属性を持つリンクのクリックを計測
  // 例: <a data-ga="cta_click" data-ga-location="hero" data-ga-label="無料相談">
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-ga]');
    if (!a) return;
    track(a.getAttribute('data-ga'), {
      cta_location: a.getAttribute('data-ga-location') || '',
      cta_label: (a.getAttribute('data-ga-label') || a.textContent || '').trim().slice(0, 100),
      link_url: a.href
    });
  });

  // 問い合わせページ: 表示・フォーム読み込み・フォーム操作開始を計測
  var contact = document.querySelector('[data-contact-form]');
  if (contact) {
    var params = new URLSearchParams(location.search);
    track('contact_view', {
      entry_referrer: document.referrer || '(direct)',
      cta_location: params.get('from') || ''
    });
    var frame = contact.querySelector('iframe');
    if (frame) {
      frame.addEventListener('load', function () { track('contact_form_loaded'); });
      // iframe 内へのフォーカス移動は親 window の blur で検知できる
      var engaged = false;
      window.addEventListener('blur', function () {
        setTimeout(function () {
          if (!engaged && document.activeElement === frame) {
            engaged = true;
            track('contact_form_engaged');
          }
        }, 0);
      });
    }
  }

  // 開発のご相談ページ: 料金セクションの閲覧を計測（見込みの強さの指標）
  var pricing = document.getElementById('pricing');
  if (pricing && 'IntersectionObserver' in window) {
    var seen = false;
    var po = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen) {
          seen = true;
          track('pricing_view');
          po.disconnect();
        }
      });
    }, { threshold: 0.3 });
    po.observe(pricing);
  }
})();
