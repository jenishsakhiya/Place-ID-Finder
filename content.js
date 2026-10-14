(function() {
    const OVERLAY_ID = "place-id-finder-overlay";
    const HISTORY_KEY = "history";
    const WIDGET_STATE_KEY = "widgetState";
    const HISTORY_LIMIT = 200;
    const {
        isValidPlaceId, getReviewsUrl, getWriteReviewUrl, parsePlaceIdInput, THEMES, darkScheme, resolveTheme
    } = globalThis.PlaceIdUtils;

    const ICONS = {
        minimize: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"><path d="M5 12h14"></path></svg>',
        expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4"><path d="M6 15l6-6 6 6"></path></svg>',
        copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h8"></path></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.6"><path d="M5 12l5 5 9-10"></path></svg>',
        open: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"></path></svg>',
        star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"></path></svg>',
        pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4z"></path><path d="M14 6l4 4"></path></svg>',
        settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"></path></svg>'
    };


    let lastResultKey = "";
    let lastRenderedKey = "";
    let pendingRunId = null;
    let ui = null;
    let currentPlaceIds = [];
    let currentPageName = "";
    let historyFilter = "";
    let widgetState = { tab: "page", minimized: false, theme: "auto" };

    function isSupportedPage() {
        return (
            window.location.pathname === "/search" ||
            window.location.pathname.startsWith("/travel/")
        );
    }

    function getPageSource() {
        if (window.location.pathname.startsWith("/travel/")) {
            return "Travel";
        }
        return "Search";
    }

    // Best-effort place name from the tab title, e.g. "Google Sydney - Google Search".
    function getPageName() {
        const name = document.title.replace(/\s+[-–|]\s+Google\b.*$/, "").trim();
        return /^Google( (Maps|Search|Travel|Hotels))?$/i.test(name) ? "" : name;
    }

    function extractUniquePlaceIds() {
        const placeIds = [];

        if (window.location.pathname.startsWith("/travel/")) {
            document.querySelectorAll("[data-place-id]").forEach((element) => {
                const placeId = element.getAttribute("data-place-id").trim();
                if (isValidPlaceId(placeId)) {
                    placeIds.push(placeId);
                }
            });

            return [...new Set(placeIds)];
        }

        const htmlText = document.documentElement.innerHTML;
        const regex = /thank-you-dialog\",\"(.*?)\"/g;

        let match;

        while ((match = regex.exec(htmlText)) !== null) {
            const placeId = match[1];
            if (placeId) {
                placeIds.push(placeId);
            }
        }

        return [...new Set(placeIds)];
    }

    // chrome.storage throws once the extension is reloaded under an open tab.
    async function storageGet(defaults) {
        try {
            return await chrome.storage.local.get(defaults);
        } catch (error) {
            console.warn("Place ID finder storage unavailable.", error);
            return defaults;
        }
    }

    async function storageSet(values) {
        try {
            await chrome.storage.local.set(values);
        } catch (error) {
            console.warn("Place ID finder storage unavailable.", error);
        }
    }

    async function loadHistory() {
        const stored = await storageGet({ [HISTORY_KEY]: [] });
        return Array.isArray(stored[HISTORY_KEY]) ? stored[HISTORY_KEY] : [];
    }

    async function recordHistory(placeIds, name, source) {
        let history = await loadHistory();
        const now = Date.now();

        placeIds.slice().reverse().forEach((placeId) => {
            const existing = history.find((entry) => entry.id === placeId);
            history = history.filter((entry) => entry.id !== placeId);
            history.unshift({
                id: placeId,
                name: name || (existing && existing.name) || "",
                source,
                seenAt: now
            });
        });

        await storageSet({ [HISTORY_KEY]: history.slice(0, HISTORY_LIMIT) });
    }

    async function copyText(text) {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            try {
                await navigator.clipboard.writeText(text);
                return;
            } catch (error) {
                console.warn("Clipboard API copy failed, falling back to execCommand.", error);
            }
        }

        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand("copy");
        } finally {
            textarea.remove();
        }
    }

    function el(tag, props, children) {
        const node = document.createElement(tag);
        Object.entries(props || {}).forEach(([key, value]) => {
            if (key === "className") {
                node.className = value;
            } else if (key === "text") {
                node.textContent = value;
            } else if (key === "html") {
                node.innerHTML = value;
            } else if (key.startsWith("on")) {
                node.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                node.setAttribute(key, value);
            }
        });
        (children || []).forEach((child) => child && node.appendChild(child));
        return node;
    }

    function icon(name) {
        return el("span", { className: "icon", "aria-hidden": "true", html: ICONS[name] });
    }

    // A keycap button, or a keycap link when `href` is given.
    function key({ href, label, iconName, legend, className }) {
        const attrs = { className: "key " + (className || ""), "aria-label": label, title: label };
        Object.assign(attrs, href ? { href } : { type: "button" });

        return el(href ? "a" : "button", attrs, [
            legend ? el("span", { className: "legend", "aria-hidden": "true", text: legend }) : null,
            icon(iconName)
        ]);
    }

    function keyGroup(keyNode, caption) {
        return el("div", { className: "key-group" }, [
            keyNode,
            el("span", { className: "caption", "aria-hidden": "true", text: caption })
        ]);
    }

    // Copies text and briefly swaps the control into its success/failure state.
    async function copyWithFeedback(button, text, statusEl) {
        const iconEl = button.querySelector(".icon");
        const original = iconEl ? iconEl.innerHTML : button.textContent;
        let copied = true;

        try {
            await copyText(text);
        } catch (error) {
            console.error("❌ Failed to copy place ID:", error);
            copied = false;
        }

        if (iconEl) {
            iconEl.innerHTML = copied ? ICONS.check : original;
        } else {
            button.textContent = copied ? "Copied" : "Retry";
        }

        button.classList.remove("ok", "err");
        void button.offsetWidth; // restart the theme's success animation
        button.classList.add(copied ? "ok" : "err");

        if (statusEl) {
            statusEl.textContent = copied ? "Copied" : "Copy failed";
            statusEl.classList.toggle("ok", copied);
        }

        window.clearTimeout(button._resetTimerId);
        button._resetTimerId = window.setTimeout(() => {
            if (iconEl) {
                iconEl.innerHTML = original;
            } else {
                button.textContent = original;
            }
            button.classList.remove("ok", "err");

            if (statusEl) {
                statusEl.textContent = "Ready";
                statusEl.classList.remove("ok");
            }
        }, 1500);
    }

    function placeItem(name, placeId, meta) {
        const copyKey = key({ label: "Copy place ID", iconName: "copy", className: "small" });
        copyKey.addEventListener("click", () => copyWithFeedback(copyKey, placeId));

        return el("div", { className: "item" }, [
            el("div", { className: "item-main" }, [
                el("div", { className: "item-title" }, [
                    el("span", { className: "item-name truncate", text: name || "Unnamed place", title: name || "" }),
                    meta ? el("span", { className: "item-meta", text: meta }) : null
                ]),
                el("div", { className: "item-id mono truncate", text: placeId, title: placeId })
            ]),
            copyKey,
            key({ href: getReviewsUrl(placeId), label: "Open reviews", iconName: "open", className: "small" })
        ]);
    }

    function renderPagePanel() {
        const panel = ui.panels.page;
        panel.replaceChildren();
        ui.shortcuts = {};

        if (currentPlaceIds.length === 1) {
            const placeId = currentPlaceIds[0];
            const name = currentPageName || "Place ID";
            const status = el("span", { className: "display-status", "aria-live": "polite", text: "Ready" });
            const copyKey = key({ label: "Copy place ID (C)", iconName: "copy", legend: "C", className: "wide accent" });
            const reviewsKey = key({ href: getReviewsUrl(placeId), label: "Open reviews (R)", iconName: "star", legend: "R" });
            const writeKey = key({ href: getWriteReviewUrl(placeId), label: "Write a review (W)", iconName: "pen", legend: "W" });

            copyKey.addEventListener("click", () => copyWithFeedback(copyKey, placeId, status));
            ui.shortcuts = { c: copyKey, r: reviewsKey, w: writeKey };

            panel.append(
                el("div", { className: "display" }, [
                    el("div", { className: "display-top" }, [
                        el("span", { className: "display-name truncate", text: name, title: name }),
                        el("span", { className: "display-source", text: getPageSource() }),
                        el("span", { className: "spacer" }),
                        status
                    ]),
                    el("div", { className: "display-id truncate", text: placeId, title: placeId })
                ]),
                el("div", { className: "keys" }, [
                    keyGroup(copyKey, "Copy"),
                    keyGroup(reviewsKey, "Reviews"),
                    keyGroup(writeKey, "Write")
                ])
            );
            return;
        }

        const copyAllButton = el("button", { type: "button", className: "btn primary", text: "Copy all", title: "Copy all place IDs (C)" });
        copyAllButton.addEventListener("click", () => copyWithFeedback(copyAllButton, currentPlaceIds.join(", ")));
        ui.shortcuts = { c: copyAllButton };

        panel.append(
            el("div", { className: "row" }, [
                el("div", { className: "heading truncate spacer", text: currentPlaceIds.length + " places on this page" }),
                copyAllButton
            ]),
            el("div", { className: "list" }, currentPlaceIds.map((placeId, index) => placeItem("Place " + (index + 1), placeId, "")))
        );
    }

    function buildGoPanel() {
        const field = el("input", {
            id: "pif-go",
            type: "text",
            className: "field mono",
            placeholder: "Paste a place ID",
            spellcheck: "false",
            autocomplete: "off"
        });
        const error = el("div", { className: "error", "aria-live": "polite" });

        field.addEventListener("input", () => {
            field.classList.remove("invalid");
            error.textContent = "";
        });

        const form = el("form", { className: "panel" }, [
            el("label", { className: "label", for: "pif-go", text: "Place ID" }),
            el("div", { className: "row" }, [
                field,
                el("button", { type: "submit", className: "btn primary tall", text: "Go" })
            ]),
            error
        ]);

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const placeId = parsePlaceIdInput(field.value);
            if (!placeId) {
                field.classList.add("invalid");
                error.textContent = "That doesn't look like a place ID.";
                return;
            }

            window.location.assign(getReviewsUrl(placeId));
        });

        return form;
    }

    function buildHistoryPanel() {
        const search = el("input", {
            type: "search",
            className: "field small",
            placeholder: "Search by name or ID",
            "aria-label": "Search history"
        });
        const list = el("div", { className: "list" });
        const clearButton = el("button", { type: "button", className: "btn danger", text: "Clear history" });
        const exportButton = el("button", { type: "button", className: "btn", text: "Export CSV" });

        search.addEventListener("input", () => {
            historyFilter = search.value;
            renderHistoryList();
        });

        clearButton.addEventListener("click", async () => {
            if (window.confirm("Clear all saved place IDs?")) {
                await storageSet({ [HISTORY_KEY]: [] });
                renderHistoryList();
            }
        });

        exportButton.addEventListener("click", async () => {
            downloadCsv(await loadHistory());
        });

        ui.historyList = list;

        return el("div", { className: "panel" }, [
            search,
            list,
            el("div", { className: "footer" }, [clearButton, exportButton])
        ]);
    }

    async function renderHistoryList() {
        if (!ui || !ui.historyList) {
            return;
        }

        const query = historyFilter.trim().toLowerCase();
        const history = (await loadHistory()).filter((entry) =>
            !query ||
            entry.id.toLowerCase().includes(query) ||
            (entry.name || "").toLowerCase().includes(query)
        );

        if (!ui) {
            return;
        }

        ui.historyList.replaceChildren(
            ...(history.length
                ? history.map((entry) => placeItem(entry.name, entry.id, entry.source))
                : [el("div", { className: "empty", text: query ? "No matches." : "No place IDs saved yet." })])
        );
    }

    function csvField(value) {
        const text = String(value == null ? "" : value);
        return /[",\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
    }

    function downloadCsv(history) {
        const rows = [["place_id", "name", "source", "seen_at", "reviews_url"]].concat(
            history.map((entry) => [
                entry.id,
                entry.name,
                entry.source,
                new Date(entry.seenAt).toISOString(),
                getReviewsUrl(entry.id)
            ])
        );
        const csv = rows.map((row) => row.map(csvField).join(",")).join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        const link = el("a", {
            href: url,
            download: "place-ids-" + new Date().toISOString().slice(0, 10) + ".csv"
        });

        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    function buildSettingsPanel() {
        const grid = el("div", { className: "themes" });
        ui.themeButtons = {};

        THEMES.forEach((theme) => {
            const swatch = el("span", { className: "swatch", "aria-hidden": "true" });
            swatch.style.background = theme.swatch;

            const button = el("button", { type: "button", className: "theme-option", "aria-pressed": "false" }, [
                swatch,
                el("span", { text: theme.name })
            ]);
            button.addEventListener("click", () => setTheme(theme.id));

            ui.themeButtons[theme.id] = button;
            grid.appendChild(button);
        });

        return el("div", { className: "panel" }, [el("div", { className: "label", text: "Theme" }), grid]);
    }

    function applyTheme() {
        if (!ui) {
            return;
        }

        ui.card.setAttribute("data-theme", resolveTheme(widgetState.theme));
        Object.entries(ui.themeButtons).forEach(([id, button]) => {
            button.setAttribute("aria-pressed", String(id === widgetState.theme));
        });
    }

    function setTheme(theme) {
        widgetState.theme = theme;
        applyTheme();
        saveWidgetState();
    }

    function saveWidgetState() {
        storageSet({ [WIDGET_STATE_KEY]: widgetState });
    }

    function setTab(tab) {
        if (tab !== "settings") {
            ui.previousTab = tab;
        }

        widgetState.tab = tab;
        Object.entries(ui.tabs).forEach(([id, button]) => {
            button.setAttribute("aria-selected", String(id === tab));
        });
        ui.settingsKey.setAttribute("aria-pressed", String(tab === "settings"));
        Object.entries(ui.panels).forEach(([id, panel]) => {
            panel.hidden = id !== tab;
        });

        if (tab === "history") {
            renderHistoryList();
        }

        if (widgetState.minimized) {
            setMinimized(false);
        }

        saveWidgetState();
    }

    function setMinimized(minimized) {
        const label = minimized ? "Expand (Esc)" : "Minimize (Esc)";

        widgetState.minimized = minimized;
        ui.card.classList.toggle("minimized", minimized);
        ui.minimizeKey.querySelector(".icon").innerHTML = minimized ? ICONS.expand : ICONS.minimize;
        ui.minimizeKey.setAttribute("aria-label", label);
        ui.minimizeKey.title = label;
        saveWidgetState();
    }

    // Shortcuts only fire while focus is inside the widget, so they never
    // clash with Google's own page shortcuts.
    function handleShortcut(event) {
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }

        const target = event.composedPath()[0];
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            setMinimized(!widgetState.minimized);
            return;
        }

        if (widgetState.minimized || widgetState.tab !== "page") {
            return;
        }

        const control = ui.shortcuts[event.key.toLowerCase()];
        if (control) {
            event.preventDefault();
            control.click();
        }
    }

    function createOverlay() {
        const host = el("div", { id: OVERLAY_ID });
        const root = host.attachShadow({ mode: "open" });

        ui = { host, tabs: {}, panels: {}, shortcuts: {}, previousTab: "page" };

        const tabBar = el("div", { className: "tabs", role: "tablist" });
        [["page", "This page"], ["go", "Go to"], ["history", "History"]].forEach(([id, label]) => {
            const button = el("button", { type: "button", className: "tab", role: "tab", text: label });
            button.addEventListener("click", () => setTab(id));
            ui.tabs[id] = button;
            tabBar.appendChild(button);
        });

        ui.settingsKey = key({ label: "Theme", iconName: "settings", className: "small" });
        ui.settingsKey.addEventListener("click", () => {
            setTab(widgetState.tab === "settings" ? ui.previousTab : "settings");
        });

        ui.minimizeKey = key({ label: "Minimize (Esc)", iconName: "minimize", className: "small" });
        ui.minimizeKey.addEventListener("click", () => setMinimized(!widgetState.minimized));
        tabBar.append(el("div", { className: "spacer" }), ui.settingsKey, ui.minimizeKey);

        ui.panels.page = el("div", { className: "panel" });
        ui.panels.go = buildGoPanel();
        ui.panels.history = buildHistoryPanel();
        ui.panels.settings = buildSettingsPanel();

        // tabindex lets a click anywhere in the widget give it focus for shortcuts.
        ui.card = el("div", { className: "card", tabindex: "-1" }, [
            tabBar,
            el("div", { className: "body" }, [ui.panels.page, ui.panels.go, ui.panels.history, ui.panels.settings])
        ]);

        // Keep Google's page-level keyboard shortcuts from grabbing typing in the widget.
        ["keydown", "keypress", "keyup"].forEach((type) => {
            ui.card.addEventListener(type, (event) => event.stopPropagation());
        });
        ui.card.addEventListener("keydown", handleShortcut);

        root.append(el("style", { text: globalThis.PlaceIdWidgetStyles }), ui.card);
        document.body.appendChild(host);

        const startMinimized = widgetState.minimized;
        applyTheme();
        setTab(widgetState.tab === "settings" ? "page" : widgetState.tab);
        setMinimized(startMinimized);
    }

    function removeOverlay() {
        if (ui) {
            ui.host.remove();
            ui = null;
        }
        lastRenderedKey = "";
    }

    function renderOverlay(placeIds, pageName) {
        const renderKey = pageName + ":" + placeIds.join(",");

        if (ui && !document.body.contains(ui.host)) {
            ui = null;
        }

        if (ui && lastRenderedKey === renderKey) {
            return;
        }

        currentPlaceIds = placeIds;
        currentPageName = pageName;

        if (!ui) {
            createOverlay();
        }

        renderPagePanel();
        lastRenderedKey = renderKey;
    }

    function logResultOnce(resultKey, message, payload) {
        if (lastResultKey === resultKey) {
            return false;
        }

        lastResultKey = resultKey;

        if (payload) {
            console.log(message, payload);
            return true;
        }

        console.log(message);
        return true;
    }

    function runExtraction() {
        pendingRunId = null;

        if (!isSupportedPage()) {
            removeOverlay();
            logResultOnce("unsupported", "⚠️ Unsupported page for Place ID finder.");
            return;
        }

        const uniquePlaceIds = extractUniquePlaceIds();

        if (uniquePlaceIds.length > 0) {
            const pageName = uniquePlaceIds.length === 1 ? getPageName() : "";
            renderOverlay(uniquePlaceIds, pageName);

            const isNewResult = logResultOnce(
                "ids:" + uniquePlaceIds.join(","),
                "✅ Found unique place IDs:",
                uniquePlaceIds
            );
            if (isNewResult) {
                recordHistory(uniquePlaceIds, pageName, getPageSource());
            }
            return;
        }

        removeOverlay();
        logResultOnce("none", "❌ No Place ID found.");
    }

    function scheduleExtraction() {
        if (pendingRunId !== null) {
            return;
        }

        pendingRunId = window.setTimeout(runExtraction, 250);
    }

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== "local") {
            return;
        }

        if (changes[HISTORY_KEY] && widgetState.tab === "history") {
            renderHistoryList();
        }

        // Keep the theme in sync when it's changed from another tab.
        const newState = changes[WIDGET_STATE_KEY] && changes[WIDGET_STATE_KEY].newValue;
        if (newState && newState.theme && newState.theme !== widgetState.theme) {
            widgetState.theme = newState.theme;
            applyTheme();
        }
    });

    darkScheme.addEventListener("change", applyTheme);

    const observer = new MutationObserver(() => {
        scheduleExtraction();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    storageGet({ [WIDGET_STATE_KEY]: widgetState }).then((stored) => {
        widgetState = Object.assign({}, widgetState, stored[WIDGET_STATE_KEY]);
        scheduleExtraction();
    });
})();
