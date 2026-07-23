/**
 * Tokens de estilo compartilhados.
 * Como a estilização é feita só com StyleSheet, esse arquivo faz o papel que
 * um tema/config faria: mantém cores e espaçamentos consistentes entre as
 * telas e evita valores mágicos espalhados pelos componentes.
 */

export const colors = {
  background: '#F2F2F7',
  surface: '#FFFFFF',
  primary: '#D93F3F',
  primaryDark: '#B22B2B',
  text: '#1C1C1E',
  textMuted: '#6E6E73',
  border: '#E2E2E7',
  danger: '#C1121F',
  favorite: '#F2B705',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
} as const;

export const fontSize = {
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
} as const;

/** Cor de destaque por tipo de Pokémon, usada nas badges. */
export const typeColors: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export const DEFAULT_TYPE_COLOR = '#777777';
