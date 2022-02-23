<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImContractantRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ImContractantRepository::class)
 */
class ImContractant
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=ImContract::class, inversedBy="contractants")
     * @ORM\JoinColumn(nullable=false)
     */
    private $contract;

    /**
     * @ORM\ManyToOne(targetEntity=ImOwner::class, inversedBy="contractants")
     * @ORM\JoinColumn(nullable=false)
     */
    private $owner;

    /**
     * @ORM\ManyToOne(targetEntity=ImBuyer::class, inversedBy="contractants")
     */
    private $buyer;

    /**
     * @ORM\ManyToOne(targetEntity=ImTenant::class, inversedBy="contractants")
     */
    private $tenant;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContract(): ?ImContract
    {
        return $this->contract;
    }

    public function setContract(?ImContract $contract): self
    {
        $this->contract = $contract;

        return $this;
    }

    public function getBuyer(): ?ImBuyer
    {
        return $this->buyer;
    }

    public function setBuyer(?ImBuyer $buyer): self
    {
        $this->buyer = $buyer;

        return $this;
    }

    public function getTenant(): ?ImTenant
    {
        return $this->tenant;
    }

    public function setTenant(?ImTenant $tenant): self
    {
        $this->tenant = $tenant;

        return $this;
    }

    public function getOwner(): ?ImOwner
    {
        return $this->owner;
    }

    public function setOwner(?ImOwner $owner): self
    {
        $this->owner = $owner;

        return $this;
    }
}
