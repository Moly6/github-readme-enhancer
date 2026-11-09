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
// @icon         data:image/png;base64,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
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
