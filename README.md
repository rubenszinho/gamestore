# Relatório do Projeto de Desenvolvimento da GameStore - Milestone 1

## Data: 03/05/2023

### Requisitos 
Os requisitos iniciais foram fornecidos na tarefa e incluem a existência de dois tipos de usuários (Clientes e Administradores), gerenciamento de produtos e serviços, carrinho de compras e a implementação de uma funcionalidade específica para a loja. Durante o desenvolvimento, surgiram novas necessidades, como ajustes no layout para exibir corretamente os cartões dos jogos em grid e criação de um template para botões.

### Descrição do Projeto
O projeto foi desenvolvido utilizando HTML, CSS e JavaScript. Foi implementado um layout responsivo, que se adapta a diferentes tamanhos de tela e dispositivos. A estrutura das páginas inclui uma barra de navegação, conteúdo principal e rodapé. Além disso, foi criado um sistema de troca de temas (escuro, claro e solarizado) e um protótipo de dados a serem consumidos, que no caso foram intermediados pela RAWG API, que ja é especializada em jogos.

### Comentários sobre o código
O código foi organizado em arquivos separados para facilitar a manutenção e a legibilidade. Os arquivos de estilo (CSS) foram separados por componentes, como navbar, game card, footer, entre outros. Os scripts (JavaScript) também foram separados por funcionalidade. A modularização e a redução de variáveis globais tornaram o código mais robusto e fácil de manter.

### Plano de Testes
Os testes serão realizados manualmente, verificando se todas as funcionalidades requeridas estão funcionando corretamente e se o layout se adapta adequadamente a diferentes dispositivos e tamanhos de tela. Serão verificados também possíveis problemas de usabilidade e acessibilidade.

### Resultados dos Testes
Os testes manuais revelaram problemas no layout dos cartões dos jogos, que foram corrigidos durante o desenvolvimento. A solução implementada resolveu os problemas encontrados, e o projeto atende aos requisitos iniciais e adicionais.

### Procedimentos de compilação
Para executar o projeto, é necessário ter um navegador moderno, como Google Chrome, Mozilla Firefox ou Microsoft Edge. Basta abrir o arquivo "index.html" no navegador e navegar pelas páginas do projeto. Não há necessidade de instalar softwares adicionais.

### Problemas
Alguns dos principais problemas encontrados durante o desenvolvimento incluem a exibição incorreta dos cartões dos jogos no layout em grid, a falta de modularização, a existência de variáveis globais, e dificuldades na implementação dos temas e na personalização da barra de pesquisa.

Estilos de tema:
Inicialmente, discutimos a implementação de diferentes estilos de tema para o projeto. Trabalhamos na criação de três temas diferentes: escuro, claro e solarizado. Encontramos algumas dificuldades ao aplicar esses estilos aos componentes, mas, após algumas correções, conseguimos implementá-los com sucesso.

O projeto em questão tem como objetivo criar um site de jogos onde usuários possam navegar por diferentes categorias de jogos, visualizar informações sobre os jogos e pesquisar por jogos específicos. Para isso, foi utilizado JavaScript para fazer chamadas de API e preencher as páginas com informações sobre os jogos.

Modularização dos estilos:
Discutimos também a modularização dos estilos para tornar o código mais organizado e manter os componentes separados. Implementamos o uso de arquivos .css separados para cada componente, como Navbar.module.css, Footer.module.css e GameCard.module.css, e utilizamos um arquivo global (globals.css) para armazenar as variáveis de cores do tema.

Ajustes na barra de navegação:
Abordamos a questão do alinhamento dos elementos na barra de navegação. Para melhorar o design, alinhamos os textos da barra de navegação à esquerda e o botão de alternância de tema e a barra de pesquisa à direita.

Personalização da barra de pesquisa:
Trabalhamos na personalização da barra de pesquisa para que ela tivesse um estilo semelhante ao Material Design e se adaptasse aos temas de cores aplicados.

Ajustes nos cartões de jogos:
Realizamos várias alterações nos estilos dos cartões de jogos, como reduzir o espaço entre a imagem e o conteúdo, e alinhar os preços entre os cartões, independentemente da quantidade de linhas no título do jogo. Depois, modificamos a posição do preço, fazendo-o aparecer sobre a miniatura do jogo, com um fundo levemente desfocado.

Durante a discussão, identificamos algumas dificuldades no código, como a falta de modularização e a existência de variáveis globais. Isso tornava o código menos legível e dificultava a manutenção. Para resolver esses problemas, foram feitas alterações no código para torná-lo mais modular e menos dependente de variáveis globais.

Além disso, percebemos que havia um problema na página de pesquisa, que deixava de funcionar quando adicionamos um carrossel de banners na página inicial. Para resolver esse problema, fizemos uma alteração no código para verificar se a página atual era a de pesquisa antes de tentar preencher o carrossel de banners.

Outra dificuldade encontrada foi na hora de popular o carrossel de banners com as informações dos jogos. Inicialmente, tentamos utilizar o mesmo array de jogos que já havia sido buscado na página inicial, mas percebemos que isso não funcionava devido à diferença no formato das informações. Então, fizemos uma nova chamada de API para buscar somente as informações necessárias para preencher os banners do carrossel.

No final, conseguimos solucionar esses problemas e deixar o código mais limpo e organizado. Ainda há espaço para melhorias, mas o código atual já é mais robusto e fácil de manter.

### Comentários
Este projeto foi uma oportunidade de aprendizado e aprimoramento das habilidades em desenvolvimento web, resolução de problemas e criação de soluções eficientes. A colaboração e o suporte durante o desenvolvimento foram fundamentais para o sucesso do projeto. O projeto apresenta agora uma interface atraente e bem organizada, com componentes modulares e temas personalizáveis, atendendo aos requisitos solicitados.