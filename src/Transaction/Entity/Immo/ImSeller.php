<?php

namespace App\Transaction\Entity\Immo;

use App\Transaction\Repository\Immo\ImSellerRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ImSellerRepository::class)
 */
class ImSeller
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=ImContract::class, inversedBy="sellers")
     * @ORM\JoinColumn(nullable=false)
     */
    private $contract;

    /**
     * @ORM\ManyToOne(targetEntity=ImOwner::class, inversedBy="sellers")
     */
    private $owner;

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
}
