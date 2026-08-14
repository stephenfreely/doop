import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { Field } from '@/components/Field/Field';
import { LoadingState } from '@/components/LoadingState/LoadingState';
import { Screen } from '@/components/Screen/Screen';
import { AppText } from '@/components/Text/AppText';
import { useGetUser } from '@/features/auth/hooks/useGetUser';
import { DogAvatar } from '@/features/dogs/components/DogAvatar';
import { useGetDog } from '@/features/dogs/hooks/useGetDog';
import { useUpdateDog } from '@/features/dogs/hooks/useUpdateDog';
import { dogSchema } from '@/features/dogs/schemas/dogSchema';
import type { Dog } from '@/features/dogs/types/dog';
import { fieldErrors } from '@/utils/formErrors';

export function DogProfileScreen() {
  const { data: user } = useGetUser();
  const { data: dog, isLoading, isError, error, refetch } = useGetDog(user?.id);

  if (isLoading) {
    return (
      <Screen>
        <LoadingState message="Loading dog profile…" />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <ErrorState
          title="Could not load dog"
          message={error.message}
          onRetry={() => void refetch()}
        />
      </Screen>
    );
  }

  return <DogProfileForm ownerId={user?.id} existing={dog ?? null} />;
}

type DogProfileFormProps = {
  ownerId: string | undefined;
  existing: Dog | null;
};

function DogProfileForm({ ownerId, existing }: DogProfileFormProps) {
  const updateDog = useUpdateDog(ownerId);
  const [name, setName] = useState(existing?.name ?? '');
  const [breed, setBreed] = useState(existing?.breed ?? '');
  const [photoUrl, setPhotoUrl] = useState(existing?.photoUrl ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setErrors({ photoUrl: 'Photo library permission is required.' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUrl(result.assets[0].uri);
    }
  }

  async function onSave() {
    const parsed = dogSchema.safeParse({
      name,
      breed,
      photoUrl,
    });

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setErrors({});
    await updateDog.mutateAsync({
      name: parsed.data.name,
      breed: parsed.data.breed || undefined,
      photoUrl: parsed.data.photoUrl || undefined,
    });
  }

  return (
    <Screen>
      <AppText variant="title">
        {existing ? 'Dog profile' : 'Add your dog'}
      </AppText>

      <Card>
        <View style={styles.avatarRow}>
          <DogAvatar
            name={name || existing?.name || 'Dog'}
            photoUrl={photoUrl || existing?.photoUrl}
            size="lg"
          />
          <Button
            title="Choose photo"
            variant="secondary"
            icon="images-outline"
            onPress={() => void pickPhoto()}
          />
        </View>

        <Field
          label="Name"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <Field
          label="Breed (optional)"
          value={breed}
          onChangeText={setBreed}
          error={errors.breed}
        />

        {updateDog.isError && (
          <AppText variant="caption">{updateDog.error.message}</AppText>
        )}
        {updateDog.isSuccess && (
          <AppText variant="caption">Profile saved.</AppText>
        )}

        <Button
          title={updateDog.isPending ? 'Saving…' : 'Save dog'}
          disabled={updateDog.isPending}
          onPress={() => void onSave()}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  avatarRow: {
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingBottom: theme.padding.sm,
  },
}));
