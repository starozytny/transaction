<?php

namespace App\Transaction\Entity\Immo;

use App\Transaction\Repository\Immo\ImAreaRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImAreaRepository::class)
 */
class ImArea
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"user:read"})
     */
    private $total;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read", "suivi:read"})
     */
    private $habitable;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read", "suivi:read"})
     */
    private $land;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $garden;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $terrace;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $cave;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $bathroom;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $living;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTotal(): ?float
    {
        return $this->total;
    }

    public function setTotal(float $total): self
    {
        $this->total = $total;

        return $this;
    }

    public function getHabitable(): ?float
    {
        return $this->habitable;
    }

    public function setHabitable(?float $habitable): self
    {
        $this->habitable = $habitable;

        return $this;
    }

    public function getLand(): ?float
    {
        return $this->land;
    }

    public function setLand(?float $land): self
    {
        $this->land = $land;

        return $this;
    }

    public function getGarden(): ?float
    {
        return $this->garden;
    }

    public function setGarden(?float $garden): self
    {
        $this->garden = $garden;

        return $this;
    }

    public function getTerrace(): ?float
    {
        return $this->terrace;
    }

    public function setTerrace(?float $terrace): self
    {
        $this->terrace = $terrace;

        return $this;
    }

    public function getCave(): ?float
    {
        return $this->cave;
    }

    public function setCave(?float $cave): self
    {
        $this->cave = $cave;

        return $this;
    }

    public function getBathroom(): ?float
    {
        return $this->bathroom;
    }

    public function setBathroom(?float $bathroom): self
    {
        $this->bathroom = $bathroom;

        return $this;
    }

    public function getLiving(): ?float
    {
        return $this->living;
    }

    public function setLiving(?float $living): self
    {
        $this->living = $living;

        return $this;
    }
}
