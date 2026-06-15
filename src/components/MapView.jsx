import { useEffect, useState } from "react";
import { Link } from "react-router";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchEvents } from "../api/events";
import EventDetail from "./EventDetail";
import { createEventIcon } from "./EventMarker";

const BISHKEK_CENTER = [42.8746, 74.5698];
const DEFAULT_ZOOM = 13;

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
  const [loading, setLoading] = useState(!externalEvents);
  const [error, setError] = useState(null);

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

  return (
    <div className="map-view">
      {interactive && (
        <header className="map-header">
          <div className="map-header__brand">
            <h1>Academap</h1>
            <p>Карта событий Бишкека</p>
          </div>
          <Link to="/admin" className="map-header__admin-link">
            Админ-панель
          </Link>
        </header>
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

        {events.map((event) => (
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
              expiresAt: placementMarker.expiresAt || new Date().toISOString().slice(0, 10),
            })}
          />
        )}
      </MapContainer>

      {selectedEvent && (
        <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
