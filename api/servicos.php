<?php

require __DIR__ . '/conexao.php';

executar('GET', function (): array {
    $consulta = conectar()->query(
        'SELECT id, nome, descricao, preco, imagem, icone, pagina FROM servicos ORDER BY id'
    );

    return ['servicos' => $consulta->fetchAll()];
});
