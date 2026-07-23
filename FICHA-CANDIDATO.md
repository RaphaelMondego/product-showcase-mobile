# Ficha Candidato

## Instruções para rodar

### Variáveis de Ambiente

Não precisa de nenhuma variável de ambiente já que a PokeAPI é pública e não exige chave de acesso nem autenticação. A URL base da API foi declarada em src/services/api.ts.

### Instalando as dependências

Basta rodar o comando: `npm install --legacy-peer-deps`

A --legacy-peer-deps foi utilizada devido a versão do meu Expo SDK ser a 54 e isso acaba fixando o react na versão 19.1. O react-dom entra como dependência opcional do expo-router e pede o react na versão 19.2 O projeto por ser mobile não roda em tempo de execução, o que torna o conflito inofensivo mas sem o uso da --legacy-peer-deps o npm trava com erro ERESOLVE.

### Como rodar o projeto

Rode o comando: `npm start`. Esse comando sobe o servidor do Expo, basta ler o QR Code no terminal. O celular e o computador precisam estar na mesma rede Wifi.

## Decisões de design

### Estrutura de pastas

Separei o projeto em duas partes. A pasta app/ contém as telas já que o expo-router transforma cada arquivo dela em uma rota. Todo o resto fica em src/, dividido por responsabilidade técnica: components, hooks, services, contexts, types, theme e utils.

Minha ideia foi dividir por responsabilidade porque o projeto não é tão grande (duas telas principais). A regra que mantém organizado é que a dependência anda numa direção só: telas chamam os hooks, hooks chamam services, services usam o axios. Nenhuma tela fala com a API de forma direta.

### Dificuldades e como as superei

A maior dificuldade que encontrei foi o ponto de que o endpoint de listagem não devolve a imagem do Pokémon, só nome e URL de detalhes.

Como solução direta, percebi que dava para evitar 151 requisições extras: a URL de detalhes já traz o id do Pokémon (ex.: .../pokemon/25/), e a API serve as artes em um endereço fixo indexado por esse id. Aí eu extraí o id com regex e montei a URL da imagem direto, sem nenhuma chamada a mais, deixando a tela inteira carregar com uma única requisição.

Uma outra dificuldade que tive, logo no começo, foi o grid que não estava respondendo ao girar a tela do celular na horizontal. O código feito calculava as colunas pela largura da tela, mas o app.json vinha travado em modo retrato, então a largura nunca mudava. Descobri isso testando no aparelho e liberei a rotação.

### O que não deu tempo de fazer

Priorizei ter os requisitos essenciais e os bônus funcionando. Com mais tempo eu continuaria investindo em:

- Uma revitalização de acessibilidade (contraste, áreas de toque);
- Mais testes realizados (pude testar a parte mais crítica, a extração do id, mas daria para testar os hooks e os serviços);
- Pequenas animações de transição entre telas e no carregamento da imagem para uma melhor experiência do usuário;

## Link para deploy

https://raphaelmondego.github.io/product-showcase-mobile/

Observação: o desafio é web, mas como combinado entreguei em mobile ( React Native + Expo). Para hospedar, exportei a mesma base de código para o navegador com react-native-web e publiquei no Github Pages. Para uma melhor experiência real, seria no celular pelo Expo Go.

## Recomendações

O desafio é muito bom para testar o meu conhecimento. O desafio da imagem nos obriga a pensar antes de sair codando e achei isso muito positivo, a adaptação web para mobile foi um bom exercício de traduzir cada peça para o equivalente do React Native.

Como sugestão eu deixaria mais claro no enunciado se adaptações de stack são bem vindas ou não.
