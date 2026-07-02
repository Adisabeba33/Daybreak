import { useState } from "react";
import { useApiKey } from "../lib/ai";
import { GearIcon } from "./icons";

/**
 * Settings entry (gear) in the header. Opens a small modal to paste the
 * Anthropic API key that powers smart voice parsing. A dot on the gear marks
 * that AI is enabled.
 */
export function SettingsButton() {
  const { key, hasKey, save } = useApiKey();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const openModal = () => {
    setDraft(key);
    setOpen(true);
  };

  return (
    <>
      <button type="button" className="icon-btn" onClick={openModal} aria-label="Settings">
        <GearIcon />
        {hasKey && <span className="icon-dot" aria-hidden />}
      </button>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Smart voice settings"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="tip-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2>Smart voice (AI)</h2>
            <p className="modal-lead">
              Paste an Anthropic API key to turn free speech into clean, sorted task cards
              (Claude Haiku 4.5). Without a key the app still works — each phrase becomes a card.
            </p>
            <input
              className="key-input"
              type="password"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="sk-ant-…"
              aria-label="Anthropic API key"
              autoComplete="off"
              spellCheck={false}
            />
            <div className="modal-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  save("");
                  setDraft("");
                }}
                disabled={!hasKey && !draft}
              >
                Clear
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  save(draft);
                  setOpen(false);
                }}
              >
                Save
              </button>
            </div>
            <p className="modal-note">
              {hasKey ? "AI enabled ✓ · " : ""}The key is stored only in this browser and sent
              directly to Anthropic. For personal/testing use — a public launch should route
              calls through a backend. Get a key at console.anthropic.com.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
