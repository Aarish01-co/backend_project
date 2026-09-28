const API_BASE = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === "localhost" ? "http://localhost:5000/api" : "/api");

let accessToken = localStorage.getItem("accessToken") || null;

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

export const getAccessToken = () => accessToken;

export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const config = {
    ...options,
    headers,
    credentials: "include"
  };

  let response = await fetch(`${API_BASE}${endpoint}`, config);

  if (response.status === 401 && !options._retry && endpoint !== "/auth/login" && endpoint !== "/auth/refresh-token") {
    options._retry = true;
    const refreshSuccess = await refreshAccessToken();
    if (refreshSuccess) {
      headers["Authorization"] = `Bearer ${accessToken}`;
      config.headers = headers;
      response = await fetch(`${API_BASE}${endpoint}`, config);
    }
  }

  return response;
};

export const refreshAccessToken = async () => {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    if (res.ok) {
      const data = await res.json();
      setAccessToken(data.accessToken);
      return true;
    } else {
      setAccessToken(null);
      return false;
    }
  } catch (err) {
    setAccessToken(null);
    return false;
  }
};
