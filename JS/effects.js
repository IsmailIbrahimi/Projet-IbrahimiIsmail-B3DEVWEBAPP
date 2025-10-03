// effects.js — Scramble effect
(() => {
    const reduce =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const GLYPHS = "!<>-_\\/[]{}—=+*^?#________";

    const nodesMap = new WeakMap();

    function captureNodes(el) {
        const walker = document.createTreeWalker(
            el,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    return node.nodeValue.trim().length
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                },
            }
        );

        const nodes = [];
        let n;
        while ((n = walker.nextNode())) {
            nodes.push({ node: n, text: n.nodeValue });
        }
        nodesMap.set(el, {
            nodes,
            final: nodes.map((x) => x.text).join(""),
            rafId: null,
        });
    }

    function restoreNodes(el) {
        const rec = nodesMap.get(el);
        if (!rec) return;
        rec.nodes.forEach(({ node, text }) => (node.nodeValue = text));
    }

    function cancelScramble(el) {
        const rec = nodesMap.get(el);
        if (!rec) return;

        if (rec.rafId != null) {
            cancelAnimationFrame(rec.rafId);
            rec.rafId = null;
        }

        restoreNodes(el);
        el.dataset.scrambling = "0";
    }

    function scramble(el, duration = 900) {
        if (!el || reduce) return;

        if (!nodesMap.has(el)) captureNodes(el);
        const rec = nodesMap.get(el);
        if (!rec) return;

        if (el.dataset.scrambling === "1") return;
        el.dataset.scrambling = "1";

        const { nodes, final } = rec;
        const len = final.length;
        const start = performance.now();

        const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

            let out = "";
            for (let i = 0; i < len; i++) {
                const lockPoint = 0.3 + (i / len) * 0.7;
                out += ease < lockPoint
                    ? GLYPHS[(Math.random() * GLYPHS.length) | 0]
                    : final[i];
            }

            let offset = 0;
            for (const recNode of nodes) {
                const slice = out.slice(offset, offset + recNode.text.length);
                recNode.node.nodeValue = slice;
                offset += recNode.text.length;
            }

            if (t < 1) {
                rec.rafId = requestAnimationFrame(step);
            } else {
                rec.rafId = null;
                restoreNodes(el);
                el.dataset.scrambling = "0";
            }
        };

        rec.rafId = requestAnimationFrame(step);
    }

    window.markTyping = (el) => {
        if (!el) return;
    };

    window.markTyped = (el) => {
        if (!el) return;

        if (!nodesMap.has(el)) captureNodes(el);
        if (el.dataset.scrambleBound === "1") return;
        el.dataset.scrambleBound = "1";

        el.addEventListener("mouseenter", () => scramble(el));
        el.addEventListener("focus", () => scramble(el), true);
        el.addEventListener("mouseleave", () => cancelScramble(el));
        el.addEventListener("blur", () => cancelScramble(el), true);
        el.addEventListener("pointercancel", () => cancelScramble(el));
    };
})();
