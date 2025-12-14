// src/api/apiService.js
const BASE_URL = "http://10.0.2.2:2803";

async function parseError(res) {
  // 서버가 json 또는 text로 에러를 줄 수 있어서 둘 다 대응
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
  /* =========================
     GET
  ========================= */
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

  /* =========================
     POST (JSON)
  ========================= */
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

  /* =========================
     PUT (JSON)
  ========================= */
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

  /* =========================
     DELETE
  ========================= */
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

  /* =========================
     POST (multipart/form-data)
     - Content-Type 지정 금지 (boundary 자동)
  ========================= */
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
