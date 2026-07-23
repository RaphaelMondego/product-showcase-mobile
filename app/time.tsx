import { Stack, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { PokemonCard } from '../src/components/PokemonCard';
import { MAX_TEAM_SIZE, useTeam } from '../src/contexts/TeamContext';
import { colors, fontSize, spacing } from '../src/theme';
import type { Pokemon } from '../src/types/pokemon';
import { confirmAction } from '../src/utils/notify';

export default function TeamScreen() {
  const router = useRouter();
  const { team, isInTeam, toggleTeamMember, clearTeam } = useTeam();

  const openDetails = useCallback(
    (selected: Pokemon) => {
      router.push(`/pokemon/${selected.name}`);
    },
    [router],
  );

  /** Esvaziar o time é destrutivo, então confirma antes de apagar tudo. */
  const handleClearTeam = useCallback(() => {
    confirmAction(
      'Limpar time',
      'Tem certeza que deseja remover todos os Pokémon do seu time?',
      'Limpar',
      clearTeam,
    );
  }, [clearTeam]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Meu time (${team.length}/${MAX_TEAM_SIZE})`,
          headerRight: () =>
            team.length > 0 ? (
              <Pressable
                onPress={handleClearTeam}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Limpar todo o time"
              >
                <Text style={styles.clearButton}>Limpar</Text>
              </Pressable>
            ) : null,
        }}
      />

      <FlatList
        data={team}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={openDetails}
            isFavorite={isInTeam(item.id)}
            onToggleFavorite={toggleTeamMember}
          />
        )}
        extraData={team}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>☆</Text>
            <Text style={styles.emptyText}>
              Seu time está vazio. Toque na estrela de um Pokémon na listagem para
              adicioná-lo aqui.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
    flexGrow: 1,
  },
  row: {
    gap: spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    color: colors.textMuted,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
  },
  clearButton: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.danger,
  },
});
