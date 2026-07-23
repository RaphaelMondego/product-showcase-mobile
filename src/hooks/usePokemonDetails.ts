import { useCallback, useEffect, useState } from 'react';

import { fetchPokemonByName } from '../services/pokemonService';
import type { PokemonDetails } from '../types/pokemon';

interface UsePokemonDetailsResult {
  details: PokemonDetails | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Mesma responsabilidade do usePokemonList, mas para um único Pokémon.
 * A tela de detalhes também faz requisição, então também precisa de
 * loading e tratamento de erro próprios.
 */
export function usePokemonDetails(name: string | undefined): UsePokemonDetailsResult {
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!name) {
      setError('Pokémon não informado.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setDetails(await fetchPokemonByName(name));
    } catch {
      setError('Não foi possível carregar os detalhes deste Pokémon.');
    } finally {
      setIsLoading(false);
    }
  }, [name]);

  useEffect(() => {
    void load();
  }, [load]);

  return { details, isLoading, error, reload: load };
}
