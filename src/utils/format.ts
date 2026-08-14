/**
 * Format metres for display.
 * Under 1000m → "842 m", otherwise → "2.42 km"
 */
export function formatDistance(metres: number): string {
  if (!Number.isFinite(metres) || metres < 0) {
    return '0 m';
  }

  if (metres < 1000) {
    return `${Math.round(metres)} m`;
  }

  return `${(metres / 1000).toFixed(2)} km`;
}

/**
 * Format an ISO date string for walk list display.
 */
export function formatWalkDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a duration in milliseconds for walk list/detail display.
 */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) {
    return '0 min';
  }

  const totalMinutes = Math.round(ms / 60_000);
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}
