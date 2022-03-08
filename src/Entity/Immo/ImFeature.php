<?php

namespace App\Entity\Immo;

use App\Entity\DataEntity;
use App\Repository\Immo\ImFeatureRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImFeatureRepository::class)
 */
class ImFeature extends DataEntity
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
    private $isMeuble = ImBien::ANSWER_UNKNOWN;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $isNew = ImBien::ANSWER_UNKNOWN;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $dispoAt;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $buildAt;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $floor;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $nbFloor;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $codeHeater0;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $codeHeater;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $codeKitchen;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $isWcSeparate = ImBien::ANSWER_UNKNOWN;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $codeWater;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $exposition = ImBien::ANSWER_UNKNOWN;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $busy = ImBien::BUSY_NONE;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $nbVehicles;

    /**
     * @ORM\Column(type="integer")
     */
    private $isImmeubleParking = ImBien::ANSWER_UNKNOWN;

    /**
     * @ORM\Column(type="integer")
     */
    private $isParkingIsolate = ImBien::ANSWER_UNKNOWN;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIsMeuble(): ?int
    {
        return $this->isMeuble;
    }

    public function setIsMeuble(int $isMeuble): self
    {
        $this->isMeuble = $isMeuble;

        return $this;
    }

    public function getIsNew(): ?int
    {
        return $this->isNew;
    }

    public function setIsNew(int $isNew): self
    {
        $this->isNew = $isNew;

        return $this;
    }

    /**
     * @return string|null
     * @Groups({"user:read"})
     */
    public function getDispoAtString(): ?string
    {
        return $this->getFullDateString($this->dispoAt);
    }

    /**
     * @return string|null
     * @Groups({"user:read"})
     */
    public function getDispoAtJavascript(): ?string
    {
        return $this->setDateJavascript($this->dispoAt);
    }

    public function getDispoAt(): ?\DateTimeInterface
    {
        return $this->dispoAt;
    }

    public function setDispoAt(?\DateTimeInterface $dispoAt): self
    {
        $this->dispoAt = $dispoAt;

        return $this;
    }

    public function getBuildAt(): ?int
    {
        return $this->buildAt;
    }

    public function setBuildAt(?int $buildAt): self
    {
        $this->buildAt = $buildAt;

        return $this;
    }

    public function getFloor(): ?int
    {
        return $this->floor;
    }

    public function setFloor(?int $floor): self
    {
        $this->floor = $floor;

        return $this;
    }

    public function getNbFloor(): ?int
    {
        return $this->nbFloor;
    }

    public function setNbFloor(?int $nbFloor): self
    {
        $this->nbFloor = $nbFloor;

        return $this;
    }

    public function getCodeHeater(): ?int
    {
        return $this->codeHeater;
    }

    public function setCodeHeater(?int $codeHeater): self
    {
        $this->codeHeater = $codeHeater;

        return $this;
    }

    public function getCodeKitchen(): ?int
    {
        return $this->codeKitchen;
    }

    public function setCodeKitchen(?int $codeKitchen): self
    {
        $this->codeKitchen = $codeKitchen;

        return $this;
    }

    public function getIsWcSeparate(): ?int
    {
        return $this->isWcSeparate;
    }

    public function setIsWcSeparate(int $isWcSeparate): self
    {
        $this->isWcSeparate = $isWcSeparate;

        return $this;
    }

    public function getCodeWater(): ?int
    {
        return $this->codeWater;
    }

    public function setCodeWater(?int $codeWater): self
    {
        $this->codeWater = $codeWater;

        return $this;
    }

    public function getExposition(): ?int
    {
        return $this->exposition;
    }

    public function setExposition(int $exposition): self
    {
        $this->exposition = $exposition;

        return $this;
    }

    public function getCodeHeater0(): ?int
    {
        return $this->codeHeater0;
    }

    public function setCodeHeater0(?int $codeHeater0): self
    {
        $this->codeHeater0 = $codeHeater0;

        return $this;
    }

    public function getBusy(): ?int
    {
        return $this->busy;
    }

    public function setBusy(int $busy): self
    {
        $this->busy = $busy;

        return $this;
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getBusyString(): string
    {
        $values = ["Libre", "Occupé - propriétaire", "Occupé - locataire(s)"];

        return $values[$this->busy];
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getExpositionString(): string
    {
        $values = ["Nord", "Est", "Sud", "Ouest", "Nord-est", "Nord-ouest", "Sud-est", "Sud-ouest"];

        return $this->exposition == 99 ? "?" : $values[$this->exposition];
    }

    public function getNbVehicles(): ?int
    {
        return $this->nbVehicles;
    }

    public function setNbVehicles(?int $nbVehicles): self
    {
        $this->nbVehicles = $nbVehicles;

        return $this;
    }

    public function getIsImmeubleParking(): ?int
    {
        return $this->isImmeubleParking;
    }

    public function setIsImmeubleParking(int $isImmeubleParking): self
    {
        $this->isImmeubleParking = $isImmeubleParking;

        return $this;
    }

    public function getIsParkingIsolate(): ?int
    {
        return $this->isParkingIsolate;
    }

    public function setIsParkingIsolate(int $isParkingIsolate): self
    {
        $this->isParkingIsolate = $isParkingIsolate;

        return $this;
    }
}
