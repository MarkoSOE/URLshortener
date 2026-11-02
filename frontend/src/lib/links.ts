export type SavedLink = {
  shortUrl: string;
  adminUrl: string;
  targetUrl: string;
  createdAt: string;
};

export type LinkInfo = {
  target_url: string;
  is_active: boolean;
  clicks: number;
  url: string;
  admin_url: string;
};

const API = import.meta.env.VITE_API_URL;
const STORAGE_KEY = "urlsnip.links";

/** Links created in this browser, newest first. */
export function loadLinks(): SavedLink[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLink(link: SavedLink) {
  try {
    const rest = loadLinks().filter((l) => l.adminUrl !== link.adminUrl);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([link, ...rest]));
  } catch {
    // storage unavailable (private mode etc.) — the link still works
  }
}

/** Pull the secret key out of an admin URL (or return the input if it is already a key). */
export function secretFromAdminUrl(input: string): string {
  const value = input.trim();
  try {
    const parts = new URL(value).pathname.split("/admin/");
    if (parts.length === 2 && parts[1]) return parts[1];
  } catch {
    // not a URL
  }
  return value;
}

/** "https://urlsnip.ca/abc12" -> "urlsnip.ca/abc12" */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export async function createLink(targetUrl: string): Promise<LinkInfo> {
  const res = await fetch(`${API}/url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target_url: targetUrl }),
  });
  if (!res.ok) {
    let message = "Couldn't shorten that URL. Please try again.";
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") message = body.detail;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }
  return res.json();
}

/** Returns the link's info, or null when the API says it no longer exists (deleted). Throws on network errors. */
export async function fetchLinkInfo(secret: string): Promise<LinkInfo | null> {
  const res = await fetch(`${API}/admin/${encodeURIComponent(secret)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // clipboard blocked — ignore
  }
}
