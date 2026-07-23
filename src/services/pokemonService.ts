import { api } from './api';
import type { PokemonDetailResponse, PokemonListResponse } from '../types/pokeapi';
import type { Pokemon, PokemonDetails } from '../types/pokemon';
import { buildOfficialArtworkUrl, extractPokemonId } from '../utils/pokemon';

/** Primeira geração, conforme o escopo do desafio. */
const POKEMON_LIST_LIMIT = 151;

/** A API entrega altura em decímetros e peso em hectogramas. */
const DECIMETERS_TO_METERS = 10;
const HECTOGRAMS_TO_KILOGRAMS = 10;

/** Busca a listagem e já resolve nome, id e imagem de cada Pokémon. */
export async function fetchPokemonList(limit = POKEMON_LIST_LIMIT): Promise<Pokemon[]> {
  const { data } = await api.get<PokemonListResponse>('/pokemon', {
    params: { limit, offset: 0 },
  });

  return data.results.map((result) => {
    const id = extractPokemonId(result.url);

    return {
      id,
      name: result.name,
      imageUrl: buildOfficialArtworkUrl(id),
    };
  });
}

/** Busca os dados completos de um Pokémon pelo nome (usado na rota de detalhes). */
export async function fetchPokemonByName(name: string): Promise<PokemonDetails> {
  const { data } = await api.get<PokemonDetailResponse>(`/pokemon/${name}`);

  return {
    id: data.id,
    name: data.name,
    imageUrl:
      data.sprites.other?.['official-artwork']?.front_default ??
      data.sprites.front_default ??
      buildOfficialArtworkUrl(data.id),
    types: data.types.map((slot) => slot.type.name),
    heightInMeters: data.height / DECIMETERS_TO_METERS,
    weightInKilograms: data.weight / HECTOGRAMS_TO_KILOGRAMS,
  };
}
