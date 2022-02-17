<?php

namespace App\Entity\Donnee;

use App\Entity\DataEntity;
use App\Entity\Immo\ImAgency;
use App\Repository\Donnee\DoSousTypeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=DoSousTypeRepository::class)
 */
class DoSousType extends DataEntity
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"donnee:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"donnee:read"})
     */
    private $isNative = false;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"donnee:read"})
     */
    private $name;

    /**
     * @ORM\ManyToOne(targetEntity=ImAgency::class, inversedBy="doSousTypes")
     */
    private $agency;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"donnee:read"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $updatedAt;

    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIsNative(): ?bool
    {
        return $this->isNative;
    }

    public function setIsNative(bool $isNative): self
    {
        $this->isNative = $isNative;

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

    public function getAgency(): ?ImAgency
    {
        return $this->agency;
    }

    public function setAgency(?ImAgency $agency): self
    {
        $this->agency = $agency;

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

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $updatedAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
