<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImFinancialRepository;
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
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $typeCalcul;

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
    private $provisionOrdures;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $tva;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $totalTerme;

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
    private $honoraireBail;

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
    private $typeBail = 0;

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
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $honoraireChargeDe = self::VENTE_CHARGES_ACQUEREUR;

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

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTypeCalcul(): ?int
    {
        return $this->typeCalcul;
    }

    public function setTypeCalcul(int $typeCalcul): self
    {
        $this->typeCalcul = $typeCalcul;

        return $this;
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

    public function getTva(): ?float
    {
        return $this->tva;
    }

    public function setTva(?float $tva): self
    {
        $this->tva = $tva;

        return $this;
    }

    public function getTotalTerme(): ?float
    {
        return $this->totalTerme;
    }

    public function setTotalTerme(?float $totalTerme): self
    {
        $this->totalTerme = $totalTerme;

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

    public function getHonoraireBail(): ?float
    {
        return $this->honoraireBail;
    }

    public function setHonoraireBail(?float $honoraireBail): self
    {
        $this->honoraireBail = $honoraireBail;

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

    public function getProvisionOrdures(): ?float
    {
        return $this->provisionOrdures;
    }

    public function setProvisionOrdures(?float $provisionOrdures): self
    {
        $this->provisionOrdures = $provisionOrdures;

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

    public function setHonoraireChargeDe(int $honoraireChargeDe): self
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
    public function getHonoraireChargeDeString(): string
    {
        $charges = ["Acquéreur", "Vendeur", "Acquéreur et vendeur"];

        return $charges[$this->honoraireChargeDe];
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getTypeCalculString(): string
    {
        $charges = ["Pas de taxe", "TVA/Loyer + Charges", "TVA/Loyer + Charges + Ordures ménagères"];

        return $charges[$this->typeCalcul];
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getTypeChargesString(): string
    {
        $charges = ["Forfaitaires mensuelles", "Prévisionnelles mensuelles avec régularisation annuelle", "Remboursement annuel par le locataire"];

        return $charges[$this->typeCharges];
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getTypeBailString(): string
    {
        $charges = ["Habitation", "Commercial", "Meublé", "Professionnel", "Garage"];

        return $charges[$this->typeBail];
    }
}
