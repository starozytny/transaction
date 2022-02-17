<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImRoomRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImRoomRepository::class)
 */
class ImRoom
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user:read"})
     */
    private $uid;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $typeRoom;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user:read"})
     */
    private $name;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $area;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user:read"})
     */
    private $sol;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $hasBalcony = ImBien::ANSWER_UNKNOWN;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $areaBalcony;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $hasTerrace = ImBien::ANSWER_UNKNOWN;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $areaTerrace;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $hasGarden = ImBien::ANSWER_UNKNOWN;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $areaGarden;

    /**
     * @ORM\ManyToOne(targetEntity=ImBien::class, inversedBy="rooms")
     * @ORM\JoinColumn(nullable=false)
     */
    private $bien;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTypeRoom(): ?int
    {
        return $this->typeRoom;
    }

    public function setTypeRoom(int $typeRoom): self
    {
        $this->typeRoom = $typeRoom;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getArea(): ?float
    {
        return $this->area;
    }

    public function setArea(?float $area): self
    {
        $this->area = $area;

        return $this;
    }

    public function getSol(): ?string
    {
        return $this->sol;
    }

    public function setSol(?string $sol): self
    {
        $this->sol = $sol;

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

    public function getAreaBalcony(): ?float
    {
        return $this->areaBalcony;
    }

    public function setAreaBalcony(?float $areaBalcony): self
    {
        $this->areaBalcony = $areaBalcony;

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

    public function getAreaTerrace(): ?float
    {
        return $this->areaTerrace;
    }

    public function setAreaTerrace(?float $areaTerrace): self
    {
        $this->areaTerrace = $areaTerrace;

        return $this;
    }

    public function getHasGarden(): ?int
    {
        return $this->hasGarden;
    }

    public function setHasGarden(int $hasGarden): self
    {
        $this->hasGarden = $hasGarden;

        return $this;
    }

    public function getAreaGarden(): ?float
    {
        return $this->areaGarden;
    }

    public function setAreaGarden(?float $areaGarden): self
    {
        $this->areaGarden = $areaGarden;

        return $this;
    }

    public function getBien(): ?ImBien
    {
        return $this->bien;
    }

    public function setBien(?ImBien $bien): self
    {
        $this->bien = $bien;

        return $this;
    }

    public function getUid(): ?string
    {
        return $this->uid;
    }

    public function setUid(string $uid): self
    {
        $this->uid = $uid;

        return $this;
    }
}
