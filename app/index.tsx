import { Stack, useRouter } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { ErrorState } from '../src/components/ErrorState';
import { PokemonCard } from '../src/components/PokemonCard';
import { MAX_TEAM_SIZE, useTeam } from '../src/contexts/TeamContext';
import { usePokemonList } from '../src/hooks/usePokemonList';
import { colors, fontSize, spacing } from '../src/theme';
import type { Pokemon } from '../src/types/pokemon';

/**
 * Largura mínima confortável para um card. O número de colunas é derivado
 * dela, e não fixado em 2 — é assim que a listagem fica responsiva entre
 * celular em pé, celular deitado e tablet.
 */
const MIN_CARD_WIDTH = 160;

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { pokemon, isLoading, error, reload } = usePokemonList();
  const { team, isInTeam, toggleTeamMember } = useTeam();

  const numColumns = Math.max(2, Math.floor(width / MIN_CARD_WIDTH));

  const openDetails = useCallback(
    (selected: Pokemon) => {
      router.push(`/pokemon/${selected.name}`);
    },
    [router],
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Pokédex',
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/time')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Abrir meu time"
            >
              <Text style={styles.teamBadge}>
                ★ {team.length}/{MAX_TEAM_SIZE}
              </Text>
            </Pressable>
          ),
        }}
      />

      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.feedbackText}>Carregando Pokémon...</Text>
        </View>
      )}

      {!isLoading && error && <ErrorState message={error} onRetry={reload} />}

      {!isLoading && !error && (
        <FlatList
          data={pokemon}
          /**
           * A FlatList não recria o layout quando numColumns muda; forçar a
           * remontagem pela key é a saída recomendada pela documentação.
           */
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              onPress={openDetails}
              isFavorite={isInTeam(item.id)}
              onToggleFavorite={toggleTeamMember}
            />
          )}
          /** Sem isto a FlatList não sabe que as estrelas mudaram. */
          extraData={team}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: {
    gap: spacing.md,
  },
  feedbackText: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
  },
  teamBadge: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.favorite,
  },
});
