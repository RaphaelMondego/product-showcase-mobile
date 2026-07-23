import { memo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, spacing } from '../theme';
import type { Pokemon } from '../types/pokemon';
import { capitalize } from '../utils/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress: (pokemon: Pokemon) => void;
  isFavorite: boolean;
  onToggleFavorite: (pokemon: Pokemon) => void;
}

/**
 * Card da listagem. Memoizado porque a Home renderiza 151 deles.
 *
 * `isFavorite` chega por prop em vez de o card ler o contexto direto: se cada
 * card fosse consumidor do TeamContext, favoritar um Pokémon re-renderizaria
 * os 151 de uma vez. Por prop, o memo compara e só o card afetado re-renderiza.
 */
function PokemonCardComponent({
  pokemon,
  onPress,
  isFavorite,
  onToggleFavorite,
}: PokemonCardProps) {
  /**
   * A imagem é montada a partir do id, então pode não existir para todos os
   * casos. Se falhar, mostramos um espaço reservado em vez de um vão branco.
   */
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(pokemon)}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${capitalize(pokemon.name)}`}
    >
      <View style={styles.imageWrapper}>
        {imageFailed ? (
          <View style={styles.imageFallback}>
            <Text style={styles.imageFallbackText}>?</Text>
          </View>
        ) : (
          <Image
            source={{ uri: pokemon.imageUrl }}
            style={styles.image}
            resizeMode="contain"
            onError={() => setImageFailed(true)}
          />
        )}

        <Pressable
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(pokemon)}
          /** Área de toque maior que o ícone, para não competir com o card. */
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={
            isFavorite
              ? `Remover ${capitalize(pokemon.name)} do time`
              : `Adicionar ${capitalize(pokemon.name)} ao time`
          }
        >
          <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>
            {isFavorite ? '★' : '☆'}
          </Text>
        </Pressable>
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
  favoriteButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  favoriteIcon: {
    fontSize: fontSize.xl,
    color: colors.textMuted,
  },
  favoriteIconActive: {
    color: colors.favorite,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageFallbackText: {
    fontSize: fontSize.xxl,
    color: colors.textMuted,
    fontWeight: '700',
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
