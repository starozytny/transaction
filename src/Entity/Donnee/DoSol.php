<?php

namespace App\Entity\Donnee;

use App\Entity\Immo\ImAgency;
use App\Repository\Donnee\DoSolRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=DoSolRepository::class)
 */
class DoSol
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
     * @ORM\ManyToOne(targetEntity=ImAgency::class, inversedBy="doSols")
     */
    private $agency;

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
}
