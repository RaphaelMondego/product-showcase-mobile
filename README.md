# Pokédex Mobile

Pokédex com os 151 Pokémon da primeira geração, consumindo a
[PokeAPI](https://pokeapi.co/). Resolução do desafio front-end da InfinixATLab.

O enunciado pede uma aplicação web; combinei entregar em mobile (React Native +
Expo), mantendo os requisitos. As trocas de stack:

| Enunciado (web) | Aqui (mobile) |
|---|---|
| TailwindCSS | `StyleSheet` + arquivo de tokens |
| react-router-dom | expo-router |
| grid CSS | `FlatList` com colunas pela largura da tela |

**Deploy (web):** https://raphaelmondego.github.io/product-showcase-mobile/
Mesma base de código exportada para o navegador com `react-native-web`, para
avaliar sem instalar nada. A experiência real é no celular.

## Como rodar

```bash
npm install --legacy-peer-deps
npm start
```

Leia o QR Code do terminal no Expo Go (precisa da SDK 54).

A flag `--legacy-peer-deps` é necessária: o `react-dom` entra como peer opcional
do expo-router pedindo `react ^19.2.8`, mas a SDK 54 usa `react@19.1.0`. Sem a
flag o install falha com `ERESOLVE`. Como é mobile, o `react-dom` não roda em
tempo de execução.

Não há variáveis de ambiente — a PokeAPI é pública.

### Testes

```bash
npm test
```

Cobrem `src/utils/pokemon.ts`, a extração do id da url (de onde sai a imagem de
todos os cards), incluindo os casos em que a função deve lançar erro.

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

`app/` só tem telas porque o expo-router transforma cada arquivo da pasta em
rota. O resto fica em `src/`, dividido por responsabilidade — com três telas,
dividir por feature geraria pastas de um arquivo só. As telas chamam hooks, os
hooks chamam services; nenhuma tela fala com o axios direto.

## Decisões principais

**Imagem que a lista não devolve.** `/pokemon?limit=151` traz só nome e url. Em
vez de abrir as 151 urls (152 requisições no total), extraio o id da própria url
(`.../pokemon/25/`) e monto o endereço da arte oficial — uma requisição só. O
custo é depender do formato da url; foi troca consciente por desempenho.

**Dois arquivos de tipos.** `pokeapi.ts` reflete o retorno cru; `pokemon.ts` é o
que a UI usa, com altura/peso já convertidos (a API manda decímetro e
hectograma). A conversão fica no service.

**Card não lê o Context.** Fosse cada card consumir o contexto, favoritar um
re-renderizaria os 151. A Home lê o contexto uma vez e passa `isFavorite` por
prop; só o card alterado re-renderiza.

**Cache.** A lista é guardada por 24h. Na abertura, se o cache vale, a tela abre
na hora sem requisição. Puxar para atualizar ignora o cache e vai à rede.

## Funcionalidades

Essenciais: listagem dos 151 em grid responsivo, cards com nome e imagem, tela
de detalhes em rota dinâmica (nome, arte oficial, tipos, altura, peso), loading
e tratamento de erro com "tentar novamente".

Bônus: filtro por nome no cliente, Time Pokémon (Context API, até 6, com aviso
ao exceder e botão de limpar), cache local, puxar para atualizar, e time salvo
entre sessões.

O aviso de time cheio e a confirmação de limpar passam por `src/utils/notify.ts`,
porque o `Alert` do `react-native-web` é vazio e não funcionaria no navegador.
