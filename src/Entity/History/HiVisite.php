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
     * @ORM\Column(type="integer")
     * @Groups({"history:visite"})
     */
    private $bienId;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"history:visite"})
     */
    private $visiteId;

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

    public function getBienId(): ?int
    {
        return $this->bienId;
    }

    public function setBienId(int $bienId): self
    {
        $this->bienId = $bienId;

        return $this;
    }

    public function getVisiteId(): ?int
    {
        return $this->visiteId;
    }

    public function setVisiteId(int $visiteId): self
    {
        $this->visiteId = $visiteId;

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


    /**
     * @return string
     * @Groups({"history:visite"})
     */
    public function getStatusString(): string
    {
        $status = ["Inactif", "Actif", "Annulé", "Fini"];

        return $status[$this->status];
    }
}
