<?php
// src/Cart.php
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Response.php';

final class Cart {
  // POST /cart/add  { "usuario_id":1, "sessao_id":10, "assento_id":55 }
  public static function add(): void {
    $in = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $usuarioId = (int)($in['usuario_id'] ?? 0);
    $sessaoId  = (int)($in['sessao_id']  ?? 0);
    $assentoId = (int)($in['assento_id'] ?? 0);
    if ($usuarioId<=0 || $sessaoId<=0 || $assentoId<=0) {
      Response::error('Parâmetros inválidos');
    }

    $pdo = Database::pdo();
    try {
      $pdo->beginTransaction();

      // Lock do assento (garante que está LIVRE e pertence à sessão)
      $lock = $pdo->prepare('SELECT id, status FROM assento WHERE id = ? AND sessao = ? FOR UPDATE');
      $lock->execute([$assentoId, $sessaoId]);
      $as = $lock->fetch();
      if (!$as) {
        $pdo->rollBack();
        Response::error('Assento não encontrado para essa sessão', 404);
      }
      if ($as['status'] !== 'LIVRE') {
        $pdo->rollBack();
        Response::error('Assento não está LIVRE', 409, ['status_atual' => $as['status']]);
      }

      // Cria ingresso (unique em assento)
      $ingIns = $pdo->prepare('INSERT INTO ingresso (sessao, assento) VALUES (?, ?)');
      $ingIns->execute([$sessaoId, $assentoId]);
      $ingressoId = (int)$pdo->lastInsertId();

      // Marca assento como RESERVADO (no carrinho)
      $upd = $pdo->prepare("UPDATE assento SET status = 'RESERVADO' WHERE id = ?");
      $upd->execute([$assentoId]);

      // Coloca no carrinho (unique usuario+ingresso)
      $cartIns = $pdo->prepare('INSERT INTO carrinho (usuario, ingresso) VALUES (?, ?)');
      $cartIns->execute([$usuarioId, $ingressoId]);

      $pdo->commit();
      Response::json(['ok' => true, 'carrinho_id' => (int)$pdo->lastInsertId(), 'ingresso_id' => $ingressoId], 201);

    } catch (PDOException $e) {
      if ($pdo->inTransaction()) $pdo->rollBack();
      // Violação UNIQUE em ingresso.assento (assento já tem ingresso)
      if ($e->getCode() === '23000') {
        Response::error('Assento já reservado/ocupado', 409);
      }
      Response::error('Falha ao adicionar ao carrinho');
    }
  }

  // GET /cart?usuario_id=1
  public static function list(): void {
    $usuarioId = (int)($_GET['usuario_id'] ?? 0);
    if ($usuarioId <= 0) Response::error('usuario_id obrigatório');

    $pdo = Database::pdo();
    $sql = "SELECT c.id AS carrinho_id,
                   i.id AS ingresso_id,
                   a.id AS assento_id, a.numero AS assento_numero, a.status AS assento_status,
                   s.id AS sessao_id, s.data, s.horario,
                   f.id AS filme_id, f.nome AS filme_nome, f.genero, f.faixa_etaria, f.duracao, f.banner
              FROM carrinho c
              JOIN ingresso i ON i.id = c.ingresso
              JOIN assento a  ON a.id = i.assento
              JOIN sessao s   ON s.id = i.sessao
              JOIN filme f    ON f.id = s.filme
             WHERE c.usuario = ?
             ORDER BY s.data, s.horario, a.numero";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$usuarioId]);
    Response::json($stmt->fetchAll());
  }

  // DELETE /cart/item/{carrinho_id}?usuario_id=1
  public static function remove(int $carrinhoId): void {
    $usuarioId = (int)($_GET['usuario_id'] ?? 0);
    if ($usuarioId <= 0) Response::error('usuario_id obrigatório');

    $pdo = Database::pdo();
    try {
      $pdo->beginTransaction();

      // Busca ingresso + assento
      $sel = $pdo->prepare('SELECT i.id AS ingresso_id, a.id AS assento_id
                              FROM carrinho c
                              JOIN ingresso i ON i.id = c.ingresso
                              JOIN assento  a ON a.id = i.assento
                             WHERE c.id = ? AND c.usuario = ?
                             FOR UPDATE');
      $sel->execute([$carrinhoId, $usuarioId]);
      $row = $sel->fetch();
      if (!$row) { $pdo->rollBack(); Response::error('Item não encontrado', 404); }

      // Remove do carrinho
      $delC = $pdo->prepare('DELETE FROM carrinho WHERE id = ? AND usuario = ?');
      $delC->execute([$carrinhoId, $usuarioId]);

      // Libera assento e remove ingresso (ainda não pago)
      $updA = $pdo->prepare("UPDATE assento SET status = 'LIVRE' WHERE id = ?");
      $updA->execute([$row['assento_id']]);

      $delI = $pdo->prepare('DELETE FROM ingresso WHERE id = ?');
      $delI->execute([$row['ingresso_id']]);

      $pdo->commit();
      Response::json(['ok' => true]);
    } catch (PDOException $e) {
      if ($pdo->inTransaction()) $pdo->rollBack();
      Response::error('Falha ao remover item do carrinho');
    }
  }
}
