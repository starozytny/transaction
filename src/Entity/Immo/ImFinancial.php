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
     * @Groups({"user:read"})
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
    private $typeCharge;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $totalGeneral;

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

    public function getTypeCharge(): ?int
    {
        return $this->typeCharge;
    }

    public function setTypeCharge(?int $typeCharge): self
    {
        $this->typeCharge = $typeCharge;

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
}
