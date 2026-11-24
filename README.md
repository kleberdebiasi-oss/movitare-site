# Movitare Fisioterapia

Projeto da Avaliação A1.3 de Fundamentos ao Desenvolvimento Web, por Kleber Augusto de Biasi. O site usa HTML, Bootstrap, JavaScript, PHP e MySQL ou MariaDB.

## Executar no XAMPP

1. No painel do XAMPP, inicie **Apache** e **MySQL**.
2. Copie a pasta `movitare-site` para `C:\xampp\htdocs\`.
3. Abra `http://localhost/phpmyadmin/`, vá em **Importar** e selecione `banco/movitare.sql`. A exportação do phpMyAdmin cria o banco `movitare` com três tabelas e os quatro serviços iniciais. Importe em um banco novo.
4. Abra `http://localhost/movitare-site/`.

A conexão em `api/conexao.php` usa as configurações locais padrão do XAMPP (`127.0.0.1:3306`, usuário `root`, senha vazia). Se a sua instalação for diferente, defina as variáveis de ambiente `MOVITARE_DB_HOST`, `MOVITARE_DB_PORT`, `MOVITARE_DB_NAME`, `MOVITARE_DB_USER` e `MOVITARE_DB_PASSWORD` conforme necessário.

Com PHP e MySQL/MariaDB já instalados, outra forma de iniciar o site após importar o banco é rodar `php -S 127.0.0.1:8000` na raiz do projeto e abrir `http://127.0.0.1:8000/`. O PHP precisa da extensão `pdo_mysql`.

## Roteiro para a apresentação

| Seção | Fluxo | Como conferir |
| --- | --- | --- |
| Serviços | A página inicial faz um `GET` em `api/servicos.php`. O PHP executa um `SELECT` em `servicos`, e o JavaScript monta os cartões com o JSON recebido. | Edite a descrição de um serviço no phpMyAdmin e recarregue a página inicial. |
| Contato | O formulário envia um `POST` para `api/contatos.php`. Após validar os campos, o PHP insere a mensagem em `contatos`. | Envie uma mensagem de teste e confira a nova linha em **contatos → Procurar** no phpMyAdmin. |
| Orçamento | As quatro páginas de serviço enviam um `POST` para `api/orcamentos.php`. A tabela `orcamentos` relaciona o pedido ao serviço pela chave estrangeira `servico_id`. | Abra um serviço, solicite um orçamento com data futura e confira a linha em **orcamentos → Procurar**. |

Nos dois formulários, `fetch` envia os campos, e o JavaScript mostra a confirmação ou o erro devolvido pelo PHP. Os `INSERT` usam parâmetros via PDO. Para demonstrar a validação do servidor, envie um orçamento com serviço inexistente e confira o retorno HTTP `422`.

Os preços, os depoimentos, as fotos e o endereço servem à demonstração acadêmica. Mapa, vídeos e links externos dependem de acesso à internet.
