#!/usr/bin/env node

/**
 * Moves the iOS Simulator GPS pin downtown along Fifth Avenue —
 * 59th St (Central Park South) → Washington Square.
 *
 * Start a walk in Doop first, then:
 *   npm run simulate:walk
 *
 * Walking speed is 1.4 m/s (~45 min). For a quicker preview that still
 * passes Doop's 15 m/s GPS-jump check:
 *   SPEED=8 npm run simulate:walk
 */
import { spawnSync } from 'node:child_process';

const SPEED_METRES_PER_SECOND = Number(process.env.SPEED ?? 1.4);
const MAX_SPEED_METRES_PER_SECOND = 15;
const DEVICE = process.env.DEVICE ?? 'booted';

if (!Number.isFinite(SPEED_METRES_PER_SECOND) || SPEED_METRES_PER_SECOND <= 0) {
  console.error('SPEED must be a positive number (metres per second).');
  process.exit(1);
}

if (SPEED_METRES_PER_SECOND > MAX_SPEED_METRES_PER_SECOND) {
  console.error(
    `SPEED ${SPEED_METRES_PER_SECOND} m/s is above Doop's ${MAX_SPEED_METRES_PER_SECOND} m/s GPS-jump limit. Points would be dropped.`,
  );
  process.exit(1);
}

// Fifth Avenue centerline, walking downtown (south).
const start = { lat: 40.76444, lon: -73.97302 }; // 5th Ave & 59th St
const end = { lat: 40.73083, lon: -73.99703 }; // Washington Square North
const distanceMetres = 3700;
const steps = 20;

const waypoints = Array.from({ length: steps }, (_, index) => {
  const t = index / (steps - 1);
  const lat = start.lat + t * (end.lat - start.lat);
  const lon = start.lon + t * (end.lon - start.lon);
  return `${lat.toFixed(5)},${lon.toFixed(5)}`;
});

function simctl(args) {
  const result = spawnSync('xcrun', ['simctl', 'location', DEVICE, ...args], {
    stdio: 'inherit',
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const durationMinutes = Math.round(
  distanceMetres / SPEED_METRES_PER_SECOND / 60,
);

console.log(
  `Walking down Fifth Avenue (59th St → Washington Square, ~3.7 km) at ${SPEED_METRES_PER_SECOND} m/s (~${durationMinutes} min).`,
);
console.log('Start a walk in Doop first so tracking is already listening.');

simctl(['set', waypoints[0]]);
simctl([
  'start',
  `--speed=${SPEED_METRES_PER_SECOND}`,
  '--interval=1',
  ...waypoints,
]);
