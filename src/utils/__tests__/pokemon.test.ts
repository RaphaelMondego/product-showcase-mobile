import { buildOfficialArtworkUrl, capitalize, extractPokemonId } from '../pokemon';

describe('extractPokemonId', () => {
  it('extrai o id de uma url de detalhe da PokeAPI', () => {
    expect(extractPokemonId('https://pokeapi.co/api/v2/pokemon/1/')).toBe(1);
    expect(extractPokemonId('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
    expect(extractPokemonId('https://pokeapi.co/api/v2/pokemon/151/')).toBe(151);
  });

  it('funciona com ou sem a barra final', () => {
    expect(extractPokemonId('https://pokeapi.co/api/v2/pokemon/7')).toBe(7);
    expect(extractPokemonId('https://pokeapi.co/api/v2/pokemon/7/')).toBe(7);
  });

  /**
   * A versão 2 da API tem um "2" no caminho. O id precisa vir do fim da url,
   * não do primeiro número que aparecer.
   */
  it('ignora numeros que nao sejam o id no fim da url', () => {
    expect(extractPokemonId('https://pokeapi.co/api/v2/pokemon/132/')).toBe(132);
  });

  it('falha alto quando a url nao tem o formato esperado', () => {
    expect(() => extractPokemonId('https://pokeapi.co/api/v2/berry/1/')).toThrow();
    expect(() => extractPokemonId('https://pokeapi.co/api/v2/pokemon/pikachu/')).toThrow();
    expect(() => extractPokemonId('')).toThrow();
  });
});

describe('buildOfficialArtworkUrl', () => {
  it('monta o endereco da arte oficial a partir do id', () => {
    expect(buildOfficialArtworkUrl(25)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    );
  });

  it('encadeia com a extracao de id', () => {
    const id = extractPokemonId('https://pokeapi.co/api/v2/pokemon/6/');
    expect(buildOfficialArtworkUrl(id)).toContain('/6.png');
  });
});

describe('capitalize', () => {
  it('coloca a primeira letra em maiuscula', () => {
    expect(capitalize('bulbasaur')).toBe('Bulbasaur');
  });

  it('nao quebra com string vazia', () => {
    expect(capitalize('')).toBe('');
  });

  it('preserva nomes compostos da API', () => {
    expect(capitalize('nidoran-f')).toBe('Nidoran-f');
  });
});
