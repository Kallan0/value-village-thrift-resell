export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export async function api(path: string, options: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, options);
}
