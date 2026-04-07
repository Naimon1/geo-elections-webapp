/** Client-only: when admin APIs return 401, notify portal to show login again. */

type Listener = () => void;

let listener: Listener | null = null;

export function setAdminUnauthorizedListener(fn: Listener | null) {
  listener = fn;
}

export function notifyAdminUnauthorized() {
  listener?.();
}
