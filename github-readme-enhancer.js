// ==UserScript==
// @name         GitHub README 增强工具
// @namespace    https://github.com/Moly6/github-readme-enhancer
// @version      2.0.0
// @description  增强 GitHub README：支持图片预览与多语言 README 原地切换
// @author       Moly6
// @tag          GitHub
// @tag          图片预览
// @tag          多语言 README
// @license      https://github.com/Moly6/github-readme-enhancer/blob/main/LICENSE
// @homepageURL  https://github.com/Moly6/github-readme-enhancer
// @updateURL    https://raw.githubusercontent.com/Moly6/github-readme-enhancer/main/github-readme-enhancer.js
// @downloadURL  https://raw.githubusercontent.com/Moly6/github-readme-enhancer/main/github-readme-enhancer.js
// @match        *://github.com/*
// @match        *://gist.github.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const CONTAINER_SELECTOR = '.markdown-body';

    function cleanUrl(url) {
        if (!url) return '';
        return String(url).trim().replace(/^`+|`+$/g, '');
    }

    function isImageUrl(url) {
        url = cleanUrl(url);
        if (!url) return false;
        try {
            const u = new URL(url, location.href);
            if (/\.(png|jpe?g|gif|webp|bmp|svg|ico|avif)(\?|$|#)/i.test(u.pathname)) return true;
            if (/camo\.githubusercontent\.com$/i.test(u.hostname)) return true;
            if (/(^|\.)raw\.githubusercontent\.com$/i.test(u.hostname)) return true;
            if (/^user-images\.githubusercontent\.com$/i.test(u.hostname)) return true;
            if (u.hostname === 'github.com' && /^\/user-attachments\/(assets|files)\//i.test(u.pathname)) return true;
            if (/cloudflare_ipfs|cf-ipfs|ipfs\.io/i.test(u.hostname)) return true;
            return false;
        } catch (e) {
            return false;
        }
    }

    function getImgSrc(img) {
        return cleanUrl(img.currentSrc || img.src);
    }

    function isBadgeImage(img) {
        const canonical = cleanUrl(img.getAttribute('data-canonical-src') || '').toLowerCase();
        return canonical.includes('img.shields.io') || canonical.includes('badge');
    }

    function imgIsPreviewable(img) {
        if (isBadgeImage(img)) return false;

        const src = getImgSrc(img);
        const canonical = cleanUrl(img.getAttribute('data-canonical-src') || '');
        return isImageUrl(src) || isImageUrl(canonical);
    }

    function isSmallIcon(img) {
        return img.naturalWidth && img.naturalWidth < 32 && img.naturalHeight < 32;
    }

    // ============ 模态框核心 ============
    let overlay, imgEl, toolbar, infoEl, prevBtn, nextBtn, navGroup, navSep;
    let sidePrev, sideNext, thumbBar;
    let thumbEls = [];
    let state = { scale: 1, rotation: 0, x: 0, y: 0 };
    let drag = { active: false, startX: 0, startY: 0, baseX: 0, baseY: 0 };
    let gallery = { items: [], index: 0 };
    let loadToken = 0;

    function buildModal() {
        overlay = document.createElement('div');
        overlay.id = 'gh-img-preview-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', inset: '0', zIndex: '2147483647',
            background: 'rgba(0,0,0,.85)',
            display: 'none', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-in', userSelect: 'none', fontFamily: 'system-ui,sans-serif'
        });

        // 工具栏（底部居中、不透明）
        toolbar = document.createElement('div');
        Object.assign(toolbar.style, {
            position: 'absolute', bottom: '24px', left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: '6px', alignItems: 'center',
            background: '#2b2b2b',
            padding: '10px 14px', borderRadius: '12px',
            boxShadow: '0 6px 24px rgba(0,0,0,.5)', color: '#fff', fontSize: '13px',
            maxWidth: '92vw', flexWrap: 'wrap', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,.08)',
            zIndex: '10'
        });

        const mkBtn = (label, title, fn) => {
            const b = document.createElement('button');
            b.textContent = label;
            b.title = title;
            Object.assign(b.style, {
                background: 'rgba(255,255,255,.12)', color: '#fff',
                border: '1px solid rgba(255,255,255,.18)',
                borderRadius: '8px', padding: '6px 11px', cursor: 'pointer',
                fontSize: '14px', lineHeight: '1', minWidth: '34px',
                transition: 'background .15s'
            });
            b.addEventListener('mouseenter', () => b.style.background = 'rgba(255,255,255,.28)');
            b.addEventListener('mouseleave', () => b.style.background = 'rgba(255,255,255,.12)');
            b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
            return b;
        };

        infoEl = document.createElement('span');
        Object.assign(infoEl.style, {
            padding: '0 10px', whiteSpace: 'nowrap', overflow: 'hidden',
            textOverflow: 'ellipsis', maxWidth: '280px', opacity: '.95',
            fontVariantNumeric: 'tabular-nums'
        });

        const sep = () => {
            const s = document.createElement('span');
            s.textContent = '|'; s.style.opacity = '.3';
            return s;
        };

        prevBtn = mkBtn('←', '上一张 (←)', () => prev());
        nextBtn = mkBtn('→', '下一张 (→)', () => next());
        prevBtn.style.fontSize = '16px';
        nextBtn.style.fontSize = '16px';

        navGroup = document.createElement('div');
        Object.assign(navGroup.style, { display: 'flex', gap: '6px', alignItems: 'center' });
        navGroup.append(prevBtn, nextBtn);
        navSep = sep();

        toolbar.append(
            navGroup,
            navSep,
            mkBtn('＋', '放大 (+)', () => zoom(1.2)),
            mkBtn('－', '缩小 (-)', () => zoom(1 / 1.2)),
            infoEl,
            sep(),
            mkBtn('⟲', '向左旋转 ([)', () => rotate(-90)),
            mkBtn('⟳', '向右旋转 (])', () => rotate(90)),
            mkBtn('重置', '重置缩放、旋转和位置（快捷键 0）', reset),
            sep(),
            mkBtn('✕', '关闭 (Esc)', close)
        );

        // 图片
        imgEl = document.createElement('img');
        Object.assign(imgEl.style, {
            maxWidth: '90vw', maxHeight: '85vh',
            transition: 'opacity .15s', cursor: 'grab',
            boxShadow: '0 8px 40px rgba(0,0,0,.6)', willChange: 'transform',
            zIndex: '1'
        });
        imgEl.draggable = false;

        // 底部缩略图条（工具栏上方）
        thumbBar = document.createElement('div');
        Object.assign(thumbBar.style, {
            position: 'absolute', bottom: '92px', left: '50%',
            transform: 'translateX(-50%)',
            display: 'none', gap: '8px', alignItems: 'center',
            background: 'rgba(43,43,43,.85)',
            padding: '8px', borderRadius: '10px',
            boxShadow: '0 6px 24px rgba(0,0,0,.5)',
            border: '1px solid rgba(255,255,255,.08)',
            maxWidth: '90vw', overflowX: 'auto', overflowY: 'hidden',
            zIndex: '10', scrollBehavior: 'smooth'
        });
        // 隐藏横向滚动条（保持可用）
        thumbBar.style.scrollbarWidth = 'thin';

        // 左右两侧大箭头按钮
        const mkSideBtn = (side, label, title, fn) => {
            const b = document.createElement('button');
            b.textContent = label;
            b.title = title;
            Object.assign(b.style, {
                position: 'absolute', top: '50%', [side]: '20px',
                transform: 'translateY(-50%)',
                width: '52px', height: '52px', padding: '0',
                borderRadius: '50%',
                background: 'rgba(43,43,43,.85)', color: '#fff',
                border: '1px solid rgba(255,255,255,.18)',
                cursor: 'pointer',
                fontSize: '22px', lineHeight: '1',
                display: 'none', alignItems: 'center', justifyContent: 'center',
                zIndex: '10',
                transition: 'background .15s',
                boxShadow: '0 4px 16px rgba(0,0,0,.4)'
            });
            b.addEventListener('mouseenter', () => b.style.background = 'rgba(60,60,60,.95)');
            b.addEventListener('mouseleave', () => b.style.background = 'rgba(43,43,43,.85)');
            b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
            return b;
        };
        sidePrev = mkSideBtn('left', '‹', '上一张 (←)', () => prev());
        sideNext = mkSideBtn('right', '›', '下一张 (→)', () => next());

        overlay.append(imgEl, sidePrev, sideNext, thumbBar, toolbar);
        document.body.append(overlay);

        // ===== 事件绑定 =====
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        imgEl.addEventListener('mousedown', (e) => {
            e.preventDefault();
            drag.active = true;
            drag.startX = e.clientX; drag.startY = e.clientY;
            drag.baseX = state.x; drag.baseY = state.y;
            imgEl.style.cursor = 'grabbing';
        });
        window.addEventListener('mousemove', (e) => {
            if (!drag.active) return;
            state.x = drag.baseX + (e.clientX - drag.startX);
            state.y = drag.baseY + (e.clientY - drag.startY);
            updateTransform();
        });
        window.addEventListener('mouseup', () => {
            if (drag.active) { drag.active = false; imgEl.style.cursor = 'grab'; }
        });

        imgEl.addEventListener('wheel', (e) => {
            e.preventDefault();
            zoom(e.deltaY < 0 ? 1.12 : 1 / 1.12);
        }, { passive: false });

        imgEl.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            if (state.scale > 1.01) { state.scale = 1; state.x = 0; state.y = 0; }
            else { state.scale = 3; }
            updateTransform();
        });

        window.addEventListener('keydown', (e) => {
            if (overlay.style.display === 'none') return;
            if (e.key === 'Escape') { e.preventDefault(); close(); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
            else if (e.key === '+' || e.key === '=') zoom(1.2);
            else if (e.key === '-' || e.key === '_') zoom(1 / 1.2);
            else if (e.key === '0') reset();
            else if (e.key === '[') rotate(-90);
            else if (e.key === ']') rotate(90);
        });
    }

    function updateTransform() {
        imgEl.style.transform =
            `translate(${state.x}px, ${state.y}px) rotate(${state.rotation}deg) scale(${state.scale})`;
        const sizeInfo = (imgEl.complete && imgEl.naturalWidth)
            ? `  ·  ${imgEl.naturalWidth}×${imgEl.naturalHeight}`
            : '';
        const navInfo = gallery.items.length > 1
            ? `${gallery.index + 1}/${gallery.items.length}  ·  `
            : '';
        infoEl.textContent = `${navInfo}${Math.round(state.scale * 100)}%  ·  ${state.rotation}°${sizeInfo}`;
    }

    function updateNavVisibility() {
        const multi = gallery.items.length > 1;
        navGroup.style.display = multi ? 'flex' : 'none';
        navSep.style.display = multi ? 'inline' : 'none';
        sidePrev.style.display = multi ? 'flex' : 'none';
        sideNext.style.display = multi ? 'flex' : 'none';
        thumbBar.style.display = multi ? 'flex' : 'none';
    }

    // 构建缩略图条（打开新 gallery 时调用一次）
    function buildThumbs() {
        thumbBar.innerHTML = '';
        thumbEls = [];
        gallery.items.forEach((item, i) => {
            const t = document.createElement('img');
            t.src = item.src;
            t.alt = item.alt || '';
            t.draggable = false;
            Object.assign(t.style, {
                width: '56px', height: '56px',
                objectFit: 'cover', objectPosition: 'center top',
                borderRadius: '6px', cursor: 'pointer',
                border: '2px solid transparent',
                opacity: '.55', background: '#111',
                flex: '0 0 auto',
                transition: 'opacity .15s, border-color .15s',
                boxSizing: 'border-box'
            });
            t.addEventListener('mouseenter', () => {
                if (i !== gallery.index) t.style.opacity = '.85';
            });
            t.addEventListener('mouseleave', () => {
                if (i !== gallery.index) t.style.opacity = '.55';
            });
            t.addEventListener('click', (e) => {
                e.stopPropagation();
                showAt(i);
            });
            thumbBar.appendChild(t);
            thumbEls.push(t);
        });
    }

    // 更新缩略图高亮 + 自动居中滚动
    function updateThumbs() {
        thumbEls.forEach((t, i) => {
            const active = i === gallery.index;
            t.style.borderColor = active ? '#fff' : 'transparent';
            t.style.opacity = active ? '1' : '.55';
        });
        const activeEl = thumbEls[gallery.index];
        if (!activeEl) return;
        // 手动计算居中位置，避免 scrollIntoView 影响其他滚动容器
        const bar = thumbBar;
        const target = activeEl.offsetLeft - (bar.clientWidth - activeEl.offsetWidth) / 2;
        bar.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
    }

    function zoom(factor) {
        const next = state.scale * factor;
        if (next < 0.1 || next > 30) return;
        state.scale = next;
        updateTransform();
    }

    function rotate(deg) {
        state.rotation = (state.rotation + deg) % 360;
        updateTransform();
    }

    function reset() {
        state = { scale: 1, rotation: 0, x: 0, y: 0 };
        updateTransform();
    }

    function collectImages(container) {
        const imgs = container.querySelectorAll('img');
        const items = [];
        const seen = new Set();
        for (const img of imgs) {
            if (isSmallIcon(img)) continue;
            if (!imgIsPreviewable(img)) continue;
            const src = getImgSrc(img);
            if (!src || seen.has(src)) continue;
            seen.add(src);
            items.push({ src, alt: img.alt || '' });
        }
        return items;
    }

    function showAt(index) {
        if (!gallery.items.length) return;
        const n = gallery.items.length;
        gallery.index = ((index % n) + n) % n;
        const item = gallery.items[gallery.index];

        // 切换图片时重置视图状态
        state = { scale: 1, rotation: 0, x: 0, y: 0 };
        drag.active = false;
        imgEl.style.cursor = 'grab';

        const token = ++loadToken;
        imgEl.style.opacity = '0';
        imgEl.alt = item.alt || '';
        imgEl.src = item.src;

        imgEl.onload = () => {
            if (token !== loadToken) return;
            imgEl.style.opacity = '1';
            updateTransform();
        };
        imgEl.onerror = () => {
            if (token !== loadToken) return;
            imgEl.style.opacity = '1';
            infoEl.textContent = '图片加载失败';
        };

        updateTransform();
        updateNavVisibility();
        updateThumbs();
    }

    function prev() {
        if (gallery.items.length > 1) showAt(gallery.index - 1);
    }

    function next() {
        if (gallery.items.length > 1) showAt(gallery.index + 1);
    }

    function openGallery(items, index) {
        if (!overlay) buildModal();
        gallery = { items, index };
        buildThumbs();
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        showAt(index);
    }

    function close() {
        if (!overlay) return;
        loadToken++;
        overlay.style.display = 'none';
        imgEl.removeAttribute('src');
        imgEl.alt = '';
        document.body.style.overflow = '';
    }

    // ============ 拦截点击 ============
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName !== 'IMG') return;

        const container = target.closest(CONTAINER_SELECTOR);
        if (!container) return;

        const parentA = target.closest('a');

        // 保留浏览器的中键和修饰键链接行为
        if (parentA && (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)) return;

        if (isBadgeImage(target)) return;

        if (isSmallIcon(target)) return;

        const anchorHref = parentA ? cleanUrl(parentA.href) : '';

        const src = getImgSrc(target);
        if (!src) return;

        const previewable = imgIsPreviewable(target);

        let shouldOpen = false;
        if (parentA) {
            if (isImageUrl(anchorHref) || previewable) shouldOpen = true;
        } else if (previewable) {
            shouldOpen = true;
        }

        if (!shouldOpen) return;

        e.preventDefault();
        e.stopPropagation();

        const items = collectImages(container);
        let index = items.findIndex(it => it.src === src);
        if (index < 0) {
            items.unshift({ src, alt: target.alt || '' });
            index = 0;
        }
        openGallery(items, index);
    }, true);
})();

