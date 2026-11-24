<?php

require __DIR__ . '/conexao.php';

executar('POST', function (): array {
    $nome = campo('nome', 'nome', 100);
    $email = email();
    $mensagem = campo('mensagem', 'mensagem', 3000);

    $consulta = conectar()->prepare(
        'INSERT INTO contatos (nome, email, mensagem) VALUES (?, ?, ?)'
    );
    $consulta->execute([$nome, $email, $mensagem]);

    return ['mensagem' => 'Mensagem registrada com sucesso.'];
}, 201);
