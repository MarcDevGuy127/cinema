
import { Store } from '../models/Store.js';

function drawLine(ctx, data){
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.strokeStyle = '#7fb3ff'; ctx.lineWidth = 2;
  ctx.beginPath();
  data.forEach((v,i)=>{
    const x = (i/(data.length-1))*(w-20)+10;
    const y = h-10 - (v/Math.max(...data))* (h-30);
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  });
  ctx.stroke();
}
function drawBars(ctx, data){
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.clearRect(0,0,w,h);
  const bw = (w-40)/data.length;
  ctx.fillStyle = '#7fb3ff';
  data.forEach((v,i)=>{
    const x = 20 + i*bw + 8;
    const y = h-10 - (v/Math.max(...data))*(h-30);
    ctx.fillRect(x, y, bw-16, h-10-y);
  });
}

export async function AdminController(){
  const users = Store.get('users', []);
  const hits = Store.get('hits', 18200);
  const conversion = users.length ? Math.min(30, (users.length/2340*3)).toFixed(2) : 0;

  const setText = (id, val)=>{ const el = document.getElementById(id); if(el) el.textContent = val; };
  setText('kpi-users', users.length);
  setText('kpi-hits', hits);
  setText('kpi-cvr', conversion + '%');

  const ctxU = document.getElementById('chart-users')?.getContext('2d');
  const ctxH = document.getElementById('chart-hits')?.getContext('2d');
  if(ctxU){ drawLine(ctxU, [2,3,5,8,13,21,34]); }
  if(ctxH){ drawBars(ctxH, [5,8,6,9,12,10,14]); }

  const tbody = document.querySelector('#tbl-users tbody');
  if(tbody){
    tbody.innerHTML = users.map(u=>`
      <tr>
        <td>${u.nome}</td>
        <td class="helper">${u.email}</td>
        <td><button class="btn-danger" data-del="${u.id}">Excluir</button></td>
      </tr>`).join('');
    tbody.addEventListener('click', e=>{
      if(e.target.dataset.del){
        const id = e.target.dataset.del;
        const list = Store.get('users', []).filter(u=>u.id!==id);
        Store.set('users', list);
        location.reload();
      }
    });
  }

  document.getElementById('seed-data')?.addEventListener('click', ()=>{
    const sample = [
      {nome:'Ana', email:'ana@cine.com', cpf:'000.000.000-00', telefone:'(11) 90000-0000', id:'1'},
      {nome:'Carlos', email:'carlos@cine.com', cpf:'000.000.000-00', telefone:'(11) 91111-1111', id:'2'},
      {nome:'Bia', email:'bia@cine.com', cpf:'000.000.000-00', telefone:'(11) 92222-2222', id:'3'},
    ];
    Store.set('users', sample);
    alert('Dados adicionados!'); location.reload();
  });

  const banners = document.getElementById('banners');
  if(banners){
    banners.innerHTML = '<li class="helper">Nenhum banner cadastrado.</li>';
    document.getElementById('add-banner').addEventListener('click', ()=>{
      const t = prompt('Título do banner');
      if(!t) return;
      banners.innerHTML += `<li class="card" style="margin:8px 0;padding:10px">${t}</li>`;
    });
  }
}
