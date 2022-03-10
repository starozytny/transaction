<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImContractantRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImContractantRepository::class)
 */
class ImContractant
{
    const CONTRACTANT_OWNER_READ = ["contractant-owner:read"];
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=ImContract::class, fetch="EAGER", inversedBy="contractants")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"contractant-owner:read"})
     */
    private $contract;

    /**
     * @ORM\ManyToOne(targetEntity=ImOwner::class, fetch="EAGER", inversedBy="contractants")
     * @Groups({"contractant-owner:read"})
     */
    private $owner;

    /**
     * @ORM\ManyToOne(targetEntity=ImTenant::class, fetch="EAGER", inversedBy="contractants")
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

    public function getOwner(): ?ImOwner
    {
        return $this->owner;
    }

    public function setOwner(?ImOwner $owner): self
    {
        $this->owner = $owner;

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
}
