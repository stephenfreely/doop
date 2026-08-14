import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { v4 as uuidv4 } from 'uuid';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { Field } from '@/components/Field/Field';
import { Icon } from '@/components/Icon/Icon';
import { LoadingState } from '@/components/LoadingState/LoadingState';
import { Screen } from '@/components/Screen/Screen';
import { AppText } from '@/components/Text/AppText';
import { StoolRatingPicker } from '@/features/walks/components/StoolRatingPicker';
import { useGetWalk } from '@/features/walks/hooks/useGetWalks';
import { useUpdateWalk } from '@/features/walks/hooks/useWalkMutations';
import type { StoolLog, StoolRating, Walk } from '@/features/walks/types/walk';
import { upsertStool } from '@/features/walks/utils/stools';
import { useActiveWalkStore } from '@/stores/activeWalkStore';

export function LogStoolScreen() {
  const { walkId, stoolId } = useLocalSearchParams<{
    walkId?: string;
    stoolId?: string;
  }>();
  const { data: walk, isLoading, isError, error, refetch } = useGetWalk(walkId);
  const liveStools = useActiveWalkStore((state) => state.stools);

  if (walkId && isLoading) {
    return (
      <Screen>
        <LoadingState message="Loading stool log…" />
      </Screen>
    );
  }

  if (walkId && isError) {
    return (
      <Screen>
        <ErrorState
          title="Could not load walk"
          message={error.message}
          onRetry={() => void refetch()}
        />
      </Screen>
    );
  }

  const existing = stoolId
    ? walkId
      ? walk?.stools?.find((item) => item.id === stoolId)
      : liveStools.find((item) => item.id === stoolId)
    : undefined;

  return (
    <StoolLogForm existing={existing} walkId={walkId} walk={walk ?? null} />
  );
}

type StoolLogFormProps = {
  existing?: StoolLog;
  walkId?: string;
  walk: Walk | null;
};

function StoolLogForm({ existing, walkId, walk }: StoolLogFormProps) {
  const router = useRouter();
  const { theme } = useUnistyles();
  const updateWalk = useUpdateWalk();
  const [addStool, updateStool] = useActiveWalkStore(
    useShallow((state) => [state.addStool, state.updateStool]),
  );

  const [photoUri, setPhotoUri] = useState(existing?.photoUri ?? '');
  const [rating, setRating] = useState<StoolRating | null>(
    existing?.rating ?? null,
  );
  const [description, setDescription] = useState(existing?.description ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError('Camera permission is needed to photograph a stool sample.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setError(null);
    }
  }

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo library permission is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setError(null);
    }
  }

  async function onSave() {
    if (!rating) {
      setError('Choose a consistency rating so your vet can see the pattern.');
      return;
    }

    const stool: StoolLog = {
      id: existing?.id ?? uuidv4(),
      recordedAt: existing?.recordedAt ?? new Date().toISOString(),
      photoUri: photoUri || undefined,
      rating,
      description: description.trim() || undefined,
    };

    setIsSaving(true);
    setError(null);

    try {
      if (walkId) {
        if (!walk) {
          throw new Error('Walk not found.');
        }
        await updateWalk.mutateAsync({
          id: walkId,
          input: { stools: upsertStool(walk.stools ?? [], stool) },
        });
      } else if (existing) {
        updateStool(stool);
      } else {
        addStool(stool);
      }

      router.back();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Could not save this stool log.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Screen>
      <AppText variant="title">
        {existing ? 'Edit stool log' : 'Log stool'}
      </AppText>
      <AppText variant="caption">
        A photo and consistency rating help your vet spot patterns if your puppy
        gets sick.
      </AppText>

      <Card>
        {photoUri && (
          <Image source={{ uri: photoUri }} style={styles.preview} />
        )}
        {!photoUri && (
          <View style={styles.photoPlaceholder}>
            <Icon
              name="camera-outline"
              size={32}
              color={theme.colors.textMuted}
            />
            <AppText variant="caption">No photo yet</AppText>
          </View>
        )}

        <View style={styles.photoActions}>
          <Button
            title="Take photo"
            icon="camera-outline"
            onPress={() => void takePhoto()}
            style={styles.photoAction}
          />
          <Button
            title="Library"
            icon="images-outline"
            variant="secondary"
            onPress={() => void pickPhoto()}
            style={styles.photoAction}
          />
        </View>

        <StoolRatingPicker value={rating} onChange={setRating} />

        <Field
          label="Notes for the vet (optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Colour, mucus, straining, appetite…"
          multiline
          style={styles.notes}
        />

        {error && <AppText variant="caption">{error}</AppText>}

        <Button
          title={
            isSaving ? 'Saving…' : existing ? 'Save changes' : 'Save stool log'
          }
          icon="checkmark-circle-outline"
          disabled={isSaving}
          onPress={() => void onSave()}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  preview: {
    width: '100%',
    height: 220,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceMuted,
    borderCurve: 'continuous',
  },
  photoPlaceholder: {
    height: 180,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    borderCurve: 'continuous',
  },
  photoActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  photoAction: {
    flex: 1,
  },
  notes: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingTop: theme.padding.sm,
  },
}));
