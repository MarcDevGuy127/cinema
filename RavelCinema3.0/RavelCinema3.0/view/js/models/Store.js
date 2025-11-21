
// view/js/models/Store.js
import { api } from '../app.js';

export const Store = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// API para falar com o backend de cinema
export const StoreAPI = {
  // FILMES
  listFilms() {
    return api('/films'); // GET /films
  },

  getFilm(id) {
    return api(`/films/${id}`); // GET /films/{id}
  },

  // SESSÕES (pode filtrar por filme e data)
  listSessions({ filmeId, data } = {}) {
    const params = new URLSearchParams();
    if (filmeId) params.set('filme', filmeId);
    if (data) params.set('data', data);
    const qs = params.toString() ? '?' + params.toString() : '';
    return api('/sessions' + qs); // GET /sessions?filme=...&data=...
  },

  // ASSENTOS DA SESSÃO
  listSeats(sessaoId) {
    return api(`/sessions/${sessaoId}/seats`); // GET /sessions/{id}/seats
  },

  // CARRINHO
  addToCart({ usuarioId, sessaoId, assentoId }) {
    return api('/cart/add', {
      method: 'POST',
      body: {
        usuario_id: usuarioId,
        sessao_id: sessaoId,
        assento_id: assentoId
      }
    });
  },

  getCart(usuarioId) {
    return api(`/cart?usuario_id=${usuarioId}`); // GET /cart?usuario_id=...
  },

  removeFromCart({ carrinhoId, usuarioId }) {
    return api(`/cart/item/${carrinhoId}?usuario_id=${usuarioId}`, {
      method: 'DELETE'
    });
  },

  checkout(usuarioId) {
    return api('/cart/checkout', {
      method: 'POST',
      body: { usuario_id: usuarioId }
    });
  }
};
