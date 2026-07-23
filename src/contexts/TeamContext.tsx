import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { readFromCache, StorageKeys, writeToCache } from '../services/storage';
import type { Pokemon } from '../types/pokemon';

/** Um time Pokémon tem seis integrantes — é a regra do jogo, e o limite do bônus. */
export const MAX_TEAM_SIZE = 6;

interface TeamContextValue {
  team: Pokemon[];
  isInTeam: (id: number) => boolean;
  /** Adiciona se houver vaga, remove se já estiver no time. */
  toggleTeamMember: (pokemon: Pokemon) => void;
  isFull: boolean;
}

const TeamContext = createContext<TeamContextValue | null>(null);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [team, setTeam] = useState<Pokemon[]>([]);
  /** Enquanto false, o time guardado no dispositivo ainda não foi lido. */
  const [isHydrated, setIsHydrated] = useState(false);

  /** Restaura o time salvo na abertura do aplicativo. */
  useEffect(() => {
    async function restoreTeam() {
      const saved = await readFromCache<Pokemon[]>(StorageKeys.team);

      if (saved?.data?.length) {
        setTeam(saved.data.slice(0, MAX_TEAM_SIZE));
      }

      setIsHydrated(true);
    }

    void restoreTeam();
  }, []);

  /**
   * Salva a cada alteração — menos antes da restauração terminar.
   * Sem essa guarda, o estado inicial vazio sobrescreveria no disco o time
   * que acabou de ser lido, e os favoritos sumiriam a cada abertura.
   */
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void writeToCache(StorageKeys.team, team);
  }, [team, isHydrated]);

  const isInTeam = useCallback(
    (id: number) => team.some((member) => member.id === id),
    [team],
  );

  const toggleTeamMember = useCallback((pokemon: Pokemon) => {
    setTeam((current) => {
      const alreadyInTeam = current.some((member) => member.id === pokemon.id);

      if (alreadyInTeam) {
        return current.filter((member) => member.id !== pokemon.id);
      }

      /** Time cheio: ignora a adição em vez de derrubar alguém sem avisar. */
      if (current.length >= MAX_TEAM_SIZE) {
        return current;
      }

      return [...current, pokemon];
    });
  }, []);

  const value = useMemo<TeamContextValue>(
    () => ({
      team,
      isInTeam,
      toggleTeamMember,
      isFull: team.length >= MAX_TEAM_SIZE,
    }),
    [team, isInTeam, toggleTeamMember],
  );

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

/**
 * Lança erro se usado fora do provider. É melhor quebrar na hora, com uma
 * mensagem clara, do que devolver undefined e estourar em algum lugar distante.
 */
export function useTeam(): TeamContextValue {
  const context = useContext(TeamContext);

  if (!context) {
    throw new Error('useTeam precisa estar dentro de um TeamProvider.');
  }

  return context;
}
