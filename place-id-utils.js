// Shared by content.js and popup.js.
globalThis.PlaceIdUtils = (function() {
    function isValidPlaceId(value) {
        return /^[A-Za-z0-9_-]+$/.test(value);
    }

    function getReviewsUrl(placeId) {
        return "https://search.google.com/local/reviews?placeid=" + encodeURIComponent(placeId);
    }

    function getWriteReviewUrl(placeId) {
        return "https://search.google.com/local/writereview?placeid=" + encodeURIComponent(placeId);
    }

    // Accepts a bare place ID, or a link that carries one
    // (placeid=…, place_id=…, or place_id:… as in Maps "?q=place_id:…").
    function parsePlaceIdInput(input) {
        const value = (input || "").trim();

        if (isValidPlaceId(value)) {
            return value;
        }

        let decoded = value;
        try {
            decoded = decodeURIComponent(value);
        } catch (error) {
            // Keep the raw value if it isn't valid URI encoding.
        }

        const match = decoded.match(/place_?id[=:]([A-Za-z0-9_-]+)/i);
        return match ? match[1] : null;
    }

    // Widget/popup themes; styles live in widget-styles.js.
    const THEMES = [
        { id: "auto", name: "Auto", swatch: "linear-gradient(135deg, #f6f3ee 50%, #2a2b2f 50%)" },
        { id: "classic", name: "Sculpted", swatch: "linear-gradient(135deg, #f6f3ee 60%, #86b0f6 60%)" },
        { id: "chiclet", name: "Backlit", swatch: "linear-gradient(135deg, #2a2b2f 60%, #8ab4f8 60%)" },
        { id: "retro", name: "Retro", swatch: "linear-gradient(135deg, #e2d7bb 60%, #d9681f 60%)" },
        { id: "brutal", name: "Brutalist", swatch: "linear-gradient(135deg, #fffbea 60%, #ffd23f 60%)" }
    ];

    const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // "auto" follows the browser's light/dark preference.
    function resolveTheme(theme) {
        if (theme === "auto") {
            return darkScheme.matches ? "chiclet" : "classic";
        }
        return THEMES.some((option) => option.id === theme) ? theme : "classic";
    }

    return {
        isValidPlaceId, getReviewsUrl, getWriteReviewUrl, parsePlaceIdInput, THEMES, darkScheme, resolveTheme
    };
})();
