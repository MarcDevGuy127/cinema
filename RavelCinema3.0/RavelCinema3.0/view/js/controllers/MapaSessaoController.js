// view/js/controllers/MapaSessaoController.js

import { StoreAPI } from '../models/Store.js';
import { UserModel } from '../models/User.js';

const SESSION_KEYS = {
  filmId: 'cinema_current_film_id',
  sessaoId: 'cinema_current_sessao_id'
};

function setCurrentFilm(id) {
  sessionStorage.setItem(SESSION_KEYS.filmId, String(id));
}
function getCurrentFilm() {
  return sessionStorage.getItem(SESSION_KEYS.filmId);
}
function setCurrentSessao(id) {
  sessionStorage.setItem(SESSION_KEYS.sessaoId, String(id));
}
function getCurrentSessao() {
  return sessionStorage.getItem(SESSION_KEYS.sessaoId);
}

// Essas funções só fazem algo se existirem elementos nas páginas correspondentes.
// Se sua página de mapa só tiver o layout das poltronas, elas simplesmente “não rodam” lá.
async function carregarFilmes() {
  const lista = document.getElementById('lista-filmes');
  if (!lista) return;

  try {
    const filmes = await StoreAPI.listFilms();
    lista.innerHTML = '';

    filmes.forEach(f => {
      const card = document.createElement('div');
      card.className = 'filme-card';
      card.innerHTML = `
        <h3>${f.nome}</h3>
        <p>${f.genero ?? ''}</p>
        <button type="button" class="btn-filme" data-id="${f.id}">
          Ver sessões
        </button>
      `;
      lista.appendChild(card);
    });

    lista.addEventListener('click', async (e) => {
      const btn = e.target.closest('.btn-filme');
      if (!btn) return;
      const filmId = btn.getAttribute('data-id');
      setCurrentFilm(filmId);
      // aqui você pode trocar de hash/rota se quiser
      // ex: location.hash = '/sessao';
    });
  } catch (err) {
    console.error(err);
    lista.innerHTML = '<p>Erro ao carregar filmes.</p>';
  }
}

async function carregarSessoes() {
  const lista = document.getElementById('lista-sessoes');
  if (!lista) return;

  const filmId = getCurrentFilm();
  if (!filmId) {
    lista.innerHTML = '<p>Selecione um filme.</p>';
    return;
  }

  const inputData = document.getElementById('sessao-data'); // se existir
  const data = inputData && inputData.value ? inputData.value : undefined;

  try {
    const sessoes = await StoreAPI.listSessions({
      filmeId: parseInt(filmId),
      data
    });

    lista.innerHTML = '';
    if (!sessoes.length) {
      lista.innerHTML = '<p>Não há sessões para este filme/data.</p>';
      return;
    }

    sessoes.forEach(s => {
      const item = document.createElement('div');
      item.className = 'sessao-item';
      const horario = s.horario?.slice(0, 5) ?? '';
      item.innerHTML = `
        <span>${s.data} - ${horario}</span>
        <button type="button" class="btn-sessao" data-id="${s.id}">
          Escolher assentos
        </button>
      `;
      lista.appendChild(item);
    });

    lista.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-sessao');
      if (!btn) return;
      const sessaoId = btn.getAttribute('data-id');
      setCurrentSessao(sessaoId);
      // ex: location.hash = '/mapa_sessao';
    });
  } catch (err) {
    console.error(err);
    lista.innerHTML = '<p>Erro ao carregar sessões.</p>';
  }
}

// ----------- AQUI É O QUE IMPORTA PRO HTML DO MAPA QUE VOCÊ MANDOU -----------

async function carregarAssentos() {
  // usa o layout pronto: a grid é .container1 e cada poltrona é .poltrona (A01, B02, etc.)
  const container = document.querySelector('.container1');
  if (!container) return; // se não estiver na página do mapa, sai quietly

  const sessaoId = getCurrentSessao();
  if (!sessaoId) {
    console.warn('Sessão não selecionada (sessionStorage vazio em cinema_current_sessao_id).');
    return;
  }

  const user = UserModel.getCurrent();
  if (!user) {
    alert('Faça login para escolher assentos.');
    location.hash = '/redirecionamento';
    return;
  }

  try {
    const assentos = await StoreAPI.listSeats(parseInt(sessaoId, 10));

    // Map de numero -> objeto assento vindo do back
    const mapAssentos = new Map();
    assentos.forEach(a => {
      if (a.numero) {
        mapAssentos.set(String(a.numero).trim().toUpperCase(), a);
      }
    });

    // marca cada DIV .poltrona de acordo com o status do backend
    const nodes = container.querySelectorAll('.poltrona');
    nodes.forEach(node => {
      const label = node.textContent.trim().toUpperCase(); // ex: A01
      const info = mapAssentos.get(label);

      // limpa classes anteriores relacionadas a status
      node.classList.remove('livre', 'reservado', 'ocupado');

      if (!info) {
        // se não existe no banco, desabilita o clique visualmente
        node.classList.add('ocupado');
        node.dataset.id = '';
        node.style.opacity = '0.4';
        node.style.pointerEvents = 'none';
        return;
      }

      node.dataset.id = info.id; // vamos usar isso no clique

      const status = (info.status || '').toUpperCase();
      if (status === 'LIVRE') {
        node.classList.add('livre');
        node.style.opacity = '1';
        node.style.pointerEvents = 'auto';
      } else if (status === 'RESERVADO') {
        node.classList.add('reservado');
        node.style.opacity = '0.7';
        node.style.pointerEvents = 'none';
      } else { // OCUPADO ou qualquer outra coisa
        node.classList.add('ocupado');
        node.style.opacity = '0.4';
        node.style.pointerEvents = 'none';
      }
    });

    // clique para reservar (adicionar ao carrinho)
    container.addEventListener('click', async (e) => {
      const seatEl = e.target.closest('.poltrona');
      if (!seatEl) return;

      const assentoId = parseInt(seatEl.dataset.id || '0', 10);
      if (!assentoId) return;

      // só permite clicar se estiver livre (classe 'livre')
      if (!seatEl.classList.contains('livre')) return;

      try {
        await StoreAPI.addToCart({
          usuarioId: user.id,
          sessaoId: parseInt(sessaoId, 10),
          assentoId
        });
        alert(`Assento ${seatEl.textContent.trim()} adicionado ao carrinho.`);

        // atualiza visualmente para reservado
        seatEl.classList.remove('livre');
        seatEl.classList.add('reservado');
        seatEl.style.opacity = '0.7';
        seatEl.style.pointerEvents = 'none';
      } catch (err) {
        alert(err.message || 'Falha ao adicionar ao carrinho.');
      }
    });

  } catch (err) {
    console.error(err);
    alert('Erro ao carregar assentos.');
  }
}

async function ligarCheckout() {
  const btnCheckout = document.getElementById('btn-checkout');
  if (!btnCheckout) return;

  btnCheckout.addEventListener('click', async () => {
    const user = UserModel.getCurrent();
    if (!user) {
      alert('Faça login para finalizar a compra.');
      location.hash = '/redirecionamento';
      return;
    }

    try {
      const res = await StoreAPI.checkout(user.id);
      alert(`Compra concluída! Ingressos: ${res.total_itens}`);
      location.hash = '/marketing';
    } catch (err) {
      alert(err.message || 'Falha ao finalizar compra.');
    }
  });
}

export async function MapaSessaoController() {
  // Só fazem algo se existirem os elementos na página atual:
  await carregarFilmes();
  await carregarSessoes();
  await carregarAssentos();   // aqui ele usa seu HTML de mapa pronto
  await ligarCheckout();
}
