/**
 * Erro de domínio para quando a API responde que o Pokémon não existe.
 *
 * Sem ele, um 404 e uma queda de rede chegam à tela como a mesma coisa, e o
 * usuário lê "verifique sua conexão" quando a conexão está perfeita.
 */
export class PokemonNotFoundError extends Error {
  readonly pokemonName: string;

  constructor(pokemonName: string) {
    super(`Pokémon "${pokemonName}" não encontrado.`);
    this.name = 'PokemonNotFoundError';
    this.pokemonName = pokemonName;
  }
}
