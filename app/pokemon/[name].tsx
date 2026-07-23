import { Stack, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ErrorState } from '../../src/components/ErrorState';
import { usePokemonDetails } from '../../src/hooks/usePokemonDetails';
import {
  colors,
  DEFAULT_TYPE_COLOR,
  fontSize,
  radius,
  spacing,
  typeColors,
} from '../../src/theme';
import { capitalize } from '../../src/utils/pokemon';

export default function PokemonDetailsScreen() {
  /** O nome vem do próprio nome do arquivo: [name].tsx -> params.name */
  const { name } = useLocalSearchParams<{ name: string }>();
  const { details, isLoading, error, reload } = usePokemonDetails(name);

  const title = name ? capitalize(name) : 'Detalhes';

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title }} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !details) {
    return (
      <View style={styles.centered}>
        <Stack.Screen options={{ title }} />
        <ErrorState message={error ?? 'Pokémon não encontrado.'} onRetry={reload} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Stack.Screen options={{ title: capitalize(details.name) }} />

      <View style={styles.imageWrapper}>
        <Image source={{ uri: details.imageUrl }} style={styles.image} resizeMode="contain" />
      </View>

      <Text style={styles.id}>#{String(details.id).padStart(3, '0')}</Text>
      <Text style={styles.name}>{capitalize(details.name)}</Text>

      <View style={styles.types}>
        {details.types.map((type) => (
          <View
            key={type}
            style={[styles.typeBadge, { backgroundColor: typeColors[type] ?? DEFAULT_TYPE_COLOR }]}
          >
            <Text style={styles.typeText}>{capitalize(type)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.attributes}>
        <View style={styles.attribute}>
          <Text style={styles.attributeLabel}>Altura</Text>
          <Text style={styles.attributeValue}>
            {details.heightInMeters.toFixed(1).replace('.', ',')} m
          </Text>
        </View>

        <View style={styles.attributeDivider} />

        <View style={styles.attribute}>
          <Text style={styles.attributeLabel}>Peso</Text>
          <Text style={styles.attributeValue}>
            {details.weightInKilograms.toFixed(1).replace('.', ',')} kg
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 280,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  id: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
    fontWeight: '600',
  },
  name: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  types: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  typeBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
  },
  typeText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: fontSize.md,
  },
  attributes: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
  },
  attribute: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  attributeDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
  },
  attributeLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  attributeValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
});
