# Chrome Web Store Submission Notes

## Suggested single purpose

Extract and copy place IDs from supported Search, Maps, and Travel pages automatically when those pages load.

## Permissions justification

No extension permissions are requested. The extension relies on a declarative content script limited to supported page URLs.

## Remote code declaration

No. The extension does not execute remote code.

## Suggested reviewer instructions

1. Load the extension.
2. Open a supported page such as a Search, Maps, or Travel page on `https://www.google.com`.
3. Confirm that an overlay appears in the lower-right corner showing `Place ID` or `Place IDs` without any user click.
4. Confirm that clicking the `Copy` button copies the displayed value.
5. Confirm that unsupported pages are ignored because the content script only matches the supported URLs.

## Suggested short description

Extract and copy place IDs from supported Search, Maps, and Travel pages.

## Suggested detailed description

Place ID finder helps you quickly extract and copy place IDs from supported Search, Maps, and Travel pages.

When a supported page loads, the extension scans the current page and shows the detected place ID directly on the page. A built-in copy control lets the user copy the extracted value without manually selecting text. The extension is designed for a narrow single purpose and runs only on the supported URLs declared in its manifest.

## Still required in the dashboard

- Upload at least one screenshot
- Upload a 440x280 promo tile
- Add a public privacy policy URL
- Fill in your support contact details
