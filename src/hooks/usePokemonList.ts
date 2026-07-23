import { useCallback, useEffect, useState } from 'react';

import { fetchPokemonList } from '../services/pokemonService';
import { readFromCache, StorageKeys, writeToCache } from '../services/storage';
import type { Pokemon } from '../types/pokemon';

/**
 * Por quanto tempo a lista guardada continua válida.
 * A primeira geração não muda nunca, então um dia é até conservador.
 */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface UsePokemonListResult {
  pokemon: Pokemon[];
  isLoading: boolean;
  /** Diferente de isLoading: já existe conteúdo na tela, só está atualizando. */
  isRefreshing: boolean;
  error: string | null;
  reload: () => void;
  refresh: () => void;
}

export function usePokemonList(): UsePokemonListResult {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Busca na rede e atualiza o cache. Usado tanto na carga quanto no refresh. */
  const fetchAndCache = useCallback(async () => {
    const fresh = await fetchPokemonList();
    setPokemon(fresh);
    await writeToCache(StorageKeys.pokemonList, fresh);
  }, []);

  /**
   * Carga inicial: tenta o cache antes da rede.
   * Se houver dado guardado e ainda válido, a tela aparece instantaneamente e
   * nenhuma requisição é feita.
   */
  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const cached = await readFromCache<Pokemon[]>(StorageKeys.pokemonList);

    if (cached && cached.ageInMs < CACHE_TTL_MS && cached.data.length > 0) {
      setPokemon(cached.data);
      setIsLoading(false);
      return;
    }

    try {
      await fetchAndCache();
    } catch {
      /**
       * Rede falhou. Se houver cache vencido, é melhor mostrar dado velho do
       * que uma tela de erro — o usuário continua navegando offline.
       */
      if (cached && cached.data.length > 0) {
        setPokemon(cached.data);
      } else {
        setError('Não foi possível carregar os Pokémon. Verifique sua conexão.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchAndCache]);

  /** Puxar para atualizar: ignora o cache de propósito e vai direto na rede. */
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      await fetchAndCache();
    } catch {
      setError('Não foi possível atualizar a lista. Verifique sua conexão.');
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchAndCache]);

  useEffect(() => {
    void load();
  }, [load]);

  return { pokemon, isLoading, isRefreshing, error, reload: load, refresh };
}
