<?php
class Filme {
    private $id;
    private $nome;
    private $genero;
    private $sinopse;
    private $duracao;
    private $faixa_etaria;
    private $banner;

    public function getId() {
        return $this->id;
    }

    public function getNome() {
        return $this->nome;
    }

    public function getGenero() {
        return $this->genero;
    }

    public function getSinopse() {
        return $this->sinopse;
    }

    public function getDuracao() {
        return $this->duracao;
    }

    public function getFaixaEtaria() {
        return $this->faixa_etaria;
    }

    public function getBanner() {
        return $this->banner;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function setNome($nome) {
        $this->nome = $nome;
    }

    public function setGenero($genero) {
        $this->genero = $genero;
    }

    public function setSinopse($sinopse) {
        $this->sinopse = $sinopse;
    }

    public function setDuracao($duracao) {
        $this->duracao = $duracao;
    }

    public function setFaixaEtaria($faixa_etaria) {
        $this->faixa_etaria = $faixa_etaria;
    }

    public function setBanner($banner) {
        $this->banner = $banner;
    }
}
