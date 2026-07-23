const POKEMON_ID_PATTERN = /\/pokemon\/(\d+)\/?$/;

const OFFICIAL_ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

/**
 * O endpoint de listagem não devolve a imagem, apenas `name` e `url`.
 * Mas a própria url de detalhe carrega o id do Pokémon
 * (ex.: https://pokeapi.co/api/v2/pokemon/25/), então dá para extraí-lo e
 * montar a url da arte oficial sem fazer nenhuma requisição extra.
 *
 * A alternativa seria disparar 151 requisições de detalhe só para montar a
 * Home — muito mais lento e pesado para uma tela de listagem.
 */
export function extractPokemonId(detailUrl: string): number {
  const match = POKEMON_ID_PATTERN.exec(detailUrl);

  if (!match) {
    throw new Error(`Não foi possível extrair o id da url: ${detailUrl}`);
  }

  return Number(match[1]);
}

/** Monta a url da arte oficial a partir do id. */
export function buildOfficialArtworkUrl(id: number): string {
  return `${OFFICIAL_ARTWORK_BASE_URL}/${id}.png`;
}

/** "bulbasaur" -> "Bulbasaur" (a API devolve tudo em minúsculo). */
export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
