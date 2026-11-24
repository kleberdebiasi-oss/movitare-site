<?php

declare(strict_types=1);

function conectar(): PDO
{
    $host = getenv('MOVITARE_DB_HOST') ?: '127.0.0.1';
    $porta = getenv('MOVITARE_DB_PORT') ?: '3306';
    $banco = getenv('MOVITARE_DB_NAME') ?: 'movitare';
    $usuario = getenv('MOVITARE_DB_USER') ?: 'root';
    $senha = getenv('MOVITARE_DB_PASSWORD') ?: '';

    return new PDO("mysql:host=$host;port=$porta;dbname=$banco;charset=utf8mb4", $usuario, $senha, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}

function responder(int $status, array $dados): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

function executar(string $metodo, callable $operacao, int $status = 200): void
{
    if ($_SERVER['REQUEST_METHOD'] !== $metodo) {
        header("Allow: $metodo");
        responder(405, ['mensagem' => 'Método não permitido.']);
    }

    try {
        responder($status, $operacao());
    } catch (InvalidArgumentException $erro) {
        responder(422, ['mensagem' => $erro->getMessage()]);
    } catch (PDOException $erro) {
        error_log('Movitare: falha no banco de dados (' . $erro->getCode() . ').');
        responder(500, ['mensagem' => 'Não foi possível acessar o banco. Tente novamente mais tarde.']);
    }
}

function campo(string $chave, string $rotulo, int $limite, bool $obrigatorio = true): string
{
    $entrada = $_POST[$chave] ?? '';
    $valor = is_string($entrada) ? trim($entrada) : null;
    $tamanho = $valor === null ? false : preg_match_all('/./us', $valor);

    if ($tamanho === false || $tamanho > $limite || ($obrigatorio && $valor === '')) {
        throw new InvalidArgumentException("Confira o campo $rotulo. Limite de $limite caracteres.");
    }

    return $valor;
}

function email(): string
{
    $valor = campo('email', 'e-mail', 254);
    if (!filter_var($valor, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Informe um e-mail válido.');
    }

    return $valor;
}
