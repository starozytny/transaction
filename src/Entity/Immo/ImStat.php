<?php

namespace App\Entity\Immo;

use App\Entity\DataEntity;
use App\Repository\Immo\ImStatRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImStatRepository::class)
 */
class ImStat extends DataEntity
{
    const STAT_READ = ["stat:read"];

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"stat:read"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=ImAgency::class, inversedBy="stats")
     * @ORM\JoinColumn(nullable=false)
     */
    private $agency;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $publishedAt;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"stat:read"})
     */
    private $nbBiens = 0;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $detailsAd = [];

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $detailsBien = [];

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $userFullname;

    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAgency(): ?ImAgency
    {
        return $this->agency;
    }

    public function setAgency(?ImAgency $agency): self
    {
        $this->agency = $agency;

        return $this;
    }

    public function getPublishedAt(): ?\DateTimeInterface
    {
        return $this->publishedAt;
    }

    public function setPublishedAt(?\DateTimeInterface $publishedAt): self
    {
        $this->publishedAt = $publishedAt;

        return $this;
    }

    public function getNbBiens(): ?int
    {
        return $this->nbBiens;
    }

    public function setNbBiens(int $nbBiens): self
    {
        $this->nbBiens = $nbBiens;

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
     * @Groups({"stat:read"})
     */
    public function getPublishedAtString(): ?string
    {
        return $this->getFullDateString($this->publishedAt, 'llll');
    }

    public function getDetailsAd(): ?array
    {
        return $this->detailsAd;
    }

    public function setDetailsAd(?array $detailsAd): self
    {
        $this->detailsAd = $detailsAd;

        return $this;
    }

    public function getDetailsBien(): ?array
    {
        return $this->detailsBien;
    }

    public function setDetailsBien(?array $detailsBien): self
    {
        $this->detailsBien = $detailsBien;

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
}