// ============ 多语言 README 原地切换 ============
(function () {
    'use strict';

    const ARTICLE_SELECTOR = 'article.markdown-body';
    const LANG_README_RE = /^README[._-][^.]+\.md$/i;

    const cache = new Map();
    let originalHTML = null;
    let articleEl = null;
    let currentUrl = null;
    let loadToken = 0;

    function repoParts() {
        const parts = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
        return parts.length === 2 ? { owner: parts[0], repo: parts[1] } : null;
    }

    function parseLangLink(el) {
        const a = el.closest('a');
        if (!a || !a.getAttribute('href')) return null;
        const info = repoParts();
        if (!info) return null;
        let url;
        try { url = new URL(a.href, location.origin); } catch { return null; }
        if (url.origin !== location.origin) return null;
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length < 5) return null;
        if (parts[0].toLowerCase() !== info.owner.toLowerCase()) return null;
        if (parts[1].toLowerCase() !== info.repo.toLowerCase()) return null;
        if (parts[2] !== 'blob') return null;
        const filename = parts[parts.length - 1];
        if (filename.toLowerCase() === 'readme.md') return null;
        if (!LANG_README_RE.test(filename)) return null;
        return url.href;
    }

    // 将相对路径解析为绝对路径，锚点和协议链接保持不变
    function absolutize(html, baseUrl) {
        const root = document.createElement('div');
        root.innerHTML = html;
        const base = new URL(baseUrl, location.origin);
        root.querySelectorAll('[src],[href]').forEach(el => {
            for (const attr of ['src', 'href']) {
                const v = el.getAttribute(attr);
                if (!v) continue;
                if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(v)) continue;
                try { el.setAttribute(attr, new URL(v, base).href); } catch {}
            }
        });
        return root.innerHTML;
    }

    function setLoading(article, on) {
        if (on) {
            article.style.transition = 'opacity .12s';
            article.style.opacity = '0.4';
        } else {
            article.style.opacity = '';
            article.style.transition = '';
        }
    }

    function addBackBar(article) {
        const bar = document.createElement('div');
        bar.className = 'readme-lang-bar';
        bar.style.cssText = 'display:flex;justify-content:flex-end;margin-bottom:12px;';
        const back = document.createElement('a');
        back.href = '#';
        back.textContent = '返回默认 README';
        back.style.cssText = 'font-size:12px;color:inherit;opacity:.65;text-decoration:none;border-bottom:1px dashed currentColor;cursor:pointer;';
        back.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            restoreOriginal();
        });
        bar.appendChild(back);
        article.prepend(bar);
    }

    function showError(article) {
        const flash = document.createElement('div');
        flash.style.cssText = 'padding:12px 16px;margin-bottom:16px;border:1px solid rgba(255,129,130,.4);border-radius:6px;background:#ffebe9;color:#1f2328;font-size:14px;';
        flash.textContent = '切换失败，已显示默认 README。';
        article.prepend(flash);
        setTimeout(() => flash.remove(), 5000);
    }

    // 若 README 顶部已滚出视口，切回顶部，避免读的是中间位置
    function scrollArticleTop(article) {
        if (article.getBoundingClientRect().top < 0) {
            article.scrollIntoView({ block: 'start' });
        }
    }

    async function switchTo(url) {
        const article = articleEl && document.contains(articleEl)
            ? articleEl
            : document.querySelector(ARTICLE_SELECTOR);
        if (!article) return;
        articleEl = article;

        if (originalHTML === null) originalHTML = article.innerHTML;

        const my = ++loadToken;
        setLoading(article, true);

        try {
            let html = cache.get(url);
            if (!html) {
                const res = await fetch(url, { headers: { Accept: 'text/html' } });
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const text = await res.text();
                const doc = new DOMParser().parseFromString(text, 'text/html');
                const node = doc.querySelector(ARTICLE_SELECTOR);
                if (!node) throw new Error('missing readme');
                html = absolutize(node.innerHTML, url);
                cache.set(url, html);
            }
            if (my !== loadToken) return;
            article.innerHTML = html;
            currentUrl = url;
            addBackBar(article);
            scrollArticleTop(article);
        } catch (err) {
            if (my !== loadToken) return;
            if (originalHTML !== null) article.innerHTML = originalHTML;
            currentUrl = null;
            showError(article);
        } finally {
            if (my === loadToken) setLoading(article, false);
        }
    }

    function restoreOriginal() {
        if (!articleEl || originalHTML === null || currentUrl === null) return;
        articleEl.innerHTML = originalHTML;
        currentUrl = null;
        scrollArticleTop(articleEl);
    }

    function reset() {
        loadToken++;
        originalHTML = null;
        currentUrl = null;
        articleEl = null;
    }

    function onClick(e) {
        if (!repoParts()) return;
        const target = e.target;
        if (!(target instanceof Element)) return;
        const url = parseLangLink(target);
        if (!url) return;
        e.preventDefault();
        e.stopPropagation();
        switchTo(url);
    }

    window.addEventListener('click', onClick, true);
    document.addEventListener('turbo:load', reset);
    document.addEventListener('pjax:end', reset);
    window.addEventListener('pageshow', (e) => { if (e.persisted) reset(); });
})();
