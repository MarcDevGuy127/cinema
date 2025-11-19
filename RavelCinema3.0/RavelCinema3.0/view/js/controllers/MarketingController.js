// view/js/controllers/MarketingController.js
import { Store, StoreAPI } from '../models/Store.js';

export async function MarketingController() {
  const tabs = ['Todas', 'Lançamentos', 'Mais vendidos', 'Descontos'];
  const tabBox = document.getElementById('promo-tabs');
  const cardsBox = document.getElementById('promo-cards');

  // 1) Busca filmes da API; se der erro, usa mock local
  let movies = [];
  try {
    const films = await StoreAPI.listFilms(); // GET /films
    movies = films.map(f => ({
      id: f.id,
      title: f.nome,
      tag: 'Lançamentos'
    }));
    Store.set('movies', movies);
  } catch (e) {
    console.warn('Falha ao carregar filmes da API, usando mock.', e);
    movies = Store.get('movies', [
      { id: 1, title: 'Astro Noir',          tag: 'Lançamentos' },
      { id: 2, title: 'Cavaleiros do Tempo', tag: 'Mais vendidos' },
      { id: 3, title: 'Pipoca Cósmica',      tag: 'Descontos' },
      { id: 4, title: 'Neve Vermelha',       tag: 'Lançamentos' },
      { id: 5, title: 'O Dublê do Herói',    tag: 'Mais vendidos' },
      { id: 6, title: 'Cidade Submersa',     tag: 'Descontos' }
    ]);
  }

  let current = 'Todas';

  function renderTabs() {
    if (!tabBox) return;
    tabBox.innerHTML = tabs
      .map(t => `<button data-tab="${t}" class="${t === current ? 'active' : ''}">${t}</button>`)
      .join('');
  }

  function renderCards() {
    if (!cardsBox) return;
    const filtered = current === 'Todas'
      ? movies
      : movies.filter(m => m.tag === current);

    cardsBox.innerHTML = filtered.map(m => `
      <div class="card">
        <strong>${m.title}</strong>
        <p class="helper">${m.tag}</p>
        <button class="btn-primary" data-buy="${m.id}">Comprar</button>
      </div>
    `).join('');
  }

  tabBox?.addEventListener('click', e => {
    if (e.target.dataset.tab) {
      current = e.target.dataset.tab;
      renderTabs();
      renderCards();
    }
  });

  // 2) Clique em "Comprar": define filme + sessão e vai para o mapa
  cardsBox?.addEventListener('click', async e => {
    const id = e.target.dataset.buy;
    if (!id) return;

    const movieId = parseInt(id, 10);
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;

    try {
      // tenta buscar sessões desse filme
      const sessoes = await StoreAPI.listSessions({ filmeId: movieId });
      if (!sessoes || !sessoes.length) {
        alert('Não há sessões disponíveis para este filme.');
        return;
      }

      const sessao = sessoes[0]; // pega a primeira sessão (simples)
      // chaves usadas pelo MapaSessaoController
      sessionStorage.setItem('cinema_current_film_id', String(movieId));
      sessionStorage.setItem('cinema_current_sessao_id', String(sessao.id));

      // vai para o mapa da sessão
      location.hash = '/mapa_sessao';
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar sessões deste filme.');
    }
  });

  renderTabs();
  renderCards();

  // Banner rotativo (mantido como estava)
  const banner = document.getElementById('hero-banner');
  const dots = document.getElementById('banner-dots');
  const slides = ['Estreia: Astro Noir', 'Festival de Clássicos', 'Promo: Quarta da Pipoca'];
  let i = 0;

  function drawBanner() {
    if (!banner) return;
    const h2 = banner.querySelector('h2');
    if (h2) h2.textContent = slides[i];
    if (dots) {
      dots.innerHTML = slides
        .map((_, idx) => `<span class="dot ${idx === i ? 'active' : ''}"></span>`)
        .join('');
    }
  }

  drawBanner();
  setInterval(() => { i = (i + 1) % slides.length; drawBanner(); }, 3500);

  document.getElementById('btn-news')?.addEventListener('click', () => {
    alert('Assinatura registrada! ✔');
  });
}
