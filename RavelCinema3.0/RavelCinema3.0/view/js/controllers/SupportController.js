
export async function SupportController(){
  const faqs = [
    {q:'Como remarcar meu ingresso?', a:'Você pode remarcar até 2h antes da sessão.'},
    {q:'Quais formas de pagamento?', a:'Pix, Cartão, Boleto e Carteira Digital.'},
    {q:'Descontos para estudantes?', a:'Sim, meia-entrada mediante comprovação.'}
  ];
  const list = document.getElementById('faq-list');
  const input = document.getElementById('faq-search');
  function render(filter=''){
    const items = faqs.filter(f=> (f.q+f.a).toLowerCase().includes(filter.toLowerCase()));
    list.innerHTML = items.map(f=>`<li class="card" style="margin:10px 0"><strong>${f.q}</strong><p class="helper">${f.a}</p></li>`).join('');
  }
  input.addEventListener('input', e=>render(e.target.value));
  render();

  const form = document.getElementById('support-form');
  const out = document.getElementById('support-result');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    out.textContent = 'Mensagem enviada! Ticket #' + Math.floor(Math.random()*1e6).toString().padStart(6,'0');
    form.reset();
  });

  document.getElementById('open-whatsapp').addEventListener('click', ()=>{
    window.open('https://wa.me/5500000000000','_blank');
  });
}
