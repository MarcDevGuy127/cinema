
export class User{
  constructor({nome,email,cpf,telefone}){
    this.id = crypto.randomUUID();
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
    this.telefone = telefone;
    this.createdAt = Date.now();
  }
}
