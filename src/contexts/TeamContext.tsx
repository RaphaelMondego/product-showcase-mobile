import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { readFromCache, StorageKeys, writeToCache } from '../services/storage';
import type { Pokemon } from '../types/pokemon';

/** Um time Pokémon tem seis integrantes — é a regra do jogo, e o limite do bônus. */
export const MAX_TEAM_SIZE = 6;

/** O que aconteceu na tentativa — permite à tela avisar o usuário. */
export type ToggleTeamResult = 'adicionado' | 'removido' | 'time-cheio';

interface TeamContextValue {
  team: Pokemon[];
  isInTeam: (id: number) => boolean;
  /** Adiciona se houver vaga, remove se já estiver no time. */
  toggleTeamMember: (pokemon: Pokemon) => ToggleTeamResult;
  /** Esvazia o time de uma vez. */
  clearTeam: () => void;
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

  /**
   * Espelho do time atualizado durante a renderização.
   *
   * É o que permite ao toggleTeamMember ler o time mais recente sem declará-lo
   * como dependência. Se ele dependesse de `team`, sua identidade mudaria a
   * cada favoritada, o memo dos cards deixaria de valer e os 151 voltariam a
   * re-renderizar juntos.
   */
  const teamRef = useRef(team);
  teamRef.current = team;

  const toggleTeamMember = useCallback((pokemon: Pokemon): ToggleTeamResult => {
    const current = teamRef.current;
    const alreadyInTeam = current.some((member) => member.id === pokemon.id);

    if (alreadyInTeam) {
      setTeam(current.filter((member) => member.id !== pokemon.id));
      return 'removido';
    }

    /** Time cheio: recusa a adição em vez de derrubar alguém sem avisar. */
    if (current.length >= MAX_TEAM_SIZE) {
      return 'time-cheio';
    }

    setTeam([...current, pokemon]);
    return 'adicionado';
  }, []);

  const clearTeam = useCallback(() => setTeam([]), []);

  const value = useMemo<TeamContextValue>(
    () => ({
      team,
      isInTeam,
      toggleTeamMember,
      clearTeam,
    }),
    [team, isInTeam, toggleTeamMember, clearTeam],
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
