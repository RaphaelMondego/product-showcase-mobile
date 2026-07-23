/**
 * Tipos que espelham fielmente o retorno da PokeAPI.
 * Ficam separados dos tipos de domínio (./pokemon.ts) para que uma mudança
 * no contrato da API não vaze direto para dentro dos componentes.
 */

/** Referência genérica usada pela API: um nome e a url do recurso completo. */
export interface NamedApiResource {
  name: string;
  url: string;
}

/** GET /pokemon?limit=151 */
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
}

export interface PokemonTypeSlot {
  slot: number;
  type: NamedApiResource;
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}

/** GET /pokemon/:name — apenas os campos que a aplicação realmente usa. */
export interface PokemonDetailResponse {
  id: number;
  name: string;
  /** Decímetros. */
  height: number;
  /** Hectogramas. */
  weight: number;
  types: PokemonTypeSlot[];
  sprites: PokemonSprites;
}
