<?php

namespace App\Transaction\Entity\History;

use App\Entity\DataEntity;
use App\Transaction\Repository\History\HiPriceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=HiPriceRepository::class)
 */
class HiPrice extends DataEntity
{
    const HISTORY_PRICE = ["history:price"];

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"history:price"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"history:price"})
     */
    private $bienId;

    /**
     * @ORM\Column(type="float")
     * @Groups({"history:price"})
     */
    private $price;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBienId(): ?int
    {
        return $this->bienId;
    }

    public function setBienId(int $bienId): self
    {
        $this->bienId = $bienId;

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

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return string|null
     * @Groups({"history:price"})
     */
    public function getCreatedAtString(): ?string
    {
        return $this->getFullDateString($this->createdAt, "llll");
    }
}
