import { useEffect, useState } from "react";
import { Link } from "react-router";
import { createEvent, deleteEvent, fetchEvents, updateEvent } from "../api/events";
import { CATEGORIES } from "../constants/categories";
import MapView from "../components/MapView";

const emptyForm = {
  title: "",
  description: "",
  posterUrl: "",
  lat: null,
  lng: null,
  expiresAt: "",
  startDate: "",
  endDate: "",
  category: "other",
  organizerUrl: "",
};

export default function AdminPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchEvents().then(setEvents).catch((err) => setError(err.message));
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
    setMessage(null);
  }

  function loadEvent(event) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description ?? "",
      posterUrl: event.posterUrl ?? "",
      lat: event.lat,
      lng: event.lng,
      expiresAt: event.expiresAt,
      startDate: event.startDate ?? "",
      endDate: event.endDate ?? "",
      category: event.category ?? "other",
      organizerUrl: event.organizerUrl ?? event.registrationUrl ?? "",
    });
    setError(null);
    setMessage(null);
  }

  function handleMapClick(lat, lng) {
    setForm((prev) => ({ ...prev, lat, lng }));
    setMessage("Место на карте выбрано");
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      if (form.lat == null || form.lng == null) {
        throw new Error("Нажмите на карту, чтобы указать место события");
      }

      if (editingId) {
        const updated = await updateEvent(editingId, form);
        setEvents((prev) => prev.map((ev) => (ev.id === editingId ? updated : ev)));
        setMessage("Событие обновлено");
      } else {
        const created = await createEvent(form);
        setEvents((prev) => [...prev, created]);
        resetForm();
        setMessage("Событие добавлено");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Удалить это событие?")) return;

    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      if (editingId === id) resetForm();
      setMessage("Событие удалено");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Админ-панель</h1>
          <p>Управление событиями на карте</p>
        </div>
        <Link to="/" className="admin-header__back">
          ← На карту
        </Link>
      </header>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2>{editingId ? "Редактировать событие" : "Новое событие"}</h2>

            <label>
              Название *
              <input name="title" value={form.title} onChange={handleChange} required />
            </label>

            <label>
              Описание
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </label>

            <label>
              Ссылка на постер
              <input
                name="posterUrl"
                type="url"
                value={form.posterUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>

            <label>
              Категория
              <select name="category" value={form.category} onChange={handleChange}>
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Можно записаться до *
              <input
                name="expiresAt"
                type="date"
                value={form.expiresAt}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Дата начала события *
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Дата окончания события *
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Ссылка для связи с организатором
              <input
                name="organizerUrl"
                type="url"
                value={form.organizerUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>

            <p className="admin-form__hint">
              {form.lat != null && form.lng != null
                ? `Координаты: ${form.lat.toFixed(5)}, ${form.lng.toFixed(5)}`
                : "Нажмите на карту справа, чтобы указать место"}
            </p>

            {error && <p className="admin-form__error">{error}</p>}
            {message && <p className="admin-form__message">{message}</p>}

            <div className="admin-form__actions">
              <button type="submit" disabled={saving}>
                {saving ? "Сохранение..." : editingId ? "Сохранить" : "Добавить"}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Отмена
                </button>
              )}
            </div>
          </form>

          <div className="admin-list">
            <h3>Все события ({events.length})</h3>
            {events.length === 0 ? (
              <p className="admin-list__empty">Событий пока нет</p>
            ) : (
              <ul>
                {events.map((event) => (
                  <li key={event.id} className={editingId === event.id ? "active" : ""}>
                    <button type="button" onClick={() => loadEvent(event)}>
                      {event.title}
                    </button>
                    <button
                      type="button"
                      className="admin-list__delete"
                      onClick={() => handleDelete(event.id)}
                      aria-label="Удалить"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <div className="admin-map">
          <MapView
            events={editingId ? events.filter((e) => e.id !== editingId) : events}
            onMapClick={handleMapClick}
            mapClickEnabled
            placementMarker={
              form.lat != null && form.lng != null
                ? {
                    lat: form.lat,
                    lng: form.lng,
                    posterUrl: form.posterUrl,
                    expiresAt: form.expiresAt,
                  }
                : null
            }
            interactive={false}
          />
        </div>
      </div>
    </div>
  );
}
