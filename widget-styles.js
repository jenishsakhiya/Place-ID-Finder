// Widget stylesheet, injected into the widget's shadow root by content.js.
// Layout lives in the base rules; each theme sets the custom properties
// below and adds a few overrides of its own.
globalThis.PlaceIdWidgetStyles = `
    :host { all: initial; }
    *, *::before, *::after { box-sizing: border-box; }
    button, input { font: inherit; color: inherit; margin: 0; }
    a { color: inherit; }
    :focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }

    .card {
        position: fixed; bottom: 10px; right: 10px; z-index: 999999;
        width: 452px; max-width: calc(100vw - 20px);
        display: flex; flex-direction: column; gap: 14px;
        padding: 12px 16px 18px;
        background: var(--card-bg); border: var(--card-border); border-radius: var(--card-radius);
        box-shadow: var(--card-shadow);
        backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        color: var(--text); font-family: var(--font); font-size: 13px; line-height: 1.35;
    }
    .card:focus { outline: none; }
    .card.minimized { padding-bottom: 12px; }
    .card.minimized .body { display: none; }

    .tabs { position: relative; display: flex; align-items: center; gap: 8px; min-width: 0; }
    .tab, .btn {
        flex-shrink: 0; height: 32px; padding: 0 12px;
        display: inline-flex; align-items: center; justify-content: center;
        border: var(--tab-border); border-radius: var(--tab-radius);
        background: var(--tab-bg); box-shadow: var(--tab-shadow);
        color: var(--muted); font-size: 12px; font-weight: 600; white-space: nowrap; text-decoration: none;
        cursor: pointer; transition: transform 0.09s ease, box-shadow 0.09s ease, color 0.15s, background 0.15s;
    }
    .tab:hover, .btn:hover { color: var(--text); }
    .tab[aria-selected="true"], .btn:active {
        transform: var(--tab-on-transform); box-shadow: var(--tab-on-shadow);
        background: var(--tab-on-bg); color: var(--tab-on-color);
    }
    .btn { min-width: 84px; color: var(--text); }
    .btn.tall { height: 40px; }
    .btn.primary { background: var(--accent-bg); border: var(--accent-border); color: var(--accent-color); }
    .btn.danger { color: var(--danger); }
    .btn.ok, .btn.ok:hover { background: var(--ok-bg); border: var(--ok-border); color: var(--ok-color); }
    .btn.err, .btn.err:hover { color: var(--danger); }

    .spacer { flex: 1; min-width: 0; }
    .body { min-height: 120px; min-width: 0; }
    .panel { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
    .panel[hidden] { display: none; }
    .row { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .mono { font-family: var(--mono); }
    .truncate { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .heading { font-size: 15px; font-weight: 600; }
    .label { font-size: 11px; font-weight: 600; letter-spacing: 0.04em; color: var(--muted); }

    .key {
        position: relative; isolation: isolate; flex-shrink: 0;
        width: 52px; height: 52px; padding: 0;
        display: flex; align-items: center; justify-content: center;
        border: var(--key-border); border-radius: var(--key-radius);
        background: var(--key-bg); box-shadow: var(--key-shadow); color: var(--key-color);
        text-decoration: none; cursor: pointer;
        transition: transform 0.09s ease, box-shadow 0.09s ease, background 0.2s, color 0.2s;
    }
    .key:hover { transform: var(--key-hover-transform); box-shadow: var(--key-shadow-hover); }
    .key:active { transform: var(--key-active-transform); box-shadow: var(--key-shadow-active); }
    .key.wide { width: 100px; }
    .key.small { width: 32px; height: 32px; border-radius: var(--key-radius-small); box-shadow: var(--key-shadow-small); }
    .key.small:hover { transform: none; box-shadow: var(--key-shadow-small); }
    .key.small:active, .key.small[aria-pressed="true"] { transform: var(--key-active-transform-small); box-shadow: var(--key-shadow-small-active); }
    .key.accent { background: var(--accent-bg); border: var(--accent-border); color: var(--accent-color); box-shadow: var(--accent-shadow); }
    .key.accent:active { box-shadow: var(--accent-shadow-active); }
    .key.ok, .key.ok:hover {
        background: var(--ok-bg); border: var(--ok-border); color: var(--ok-color);
        box-shadow: var(--ok-shadow); transform: var(--ok-transform); animation: var(--ok-animation);
    }
    .icon { display: flex; }
    .icon svg { width: 20px; height: 20px; }
    .key.small .icon svg { width: 16px; height: 16px; }
    /* Shortcut letters only show while the widget has focus, which is when the shortcuts work. */
    .legend {
        position: absolute; top: 4px; left: 7px; pointer-events: none;
        font: 600 9px var(--mono); color: var(--legend-color);
        opacity: 0; transition: opacity 0.15s ease;
    }
    .card:focus-within .legend { opacity: 1; }
    .key.accent .legend { color: var(--accent-legend); }
    .key.small .legend { display: none; }

    .keys { display: flex; align-items: flex-start; gap: 14px; padding: 2px 0 6px; }
    .key-group { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .caption {
        display: var(--caption-display);
        font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted);
    }

    .display {
        position: relative; overflow: hidden;
        display: flex; flex-direction: column; gap: 3px; padding: 10px 14px;
        border: var(--display-border); border-radius: var(--display-radius);
        background: var(--display-bg); box-shadow: var(--display-shadow);
        color: var(--display-color); font-family: var(--display-font); text-shadow: var(--display-glow);
    }
    .display-top { display: flex; align-items: baseline; gap: 8px; min-width: 0; }
    .display-name { font-size: 14px; font-weight: 600; }
    .display-source, .display-status { flex-shrink: 0; font-size: 11px; color: var(--display-muted); }
    .display-id { font-family: var(--mono); font-size: 15px; color: var(--display-id-color); }
    .display-status.ok { color: var(--display-ok); }

    .field {
        flex: 1; min-width: 0; height: 40px; padding: 0 12px; outline: none;
        border: var(--field-border); border-radius: var(--field-radius);
        background: var(--field-bg); box-shadow: var(--field-shadow); color: var(--field-color); font-size: 12px;
    }
    .field::placeholder { color: var(--muted); opacity: 1; }
    .field:focus { border-color: var(--focus); }
    .field.invalid { border-color: var(--danger); }
    .field.small { flex: none; width: 100%; height: 36px; }
    .error { min-height: 15px; font-size: 11px; color: var(--danger); }

    .list { max-height: 220px; display: flex; flex-direction: column; overflow-y: auto; scrollbar-width: thin; padding: 2px 6px 4px 2px; }
    .item { flex-shrink: 0; display: flex; align-items: center; gap: 10px; min-height: 52px; padding: 6px 0; border-top: 1px solid var(--divider); }
    .item:first-child { border-top: 0; }
    .item-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
    .item-title { display: flex; align-items: baseline; gap: 8px; min-width: 0; }
    .item-name { flex: 0 1 auto; font-size: 13px; font-weight: 600; }
    .item-meta { flex-shrink: 0; font-size: 11px; color: var(--muted); }
    .item-id { font-size: 12px; color: var(--muted); }
    .empty { padding: 24px 0; text-align: center; font-size: 12px; color: var(--muted); }
    .footer { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--divider); }

    .themes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .theme-option {
        display: flex; align-items: center; gap: 10px; padding: 8px;
        border: 1px solid var(--divider); border-radius: 10px; background: transparent;
        color: var(--text); font-size: 12px; font-weight: 600; text-align: left; cursor: pointer;
    }
    .theme-option:hover { background: var(--hover); }
    .theme-option[aria-pressed="true"] { border-color: var(--focus); box-shadow: inset 0 0 0 1px var(--focus); }
    .swatch { flex-shrink: 0; width: 36px; height: 26px; border-radius: 6px; border: 1px solid rgba(0, 0, 0, 0.25); }

    @keyframes pif-pop { 0% { transform: translateY(4px); } 55% { transform: translateY(-4px); } 100% { transform: none; } }
    @keyframes pif-ring { 0% { box-shadow: 0 0 0 0 rgba(129, 201, 149, 0.7), 0 2px 0 #050506; } 100% { box-shadow: 0 0 0 14px rgba(129, 201, 149, 0), 0 2px 0 #050506; } }
    @keyframes pif-wiggle { 0% { transform: translate(5px, 5px); } 40% { transform: translate(-2px, -2px) rotate(-4deg); } 70% { transform: rotate(3deg); } 100% { transform: none; } }

    /* ---------- Sculpted: cream mechanical keycaps ---------- */
    .card[data-theme="classic"] {
        --font: system-ui, -apple-system, "Segoe UI", sans-serif;
        --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        --card-bg: #f6f3ee; --card-border: 1px solid #d9d3c9; --card-radius: 18px;
        --card-shadow: 0 16px 40px rgba(60, 50, 30, 0.22);
        --text: #2a2620; --muted: #6f675b; --divider: rgba(90, 70, 40, 0.14); --hover: rgba(90, 70, 40, 0.06);
        --focus: #1f4fa8; --danger: #b3261e;
        --key-bg: linear-gradient(#fffefb, #ebe6de); --key-border: 1px solid #b9b2a6; --key-color: #3b362f;
        --key-radius: 11px; --key-radius-small: 8px;
        --key-shadow: 0 5px 0 #cdc6b9, 0 7px 12px rgba(40, 30, 10, 0.2), inset 0 1px 0 #fff;
        --key-shadow-hover: 0 6px 0 #cdc6b9, 0 9px 14px rgba(40, 30, 10, 0.2), inset 0 1px 0 #fff;
        --key-shadow-active: 0 1px 0 #cdc6b9, 0 2px 4px rgba(40, 30, 10, 0.2), inset 0 1px 0 #fff;
        --key-shadow-small: 0 3px 0 #d1cabe, inset 0 1px 0 #fff; --key-shadow-small-active: inset 0 2px 4px rgba(0, 0, 0, 0.12);
        --key-hover-transform: translateY(-1px); --key-active-transform: translateY(4px); --key-active-transform-small: translateY(3px);
        --legend-color: #8b8376; --accent-legend: #2f4f86;
        --accent-bg: linear-gradient(#b4cffc, #86b0f6); --accent-border: 1px solid #5c86ce; --accent-color: #13284d;
        --accent-shadow: 0 5px 0 #6690d8, 0 7px 12px rgba(30, 60, 120, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.7);
        --accent-shadow-active: 0 1px 0 #6690d8, inset 0 1px 0 rgba(255, 255, 255, 0.7);
        --ok-bg: linear-gradient(#b8e6c4, #7fc694); --ok-border: 1px solid #3e8a55; --ok-color: #0f3d1e;
        --ok-shadow: 0 5px 0 #4f9b67, 0 7px 12px rgba(20, 80, 40, 0.25); --ok-transform: none; --ok-animation: pif-pop 0.38s ease;
        --tab-bg: linear-gradient(#fffefb, #ece7df); --tab-border: 1px solid #c3bcb0; --tab-radius: 9px;
        --tab-shadow: 0 3px 0 #d1cabe, inset 0 1px 0 #fff; --tab-on-transform: translateY(3px);
        --tab-on-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.12); --tab-on-bg: #e6e0d6; --tab-on-color: #1f4fa8;
        --display-bg: #e9e4db; --display-border: 0; --display-radius: 10px; --display-shadow: inset 0 2px 5px rgba(60, 40, 10, 0.14);
        --display-color: #2a2620; --display-id-color: #2a2620; --display-muted: #6f675b; --display-ok: #2a7a43;
        --display-font: var(--font); --display-glow: none;
        --field-bg: #fffdf9; --field-border: 1px solid #cfc8bc; --field-radius: 10px; --field-color: #2a2620;
        --field-shadow: inset 0 1px 3px rgba(60, 40, 10, 0.1);
        --caption-display: block;
    }

    /* ---------- Backlit: dark laptop keys with glowing legends ---------- */
    .card[data-theme="chiclet"] {
        --font: system-ui, -apple-system, "Segoe UI", sans-serif;
        --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        --card-bg: linear-gradient(180deg, #34353a, #2a2b2f); --card-border: 1px solid #45464c; --card-radius: 16px;
        --card-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 20px 50px rgba(0, 0, 0, 0.55);
        --text: #e8eaed; --muted: #9aa0a6; --divider: rgba(255, 255, 255, 0.08); --hover: rgba(255, 255, 255, 0.05);
        --focus: #8ab4f8; --danger: #f28b82;
        --key-bg: linear-gradient(#232327, #18181b); --key-border: 1px solid #050506; --key-color: #d7dbe3;
        --key-radius: 9px; --key-radius-small: 7px;
        --key-shadow: 0 2px 0 #050506, inset 0 1px 0 rgba(255, 255, 255, 0.07);
        --key-shadow-hover: var(--key-shadow);
        --key-shadow-active: 0 0 0 #050506, inset 0 1px 0 rgba(255, 255, 255, 0.05);
        --key-shadow-small: 0 2px 0 #050506; --key-shadow-small-active: none;
        --key-hover-transform: none; --key-active-transform: translateY(2px); --key-active-transform-small: translateY(2px);
        --legend-color: #6f7480; --accent-legend: #6f7480;
        --accent-bg: var(--key-bg); --accent-border: var(--key-border); --accent-color: #8ab4f8;
        --accent-shadow: var(--key-shadow); --accent-shadow-active: var(--key-shadow-active);
        --ok-bg: var(--key-bg); --ok-border: var(--key-border); --ok-color: #81c995;
        --ok-shadow: 0 2px 0 #050506; --ok-transform: none; --ok-animation: pif-ring 0.5s ease;
        --tab-bg: #1c1c1f; --tab-border: 1px solid #050506; --tab-radius: 7px;
        --tab-shadow: 0 2px 0 #050506, inset 0 1px 0 rgba(255, 255, 255, 0.06); --tab-on-transform: translateY(2px);
        --tab-on-shadow: none; --tab-on-bg: #1c1c1f; --tab-on-color: #8ab4f8;
        --display-bg: #141416; --display-border: 1px solid #0a0a0b; --display-radius: 10px;
        --display-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.6);
        --display-color: #e8eaed; --display-id-color: #c6dafc; --display-muted: #8b919b; --display-ok: #81c995;
        --display-font: var(--font); --display-glow: 0 0 10px rgba(138, 180, 248, 0.3);
        --field-bg: #141416; --field-border: 1px solid #0a0a0b; --field-radius: 10px; --field-color: #e8eaed;
        --field-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.5);
        --caption-display: none;
    }
    .card[data-theme="chiclet"] .key svg { filter: drop-shadow(0 0 3px rgba(138, 180, 248, 0.45)); transition: filter 0.2s; }
    .card[data-theme="chiclet"] .key:hover { color: #fff; }
    .card[data-theme="chiclet"] .key:hover svg,
    .card[data-theme="chiclet"] .key.accent svg { filter: drop-shadow(0 0 6px rgba(138, 180, 248, 0.95)); }
    .card[data-theme="chiclet"] .key.ok svg { filter: drop-shadow(0 0 8px rgba(129, 201, 149, 1)); }
    .card[data-theme="chiclet"] .tab[aria-selected="true"] { text-shadow: 0 0 8px rgba(138, 180, 248, 0.8); }

    /* ---------- Retro: 80s terminal with a phosphor screen ---------- */
    .card[data-theme="retro"] {
        --font: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        --card-bg: linear-gradient(180deg, #efe6cf, #e2d7bb); --card-border: 2px solid #b5a785; --card-radius: 12px;
        --card-shadow: inset 0 2px 0 #fff8e6, inset 0 -3px 0 #cbbd9a, 0 18px 40px rgba(60, 45, 20, 0.28);
        --text: #3a312a; --muted: #6f624f; --divider: rgba(90, 70, 40, 0.18); --hover: rgba(90, 70, 40, 0.07);
        --focus: #c4561a; --danger: #a3261a;
        --key-bg: linear-gradient(#7d7064, #62564b); --key-border: 2px solid #3a312a; --key-color: #f3e9d2;
        --key-radius: 6px; --key-radius-small: 5px;
        --key-shadow: 0 7px 0 #3f352d, 0 9px 10px rgba(30, 20, 10, 0.35), inset 0 2px 0 rgba(255, 255, 255, 0.18);
        --key-shadow-hover: var(--key-shadow);
        --key-shadow-active: 0 1px 0 #3f352d, inset 0 2px 0 rgba(255, 255, 255, 0.18);
        --key-shadow-small: 0 3px 0 #3f352d; --key-shadow-small-active: none;
        --key-hover-transform: none; --key-active-transform: translateY(6px); --key-active-transform-small: translateY(3px);
        --legend-color: rgba(243, 233, 210, 0.75); --accent-legend: rgba(43, 22, 6, 0.7);
        --accent-bg: linear-gradient(#f08a3e, #d9681f); --accent-border: 2px solid #7a3a10; --accent-color: #2b1606;
        --accent-shadow: 0 7px 0 #8f4614, 0 9px 10px rgba(30, 20, 10, 0.35), inset 0 2px 0 rgba(255, 255, 255, 0.3);
        --accent-shadow-active: 0 1px 0 #8f4614, inset 0 2px 0 rgba(255, 255, 255, 0.3);
        --ok-bg: linear-gradient(#f5a25f, #e07a30); --ok-border: 2px solid #7a3a10; --ok-color: #2b1606;
        --ok-shadow: 0 1px 0 #8f4614, inset 0 2px 0 rgba(255, 255, 255, 0.3); --ok-transform: translateY(6px); --ok-animation: none;
        --tab-bg: #efe6cf; --tab-border: 2px solid #8b7f68; --tab-radius: 4px;
        --tab-shadow: 0 3px 0 #b8ab8c; --tab-on-transform: translateY(3px);
        --tab-on-shadow: none; --tab-on-bg: #e1d6ba; --tab-on-color: #c4561a;
        --display-bg: radial-gradient(ellipse at center, #10261a 0%, #07140d 100%); --display-border: 3px solid #4a4136;
        --display-radius: 10px; --display-shadow: inset 0 0 24px rgba(0, 0, 0, 0.8);
        --display-color: #7dff9b; --display-id-color: #7dff9b; --display-muted: rgba(125, 255, 155, 0.7); --display-ok: #d2ffdc;
        --display-font: var(--mono); --display-glow: 0 0 6px rgba(125, 255, 155, 0.7);
        --field-bg: #fbf6e8; --field-border: 2px solid #8b7f68; --field-radius: 4px; --field-color: #3a312a; --field-shadow: none;
        --caption-display: none;
    }
    .card[data-theme="retro"] .key, .card[data-theme="retro"] .tab, .card[data-theme="retro"] .btn { transition-timing-function: steps(2); }
    .card[data-theme="retro"] .tab { text-transform: uppercase; font-size: 11px; letter-spacing: 0.04em; }
    .card[data-theme="retro"] .legend { top: auto; bottom: 4px; left: 6px; }
    .card[data-theme="retro"] .display::after {
        content: ""; position: absolute; inset: 0; pointer-events: none;
        background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.22) 0 1px, transparent 1px 3px);
    }
    .card[data-theme="retro"] .display-id { font-size: 17px; }

    /* ---------- Brutalist: flat colour, thick outlines, hard shadows ---------- */
    .card[data-theme="brutal"] {
        --font: system-ui, -apple-system, "Segoe UI", sans-serif;
        --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        --card-bg: #fffbea; --card-border: 2.5px solid #111; --card-radius: 10px; --card-shadow: 8px 8px 0 #111;
        --text: #111; --muted: #4a4a4a; --divider: rgba(0, 0, 0, 0.2); --hover: rgba(0, 0, 0, 0.05);
        --focus: #2563eb; --danger: #c81e1e;
        --key-bg: #fff; --key-border: 2.5px solid #111; --key-color: #111;
        --key-radius: 6px; --key-radius-small: 5px;
        --key-shadow: 5px 5px 0 #111; --key-shadow-hover: 7px 7px 0 #111; --key-shadow-active: 0 0 0 #111;
        --key-shadow-small: 3px 3px 0 #111; --key-shadow-small-active: 0 0 0 #111;
        --key-hover-transform: translate(-2px, -2px); --key-active-transform: translate(5px, 5px); --key-active-transform-small: translate(3px, 3px);
        --legend-color: #111; --accent-legend: #111;
        --accent-bg: #ffd23f; --accent-border: 2.5px solid #111; --accent-color: #111;
        --accent-shadow: 5px 5px 0 #111; --accent-shadow-active: 0 0 0 #111;
        --ok-bg: #a7f3d0; --ok-border: 2.5px solid #111; --ok-color: #111;
        --ok-shadow: 5px 5px 0 #111; --ok-transform: none; --ok-animation: pif-wiggle 0.4s ease;
        --tab-bg: #fffbea; --tab-border: 2.5px solid #111; --tab-radius: 6px;
        --tab-shadow: 3px 3px 0 #111; --tab-on-transform: translate(3px, 3px);
        --tab-on-shadow: 0 0 0 #111; --tab-on-bg: #111; --tab-on-color: #fffbea;
        --display-bg: #fff; --display-border: 2.5px solid #111; --display-radius: 6px; --display-shadow: none;
        --display-color: #111; --display-id-color: #111; --display-muted: #4a4a4a; --display-ok: #0f7a3d;
        --display-font: var(--font); --display-glow: none;
        --field-bg: #fff; --field-border: 2.5px solid #111; --field-radius: 6px; --field-color: #111; --field-shadow: none;
        --caption-display: none;
    }
    .card[data-theme="brutal"] .keys { gap: 20px; padding-top: 10px; }
    .card[data-theme="brutal"] .legend {
        top: -11px; right: -11px; left: auto; z-index: 1; width: 20px; height: 20px;
        display: flex; align-items: center; justify-content: center;
        border: 2px solid #111; border-radius: 50%; background: #fffbea; color: #111;
    }
    .card[data-theme="brutal"] .key-group:nth-child(2) .key { background: #8ab4f8; }
    .card[data-theme="brutal"] .key-group:nth-child(3) .key { background: #ff9ec4; }
    .card[data-theme="brutal"] .display-id, .card[data-theme="brutal"] .heading { font-weight: 700; }

    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation: none !important; transition: none !important; }
    }
`;
