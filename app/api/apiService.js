// app/api/apiService.js
const BASE_URL = "http://10.0.2.2:2803";

async function parseError(res) {
  const contentType = res.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const json = await res.json();
      return json?.message || JSON.stringify(json);
    }
    const text = await res.text();
    return text || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

const ApiService = {
  get: async (url, token) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(BASE_URL + url, { headers });

    if (!res.ok) {
      const msg = await parseError(res);
      throw new Error(`API ${res.status}: ${msg}`);
    }

    return res.json();
  },

  post: async (url, body, token) => {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(BASE_URL + url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const msg = await parseError(res);
      throw new Error(`API ${res.status}: ${msg}`);
    }

    return res.json();
  },

  put: async (url, body, token) => {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(BASE_URL + url, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const msg = await parseError(res);
      throw new Error(`API ${res.status}: ${msg}`);
    }

    return res.json();
  },

  delete: async (url, token) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(BASE_URL + url, {
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const msg = await parseError(res);
      throw new Error(`API ${res.status}: ${msg}`);
    }

    return res.json();
  },

  postMultipart: async (url, formData, token) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(BASE_URL + url, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const msg = await parseError(res);
      throw new Error(`API ${res.status}: ${msg}`);
    }

    return res.json();
  },
};

export default ApiService;
