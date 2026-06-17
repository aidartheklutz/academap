import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { fetchEvents } from "../api/events";
import { CATEGORIES } from "../constants/categories";
import { formatDateRange, formatFullDate, isExpired } from "../utils/formatDate";

const CATEGORY_KEYS = Object.keys(CATEGORIES);

function getCategoryKey(event) {
  return CATEGORIES[event.category] ? event.category : "other";
}

function sortByStartDate(a, b) {
  const first = a.startDate ?? a.expiresAt ?? "";
  const second = b.startDate ?? b.expiresAt ?? "";
  return first.localeCompare(second);
}

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(CATEGORY_KEYS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedCategorySet = useMemo(
    () => new Set(selectedCategories),
    [selectedCategories],
  );

  const filteredEvents = useMemo(
    () =>
      [...events]
        .filter((event) => selectedCategorySet.has(getCategoryKey(event)))
        .sort(sortByStartDate),
    [events, selectedCategorySet],
  );

  const allCategoriesSelected =
    selectedCategories.length === CATEGORY_KEYS.length;

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
    <div className="calendar-page">
      <header className="calendar-header">
        <div className="calendar-header__content">
          <Link to="/" className="calendar-header__brand">
            <img src="/academap.png" alt="Academap Logo" />
            <div>
              <h1>Календарь</h1>
              <p>События и дедлайны Academap</p>
            </div>
          </Link>
          <nav className="calendar-header__nav">
            <Link to="/" className="map-header__nav-link">
              <i className="bi bi-map-fill"></i> <span>Карта</span>
            </Link>
            <Link to="/about" className="map-header__nav-link">
              <i className="bi bi-info-circle-fill"></i> <span>О проекте</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="calendar-content">
        <section className="calendar-filter" aria-label="Фильтр категорий">
          <div className="calendar-filter__topline">
            <div>
              <h2>Фильтр категорий</h2>
              <p>Показывается {filteredEvents.length} из {events.length}</p>
            </div>
            <button type="button" onClick={toggleAllCategories}>
              {allCategoriesSelected ? "Скрыть все" : "Показать все"}
            </button>
          </div>
          <div className="calendar-filter__options">
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <label key={key} className="calendar-filter__option">
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

        {loading && <div className="calendar-status">Загрузка...</div>}
        {error && <div className="calendar-status calendar-status--error">{error}</div>}

        {!loading && !error && (
          <section className="calendar-list" aria-label="Календарь событий">
            {filteredEvents.length === 0 ? (
              <div className="calendar-empty">
                <i className="bi bi-calendar-x"></i>
                <p>Нет событий по выбранным категориям.</p>
              </div>
            ) : (
              filteredEvents.map((event) => {
                const signupClosed = isExpired(event.expiresAt);
                const categoryKey = getCategoryKey(event);
                const contactUrl = event.organizerUrl ?? event.registrationUrl;

                return (
                  <article key={event.id} className="calendar-event">
                    {event.posterUrl ? (
                      <img
                        className="calendar-event__poster"
                        src={event.posterUrl}
                        alt={event.title}
                      />
                    ) : (
                      <div className="calendar-event__poster calendar-event__poster--placeholder">
                        <i className="bi bi-calendar-event"></i>
                      </div>
                    )}

                    <div className="calendar-event__body">
                      <div className="calendar-event__topline">
                        <span className="calendar-event__category">
                          {CATEGORIES[categoryKey]}
                        </span>
                        <span
                          className={`calendar-event__deadline ${
                            signupClosed ? "calendar-event__deadline--closed" : ""
                          }`}
                        >
                          Запись до {formatFullDate(event.expiresAt)}
                        </span>
                      </div>
                      <h2>{event.title}</h2>
                      <div className="calendar-event__dates">
                        <i className="bi bi-clock-fill"></i>
                        <span>{formatDateRange(event.startDate, event.endDate)}</span>
                      </div>
                      {event.description && (
                        <p className="calendar-event__description">
                          {event.description}
                        </p>
                      )}
                      {contactUrl && (
                        <a
                          className="calendar-event__link"
                          href={contactUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Связаться с организатором
                        </a>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </section>
        )}
      </main>
    </div>
  );
}
