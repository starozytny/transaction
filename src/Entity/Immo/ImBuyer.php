<?php

namespace App\Entity\Immo;

use App\Entity\DataEntity;
use App\Repository\Immo\ImBuyerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImBuyerRepository::class)
 */
class ImBuyer extends DataEntity
{
    const TYPE_BUYER = 0;
    const TYPE_INVEST = 1;
    const TYPE_AUTRE = 2;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "agenda:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"admin:read"})
     */
    private $type = self::TYPE_BUYER;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read", "agenda:read"})
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read"})
     */
    private $firstname;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"admin:read"})
     */
    private $civility;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read"})
     */
    private $phone1;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read"})
     */
    private $phone2;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read"})
     */
    private $phone3;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $complement;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"admin:read"})
     */
    private $zipcode;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $city;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $birthday;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isArchived = false;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity=ImNegotiator::class, fetch="EAGER", inversedBy="buyers")
     * @Groups({"admin:read"})
     */
    private $negotiator;

    /**
     * @ORM\ManyToOne(targetEntity=ImAgency::class, fetch="EAGER", inversedBy="buyers")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"admin:read"})
     */
    private $agency;

    /**
     * @ORM\OneToMany(targetEntity=ImContractant::class, mappedBy="buyer")
     */
    private $contractants;

    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
        $this->contractants = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * @return string
     * @Groups({"admin:read"})
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

    /**
     * @return string|null
     * @Groups({"admin:read"})
     */
    public function getBirthdayJavascript(): ?string
    {
        return $this->setDateJavascript($this->birthday);
    }

    public function getBirthday(): ?\DateTimeInterface
    {
        return $this->birthday;
    }

    public function setBirthday(?\DateTimeInterface $birthday): self
    {
        $this->birthday = $birthday;

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

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): self
    {
        $this->type = $type;

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
     * @return string
     * @Groups({"admin:read", "agenda:read"})
     */
    public function getFullname(): string
    {
        return $this->getFullNameString($this->lastname, $this->firstname);
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getFullAddress(): string
    {
        return $this->getFullAddressString($this->address, $this->zipcode, $this->city, $this->complement);
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getTypeString(): string
    {
        $types = ["Acheteur", "Investisseur", "Autre"];

        return $types[$this->type];
    }

    public function getIsArchived(): ?bool
    {
        return $this->isArchived;
    }

    public function setIsArchived(bool $isArchived): self
    {
        $this->isArchived = $isArchived;

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
            $contractant->setBuyer($this);
        }

        return $this;
    }

    public function removeContractant(ImContractant $contractant): self
    {
        if ($this->contractants->removeElement($contractant)) {
            // set the owning side to null (unless already changed)
            if ($contractant->getBuyer() === $this) {
                $contractant->setBuyer(null);
            }
        }

        return $this;
    }
}
