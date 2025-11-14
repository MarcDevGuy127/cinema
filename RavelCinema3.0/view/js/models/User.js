// view/js/models/User.js
import { api } from '../app.js';

// Classe antiga mantida se alguém ainda usar em outra parte do front
export class User {
  constructor({ nome, email, cpf, telefone }) {
    this.id = crypto.randomUUID();
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
    this.telefone = telefone;
    this.createdAt = Date.now();
  }
}

// Model que fala com o backend (usar ESTE nas telas)
export const UserModel = {
  async register({ nome, email, senha, cpf }) {
    // backend ignora telefone, então não envio aqui
    return api('/auth/register', {
      method: 'POST',
      body: { nome, email, senha, cpf }
    });
  },

  async login({ email, senha }) {
    const user = await api('/auth/login', {
      method: 'POST',
      body: { email, senha }
    });

    // Ex: {id, nome, email, role}
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  getCurrent() {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('user');
  }
};
