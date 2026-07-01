import { useState } from "react";
import { useInstallPrompt } from "../hooks/useInstallPrompt";

/**
 * Small install affordance in the top bar. Shows a one-tap install button where
 * the browser supports it, or a dismissible "Add to Home Screen" hint on iOS.
 * Renders nothing once installed (or in standalone mode).
 */
export function InstallButton() {
  const { canInstall, iosHint, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (canInstall) {
    return (
      <button type="button" className="install" onClick={promptInstall}>
        Install ⬇
      </button>
    );
  }

  if (iosHint && !dismissed) {
    return (
      <button
        type="button"
        className="install ios"
        onClick={() => setDismissed(true)}
        title="Tap Share, then “Add to Home Screen”"
      >
        Add to Home Screen ⬆
      </button>
    );
  }

  return null;
}
