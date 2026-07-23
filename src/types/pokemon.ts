/**
 * Tipos de domínio: o formato que a UI consome.
 * As unidades já vêm convertidas e a imagem já vem resolvida, para que
 * nenhuma tela precise conhecer os detalhes do payload da PokeAPI.
 */

/** Item da listagem da Home. */
export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
}

/** Dados completos exibidos na tela de detalhes. */
export interface PokemonDetails extends Pokemon {
  types: string[];
  /** Metros. */
  heightInMeters: number;
  /** Quilogramas. */
  weightInKilograms: number;
}
