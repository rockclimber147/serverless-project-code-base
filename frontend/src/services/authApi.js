// src/api.js
export const API_BASE =
  "https://y35kgh2yf3.execute-api.us-west-2.amazonaws.com/dev";

async function post(path, body, authToken) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  // Unwrap Lambda proxy response if it exists
  if (data && data.body) {
    try {
      return JSON.parse(data.body);
    } catch {
      return data.body;
    }
  }

  return data;
}

async function get(path, queryParams = {}, authToken) {
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  // Create query string from queryParams object
  const queryString = new URLSearchParams(queryParams).toString();

  // If queryParams exist, append them to the path
  const url = queryString
    ? `${API_BASE}${path}?${queryString}`
    : `${API_BASE}${path}`;

  const res = await fetch(url, {
    method: "GET",
    headers,
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  // Unwrap Lambda proxy response if it exists
  if (data && data.body) {
    try {
      return JSON.parse(data.body);
    } catch {
      return data.body;
    }
  }

  return data;
}

// Lambda API functions
export async function signup(payload) {
  return post("/signup", payload);
}
export async function signin(payload) {
  return post("/signin", payload);
}
export async function confirmUser(payload) {
  return post("/confirmuser", payload);
}
export async function resendConfirmation(payload) {
  return post("/confirmuser/resendconfirmation", payload);
}
export async function uploadPhoto(payload, authToken) {
  return post("/edituser/uploadphoto", payload, authToken);
}
export async function editUser(payload, authToken) {
  return post("/edituser", payload, authToken);
}
export async function getUserInfo(queryString, authToken) {
  return get("/fetchuser", queryString, authToken);
}

// Decode JWT
export function parseJwt(token) {
  try {
    return JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
  } catch (e) {
    return null;
  }
}

const CRUD_API = "https://ardhu7a4ye.execute-api.us-west-2.amazonaws.com/prod";
export async function fetchApiGet(endpoint, idToken) {
  const response = await fetch(`${CRUD_API}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response;
}

export async function fetchApiPost(endpoint, body, idToken) {
  const response = await fetch(`${CRUD_API}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  });
  return response;
}
