
import { Store } from '../models/Store.js';
import { User } from '../models/User.js';

function maskCPF(value){
  return value
    .replace(/\D/g,'')
    .replace(/(\d{3})(\d)/,'\\1.\\2')
    .replace(/(\d{3})(\d)/,'\\1.\\2')
    .replace(/(\d{3})(\d{1,2})$/,'\\1-\\2')
    .slice(0,14);
}
function maskPhone(value){
  return value
    .replace(/\D/g,'')
    .replace(/(\d{2})(\d)/,'(\\1) \\2')
    .replace(/(\d{5})(\d)/,'\\1-\\2')
    .slice(0,15);
}
function validateCPF(cpf){
  cpf = cpf.replace(/\D/g,'');
  if(cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
  let sum=0; for(let i=0;i<9;i++) sum += parseInt(cpf.charAt(i))*(10-i);
  let rev = 11 - (sum % 11); if(rev==10||rev==11) rev=0; if(rev!=parseInt(cpf.charAt(9))) return false;
  sum=0; for(let i=0;i<10;i++) sum += parseInt(cpf.charAt(i))*(11-i);
  rev = 11 - (sum % 11); if(rev==10||rev==11) rev=0; if(rev!=parseInt(cpf.charAt(10))) return false;
  return true;
}

export async function AuthController(){
  const reg = document.getElementById('register-form');
  if(reg){
    const out = document.getElementById('register-result');
    const cpfInput = reg.querySelector('input[name="cpf"]');
    const telInput = reg.querySelector('input[name="telefone"]');
    cpfInput.addEventListener('input',e=> e.target.value = maskCPF(e.target.value));
    telInput.addEventListener('input',e=> e.target.value = maskPhone(e.target.value));

    reg.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(reg).entries());
      if(!validateCPF(data.cpf)){ out.textContent='CPF inválido.'; return; }
      const users = Store.get('users', []);
      if(users.some(u=>u.email===data.email)){ out.textContent='Email já cadastrado.'; return; }
      const user = new User(data);
      users.push(user);
      Store.set('users', users);
      out.textContent = 'Cadastro criado! Faça login para continuar.';
      setTimeout(()=> location.hash = '/redirecionamento', 1200);
    });
  }

  const login = document.getElementById('login-form');
  if(login){
    login.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(login).entries());
      const users = Store.get('users', []);
      const ok = users.find(u=>u.email===data.email);
      if(ok){
        localStorage.setItem('session', data.email);
        alert('Bem-vindo!');
        location.hash = '/marketing';
      }else{
        alert('Usuário não encontrado.');
      }
    });
  }
}
