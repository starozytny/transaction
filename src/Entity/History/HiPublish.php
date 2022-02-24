<?php

namespace App\Entity\History;

use App\Entity\DataEntity;
use App\Entity\Immo\ImBien;
use App\Repository\History\HiPublishRepository;
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
     * @ORM\ManyToOne(targetEntity=ImBien::class, fetch="EAGER", inversedBy="hiPublishes")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"history:publish"})
     */
    private $bien;

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

    public function getBien(): ?ImBien
    {
        return $this->bien;
    }

    public function setBien(?ImBien $bien): self
    {
        $this->bien = $bien;

        return $this;
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
}
