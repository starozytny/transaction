<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImSearchRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ImSearchRepository::class)
 */
class ImSearch
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $codeTypeAd;

    /**
     * @ORM\Column(type="integer")
     */
    private $codeTypeBien;

    /**
     * @ORM\Column(type="float")
     */
    private $minPrice;

    /**
     * @ORM\Column(type="float")
     */
    private $maxPrice;

    /**
     * @ORM\Column(type="integer")
     */
    private $minPiece;

    /**
     * @ORM\Column(type="integer")
     */
    private $maxPiece;

    /**
     * @ORM\Column(type="integer")
     */
    private $minRoom;

    /**
     * @ORM\Column(type="integer")
     */
    private $maxRoom;

    /**
     * @ORM\Column(type="float")
     */
    private $minArea;

    /**
     * @ORM\Column(type="float")
     */
    private $maxArea;

    /**
     * @ORM\Column(type="float")
     */
    private $minLand;

    /**
     * @ORM\Column(type="float")
     */
    private $maxLand;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     */
    private $zipcode;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $city;

    /**
     * @ORM\Column(type="integer")
     */
    private $hasLift;

    /**
     * @ORM\Column(type="integer")
     */
    private $hasTerrace;

    /**
     * @ORM\Column(type="integer")
     */
    private $hasBalcony;

    /**
     * @ORM\Column(type="integer")
     */
    private $hasParking;

    /**
     * @ORM\Column(type="integer")
     */
    private $hasBox;

    /**
     * @ORM\ManyToOne(targetEntity=ImProspect::class, inversedBy="searchs")
     */
    private $prospect;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCodeTypeAd(): ?int
    {
        return $this->codeTypeAd;
    }

    public function setCodeTypeAd(int $codeTypeAd): self
    {
        $this->codeTypeAd = $codeTypeAd;

        return $this;
    }

    public function getCodeTypeBien(): ?int
    {
        return $this->codeTypeBien;
    }

    public function setCodeTypeBien(int $codeTypeBien): self
    {
        $this->codeTypeBien = $codeTypeBien;

        return $this;
    }

    public function getMinRoom(): ?int
    {
        return $this->minRoom;
    }

    public function setMinRoom(int $minRoom): self
    {
        $this->minRoom = $minRoom;

        return $this;
    }

    public function getMaxRoom(): ?int
    {
        return $this->maxRoom;
    }

    public function setMaxRoom(int $maxRoom): self
    {
        $this->maxRoom = $maxRoom;

        return $this;
    }

    public function getMinPrice(): ?float
    {
        return $this->minPrice;
    }

    public function setMinPrice(float $minPrice): self
    {
        $this->minPrice = $minPrice;

        return $this;
    }

    public function getMaxPrice(): ?float
    {
        return $this->maxPrice;
    }

    public function setMaxPrice(float $maxPrice): self
    {
        $this->maxPrice = $maxPrice;

        return $this;
    }

    public function getMinArea(): ?float
    {
        return $this->minArea;
    }

    public function setMinArea(float $minArea): self
    {
        $this->minArea = $minArea;

        return $this;
    }

    public function getMaxArea(): ?float
    {
        return $this->maxArea;
    }

    public function setMaxArea(float $maxArea): self
    {
        $this->maxArea = $maxArea;

        return $this;
    }

    public function getZipcode(): ?string
    {
        return $this->zipcode;
    }

    public function setZipcode(?string $zipcode): self
    {
        $this->zipcode = $zipcode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getMinPiece(): ?int
    {
        return $this->minPiece;
    }

    public function setMinPiece(int $minPiece): self
    {
        $this->minPiece = $minPiece;

        return $this;
    }

    public function getMaxPiece(): ?int
    {
        return $this->maxPiece;
    }

    public function setMaxPiece(int $maxPiece): self
    {
        $this->maxPiece = $maxPiece;

        return $this;
    }

    public function getHasLift(): ?int
    {
        return $this->hasLift;
    }

    public function setHasLift(int $hasLift): self
    {
        $this->hasLift = $hasLift;

        return $this;
    }

    public function getHasTerrace(): ?int
    {
        return $this->hasTerrace;
    }

    public function setHasTerrace(int $hasTerrace): self
    {
        $this->hasTerrace = $hasTerrace;

        return $this;
    }

    public function getHasBalcony(): ?int
    {
        return $this->hasBalcony;
    }

    public function setHasBalcony(int $hasBalcony): self
    {
        $this->hasBalcony = $hasBalcony;

        return $this;
    }

    public function getHasParking(): ?int
    {
        return $this->hasParking;
    }

    public function setHasParking(int $hasParking): self
    {
        $this->hasParking = $hasParking;

        return $this;
    }

    public function getHasBox(): ?int
    {
        return $this->hasBox;
    }

    public function setHasBox(int $hasBox): self
    {
        $this->hasBox = $hasBox;

        return $this;
    }

    public function getMinLand(): ?float
    {
        return $this->minLand;
    }

    public function setMinLand(float $minLand): self
    {
        $this->minLand = $minLand;

        return $this;
    }

    public function getMaxLand(): ?float
    {
        return $this->maxLand;
    }

    public function setMaxLand(float $maxLand): self
    {
        $this->maxLand = $maxLand;

        return $this;
    }

    public function getProspect(): ?ImProspect
    {
        return $this->prospect;
    }

    public function setProspect(?ImProspect $prospect): self
    {
        $this->prospect = $prospect;

        return $this;
    }
}
