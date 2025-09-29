
import { Store } from '../models/Store.js';

export async function MarketingController(){
  const tabs = ['Todas','Lançamentos','Mais vendidos','Descontos'];
  const tabBox = document.getElementById('promo-tabs');
  const cardsBox = document.getElementById('promo-cards');

  const movies = Store.get('movies', [
    {id:1,title:'Astro Noir', tag:'Lançamentos'},
    {id:2,title:'Cavaleiros do Tempo', tag:'Mais vendidos'},
    {id:3,title:'Pipoca Cósmica', tag:'Descontos'},
    {id:4,title:'Neve Vermelha', tag:'Lançamentos'},
    {id:5,title:'O Dublê do Herói', tag:'Mais vendidos'},
    {id:6,title:'Cidade Submersa', tag:'Descontos'}
  ]);

  let current = 'Todas';
  function renderTabs(){
    tabBox.innerHTML = tabs.map(t=>`<button data-tab="${t}" class="${t===current?'active':''}">${t}</button>`).join('');
  }
  function renderCards(){
    const filtered = current==='Todas'? movies : movies.filter(m=>m.tag===current);
    cardsBox.innerHTML = filtered.map(m=>`
      <div class="card">
        <strong>${m.title}</strong>
        <p class="helper">${m.tag}</p>
        <button class="btn-primary" data-buy="${m.id}">Comprar</button>
      </div>
    `).join('');
  }
  tabBox.addEventListener('click', e=>{
    if(e.target.dataset.tab){
      current = e.target.dataset.tab; renderTabs(); renderCards();
    }
  });
  cardsBox.addEventListener('click', e=>{
    if(e.target.dataset.buy){
      location.hash = '/redirecionamento';
    }
  });
  renderTabs(); renderCards();

  const banner = document.getElementById('hero-banner');
  const dots = document.getElementById('banner-dots');
  const slides = ['Estreia: Astro Noir','Festival de Clássicos','Promo: Quarta da Pipoca'];
  let i=0;
  function drawBanner(){
    banner.querySelector('h2').textContent = slides[i];
    dots.innerHTML = slides.map((_,idx)=>`<span class="dot ${idx===i?'active':''}"></span>`).join('');
  }
  drawBanner();
  setInterval(()=>{ i=(i+1)%slides.length; drawBanner(); }, 3500);

  document.getElementById('btn-news')?.addEventListener('click', ()=>{
    alert('Assinatura registrada! ✔');
  });
}
