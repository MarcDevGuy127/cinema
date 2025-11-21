// view/js/controllers/AuthController.js
import { UserModel } from '../models/User.js';

function maskCPF(value){
  return value
    .replace(/\D/g,'')
    .replace(/(\d{3})(\d)/,'$1.$2')
    .replace(/(\d{3})(\d)/,'$1.$2')
    .replace(/(\d{3})(\d{1,2})$/,'$1-$2')
    .slice(0,14);
}

function maskPhone(value){
  return value
    .replace(/\D/g,'')
    .replace(/(\d{2})(\d)/,'($1) $2')
    .replace(/(\d{5})(\d)/,'$1-$2')
    .slice(0,15);
}

function validateCPF(cpf){
  cpf = cpf.replace(/\D/g,'');
  if(cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
  let sum = 0;
  for(let i=0;i<9;i++) sum += parseInt(cpf.charAt(i))*(10-i);
  let rev = 11 - (sum % 11);
  if(rev===10 || rev===11) rev = 0;
  if(rev !== parseInt(cpf.charAt(9))) return false;
  sum = 0;
  for(let i=0;i<10;i++) sum += parseInt(cpf.charAt(i))*(11-i);
  rev = 11 - (sum % 11);
  if(rev===10 || rev===11) rev = 0;
  if(rev !== parseInt(cpf.charAt(10))) return false;
  return true;
}

export async function AuthController(){
  // CADASTRO
  const reg = document.getElementById('register-form');
  if (reg) {
    const out = document.getElementById('register-result');
    const cpfInput = reg.querySelector('input[name="cpf"]');
    const telInput = reg.querySelector('input[name="telefone"]');
    const senhaInput = reg.querySelector('input[name="senha"]');

    if (cpfInput) {
      cpfInput.addEventListener('input', e => {
        e.target.value = maskCPF(e.target.value);
      });
    }

    if (telInput) {
      telInput.addEventListener('input', e => {
        e.target.value = maskPhone(e.target.value);
      });
    }

    reg.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(reg).entries());
      const { nome, email, cpf, senha } = data;

      if (!validateCPF(cpf)) {
        if (out) out.textContent = 'CPF inválido.';
        return;
      }
      if (!senha || senha.length < 4) {
        if (out) out.textContent = 'Senha deve ter pelo menos 4 caracteres.';
        return;
      }

      try {
        await UserModel.register({ nome, email, senha, cpf });
        if (out) out.textContent = 'Cadastro criado! Faça login para continuar.';
        setTimeout(() => { location.hash = '/redirecionamento'; }, 1200);
      } catch (err) {
        if (out) out.textContent = err.message || 'Erro ao cadastrar.';
      }
    });
  }

  // LOGIN
  const login = document.getElementById('login-form');
  if (login) {
    login.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(login).entries());
      const { email, senha } = data;

      try {
        const user = await UserModel.login({ email, senha });
        alert('Bem-vindo, ' + user.nome + '!');
        // após login, segue fluxo que vocês já usam
        location.hash = '/marketing';
      } catch (err) {
        alert(err.message || 'Falha ao fazer login.');
      }
    });
  }
}
