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
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user:read"})
     */
    private $floor;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $nbFloor;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $codeHeater;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $codeKitchen;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $isWcSeparate = ImBien::ANSWER_UNKNOWN;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $codeWater;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $exposition = ImBien::ANSWER_UNKNOWN;

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

    public function getFloor(): ?string
    {
        return $this->floor;
    }

    public function setFloor(?string $floor): self
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

    public function setCodeHeater(int $codeHeater): self
    {
        $this->codeHeater = $codeHeater;

        return $this;
    }

    public function getCodeKitchen(): ?int
    {
        return $this->codeKitchen;
    }

    public function setCodeKitchen(int $codeKitchen): self
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

    public function setCodeWater(int $codeWater): self
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
}
