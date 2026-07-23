import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, spacing } from '../theme';
import type { Pokemon } from '../types/pokemon';
import { capitalize } from '../utils/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress: (pokemon: Pokemon) => void;
}

/** Card da listagem. Memoizado porque a Home renderiza 151 deles. */
function PokemonCardComponent({ pokemon, onPress }: PokemonCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(pokemon)}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${capitalize(pokemon.name)}`}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: pokemon.imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {capitalize(pokemon.name)}
      </Text>
    </Pressable>
  );
}

export const PokemonCard = memo(PokemonCardComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
  },
  cardPressed: {
    opacity: 0.6,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    marginBottom: spacing.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  id: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: '600',
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
});
