# Relatório do Projeto de Desenvolvimento da GameStore

| Nome    | NUSP | 
| -------- | ------- | 
| Fabrício Sampaio   | 12547423   | 
| Arthur Pin | 12691964     | 
| Samuel Rubens Souza Oliveira    | 11912533    |

### Requisitos 
Os requisitos iniciais foram fornecidos na tarefa e incluem a existência de dois tipos de usuários (Clientes e Administradores), gerenciamento de produtos e serviços, carrinho de compras e a implementação de uma funcionalidade específica para a loja.

### Descrição do Projeto
O projeto foi desenvolvido utilizando HTML, CSS e JavaScript. Foi implementado um layout responsivo, que se adapta a diferentes tamanhos de tela e dispositivos. A estrutura das páginas inclui uma barra de navegação, conteúdo principal e rodapé. Além disso, foi criado um sistema de troca de temas (escuro, claro e solarizado) e um protótipo de dados a serem consumidos, que no caso foram intermediados pela RAWG API, que ja é especializada em jogos. Também foi implementado todos as funcionalidades da parte do cliente como: inscrição, login, busca, carrinho, checkout entre outros.

![](https://github.com/rubenszinho/gamestore/blob/develop/public/diagram.png)

### Comentários sobre o código
O código foi organizado em arquivos separados para facilitar a manutenção e a legibilidade. Os arquivos de estilo (CSS) foram separados por componentes, como navbar, game card, footer, entre outros. Os scripts (JavaScript) também foram separados por funcionalidade. A modularização e a redução de variáveis globais tornaram o código mais robusto e fácil de manter.

### Plano de Testes
Testes manuais do funcionamento.

#### Fluxo de admin
Credenciais: email: admin@admin.com, senha: admin;

Gerenciamento de jogos: Logar como admin -> Adicionar novo jogo pelo botao "+" na homepage -> Editar ou excluir jogo pelo botao "lapis" na pagina de detalhes do jogo;

Gerenciamento de usuarios: Logar como admin -> Ir para admin page -> abrir a lista de usuarios -> editar ou remover um usuario pelos botoes;

#### Fluxo de usuario

Gerenciamento do perfil: Registrar usuario na pagina de login -> fazer login -> editar usuario na pagina profile -> fazer logout;

Esqueceu senha: clicar em esqueceu a senha, na pagina de login -> criar nova senha -> testar;

Carrinho: Abrir um jogo -> adicionar ao carrinho -> fazer checkout (o carrinho permanece entre as sessoes do usuario, entao pode fazer logout e login antes de fazer o checkout);

Buscar jogos: digitar na barra de busca e clicar no botao -> conferir os resultados;

### Procedimentos de compilação
TODO
