<?php

namespace App\Entity\Immo;

use App\Entity\DataEntity;
use App\Entity\Society;
use App\Repository\Immo\ImOwnerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImOwnerRepository::class)
 */
class ImOwner extends DataEntity
{
    const OWNER_READ = ["owner:read"];

    const CIVILITY_MR = 0;
    const CIVILITY_MME = 1;
    const CIVILITY_SOC = 2;
    const CIVILITY_OU = 3;
    const CIVILITY_ET = 4;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "user:read", "agenda:read", "owner:read", "contractant-owner:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100)
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    private $code;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read", "user:read", "agenda:read", "owner:read"})
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    private $firstname;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    private $civility = 0;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read", "agenda:read", "owner:read", "contractant-owner:read"})
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "user:read", "owner:read", "contractant-owner:read"})
     */
    private $phone1;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "user:read", "owner:read", "contractant-owner:read"})
     */
    private $phone2;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "user:read", "owner:read", "contractant-owner:read"})
     */
    private $phone3;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    private $complement;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    private $zipcode;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    private $country;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    private $isGerance = false;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    private $codeGerance;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    private $category;

    /**
     * @ORM\ManyToOne(targetEntity=ImNegotiator::class, fetch="EAGER", inversedBy="owners")
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    private $negotiator;

    /**
     * @ORM\ManyToOne(targetEntity=Society::class, fetch="EAGER", inversedBy="imOwners")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    private $society;

    /**
     * @ORM\ManyToOne(targetEntity=ImAgency::class, fetch="EAGER", inversedBy="owners")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    private $agency;

    /**
     * @ORM\OneToMany(targetEntity=ImContractant::class, mappedBy="owner")
     */
    private $contractants;

    /**
     * @ORM\OneToMany(targetEntity=ImSeller::class, mappedBy="owner")
     */
    private $sellers;

    public function __construct()
    {
        $this->contractants = new ArrayCollection();
        $this->sellers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCode(): ?string
    {
        return $this->code;
    }

    public function setCode(string $code): self
    {
        $this->code = $code;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(?string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * @return string
     * @Groups({"admin:read", "user:read"})
     */
    public function getCivilityString(): string
    {
        return $this->setCivilityString($this->civility);
    }

    public function getCivility(): ?int
    {
        return $this->civility;
    }

    public function setCivility(int $civility): self
    {
        $this->civility = $civility;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPhone1(): ?string
    {
        return $this->phone1;
    }

    public function setPhone1(?string $phone1): self
    {
        $this->phone1 = $phone1;

        return $this;
    }

    public function getPhone2(): ?string
    {
        return $this->phone2;
    }

    public function setPhone2(?string $phone2): self
    {
        $this->phone2 = $phone2;

        return $this;
    }

    public function getPhone3(): ?string
    {
        return $this->phone3;
    }

    public function setPhone3(?string $phone3): self
    {
        $this->phone3 = $phone3;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getComplement(): ?string
    {
        return $this->complement;
    }

    public function setComplement(?string $complement): self
    {
        $this->complement = $complement;

        return $this;
    }

    public function getZipcode(): ?string
    {
        return $this->zipcode;
    }

    public function setZipcode(?string $zipcode): self
    {
        $this->zipcode = $zipcode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(?string $country): self
    {
        $this->country = $country;

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

    public function getIsGerance(): ?bool
    {
        return $this->isGerance;
    }

    public function setIsGerance(bool $isGerance): self
    {
        $this->isGerance = $isGerance;

        return $this;
    }

    public function getCodeGerance(): ?string
    {
        return $this->codeGerance;
    }

    public function setCodeGerance(?string $codeGerance): self
    {
        $this->codeGerance = $codeGerance;

        return $this;
    }

    public function getCategory(): ?int
    {
        return $this->category;
    }

    public function setCategory(?int $category): self
    {
        $this->category = $category;

        return $this;
    }

    /**
     * @return string
     * @Groups({"admin:read", "user:read", "contractant-owner:read"})
     */
    public function getFullnameCivility(): string
    {
        return $this->getFullNameString($this->lastname, $this->firstname, $this->getCivilityString());
    }

    /**
     * @return string
     * @Groups({"admin:read", "user:read", "agenda:read", "owner:read"})
     */
    public function getFullname(): string
    {
        return $this->getFullNameString($this->lastname, $this->firstname);
    }

    /**
     * @return string
     * @Groups({"admin:read", "user:read", "owner:read"})
     */
    public function getFullAddress(): string
    {
        return $this->getFullAddressString($this->address, $this->zipcode, $this->city, $this->complement, $this->country);
    }

    public function getSociety(): ?Society
    {
        return $this->society;
    }

    public function setSociety(?Society $society): self
    {
        $this->society = $society;

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
            $contractant->setOwner($this);
        }

        return $this;
    }

    public function removeContractant(ImContractant $contractant): self
    {
        if ($this->contractants->removeElement($contractant)) {
            // set the owning side to null (unless already changed)
            if ($contractant->getOwner() === $this) {
                $contractant->setOwner(null);
            }
        }

        return $this;
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
            $seller->setOwner($this);
        }

        return $this;
    }

    public function removeSeller(ImSeller $seller): self
    {
        if ($this->sellers->removeElement($seller)) {
            // set the owning side to null (unless already changed)
            if ($seller->getOwner() === $this) {
                $seller->setOwner(null);
            }
        }

        return $this;
    }
}
