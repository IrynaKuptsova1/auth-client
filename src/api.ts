
import { isNonEmptyString } from "./types";

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const handleLogout = (showAlert = false) => {
  localStorage.clear();
  if (showAlert) {
    sessionStorage.setItem("session_expired", "true");
  }
  window.location.href = "/sign-in";
};

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const API_URL = import.meta.env.VITE_API_URL;
  const currentToken = localStorage.getItem("accessToken");

  if (!isNonEmptyString(currentToken)) {
    handleLogout(false);
    throw new Error("No token");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${currentToken}`);
  
  let response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!isNonEmptyString(refreshToken)) {
        handleLogout(true);
        throw new Error("No refresh token");
      }

      // Запускаем ОДИН рефреш на все параллельные запросы
      refreshPromise = fetch(`${API_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error();
          const data = await res.json();

          if (isNonEmptyString(data.accessToken) && isNonEmptyString(data.refreshToken)) {
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            isRefreshing = false;
            return true;
          }
          throw new Error();
        })
        .catch(() => {
          isRefreshing = false;
          refreshPromise = null;
          handleLogout(true);
          throw new Error("Refresh failed");
        });
      }
        await refreshPromise;

    const newToken = localStorage.getItem("accessToken");
    const retryHeaders = new Headers(options.headers);
    retryHeaders.set("Authorization", `Bearer ${newToken}`);

    return await fetch(`${API_URL}${endpoint}`, { ...options, headers: retryHeaders });
  }

  return response;
}