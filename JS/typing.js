// typing.js
(() => {
    const REDUCED =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const WORD_RE = /[A-Za-zÀ-ÖØ-öø-ÿ0-9’'-]{2,}/g;

    const PALETTES = [
        ["#3B82F6", "#F472B6"],                  // bleu → rose
        ["#2563EB", "#FFFFFF", "#EF4444"],       // bleu → blanc → rouge
        ["#22D3EE", "#818CF8"],                  // cyan → indigo
        ["#F472B6", "#60A5FA", "#34D399"],       // rose → bleu → vert
        ["#A78BFA", "#F472B6"],                  // violet → rose
        ["#14B8A6", "#F59E0B", "#EF4444"],       // teal → ambre → rouge
        ["#06B6D4", "#4F46E5"],                  // cyan → indigo foncé
        ["#00C6FF", "#F0ABFC"]                   // bleu clair → rose pastel
    ];
    const rand = (n) => Math.floor(Math.random() * n);

    document.addEventListener("DOMContentLoaded", initTyping);

    function initTyping() {
        if (REDUCED) return;

        const titleSel = [
            ".page-header .page-title",
            ".page-header h1",
            ".hero .page-title",
            ".hero .hero-title",
            ".hero h1",
            ".hero .display-1",
            ".hero .display-2",
            ".hero .display-3",
            ".hero .display-4",
            ".hero .display-5",
            ".hero .display-6",
            "main h1"
        ].join(", ");

        const subSel = [
            ".page-header .page-subtitle",
            ".page-header p.lead",
            ".hero .page-subtitle",
            ".hero .lead",
            ".hero p.lead",
            "main p.lead"
        ].join(", ");

        const titleEl = document.querySelector(titleSel);
        const subEl = document.querySelector(subSel);

        if (!titleEl) {
            console.warn("[typing.js] Aucun titre trouvé (page-header/hero/display-x).");
            return;
        }
        if (titleEl.dataset.typedDone === "1") return;

        const region = titleEl.closest(".page-header, .hero") || titleEl.parentElement;
        if (region && !region.hasAttribute("aria-live")) region.setAttribute("aria-live", "polite");

        const titleText = (titleEl.textContent || "").trim();
        const subText = (subEl?.textContent || "").trim();

        titleEl.textContent = "";
        if (subEl) subEl.textContent = "";

        (async () => {
            await typeLineWithGlow(titleEl, titleText, { speed: 55, jitter: 18, glowRatio: 0.6 });
            await sleep(220);
            if (subEl && subText) {
                await typeLineWithGlow(subEl, subText, { speed: 52, jitter: 14, glowRatio: 0.55 });
            }

            if (typeof window.markTyped === "function") {
                window.markTyped(titleEl);
                if (subEl) window.markTyped(subEl);
            }

            const restore = () => restoreGlowIfStripped(titleEl);
            titleEl.addEventListener("mouseleave", restore);
            titleEl.addEventListener("blur", restore, true);
            if (subEl) {
                const restore2 = () => restoreGlowIfStripped(subEl);
                subEl.addEventListener("mouseleave", restore2);
                subEl.addEventListener("blur", restore2, true);
            }

            titleEl.dataset.typedDone = "1";
        })().catch(err => {
            console.error("[typing.js] ", err);
            titleEl.textContent = titleText;
            if (subEl) subEl.textContent = subText;
        });
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    function tokenize(text) {
        const tokens = [];
        let last = 0, m;
        while ((m = WORD_RE.exec(text))) {
            if (m.index > last) tokens.push({ type: "sep", text: text.slice(last, m.index) });
            tokens.push({ type: "word", text: m[0] });
            last = m.index + m[0].length;
        }
        if (last < text.length) tokens.push({ type: "sep", text: text.slice(last) });
        return tokens;
    }

    function makeGlowSpan() {
        const span = document.createElement("span");
        span.className = "glow-word scramble";
        const palette = PALETTES[rand(PALETTES.length)].slice();
        if (palette.length === 2 && Math.random() < 0.3) {
            palette.splice(1, 0, palette[1]);
        }
        span.style.backgroundImage = `linear-gradient(90deg, ${palette.join(",")})`;
        span.style.backgroundSize = "200% 100%";
        span.style.setProperty("--glowB", palette[palette.length - 1]);
        return span;
    }

    function buildSkeleton(container, text, glowRatio = 0.6) {
        const tokens = tokenize(text);
        const nodes = [];
        for (const t of tokens) {
            if (t.type === "sep") {
                const tn = document.createTextNode("");
                container.appendChild(tn);
                nodes.push({ el: tn, text: t.text });
            } else {
                const useGlow = Math.random() < glowRatio;
                if (useGlow) {
                    const span = makeGlowSpan();
                    span.textContent = "";
                    container.appendChild(span);
                    nodes.push({ el: span, text: t.text, glow: true });
                } else {
                    const tn = document.createTextNode("");
                    container.appendChild(tn);
                    nodes.push({ el: tn, text: t.text, glow: false });
                }
            }
        }
        return nodes;
    }

    async function typeLineWithGlow(el, text, { speed = 55, jitter = 0, glowRatio = 0.6 } = {}) {
        el.textContent = "";
        const nodes = buildSkeleton(el, text, glowRatio);
        for (const n of nodes) {
            const s = n.text || "";
            for (let i = 0; i < s.length; i++) {
                n.el.textContent += s[i];
                const delay = speed + (jitter ? (Math.random() * jitter - jitter / 2) : 0);
                await sleep(Math.max(14, delay));
            }
        }
    }

    function restoreGlowIfStripped(container) {
        if (container.querySelector && container.querySelector(".glow-word")) return;
        const text = (container.textContent || "").trim();
        container.textContent = "";
        const nodes = buildSkeleton(container, text, 0.6);
        for (const n of nodes) n.el.textContent = n.text;
    }
})();
