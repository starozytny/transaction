<?php

namespace App\Entity\Donnee;

use App\Entity\Immo\ImAgency;
use App\Repository\Donnee\DoQuartierRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=DoQuartierRepository::class)
 */
class DoQuartier
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"donnee:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"donnee:read"})
     */
    private $name;

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $polygon = [];

    /**
     * @ORM\ManyToOne(targetEntity=ImAgency::class, inversedBy="doQuartiers")
     */
    private $agency;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isNative;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getPolygon(): ?array
    {
        return $this->polygon;
    }

    public function setPolygon(?array $polygon): self
    {
        $this->polygon = $polygon;

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

    public function getIsNative(): ?bool
    {
        return $this->isNative;
    }

    public function setIsNative(bool $isNative): self
    {
        $this->isNative = $isNative;

        return $this;
    }
}
