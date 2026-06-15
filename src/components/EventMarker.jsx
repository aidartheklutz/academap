import L from "leaflet";
import { formatExpiryDate, isExpired } from "../utils/formatDate";

export function createEventIcon(event) {
  const expired = isExpired(event.expiresAt);
  const posterStyle = event.posterUrl
    ? `background-image: url('${event.posterUrl}');`
    : "background: linear-gradient(135deg, #6366f1, #8b5cf6);";

  return L.divIcon({
    className: "",
    html: `
      <div class="event-marker ${expired ? "event-marker--expired" : ""}">
        <div class="event-marker__poster" style="${posterStyle}"></div>
        <div class="event-marker__date">до ${formatExpiryDate(event.expiresAt)}</div>
      </div>
    `,
    iconSize: [72, 88],
    iconAnchor: [36, 44],
    popupAnchor: [0, -44],
  });
}
