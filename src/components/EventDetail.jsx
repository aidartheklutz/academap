import { CATEGORIES } from "../constants/categories";
import { formatFullDate, isExpired } from "../utils/formatDate";

export default function EventDetail({ event, onClose }) {
  if (!event) return null;

  const expired = isExpired(event.expiresAt);

  return (
    <div className="event-detail-overlay" onClick={onClose}>
      <div className="event-detail" onClick={(e) => e.stopPropagation()}>
        <button className="event-detail__close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <div className="event-detail__header">
          {event.posterUrl ? (
            <img
              className="event-detail__poster"
              src={event.posterUrl}
              alt={event.title}
            />
          ) : (
            <div className="event-detail__poster event-detail__poster--placeholder" />
          )}
          <div>
            <span className="event-detail__category">
              {CATEGORIES[event.category] ?? CATEGORIES.other}
            </span>
            <h2 className="event-detail__title">{event.title}</h2>
            <p className={`event-detail__expiry ${expired ? "event-detail__expiry--past" : ""}`}>
              {expired ? "Срок истёк" : "Актуально"} · до {formatFullDate(event.expiresAt)}
            </p>
          </div>
        </div>

        {event.description && (
          <p className="event-detail__description">{event.description}</p>
        )}

        {event.registrationUrl && !expired && (
          <a
            className="event-detail__link"
            href={event.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Зарегистрироваться
          </a>
        )}
      </div>
    </div>
  );
}
