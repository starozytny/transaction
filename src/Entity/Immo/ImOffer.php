<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImOfferRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ImOfferRepository::class)
 */
class ImOffer
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $status;

    /**
     * @ORM\Column(type="float")
     */
    private $pricePropal;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $priceFinal;

    /**
     * @ORM\ManyToOne(targetEntity=ImBien::class, inversedBy="offers")
     * @ORM\JoinColumn(nullable=false)
     */
    private $bien;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getPricePropal(): ?float
    {
        return $this->pricePropal;
    }

    public function setPricePropal(float $pricePropal): self
    {
        $this->pricePropal = $pricePropal;

        return $this;
    }

    public function getPriceFinal(): ?float
    {
        return $this->priceFinal;
    }

    public function setPriceFinal(?float $priceFinal): self
    {
        $this->priceFinal = $priceFinal;

        return $this;
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
}
