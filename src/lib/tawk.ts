import { TAWK_SRC } from "@/lib/site";

/**
 * Opening the Tawk.to chat below md, from the menu's Live chat row (Navbar).
 *
 * On phones Tawk never loads by itself: ThirdPartyScripts skips its timer and
 * first-interaction listeners below md, so no chat bubble sits on the action bar. The
 * row loads it here instead. Once loaded, onLoad opens the chat window straight away,
 * and minimizing it hides the widget again rather than leaving the bubble behind.
 * At md and up Tawk loads as it always has, and this module is not used.
 */

interface TawkApi {
  onLoad?: () => void;
  onChatMinimized?: () => void;
  maximize?: () => void;
  showWidget?: () => void;
  hideWidget?: () => void;
}

declare global {
  interface Window {
    Tawk_API?: TawkApi;
    Tawk_LoadStart?: Date;
  }
}

/** How long the row says "Opening chat…" before it says the chat didn't open (S18). */
export const CHAT_WAIT_MS = 8000;

let waiting: Array<(opened: boolean) => void> = [];

function settle(opened: boolean) {
  const callbacks = waiting;
  waiting = [];
  callbacks.forEach((callback) => callback(opened));
}

function load(api: TawkApi) {
  // Set even when the script is already on its way, so a window that loaded the md+ way
  // and was then narrowed still opens when it arrives.
  api.onLoad = () => {
    api.maximize?.();
    settle(true);
  };
  api.onChatMinimized = () => api.hideWidget?.();
  if (window.Tawk_LoadStart) return;
  window.Tawk_LoadStart = new Date();
  const script = document.createElement("script");
  script.async = true;
  script.src = TAWK_SRC;
  script.charset = "UTF-8";
  script.setAttribute("crossorigin", "*");
  // Blocked or offline: say so now, and let the next tap try again.
  script.onerror = () => {
    script.remove();
    window.Tawk_LoadStart = undefined;
    settle(false);
  };
  document.head.appendChild(script);
}

/**
 * Opens the chat window. Resolves true once it is open, and false when the visitor is
 * offline, the script fails, or nothing has opened after CHAT_WAIT_MS. A chat that
 * arrives after that still opens: the visitor asked for it.
 */
export function openChat(): Promise<boolean> {
  if (navigator.onLine === false) return Promise.resolve(false);
  const api = (window.Tawk_API = window.Tawk_API || {});
  if (typeof api.maximize === "function") {
    api.showWidget?.();
    api.maximize();
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    let done = false;
    const finish = (opened: boolean) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      window.removeEventListener("offline", offline);
      resolve(opened);
    };
    const offline = () => finish(false);
    const timer = setTimeout(() => finish(false), CHAT_WAIT_MS);
    window.addEventListener("offline", offline);
    waiting.push(finish);
    load(api);
  });
}
