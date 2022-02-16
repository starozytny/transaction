<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImOfferRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImOfferRepository::class)
 */
class ImOffer
{
    const OFFER_READ = ["offer:read"];

    const STATUS_PROPAL = 0;
    const STATUS_ACCEPT = 1;
    const STATUS_REFUSE = 2;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"offer:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"offer:read"})
     */
    private $status = self::STATUS_PROPAL;

    /**
     * @ORM\Column(type="float")
     * @Groups({"offer:read"})
     */
    private $pricePropal;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"offer:read"})
     */
    private $priceFinal;

    /**
     * @ORM\ManyToOne(targetEntity=ImBien::class, fetch="EAGER", inversedBy="offers")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"offer:read"})
     */
    private $bien;

    /**
     * @ORM\ManyToOne(targetEntity=ImProspect::class, fetch="EAGER", inversedBy="offers")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"offer:read"})
     */
    private $prospect;

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

    public function getProspect(): ?ImProspect
    {
        return $this->prospect;
    }

    public function setProspect(?ImProspect $prospect): self
    {
        $this->prospect = $prospect;

        return $this;
    }

    /**
     * @return string
     * @Groups({"offer:read"})
     */
    public function getStatusString(): string
    {
        $values = ["Proposition", "Acceptée", "Refusée"];

        return $values[$this->status];
    }
}
