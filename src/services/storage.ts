import AsyncStorage from '@react-native-async-storage/async-storage';

/** Prefixo em todas as chaves para não colidir com nada mais no dispositivo. */
const KEY_PREFIX = '@pokedex';

export const StorageKeys = {
  pokemonList: `${KEY_PREFIX}:lista-pokemon`,
  team: `${KEY_PREFIX}:time`,
} as const;

/** O que é gravado: o dado em si mais o instante da gravação. */
interface CacheEnvelope<T> {
  savedAt: number;
  data: T;
}

interface CachedValue<T> {
  data: T;
  /** Há quanto tempo, em milissegundos, esse dado foi guardado. */
  ageInMs: number;
}

/**
 * Lê um valor do cache. Devolve `null` se não existir ou se o conteúdo
 * estiver corrompido — nunca deixa o app quebrar por causa do cache.
 */
export async function readFromCache<T>(key: string): Promise<CachedValue<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(key);

    if (!raw) {
      return null;
    }

    const envelope = JSON.parse(raw) as CacheEnvelope<T>;

    return {
      data: envelope.data,
      ageInMs: Date.now() - envelope.savedAt,
    };
  } catch {
    /** JSON inválido ou formato antigo: trata como se não houvesse cache. */
    return null;
  }
}

/** Grava um valor carimbando o horário. Falha de escrita não derruba o app. */
export async function writeToCache<T>(key: string, data: T): Promise<void> {
  try {
    const envelope: CacheEnvelope<T> = { savedAt: Date.now(), data };
    await AsyncStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    /**
     * Cache é otimização, não requisito. Se o disco estiver cheio, o app
     * continua funcionando buscando da rede.
     */
  }
}
