<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImFinancierRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ImFinancierRepository::class)
 */
class ImFinancier
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     */
    private $prix;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $honoraires;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $charges;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $foncier;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $depotGarantie;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $honoChargesDe;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $horsHonoAcquereur;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $modalitesChargesLocataire;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $complementLoyer;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $partHonoEdl;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $bouquet;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $rente;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPrix(): ?float
    {
        return $this->prix;
    }

    public function setPrix(float $prix): self
    {
        $this->prix = $prix;

        return $this;
    }

    public function getHonoraires(): ?float
    {
        return $this->honoraires;
    }

    public function setHonoraires(?float $honoraires): self
    {
        $this->honoraires = $honoraires;

        return $this;
    }

    public function getCharges(): ?float
    {
        return $this->charges;
    }

    public function setCharges(?float $charges): self
    {
        $this->charges = $charges;

        return $this;
    }

    public function getFoncier(): ?float
    {
        return $this->foncier;
    }

    public function setFoncier(?float $foncier): self
    {
        $this->foncier = $foncier;

        return $this;
    }

    public function getDepotGarantie(): ?float
    {
        return $this->depotGarantie;
    }

    public function setDepotGarantie(?float $depotGarantie): self
    {
        $this->depotGarantie = $depotGarantie;

        return $this;
    }

    public function getHonoChargesDe(): ?string
    {
        return $this->honoChargesDe;
    }

    public function setHonoChargesDe(?string $honoChargesDe): self
    {
        $this->honoChargesDe = $honoChargesDe;

        return $this;
    }

    public function getHorsHonoAcquereur(): ?float
    {
        return $this->horsHonoAcquereur;
    }

    public function setHorsHonoAcquereur(?float $horsHonoAcquereur): self
    {
        $this->horsHonoAcquereur = $horsHonoAcquereur;

        return $this;
    }

    public function getModalitesChargesLocataire(): ?string
    {
        return $this->modalitesChargesLocataire;
    }

    public function setModalitesChargesLocataire(?string $modalitesChargesLocataire): self
    {
        $this->modalitesChargesLocataire = $modalitesChargesLocataire;

        return $this;
    }

    public function getComplementLoyer(): ?float
    {
        return $this->complementLoyer;
    }

    public function setComplementLoyer(?float $complementLoyer): self
    {
        $this->complementLoyer = $complementLoyer;

        return $this;
    }

    public function getPartHonoEdl(): ?float
    {
        return $this->partHonoEdl;
    }

    public function setPartHonoEdl(?float $partHonoEdl): self
    {
        $this->partHonoEdl = $partHonoEdl;

        return $this;
    }

    public function getBouquet(): ?float
    {
        return $this->bouquet;
    }

    public function setBouquet(?float $bouquet): self
    {
        $this->bouquet = $bouquet;

        return $this;
    }

    public function getRente(): ?float
    {
        return $this->rente;
    }

    public function setRente(?float $rente): self
    {
        $this->rente = $rente;

        return $this;
    }
}