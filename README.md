# Pokédex Mobile

Pokédex com os 151 Pokémon da primeira geração, consumindo a
[PokeAPI](https://pokeapi.co/). Desafio front-end da InfinixATLab, entregue em
React Native + Expo (o enunciado é web; as decisões estão na FICHA-CANDIDATO).

**Deploy web:** https://raphaelmondego.github.io/product-showcase-mobile/

## Como rodar

```bash
npm install --legacy-peer-deps
npm start
```

Leia o QR Code no Expo Go (SDK 54). Não há variáveis de ambiente.

A flag `--legacy-peer-deps` é necessária por um conflito de peer entre o
`react-dom` (peer opcional do expo-router) e o `react@19.1.0` da SDK 54.

### Testes

```bash
npm test
```

## Estrutura

```
app/                rotas (expo-router)
  _layout.tsx       Stack + provider do time
  index.tsx         / (listagem)
  time.tsx          /time (favoritos)
  pokemon/[name].tsx  /pokemon/:name (detalhes)

src/
  components/       UI reutilizável
  contexts/         time do usuário (Context API)
  hooks/            loading/erro das requisições
  services/         axios e armazenamento local
  theme/            cores e espaçamentos
  types/            interfaces
  utils/            funções puras
```

## Funcionalidades

Essenciais: listagem dos 151 em grid responsivo, cards com nome e imagem, tela
de detalhes em rota dinâmica (nome, arte oficial, tipos, altura, peso), loading
e tratamento de erro.

Bônus: filtro por nome, Time Pokémon (Context API, até 6, com limpar), cache
local, puxar para atualizar, e time salvo entre sessões.
