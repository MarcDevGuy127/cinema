import { MarketingController } from './controllers/MarketingController.js';
import { SupportController } from './controllers/SupportController.js';
import { AuthController } from './controllers/AuthController.js';
import { AdminController } from './controllers/AdminController.js';
import { MapaSessaoController } from './controllers/MapaSessaoController.js';

const routes = {
  '/marketing':         { view: 'marketing',     controller: MarketingController },
  '/suporte':           { view: 'suporte',       controller: SupportController },
  '/cadastro':          { view: 'cadastro',      controller: AuthController },
  '/redirecionamento':  { view: 'redirecionamento', controller: AuthController },
  '/admin':             { view: 'admin',         controller: AdminController },
  '/mapa_sessao':       { view: 'mapa_sessao',   controller: MapaSessaoController }
};

export async function mountShell(){
  const header = await fetch('./views/components/header.html').then(r=>r.text());
  const footer = await fetch('./views/components/footer.html').then(r=>r.text());
  document.getElementById('app-header').innerHTML = header;
  document.getElementById('app-footer').innerHTML = footer;
}

async function render(path){
  const route = routes[path] ?? routes['/marketing'];
  const html = await fetch(`./views/${route.view}.html`).then(r=>r.text());
  const root = document.getElementById('app-root');
  root.innerHTML = html;
  await route.controller();
  document.querySelectorAll('nav a').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href') === `#${path}`);
  });
}

export function initRouter(){
  function onHashChange(){
    const hash = location.hash.slice(1) || '/marketing';
    render(hash);
  }
  window.addEventListener('hashchange', onHashChange);
  onHashChange();
}
