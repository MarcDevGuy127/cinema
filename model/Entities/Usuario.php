<?php
class Usuario {
    private $id;
    private $nome;
    private $email;
    private $senha;
    private $cpf;
    private $role;
    public function getId() {
        return $this->id;
    }

    public function getNome() {
        return $this->nome;
    }

    public function getEmail() {
        return $this->email;
    }

    public function getSenha() {
        return $this->senha;
    }

    public function getCpf() {
        return $this->cpf;
    }

    public function getRole() {
        return $this->role;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function setNome($nome) {
        $this->nome = $nome;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function setSenha($senha) {
        $this->senha = $senha;
    }

    public function setCpf($cpf) {
        $this->cpf = $cpf;
    }

    public function setRole($role) {
        $this->role = $role;
    }
}
