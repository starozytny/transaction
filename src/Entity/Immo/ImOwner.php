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
    const CIVILITY_MR = 0;
    const CIVILITY_MME = 1;
    const CIVILITY_SOC = 2;
    const CIVILITY_OU = 3;
    const CIVILITY_ET = 4;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "user:read", "bien-owner:read", "agenda:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100)
     * @Groups({"admin:read", "user:read"})
     */
    private $code;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read", "user:read"})
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $firstname;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "user:read"})
     */
    private $civility = 0;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read", "agenda:read"})
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $phone1;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $phone2;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $phone3;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $complement;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $zipcode;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $country;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"admin:read", "user:read"})
     */
    private $isGerance = false;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $codeGerance;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $folderGerance;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"admin:read", "user:read"})
     */
    private $isCoIndivisaire = false;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $coLastname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $coFirstname;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $coAddress;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $coComplement;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $coZipcode;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $coCity;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $coPhone;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $coEmail;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $category;

    /**
     * @ORM\ManyToOne(targetEntity=ImNegotiator::class, fetch="EAGER", inversedBy="owners")
     * @Groups({"admin:read", "user:read"})
     */
    private $negotiator;

    /**
     * @ORM\ManyToOne(targetEntity=Society::class, fetch="EAGER", inversedBy="imOwners")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"admin:read", "user:read"})
     */
    private $society;

    /**
     * @ORM\OneToMany(targetEntity=ImBien::class, mappedBy="owner")
     */
    private $biens;

    /**
     * @ORM\ManyToOne(targetEntity=ImAgency::class, fetch="EAGER", inversedBy="owners")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"admin:read", "user:read"})
     */
    private $agency;

    public function __construct()
    {
        $this->biens = new ArrayCollection();
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

    public function getFolderGerance(): ?string
    {
        return $this->folderGerance;
    }

    public function setFolderGerance(?string $folderGerance): self
    {
        $this->folderGerance = $folderGerance;

        return $this;
    }

    public function getIsCoIndivisaire(): ?bool
    {
        return $this->isCoIndivisaire;
    }

    public function setIsCoIndivisaire(bool $isCoIndivisaire): self
    {
        $this->isCoIndivisaire = $isCoIndivisaire;

        return $this;
    }

    public function getCoLastname(): ?string
    {
        return $this->coLastname;
    }

    public function setCoLastname(?string $coLastname): self
    {
        $this->coLastname = $coLastname;

        return $this;
    }

    public function getCoFirstname(): ?string
    {
        return $this->coFirstname;
    }

    public function setCoFirstname(?string $coFirstname): self
    {
        $this->coFirstname = $coFirstname;

        return $this;
    }

    public function getCoAddress(): ?string
    {
        return $this->coAddress;
    }

    public function setCoAddress(?string $coAddress): self
    {
        $this->coAddress = $coAddress;

        return $this;
    }

    public function getCoComplement(): ?string
    {
        return $this->coComplement;
    }

    public function setCoComplement(?string $coComplement): self
    {
        $this->coComplement = $coComplement;

        return $this;
    }

    public function getCoZipcode(): ?string
    {
        return $this->coZipcode;
    }

    public function setCoZipcode(?string $coZipcode): self
    {
        $this->coZipcode = $coZipcode;

        return $this;
    }

    public function getCoCity(): ?string
    {
        return $this->coCity;
    }

    public function setCoCity(?string $coCity): self
    {
        $this->coCity = $coCity;

        return $this;
    }

    public function getCoPhone(): ?string
    {
        return $this->coPhone;
    }

    public function setCoPhone(?string $coPhone): self
    {
        $this->coPhone = $coPhone;

        return $this;
    }

    public function getCoEmail(): ?string
    {
        return $this->coEmail;
    }

    public function setCoEmail(?string $coEmail): self
    {
        $this->coEmail = $coEmail;

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
     * @Groups({"admin:read", "user:read"})
     */
    public function getFullnameCivility(): string
    {
        return $this->getFullNameString($this->lastname, $this->firstname, $this->getCivilityString());
    }

    /**
     * @return string
     * @Groups({"admin:read", "user:read", "agenda:read"})
     */
    public function getFullname(): string
    {
        return $this->getFullNameString($this->lastname, $this->firstname);
    }

    /**
     * @return string
     * @Groups({"admin:read", "user:read"})
     */
    public function getFullAddress(): string
    {
        return $this->getFullAddressString($this->address, $this->zipcode, $this->city, $this->complement, $this->country);
    }

    /**
     * @return string
     * @Groups({"admin:read", "user:read"})
     */
    public function getCoFullname(): string
    {
        return $this->getFullNameString($this->coLastname, $this->coFirstname);
    }

    /**
     * @return string
     * @Groups({"admin:read", "user:read"})
     */
    public function getCoFullAddress(): string
    {
        return $this->getFullAddressString($this->coAddress, $this->coZipcode, $this->coCity);
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

    /**
     * @return Collection|ImBien[]
     */
    public function getBiens(): Collection
    {
        return $this->biens;
    }

    public function addBien(ImBien $bien): self
    {
        if (!$this->biens->contains($bien)) {
            $this->biens[] = $bien;
            $bien->setOwner($this);
        }

        return $this;
    }

    public function removeBien(ImBien $bien): self
    {
        if ($this->biens->removeElement($bien)) {
            // set the owning side to null (unless already changed)
            if ($bien->getOwner() === $this) {
                $bien->setOwner(null);
            }
        }

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
