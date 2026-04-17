(function() {
    const htmlText = document.documentElement.innerHTML;

    // Regex for Google Place ID
    const regex = /thank-you-dialog\",\"(.*?)\"/g;

    let match;
    const placeIds = [];

    while ((match = regex.exec(htmlText)) !== null) {
        const placeId = match[1];
        if (placeId) {
            placeIds.push(placeId);
        }
    }

    const uniquePlaceIds = [...new Set(placeIds)];

    if (uniquePlaceIds.length > 0) {
        console.log("✅ Found unique Place IDs:", uniquePlaceIds);

        // Optional: show in page
        const div = document.createElement("div");
        div.style.position = "fixed";
        div.style.bottom = "10px";
        div.style.right = "10px";
        div.style.background = "#202124";
        div.style.color = "white";
        div.style.padding = "10px";
        div.style.borderRadius = "8px";
        div.style.zIndex = "999999";
        div.innerText = "Place IDs: " + uniquePlaceIds.join(", ");
        document.body.appendChild(div);
    } else {
        console.log("❌ No Place ID found.");
    }
})();
