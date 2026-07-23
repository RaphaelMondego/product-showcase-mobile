import axios from 'axios';

/**
 * Instância única do axios para a PokeAPI.
 * Centralizar aqui evita repetir a baseURL em cada chamada e dá um único
 * lugar para configurar timeout, headers ou interceptors no futuro.
 */
export const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000,
});
