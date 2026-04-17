(function() {
    const OVERLAY_ID = "place-id-finder-overlay";
    let lastResultKey = "";
    let lastRenderedKey = "";
    let pendingRunId = null;
    let copyResetTimerId = null;

    function getOverlay() {
        return document.getElementById(OVERLAY_ID);
    }

    function removeOverlay() {
        const overlay = getOverlay();
        if (overlay) {
            overlay.remove();
        }
        lastRenderedKey = "";
    }

    function isSupportedPage() {
        return (
            window.location.pathname === "/search" ||
            window.location.pathname.startsWith("/maps") ||
            window.location.pathname.startsWith("/travel/")
        );
    }

    function extractUniquePlaceIds() {
        const htmlText = document.documentElement.innerHTML;
        const placeIds = [];
        const regex = window.location.pathname.startsWith("/travel/")
            ? /data-place-id=\"(.*?)\" data-/g
            : /thank-you-dialog\",\"(.*?)\"/g;

        let match;

        while ((match = regex.exec(htmlText)) !== null) {
            const placeId = match[1];
            if (placeId) {
                placeIds.push(placeId);
            }
        }

        return [...new Set(placeIds)];
    }

    function resetCopyButton() {
        const overlay = getOverlay();
        if (!overlay) {
            return;
        }

        const copyButton = overlay.querySelector("[data-role='copy-button']");
        if (!copyButton) {
            return;
        }

        copyButton.textContent = "Copy";
        copyButton.style.background = "#8ab4f8";
        copyButton.style.color = "#202124";
    }

    function showCopyButtonState(label, background, color) {
        const overlay = getOverlay();
        if (!overlay) {
            return;
        }

        const copyButton = overlay.querySelector("[data-role='copy-button']");
        if (!copyButton) {
            return;
        }

        copyButton.textContent = label;
        copyButton.style.background = background;
        copyButton.style.color = color;
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

    function createOverlay() {
        const overlay = document.createElement("div");
        const label = document.createElement("div");
        const row = document.createElement("div");
        const valueField = document.createElement("input");
        const copyButton = document.createElement("button");

        overlay.id = OVERLAY_ID;
        overlay.style.position = "fixed";
        overlay.style.bottom = "10px";
        overlay.style.right = "10px";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.gap = "8px";
        overlay.style.maxWidth = "min(460px, calc(100vw - 20px))";
        overlay.style.background = "rgba(255, 255, 255, 0.86)";
        overlay.style.backdropFilter = "blur(10px)";
        overlay.style.webkitBackdropFilter = "blur(10px)";
        overlay.style.color = "#202124";
        overlay.style.padding = "12px";
        overlay.style.borderRadius = "14px";
        overlay.style.border = "1px solid rgba(60, 64, 67, 0.18)";
        overlay.style.boxShadow = "0 12px 32px rgba(60, 64, 67, 0.18)";
        overlay.style.zIndex = "999999";
        overlay.style.fontFamily = "Arial, sans-serif";

        label.setAttribute("data-role", "label");
        label.style.fontSize = "12px";
        label.style.fontWeight = "600";
        label.style.letterSpacing = "0.02em";
        label.style.color = "#3c4043";

        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "8px";

        valueField.setAttribute("data-role", "value");
        valueField.type = "text";
        valueField.readOnly = true;
        valueField.spellcheck = false;
        valueField.style.flex = "1";
        valueField.style.minWidth = "0";
        valueField.style.padding = "10px 12px";
        valueField.style.border = "1px solid rgba(95, 99, 104, 0.25)";
        valueField.style.borderRadius = "12px";
        valueField.style.background = "rgba(255, 255, 255, 0.9)";
        valueField.style.color = "#202124";
        valueField.style.fontSize = "13px";
        valueField.style.outline = "none";
        valueField.style.boxSizing = "border-box";

        valueField.addEventListener("focus", () => {
            valueField.select();
        });

        valueField.addEventListener("click", () => {
            valueField.select();
        });

        copyButton.setAttribute("data-role", "copy-button");
        copyButton.type = "button";
        copyButton.textContent = "Copy";
        copyButton.style.minWidth = "92px";
        copyButton.style.padding = "10px 16px";
        copyButton.style.border = "0";
        copyButton.style.borderRadius = "999px";
        copyButton.style.background = "#8ab4f8";
        copyButton.style.color = "#202124";
        copyButton.style.fontSize = "13px";
        copyButton.style.fontWeight = "600";
        copyButton.style.cursor = "pointer";
        copyButton.style.boxShadow = "0 1px 2px rgba(60, 64, 67, 0.2)";

        copyButton.addEventListener("click", async () => {
            try {
                await copyText(valueField.value);
                showCopyButtonState("Copied", "#0f9d58", "white");
            } catch (error) {
                console.error("❌ Failed to copy place ID:", error);
                showCopyButtonState("Retry", "#b3261e", "white");
            }

            if (copyResetTimerId !== null) {
                window.clearTimeout(copyResetTimerId);
            }

            copyResetTimerId = window.setTimeout(() => {
                resetCopyButton();
                copyResetTimerId = null;
            }, 1500);
        });

        row.appendChild(valueField);
        row.appendChild(copyButton);
        overlay.appendChild(label);
        overlay.appendChild(row);
        document.body.appendChild(overlay);
        return overlay;
    }

    function renderOverlay(placeIds) {
        const label = placeIds.length === 1 ? "Place ID" : "Place IDs";
        const copyValue = placeIds.join(", ");
        const renderKey = label + ":" + copyValue;

        if (lastRenderedKey === renderKey) {
            return;
        }

        let overlay = getOverlay();
        if (!overlay) {
            overlay = createOverlay();
        }

        overlay.querySelector("[data-role='label']").textContent = label;

        const valueField = overlay.querySelector("[data-role='value']");
        valueField.value = copyValue;
        valueField.title = copyValue;

        resetCopyButton();
        lastRenderedKey = renderKey;
    }

    function logResultOnce(resultKey, message, payload) {
        if (lastResultKey === resultKey) {
            return;
        }

        lastResultKey = resultKey;

        if (payload) {
            console.log(message, payload);
            return;
        }

        console.log(message);
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
            renderOverlay(uniquePlaceIds);
            logResultOnce(
                "ids:" + uniquePlaceIds.join(","),
                "✅ Found unique place IDs:",
                uniquePlaceIds
            );
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

    const observer = new MutationObserver(() => {
        scheduleExtraction();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    scheduleExtraction();
})();
