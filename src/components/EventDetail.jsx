import { CATEGORIES } from "../constants/categories";
import { formatDateRange, formatFullDate, isExpired } from "../utils/formatDate";

export default function EventDetail({ event, onClose }) {
  if (!event) return null;

  const signupClosed = isExpired(event.expiresAt);
  const contactUrl = event.organizerUrl ?? event.registrationUrl;

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
          </div>
        </div>

        <div className="event-detail__meta">
          <p className={`event-detail__signup ${signupClosed ? "event-detail__signup--closed" : ""}`}>
            Можно записаться до: {formatFullDate(event.expiresAt)}
          </p>
          {event.startDate && (
            <p className="event-detail__dates">
              {formatDateRange(event.startDate, event.endDate)}
            </p>
          )}
        </div>

        {event.description && (
          <p className="event-detail__description">{event.description}</p>
        )}

        {contactUrl && (
          <a
            className="event-detail__link"
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Связаться с организатором
          </a>
        )}
      </div>
    </div>
  );
}
