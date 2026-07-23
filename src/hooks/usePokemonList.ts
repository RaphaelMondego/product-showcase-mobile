import { useCallback, useEffect, useState } from 'react';

import { fetchPokemonList } from '../services/pokemonService';
import type { Pokemon } from '../types/pokemon';

interface UsePokemonListResult {
  pokemon: Pokemon[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Isola o ciclo de vida da busca da listagem (loading, erro e recarga) para
 * que a tela cuide apenas de renderizar.
 */
export function usePokemonList(): UsePokemonListResult {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setPokemon(await fetchPokemonList());
    } catch {
      setError('Não foi possível carregar os Pokémon. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { pokemon, isLoading, error, reload: load };
}
