export function formatExpiryDate(isoDate) {
  const date = new Date(isoDate + "T00:00:00");
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

export function formatFullDate(isoDate) {
  const date = new Date(isoDate + "T00:00:00");
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateRange(startDate, endDate) {
  const start = formatFullDate(startDate);
  if (!endDate || endDate === startDate) return start;
  return `${start} — ${formatFullDate(endDate)}`;
}

export function isExpired(isoDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(isoDate + "T00:00:00");
  return expiry < today;
}
