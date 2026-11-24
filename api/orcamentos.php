<?php

require __DIR__ . '/conexao.php';

executar('POST', function (): array {
    $servico = filter_var($_POST['servico_id'] ?? '', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    $nome = campo('nome', 'nome', 100);
    $email = email();
    $telefone = campo('telefone', 'telefone', 20);
    $endereco = campo('endereco', 'endereço', 200);
    $cidade = campo('cidade', 'cidade', 100);
    $uf = campo('uf', 'UF', 2);
    $data = campo('data', 'data desejada', 10);
    $observacoes = campo('observacoes', 'observações', 2000, false);

    if ($servico === false) {
        throw new InvalidArgumentException('Selecione um serviço válido.');
    }
    if (!preg_match('/^[0-9+() .-]{8,20}$/D', $telefone) || preg_match_all('/[0-9]/', $telefone) < 8) {
        throw new InvalidArgumentException('Informe um telefone válido.');
    }
    $estados = explode(' ', 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO');
    if (!in_array($uf, $estados, true)) {
        throw new InvalidArgumentException('Selecione um estado válido.');
    }
    $fuso = new DateTimeZone('America/Sao_Paulo');
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/D', $data)) {
        throw new InvalidArgumentException('Informe uma data no formato ano-mês-dia.');
    }
    $dataDesejada = DateTimeImmutable::createFromFormat('!Y-m-d', $data, $fuso);
    if (!$dataDesejada || $dataDesejada->format('Y-m-d') !== $data || $dataDesejada < new DateTimeImmutable('today', $fuso)) {
        throw new InvalidArgumentException('Informe uma data válida a partir de hoje.');
    }

    $consulta = conectar()->prepare(
        'INSERT INTO orcamentos (servico_id, nome, email, telefone, endereco, cidade, uf, data_desejada, observacoes)
         SELECT id, ?, ?, ?, ?, ?, ?, ?, ? FROM servicos WHERE id = ?'
    );
    $consulta->execute([$nome, $email, $telefone, $endereco, $cidade, $uf, $data, $observacoes, $servico]);
    if ($consulta->rowCount() === 0) {
        throw new InvalidArgumentException('O serviço selecionado não está disponível.');
    }

    return ['mensagem' => 'Orçamento solicitado com sucesso. O agendamento ainda precisa ser confirmado.'];
}, 201);
