<?php

namespace App\Transaction\Entity\History;

use App\Entity\DataEntity;
use App\Transaction\Repository\History\HiPublishRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=HiPublishRepository::class)
 */
class HiPublish extends DataEntity
{
    const HISTORY_PUBLISH = ["history:publish"];
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"history:publish"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"history:publish"})
     */
    private $bienId;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"history:publish"})
     */
    private $supports = [];

    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string|null
     * @Groups({"history:publish"})
     */
    public function getCreatedAtString(): ?string
    {
        return $this->getFullDateString($this->createdAt, 'llll');
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

    public function getSupports(): ?array
    {
        return $this->supports;
    }

    public function setSupports(?array $supports): self
    {
        $this->supports = $supports;

        return $this;
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
}
