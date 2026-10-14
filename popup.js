(function() {
    const { getReviewsUrl, parsePlaceIdInput, resolveTheme } = globalThis.PlaceIdUtils;
    const card = document.getElementById("card");
    const form = document.getElementById("go-form");
    const field = document.getElementById("place-id");
    const error = document.getElementById("error");

    // Reuse the widget's stylesheet. Put it first so popup.html's own rules win.
    const style = document.createElement("style");
    style.textContent = globalThis.PlaceIdWidgetStyles;
    document.head.prepend(style);

    // Match the theme picked in the on-page widget. The card stays hidden until
    // the theme is applied, so the default theme never flashes first.
    function applyTheme(theme) {
        card.setAttribute("data-theme", resolveTheme(theme || "auto"));
        card.classList.add("ready");
    }

    chrome.storage.local.get({ widgetState: {} })
        .then((stored) => applyTheme(stored.widgetState.theme))
        .catch(() => applyTheme("auto"));

    field.addEventListener("input", () => {
        field.classList.remove("invalid");
        error.textContent = "";
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const placeId = parsePlaceIdInput(field.value);
        if (!placeId) {
            field.classList.add("invalid");
            error.textContent = "That doesn't look like a place ID.";
            return;
        }

        chrome.tabs.update({ url: getReviewsUrl(placeId) });
        window.close();
    });
})();
