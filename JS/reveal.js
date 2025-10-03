(() => {
    const onReady = (fn) =>
        document.readyState === "loading"
            ? document.addEventListener("DOMContentLoaded", fn)
            : fn();

    onReady(() => {
        const root = document.querySelector("#projects") || document;
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => e.isIntersecting && e.target.classList.add("in"));
        }, { threshold: 0.1 });

        const applyReveal = (scope) => {
            const items = [...scope.querySelectorAll(".card, .reveal-up, .section h2, .page-title")];
            items.forEach((el, i) => {
                el.classList.add("reveal-up");
                el.style.setProperty("--i", i);
                io.observe(el);
            });
        };

        applyReveal(document);

        const proj = document.querySelector("#projects");
        if (proj) {
            new MutationObserver(() => applyReveal(proj))
                .observe(proj, { childList: true, subtree: true });
        }
    });
})();
