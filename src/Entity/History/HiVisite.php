<?php

namespace App\Entity\History;

use App\Entity\DataEntity;
use App\Entity\Immo\ImBien;
use App\Repository\History\HiVisiteRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=HiVisiteRepository::class)
 */
class HiVisite extends DataEntity
{
    const HISTORY_VISITE = ["history:visite"];
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"history:visite"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=ImBien::class, fetch="EAGER", inversedBy="hiVisites")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"history:visite"})
     */
    private $bien;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"history:visite"})
     */
    private $status;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"history:visite"})
     */
    private $fullDate;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"history:visite"})
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"history:visite"})
     */
    private $location;

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
     * @Groups({"history:visite"})
     */
    public function getCreatedAtString(): ?string
    {
        return $this->getFullDateString($this->createdAt, "llll");
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

    public function getFullDate(): ?string
    {
        return $this->fullDate;
    }

    public function setFullDate(string $fullDate): self
    {
        $this->fullDate = $fullDate;

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

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): self
    {
        $this->location = $location;

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

        return $this;
    }
}
