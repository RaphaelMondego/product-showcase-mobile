import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fontSize, radius, spacing } from '../theme';

interface SearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
}

/** Campo de busca da Home. O filtro em si acontece no cliente, sem nova requisição. */
export function SearchInput({ value, onChangeText }: SearchInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar por nome"
        placeholderTextColor={colors.textMuted}
        /** A API devolve tudo minúsculo; corrigir teclado evita busca vazia. */
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Buscar Pokémon por nome"
      />

      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8} accessibilityLabel="Limpar busca">
          <Text style={styles.clear}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  icon: {
    fontSize: fontSize.md,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
  },
  clear: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
    paddingHorizontal: spacing.xs,
  },
});
