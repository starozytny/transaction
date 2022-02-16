<?php

namespace App\Entity\Immo;

use App\Entity\DataEntity;
use App\Repository\Immo\ImProspectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImProspectRepository::class)
 */
class ImProspect extends DataEntity
{
    const TYPE_NONE = 0;
    const TYPE_LOCATION = 1;
    const TYPE_VENTE = 2;
    const TYPE_INVEST = 3;
    const TYPE_AUTRE = 4;

    const STATUS_NONE = 0;
    const STATUS_SEARCH = 1;
    const STATUS_NOT_FULL = 2;
    const STATUS_CONTACT = 3;
    const STATUS_OFFER = 4;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "agenda:read", "suivi:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read", "agenda:read", "suivi:read"})
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read", "suivi:read"})
     */
    private $firstname;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "suivi:read"})
     */
    private $civility;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "agenda:read", "suivi:read"})
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "suivi:read"})
     */
    private $phone1;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "suivi:read"})
     */
    private $phone2;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "suivi:read"})
     */
    private $phone3;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "suivi:read"})
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "suivi:read"})
     */
    private $complement;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"admin:read", "suivi:read"})
     */
    private $zipcode;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "suivi:read"})
     */
    private $city;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $birthday;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $lastContactAt;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "suivi:read"})
     */
    private $type = self::TYPE_NONE;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "suivi:read"})
     */
    private $status = self::STATUS_SEARCH;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"admin:read", "suivi:read"})
     */
    private $isArchived = false;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read"})
     */
    private $commentary;


    /**
     * @ORM\ManyToOne(targetEntity=ImNegotiator::class, fetch="EAGER", inversedBy="prospects")
     * @Groups({"admin:read", "suivi:read"})
     */
    private $negotiator;

    /**
     * @ORM\ManyToOne(targetEntity=ImAgency::class, fetch="EAGER", inversedBy="prospects")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"admin:read", "suivi:read"})
     */
    private $agency;

    /**
     * @ORM\OneToMany(targetEntity=ImSuivi::class, mappedBy="prospect")
     */
    private $suivis;

    /**
     * @ORM\OneToOne(targetEntity=ImSearch::class, inversedBy="prospect", cascade={"persist", "remove"})
     * @Groups({"admin:read", "suivi:read"})
     */
    private $search;

    /**
     * @ORM\OneToMany(targetEntity=ImOffer::class, mappedBy="prospect")
     */
    private $offers;

    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
        $this->suivis = new ArrayCollection();
        $this->offers = new ArrayCollection();
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
     * @Groups({"admin:read", "suivi:read"})
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

    /**
     * @return string|null
     * @Groups({"admin:read", "suivi:read"})
     */
    public function getLastContactAtJavascript(): ?string
    {
        return $this->setDateJavascript($this->lastContactAt);
    }

    public function getLastContactAt(): ?\DateTimeInterface
    {
        return $this->lastContactAt;
    }

    public function setLastContactAt(?\DateTimeInterface $lastContactAt): self
    {
        $this->lastContactAt = $lastContactAt;

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

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

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
     * @Groups({"admin:read", "agenda:read", "suivi:read"})
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
     * @Groups({"admin:read", "suivi:read"})
     */
    public function getTypeString(): string
    {
        $types = ["Aucun", "Location", "Vente", "Investisseur", "Autre"];

        return $types[$this->type];
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getStatusString(): string
    {
        $status = ["Aucun", "En recherche", "A compléter", "A contacter", "En offre"];

        return $status[$this->status];
    }

    /**
     * How long ago a user was logged for the last time.
     *
     * @Groups({"admin:read"})
     */
    public function getLastContactAtAgo(): ?string
    {
        return $this->getHowLongAgo($this->lastContactAt);
    }

    /**
     * @return Collection|ImSuivi[]
     */
    public function getSuivis(): Collection
    {
        return $this->suivis;
    }

    public function addSuivi(ImSuivi $suivi): self
    {
        if (!$this->suivis->contains($suivi)) {
            $this->suivis[] = $suivi;
            $suivi->setProspect($this);
        }

        return $this;
    }

    public function removeSuivi(ImSuivi $suivi): self
    {
        if ($this->suivis->removeElement($suivi)) {
            // set the owning side to null (unless already changed)
            if ($suivi->getProspect() === $this) {
                $suivi->setProspect(null);
            }
        }

        return $this;
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

    public function getSearch(): ?ImSearch
    {
        return $this->search;
    }

    public function setSearch(?ImSearch $search): self
    {
        $this->search = $search;

        return $this;
    }

    public function getCommentary(): ?string
    {
        return $this->commentary;
    }

    public function setCommentary(?string $commentary): self
    {
        $this->commentary = $commentary;

        return $this;
    }

    /**
     * @return Collection|ImOffer[]
     */
    public function getOffers(): Collection
    {
        return $this->offers;
    }

    public function addOffer(ImOffer $offer): self
    {
        if (!$this->offers->contains($offer)) {
            $this->offers[] = $offer;
            $offer->setProspect($this);
        }

        return $this;
    }

    public function removeOffer(ImOffer $offer): self
    {
        if ($this->offers->removeElement($offer)) {
            // set the owning side to null (unless already changed)
            if ($offer->getProspect() === $this) {
                $offer->setProspect(null);
            }
        }

        return $this;
    }
}
