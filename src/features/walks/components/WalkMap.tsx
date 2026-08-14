import { Platform, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { AppText } from '@/components/Text/AppText';
import type { Coordinate } from '@/features/walks/types/walk';
import { getRouteRegion } from '@/features/walks/utils/routeRegion';

type WalkMapProps = {
  route: Coordinate[];
  showsUserLocation?: boolean;
  followsUserLocation?: boolean;
};

export function WalkMap({
  route,
  showsUserLocation = false,
  followsUserLocation = false,
}: WalkMapProps) {
  const { theme } = useUnistyles();
  const region = getRouteRegion(route);
  const lastPoint = route[route.length - 1];

  if (Platform.OS === 'web') {
    return (
      <View style={styles.fallback}>
        <AppText variant="caption">
          Maps are available on iOS and Android. {route.length} GPS points
          recorded.
        </AppText>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      region={followsUserLocation ? undefined : region}
      showsUserLocation={showsUserLocation}
      followsUserLocation={followsUserLocation}
    >
      {route.length > 1 ? (
        <Polyline
          coordinates={route}
          strokeColor={theme.colors.mapAccent}
          strokeWidth={4}
        />
      ) : null}
      {lastPoint && (
        <Marker
          coordinate={lastPoint}
          title={showsUserLocation ? 'Current location' : 'End'}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create((theme) => ({
  map: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    padding: theme.padding.lg,
  },
}));
