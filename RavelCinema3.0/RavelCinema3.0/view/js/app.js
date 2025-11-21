import { mountShell, initRouter } from './router.js';

export const API_BASE = 'http://localhost/cinemaFinal/public';

export async function api(path, options = {}) {
  const url = API_BASE + path;

  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  const opts = {
    method: options.method || 'GET',
    headers: { ...defaultHeaders, ...(options.headers || {}) },
    body: options.body ? JSON.stringify(options.body) : undefined
  };

  const resp = await fetch(url, opts);
  let data = null;

  try {
    data = await resp.json();
  } catch (e) {
    data = null;
  }

  if (!resp.ok) {
    const msg = data && data.error ? data.error : 'Erro na API';
    throw new Error(msg);
  }

  return data;
}

window.addEventListener('DOMContentLoaded', async () => {
  await mountShell();
  initRouter();

  document.body.addEventListener('click', (e) => {
    if (e.target.id === 'btn-cart') {
      location.hash = '/redirecionamento';
    }
    if (e.target.id === 'btn-login') {
      location.hash = '/redirecionamento';
    }
  });
});
