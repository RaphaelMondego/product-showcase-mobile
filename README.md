# Pokédex Mobile

Aplicativo mobile que lista os 151 Pokémon da primeira geração e mostra os
detalhes de cada um, consumindo a [PokeAPI](https://pokeapi.co/).

Este projeto é a resolução do desafio front-end da InfinixATLab. O enunciado
original pede uma aplicação **web**; foi combinado entregá-la em **mobile**,
mantendo todos os requisitos funcionais.

## Onde ver funcionando

**Versão web:** https://raphaelmondego.github.io/product-showcase-mobile/

Esta é a mesma base de código exportada para o navegador com `react-native-web`,
publicada no GitHub Pages. Serve para avaliar o projeto sem precisar instalar
nada. Para a experiência real, rode no celular seguindo as instruções abaixo:
gestos, alertas nativos e navegação em pilha se comportam como um aplicativo.

### Diferenças conhecidas na versão web

| Recurso | Celular | Navegador |
|---|---|---|
| Aviso de time completo | alerta nativo do sistema | diálogo do navegador |
| Puxar para atualizar | gesto de arrastar | disponível, mas pouco natural com mouse |
| Time salvo entre sessões | armazenamento do aplicativo | `localStorage` do navegador |

O `Alert` do `react-native-web` é uma função vazia — chamá-lo no navegador não
exibe nada. Por isso os avisos passam por `src/utils/notify.ts`, que escolhe o
mecanismo adequado a cada plataforma.

## Equivalências entre o enunciado e a entrega

| Enunciado (web) | Entrega (mobile) |
|---|---|
| React | React Native com Expo |
| TailwindCSS | `StyleSheet` do React Native + arquivo de tokens |
| react-router-dom | expo-router (roteamento baseado em arquivos) |
| Grid CSS responsivo | `FlatList` com colunas calculadas pela largura da tela |
| TypeScript | TypeScript |
| Axios | Axios |

## Como rodar

### Pré-requisitos

- Node.js 18 ou superior
- Aplicativo **Expo Go** no celular, compatível com o **SDK 54**
- Celular e computador na mesma rede Wi-Fi

### Instalação

```bash
npm install --legacy-peer-deps
```

> A flag `--legacy-peer-deps` é necessária. O `react-dom` entra na árvore de
> dependências como peer opcional do expo-router e pede `react ^19.2.8`,
> enquanto o Expo SDK 54 fixa o `react@19.1.0`. Como este projeto é mobile, o
> `react-dom` nunca é carregado em tempo de execução — o conflito existe no
> papel e é inofensivo na prática. Sem a flag, o `npm install` falha com
> `ERESOLVE`.

### Execução

```bash
npm start
```

Leia o QR Code exibido no terminal com o Expo Go, ou digite manualmente o
endereço `exp://SEU_IP_LOCAL:8081` no aplicativo.

### Testes

```bash
npm test
```

A suíte cobre `src/utils/pokemon.ts`, onde mora a extração do id a partir da url
de detalhes — a peça de que depende a imagem de todos os cards da listagem.
Além do caminho feliz, os testes verificam que a função **falha de forma
explícita** diante de uma url inesperada, em vez de devolver um valor inválido
que só apareceria como imagem quebrada na tela.

### Variáveis de ambiente

**Nenhuma.** A PokeAPI é pública e não exige chave de acesso ou autenticação.
A URL base está declarada em `src/services/api.ts`.

## Estrutura de pastas

```
app/                        rotas da aplicação (lidas pelo expo-router)
  _layout.tsx               layout raiz: navegação em pilha e provider global
  index.tsx                 rota "/"                 -> listagem
  time.tsx                  rota "/time"             -> time favoritado
  pokemon/[name].tsx        rota "/pokemon/:name"    -> detalhes

src/
  components/               peças de UI reutilizáveis
  contexts/                 estado global (time do usuário)
  hooks/                    ciclo de vida das requisições
  services/                 comunicação com a API e com o armazenamento local
  theme/                    cores, espaçamentos, tamanhos e raios
  types/                    interfaces TypeScript
  utils/                    funções puras auxiliares
```

### Por que essa separação

**`app/` contém apenas telas.** O expo-router transforma automaticamente cada
arquivo dessa pasta em uma rota. Colocar um componente ou um serviço ali faria
o roteador tentar tratá-lo como tela. A fronteira entre `app/` e `src/` não é
estética — ela é imposta pela ferramenta.

**`src/` é dividido por responsabilidade técnica**, e não por funcionalidade.
Com apenas três telas, uma divisão por feature geraria pastas de um arquivo
cada. Para este tamanho, agrupar por papel é mais direto de navegar.

**As dependências correm em uma direção só:**

```
telas -> hooks -> services -> utils
             \       /
              > types <
```

Nenhuma tela chama o axios diretamente e nenhum serviço sabe que existe
interface. É isso que permite trocar uma camada sem tocar nas outras.

## Decisões de implementação

### O endpoint de listagem não devolve imagens

`GET /pokemon?limit=151` retorna apenas `name` e uma `url` de detalhes. A saída
direta seria visitar as 151 urls para obter cada imagem — 152 requisições para
desenhar uma tela de lista.

A url de detalhes, porém, já carrega o id (`.../pokemon/25/`). Extraindo esse id
é possível montar o endereço da arte oficial sem nenhuma requisição extra,
reduzindo a montagem da tela a **uma única chamada**.

O custo dessa escolha é um acoplamento maior: ela depende do formato da url e do
repositório de sprites mantido pela PokeAPI. Foi uma troca consciente entre
resiliência e desempenho. Na tela de detalhes, onde só existe um Pokémon, a
imagem é lida do próprio payload, e o endereço montado serve apenas de reserva.

### Dois arquivos de tipos, não um

- `src/types/pokeapi.ts` espelha o retorno cru da API
- `src/types/pokemon.ts` descreve o formato que as telas consomem

A PokeAPI devolve altura em decímetros e peso em hectogramas. A conversão
acontece na camada de serviço, e os campos do domínio carregam a unidade no
nome (`heightInMeters`, `weightInKilograms`). Nenhum componente precisa saber
que existe conversão.

### O card não consome o Context

Todo componente que lê um contexto re-renderiza quando o valor do contexto muda,
e `memo` não impede isso — ele compara props, não contexto. Com 151 cards em
tela, favoritar um Pokémon dispararia 151 re-renderizações.

Por isso a Home consome o contexto uma única vez e passa `isFavorite` por prop.
O `memo` do card então compara e apenas o card afetado re-renderiza.

Pela mesma razão, a função de favoritar lê o time atual através de uma
referência (`useRef`) em vez de declará-lo como dependência. Assim ela devolve
o resultado da tentativa — `adicionado`, `removido` ou `time-cheio` — sem nunca
mudar de identidade e sem invalidar a memoização dos cards.

### Cache antes da rede

A listagem é guardada no dispositivo com um carimbo de tempo e validade de 24
horas. Na abertura, o cache é consultado primeiro: se estiver válido, a tela
aparece instantaneamente e nenhuma requisição é feita.

Se a rede falhar e existir cache vencido, o dado antigo é exibido em vez de uma
tela de erro — navegar com informação desatualizada é melhor que não navegar.
O gesto de puxar para atualizar ignora o cache de propósito e vai direto à rede.

## Funcionalidades

### Requisitos essenciais

- [x] Estrutura de pastas organizada e justificada
- [x] Camada de serviço com axios
- [x] Tipagem com interfaces, sem uso de `any`
- [x] Listagem dos 151 Pokémon em grid responsivo, com cards clicáveis
- [x] Tela de detalhes em rota dinâmica, com nome, arte oficial, tipos, altura e peso
- [x] Indicador de carregamento durante as requisições

### Bônus

- [x] Filtro por nome, aplicado no cliente
- [x] Time Pokémon via Context API, limitado a seis integrantes
- [x] Cache local da listagem, com validade de 24 horas
- [x] Atualização manual pelo gesto de puxar para atualizar
- [x] Time preservado entre sessões, no armazenamento do dispositivo

### Como usar o Time Pokémon

Toque na estrela no canto de qualquer card para adicionar o Pokémon ao time. O
contador no cabeçalho da listagem mostra quantos foram escolhidos e leva à tela
do time ao ser tocado. Ao tentar adicionar um sétimo, um aviso explica o limite
em vez de o toque simplesmente não surtir efeito. O time é gravado no aparelho e
continua disponível depois de fechar e reabrir o aplicativo.

## Tratamento de erros

As duas telas compartilham o mesmo componente de falha, que sempre oferece a
ação de tentar novamente — mostrar um erro sem oferecer saída deixa o usuário
sem alternativa a fechar o aplicativo.

Na listagem, a falha de rede só vira tela de erro quando não há absolutamente
nada em cache. Havendo dado guardado, mesmo vencido, ele é exibido: navegar com
informação desatualizada é melhor que não navegar.
