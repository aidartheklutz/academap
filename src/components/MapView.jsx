import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router";
import { fetchEvents } from "../api/events";
import { CATEGORIES } from "../constants/categories";
import EventDetail from "./EventDetail";
import { createEventIcon } from "./EventMarker";

const BISHKEK_CENTER = [42.8746, 74.5698];
const DEFAULT_ZOOM = 13;
const CATEGORY_KEYS = Object.keys(CATEGORIES);

function MapClickHandler({ onMapClick, enabled }) {
  useMapEvents({
    click(e) {
      if (enabled && onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function MapView({
  events: externalEvents,
  onMapClick,
  mapClickEnabled = false,
  placementMarker,
  interactive = true,
}) {
  const [events, setEvents] = useState(externalEvents ?? []);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(CATEGORY_KEYS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(!externalEvents);
  const [error, setError] = useState(null);

  const selectedCategorySet = useMemo(
    () => new Set(selectedCategories),
    [selectedCategories],
  );

  const visibleEvents = interactive
    ? events.filter((event) =>
        selectedCategorySet.has(
          CATEGORIES[event.category] ? event.category : "other",
        ),
      )
    : events;

  const allCategoriesSelected =
    selectedCategories.length === CATEGORY_KEYS.length;

  useEffect(() => {
    if (externalEvents) {
      setEvents(externalEvents);
      setLoading(false);
      return;
    }

    fetchEvents()
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [externalEvents]);

  function toggleCategory(categoryKey) {
    setSelectedCategories((prev) =>
      prev.includes(categoryKey)
        ? prev.filter((key) => key !== categoryKey)
        : [...prev, categoryKey],
    );
  }

  function toggleAllCategories() {
    setSelectedCategories(allCategoriesSelected ? [] : CATEGORY_KEYS);
  }

  return (
    <div className="map-view">
      {interactive && (
        <header className="map-header">
          <Link to="/" className="map-header__brand">
            <img
              src="/academap.png"
              alt="Academap Logo"
              className="map-header__logo"
            />
            <div className="map-header__brand-text">
              <h1>Academap</h1>
              <p>Карта возможностей для студентов</p>
            </div>
          </Link>
          <nav className="map-header__nav">
            <Link
              to="/about"
              className="map-header__nav-link"
              aria-label="О проекте"
              title="О проекте"
            >
              <i className="bi bi-info-circle-fill"></i> <span>О проекте</span>
            </Link>
          </nav>
        </header>
      )}

      {interactive && (
        <>
          <button
            type="button"
            className="map-filter-toggle"
            onClick={() => setFilterOpen((prev) => !prev)}
            aria-expanded={filterOpen}
            aria-controls="map-category-filter"
          >
            <i className="bi bi-funnel-fill"></i>{" "}
            {filterOpen ? "Скрыть фильтр" : "Фильтр"}
          </button>

          {filterOpen && (
            <section
              id="map-category-filter"
              className="map-filter"
              aria-label="Фильтр категорий"
            >
              <div className="map-filter__topline">
                <h2>Категории</h2>
                <button type="button" onClick={toggleAllCategories}>
                  {allCategoriesSelected ? "Скрыть все" : "Показать все"}
                </button>
              </div>
              <div className="map-filter__options">
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <label key={key} className="map-filter__option">
                    <input
                      type="checkbox"
                      checked={selectedCategorySet.has(key)}
                      onChange={() => toggleCategory(key)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {loading && <div className="map-status">Загрузка...</div>}
      {error && <div className="map-status map-status--error">{error}</div>}

      <MapContainer
        center={BISHKEK_CENTER}
        zoom={DEFAULT_ZOOM}
        className="map-container"
        scrollWheelZoom={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onMapClick={onMapClick} enabled={mapClickEnabled} />

        {visibleEvents.map((event) => (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            icon={createEventIcon(event)}
            eventHandlers={{
              click: () => interactive && setSelectedEvent(event),
            }}
          />
        ))}

        {placementMarker && (
          <Marker
            position={[placementMarker.lat, placementMarker.lng]}
            icon={createEventIcon({
              ...placementMarker,
              posterUrl: placementMarker.posterUrl || "",
              expiresAt:
                placementMarker.expiresAt ||
                new Date().toISOString().slice(0, 10),
            })}
          />
        )}
      </MapContainer>

      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
