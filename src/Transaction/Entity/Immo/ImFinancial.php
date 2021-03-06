<?php

namespace App\Transaction\Entity\Immo;

use App\Transaction\Repository\Immo\ImFinancialRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImFinancialRepository::class)
 */
class ImFinancial
{
    const VENTE_CHARGES_ACQUEREUR = 0;
    const VENTE_CHARGES_VENDEUR = 1;
    const VENTE_CHARGES_ACQUEREUR_VENDEUR = 2;

    const LOCATION_CHARGES_FORFAIT = 0;
    const LOCATION_CHARGES_REGULARISATION = 1;
    const LOCATION_CHARGES_REMBOURSEMENT = 2;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"user:read", "suivi:read"})
     */
    private $price;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $provisionCharges;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $caution;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $honoraireTtc;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $edl;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $complementLoyer;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $typeCharges;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $totalGeneral;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $typeBail;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $durationBail;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $priceHorsAcquereur;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $chargesMensuelles;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $foncier;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $taxeHabitation;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $notaire;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $honoraireChargeDe;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $honorairePourcentage;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"user:read"})
     */
    private $isCopro = false;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $nbLot;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $chargesLot;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"user:read"})
     */
    private $isSyndicProcedure = false;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"user:read"})
     */
    private $detailsProcedure;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $priceMurs;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $rente;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     * @Groups({"user:read"})
     */
    private $repartitionCa;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $resultatN2;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $resultatN1;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $resultatN0;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Groups({"user:read"})
     */
    private $natureBailCommercial;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $priceHt;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $pricePlafond;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getProvisionCharges(): ?float
    {
        return $this->provisionCharges;
    }

    public function setProvisionCharges(?float $provisionCharges): self
    {
        $this->provisionCharges = $provisionCharges;

        return $this;
    }

    public function getCaution(): ?float
    {
        return $this->caution;
    }

    public function setCaution(?float $caution): self
    {
        $this->caution = $caution;

        return $this;
    }

    public function getHonoraireTtc(): ?float
    {
        return $this->honoraireTtc;
    }

    public function setHonoraireTtc(?float $honoraireTtc): self
    {
        $this->honoraireTtc = $honoraireTtc;

        return $this;
    }

    public function getEdl(): ?float
    {
        return $this->edl;
    }

    public function setEdl(?float $edl): self
    {
        $this->edl = $edl;

        return $this;
    }

    public function getTypeCharges(): ?int
    {
        return $this->typeCharges;
    }

    public function setTypeCharges(?int $typeCharges): self
    {
        $this->typeCharges = $typeCharges;

        return $this;
    }

    public function getTotalGeneral(): ?float
    {
        return $this->totalGeneral;
    }

    public function setTotalGeneral(?float $totalGeneral): self
    {
        $this->totalGeneral = $totalGeneral;

        return $this;
    }

    public function getTypeBail(): ?int
    {
        return $this->typeBail;
    }

    public function setTypeBail(?int $typeBail): self
    {
        $this->typeBail = $typeBail;

        return $this;
    }

    public function getDurationBail(): ?int
    {
        return $this->durationBail;
    }

    public function setDurationBail(?int $durationBail): self
    {
        $this->durationBail = $durationBail;

        return $this;
    }

    public function getChargesMensuelles(): ?float
    {
        return $this->chargesMensuelles;
    }

    public function setChargesMensuelles(?float $chargesMensuelles): self
    {
        $this->chargesMensuelles = $chargesMensuelles;

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

    public function getTaxeHabitation(): ?float
    {
        return $this->taxeHabitation;
    }

    public function setTaxeHabitation(?float $taxeHabitation): self
    {
        $this->taxeHabitation = $taxeHabitation;

        return $this;
    }

    public function getNotaire(): ?float
    {
        return $this->notaire;
    }

    public function setNotaire(?float $notaire): self
    {
        $this->notaire = $notaire;

        return $this;
    }

    public function getHonoraireChargeDe(): ?int
    {
        return $this->honoraireChargeDe;
    }

    public function setHonoraireChargeDe(?int $honoraireChargeDe): self
    {
        $this->honoraireChargeDe = $honoraireChargeDe;

        return $this;
    }

    public function getHonorairePourcentage(): ?float
    {
        return $this->honorairePourcentage;
    }

    public function setHonorairePourcentage(?float $honorairePourcentage): self
    {
        $this->honorairePourcentage = $honorairePourcentage;

        return $this;
    }

    public function getIsCopro(): ?bool
    {
        return $this->isCopro;
    }

    public function setIsCopro(bool $isCopro): self
    {
        $this->isCopro = $isCopro;

        return $this;
    }

    public function getNbLot(): ?int
    {
        return $this->nbLot;
    }

    public function setNbLot(?int $nbLot): self
    {
        $this->nbLot = $nbLot;

        return $this;
    }

    public function getChargesLot(): ?float
    {
        return $this->chargesLot;
    }

    public function setChargesLot(?float $chargesLot): self
    {
        $this->chargesLot = $chargesLot;

        return $this;
    }

    public function getIsSyndicProcedure(): ?bool
    {
        return $this->isSyndicProcedure;
    }

    public function setIsSyndicProcedure(bool $isSyndicProcedure): self
    {
        $this->isSyndicProcedure = $isSyndicProcedure;

        return $this;
    }

    public function getDetailsProcedure(): ?string
    {
        return $this->detailsProcedure;
    }

    public function setDetailsProcedure(?string $detailsProcedure): self
    {
        $this->detailsProcedure = $detailsProcedure;

        return $this;
    }

    public function getPriceHorsAcquereur(): ?float
    {
        return $this->priceHorsAcquereur;
    }

    public function setPriceHorsAcquereur(?float $priceHorsAcquereur): self
    {
        $this->priceHorsAcquereur = $priceHorsAcquereur;

        return $this;
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getHonoraireChargeDeString(): ?string
    {
        $charges = ["Acqu??reur", "Vendeur", "Acqu??reur et vendeur"];

        return  $this->honoraireChargeDe !== null ? $charges[$this->honoraireChargeDe] : null;
    }

    /**
     * @Groups({"user:read"})
     */
    public function getTypeChargesString(): ?string
    {
        $charges = ["Forfaitaires mensuelles", "Pr??visionnelles mensuelles avec r??gularisation annuelle", "Remboursement annuel par le locataire"];

        return $this->typeCharges !== null ? $charges[$this->typeCharges] : null;
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getTypeBailString(): ?string
    {
        $charges = ["Habitation", "Commercial", "Meubl??", "Professionnel", "Garage"];

        return $this->typeBail !== null ? $charges[$this->typeBail] : null;
    }

    public function getPriceMurs(): ?float
    {
        return $this->priceMurs;
    }

    public function setPriceMurs(?float $priceMurs): self
    {
        $this->priceMurs = $priceMurs;

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

    public function getRente(): ?float
    {
        return $this->rente;
    }

    public function setRente(?float $rente): self
    {
        $this->rente = $rente;

        return $this;
    }

    public function getRepartitionCa(): ?string
    {
        return $this->repartitionCa;
    }

    public function setRepartitionCa(?string $repartitionCa): self
    {
        $this->repartitionCa = $repartitionCa;

        return $this;
    }

    public function getResultatN2(): ?int
    {
        return $this->resultatN2;
    }

    public function setResultatN2(?int $resultatN2): self
    {
        $this->resultatN2 = $resultatN2;

        return $this;
    }

    public function getResultatN1(): ?int
    {
        return $this->resultatN1;
    }

    public function setResultatN1(?int $resultatN1): self
    {
        $this->resultatN1 = $resultatN1;

        return $this;
    }

    public function getResultatN0(): ?int
    {
        return $this->resultatN0;
    }

    public function setResultatN0(?int $resultatN0): self
    {
        $this->resultatN0 = $resultatN0;

        return $this;
    }

    public function getNatureBailCommercial(): ?string
    {
        return $this->natureBailCommercial;
    }

    public function setNatureBailCommercial(?string $natureBailCommercial): self
    {
        $this->natureBailCommercial = $natureBailCommercial;

        return $this;
    }

    public function getPriceHt(): ?float
    {
        return $this->priceHt;
    }

    public function setPriceHt(?float $priceHt): self
    {
        $this->priceHt = $priceHt;

        return $this;
    }

    public function getPricePlafond(): ?float
    {
        return $this->pricePlafond;
    }

    public function setPricePlafond(?float $pricePlafond): self
    {
        $this->pricePlafond = $pricePlafond;

        return $this;
    }
}
