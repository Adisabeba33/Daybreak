import { useState } from "react";
import { useInstallPrompt } from "../hooks/useInstallPrompt";

/**
 * Install affordance in the top bar.
 * - Android/desktop: one-tap native install (beforeinstallprompt).
 * - iOS: no programmatic install exists, so tapping opens a short tip with the
 *   Share → "Add to Home Screen" steps.
 * Renders nothing once installed / running standalone.
 */
export function InstallButton() {
  const { canInstall, iosHint, promptInstall } = useInstallPrompt();
  const [showTip, setShowTip] = useState(false);

  if (canInstall) {
    return (
      <button type="button" className="install" onClick={promptInstall}>
        Install ⬇
      </button>
    );
  }

  if (iosHint) {
    return (
      <div className="install-wrap">
        <button
          type="button"
          className="install"
          onClick={() => setShowTip((v) => !v)}
        >
          Install ⬇
        </button>
        {showTip && (
          <div className="install-tip" role="dialog">
            <button
              type="button"
              className="tip-close"
              aria-label="Close"
              onClick={() => setShowTip(false)}
            >
              ×
            </button>
            <strong>Add Daybreak to your Home Screen</strong>
            <ol>
              <li>
                Tap the <b>Share</b> button <span aria-hidden>􀈂 ⎋</span> at the bottom of Safari
              </li>
              <li>
                Scroll down and choose <b>Add to Home Screen</b>
              </li>
              <li>
                Tap <b>Add</b> — the 🌅 icon appears on your Home Screen
              </li>
            </ol>
            <p className="tip-note">
              Don’t see “Add to Home Screen”? Open this page in <b>Safari</b> directly — it
              doesn’t work inside other apps’ browsers (Telegram, Instagram, etc.).
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
