import type { Coordinate } from '@/features/walks/types/walk';

const SYDNEY = {
  latitude: -33.8688,
  longitude: 151.2093,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export function getRouteRegion(route: Coordinate[]) {
  if (route.length === 0) {
    return SYDNEY;
  }

  if (route.length === 1) {
    return {
      latitude: route[0].latitude,
      longitude: route[0].longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const latitudes = route.map((point) => point.latitude);
  const longitudes = route.map((point) => point.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
    latitudeDelta: Math.max(maxLat - minLat, 0.005) * 1.4,
    longitudeDelta: Math.max(maxLon - minLon, 0.005) * 1.4,
  };
}
