
import { mountShell, initRouter } from './router.js';

window.addEventListener('DOMContentLoaded', async ()=>{
  await mountShell();
  initRouter();

  document.body.addEventListener('click', (e)=>{
    if(e.target.id === 'btn-cart'){
      location.hash = '/redirecionamento';
    }
    if(e.target.id === 'btn-login'){
      location.hash = '/redirecionamento';
    }
  });
});
