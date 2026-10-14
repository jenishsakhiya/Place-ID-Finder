# Chrome Web Store Submission Notes

## Suggested single purpose

Find, copy and open Google place IDs on supported Search and Travel pages.

## Permissions justification

The extension relies on a declarative content script limited to supported page URLs.

- `storage`: saves the on-device history of place IDs the extension has found, and the user's widget settings (theme, selected tab). Nothing is sent off the device.

## Remote code declaration

No. The extension does not execute remote code.

## Suggested reviewer instructions

1. Load the extension.
2. Open a supported page such as a Search or Travel page on `https://www.google.com`.
3. Confirm that a widget appears in the lower-right corner showing the place ID without any user click.
4. Confirm that clicking the Copy key copies the displayed value.
5. Open the History tab and confirm the place ID is listed; Clear history removes it.
6. Click the toolbar icon, paste a place ID and press Go; the current tab opens that place's reviews page.
7. Confirm that unsupported pages are ignored because the content script only matches the supported URLs.

## Suggested short description

Find, copy and open Google place IDs on supported Search and Travel pages.

## Suggested detailed description

Place ID finder helps you quickly find, copy and open place IDs on supported Google Search and Travel pages.

When a supported page loads, the extension scans the current page and shows the detected place ID in a small widget on the page. From the widget you can copy the ID, open the place's reviews, jump to another place by its ID, and browse a history of IDs you've found, which you can export as CSV. The toolbar button opens any place ID's reviews page. The widget comes in several themes.

History and settings are stored only on your device. The extension runs only on the supported URLs declared in its manifest.

## Still required in the dashboard

- Upload at least one screenshot
- Upload a 440x280 promo tile
- Add a public privacy policy URL
- Fill in your support contact details
