<?php

namespace App\Entity\History;

use App\Entity\DataEntity;
use App\Repository\History\HiBienRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=HiBienRepository::class)
 */
class HiBien extends DataEntity
{
    const HISTORY_BIEN = ["history:bien"];

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"history:bien"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"history:bien"})
     */
    private $bienId;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"history:bien"})
     */
    private $userFullname;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"history:bien"})
     */
    private $modifications = [];

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"history:bien"})
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

    public function getUserFullname(): ?string
    {
        return $this->userFullname;
    }

    public function setUserFullname(string $userFullname): self
    {
        $this->userFullname = $userFullname;

        return $this;
    }

    public function getModifications(): ?array
    {
        return $this->modifications;
    }

    public function setModifications(?array $modifications): self
    {
        $this->modifications = $modifications;

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
     * @Groups({"history:bien"})
     */
    public function getCreatedAtString(): ?string
    {
        return $this->getFullDateString($this->createdAt, "llll");
    }
}
