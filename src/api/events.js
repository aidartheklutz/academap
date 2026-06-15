const API = "/api";

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Ошибка запроса");
  }
  if (res.status === 204) return null;
  return res.json();
}

export function fetchEvents() {
  return fetch(`${API}/events`).then(handleResponse);
}

export function fetchEvent(id) {
  return fetch(`${API}/events/${id}`).then(handleResponse);
}

export function createEvent(data) {
  return fetch(`${API}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

export function updateEvent(id, data) {
  return fetch(`${API}/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);
}

export function deleteEvent(id) {
  return fetch(`${API}/events/${id}`, { method: "DELETE" }).then(handleResponse);
}
