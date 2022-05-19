<?php

namespace App\Entity\Immo;

use App\Entity\DataEntity;
use App\Repository\Immo\ImContractRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImContractRepository::class)
 */
class ImContract extends DataEntity
{
    const CONTRACT_READ = ["contract:read"];

    const STATUS_END = 0;
    const STATUS_PROCESSING = 1;
    const STATUS_CANCEL = 2;

    const BY_UNKNOWN = 0;
    const BY_AGENCY = 1;
    const BY_OWNER = 2;
    const BY_CONCURRENCE = 3;

    const WHY_UNKNOWN = 0;
    const WHY_OFFER = 1;
    const WHY_COMPROMIS = 2;
    const WHY_SELL = 3;
    const WHY_CANCEL = 4;
    const WHY_SUSPENDED = 5;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"contract:read", "contractant-owner:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"contract:read"})
     */
    private $status = self::STATUS_PROCESSING;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"contract:read"})
     */
    private $sellAt;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"contract:read"})
     */
    private $sellBy = self::BY_AGENCY;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"contract:read"})
     */
    private $sellWhy =self::WHY_UNKNOWN;

    /**
     * @ORM\ManyToOne(targetEntity=ImBien::class, fetch="EAGER", inversedBy="contracts")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"contractant-owner:read"})
     */
    private $bien;

    /**
     * @ORM\ManyToOne(targetEntity=ImNegotiator::class, fetch="EAGER", inversedBy="contracts")
     */
    private $negotiator;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"contract:read"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $updatedAt;

    /**
     * @ORM\OneToMany(targetEntity=ImContractant::class, mappedBy="contract")
     */
    private $contractants;

    /**
     * @ORM\OneToMany(targetEntity=ImSeller::class, mappedBy="contract")
     */
    private $sellers;

    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
        $this->contractants = new ArrayCollection();
        $this->sellers = new ArrayCollection();
    }

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

    public function getBien(): ?ImBien
    {
        return $this->bien;
    }

    public function setBien(?ImBien $bien): self
    {
        $this->bien = $bien;

        return $this;
    }

    public function getSellAt(): ?\DateTimeInterface
    {
        return $this->sellAt;
    }

    public function setSellAt(?\DateTimeInterface $sellAt): self
    {
        $this->sellAt = $sellAt;

        return $this;
    }

    public function getSellBy(): ?int
    {
        return $this->sellBy;
    }

    public function setSellBy(int $sellBy): self
    {
        $this->sellBy = $sellBy;

        return $this;
    }

    public function getSellWhy(): ?int
    {
        return $this->sellWhy;
    }

    public function setSellWhy(int $sellWhy): self
    {
        $this->sellWhy = $sellWhy;

        return $this;
    }

    public function getNegotiator(): ?ImNegotiator
    {
        return $this->negotiator;
    }

    public function setNegotiator(?ImNegotiator $negotiator): self
    {
        $this->negotiator = $negotiator;

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

    /**
     * @return Collection|ImContractant[]
     */
    public function getContractants(): Collection
    {
        return $this->contractants;
    }

    public function addContractant(ImContractant $contractant): self
    {
        if (!$this->contractants->contains($contractant)) {
            $this->contractants[] = $contractant;
            $contractant->setContract($this);
        }

        return $this;
    }

    public function removeContractant(ImContractant $contractant): self
    {
        if ($this->contractants->removeElement($contractant)) {
            // set the owning side to null (unless already changed)
            if ($contractant->getContract() === $this) {
                $contractant->setContract(null);
            }
        }

        return $this;
    }

    /**
     * @return string
     * @Groups({"contract:read"})
     */
    public function getSellByString(): string
    {
        $values = ["Inconnu", "Agence", "Propriétaire", "Concurrence"];

        return $values[$this->sellBy];
    }

    /**
     * @return string
     * @Groups({"contract:read"})
     */
    public function getSellWhyString(): string
    {
        $values = ["Inconnu", "Offre achat", "Compromis", "Vendu", "Annulé", "Suspendu"];

        return $values[$this->sellWhy];
    }

    /**
     * @return string|null
     * @Groups({"contract:read"})
     */
    public function getSellAtJavascript(): ?string
    {
        return $this->setDateJavascript($this->sellAt);
    }

    /**
     * @return string|null
     * @Groups({"contract:read"})
     */
    public function getSellAtString(): ?string
    {
        return $this->getFullDateString($this->sellAt, 'LLLL');
    }

    /**
     * @return string
     * @Groups({"contract:read"})
     */
    public function getStatusString(): string
    {
        $values = ["Terminé", "En cours", "Annulé"];

        return $values[$this->status];
    }

    /**
     * @return Collection|ImSeller[]
     */
    public function getSellers(): Collection
    {
        return $this->sellers;
    }

    public function addSeller(ImSeller $seller): self
    {
        if (!$this->sellers->contains($seller)) {
            $this->sellers[] = $seller;
            $seller->setContract($this);
        }

        return $this;
    }

    public function removeSeller(ImSeller $seller): self
    {
        if ($this->sellers->removeElement($seller)) {
            // set the owning side to null (unless already changed)
            if ($seller->getContract() === $this) {
                $seller->setContract(null);
            }
        }

        return $this;
    }
}
