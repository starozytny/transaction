<?php

namespace App\Entity\Immo;

use App\Entity\Agenda\AgEvent;
use App\Entity\DataEntity;
use App\Entity\User;
use App\Repository\Immo\ImBienRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImBienRepository::class)
 */
class ImBien extends DataEntity
{
    const TOTAL_READ_BY_OWNER = ["bien-owner:read"];

    const ANSWER_NO = 0;
    const ANSWER_YES = 1;
    const ANSWER_UNKNOWN = 99;

    const STATUS_INACTIF = 0;
    const STATUS_ACTIF = 1;
    const STATUS_ARCHIVE = 2;

    const AD_VENTE              = 0;
    const AD_LOCATION           = 1;
    const AD_VIAGER             = 2;
    const AD_PDT_INVEST         = 3;
    const AD_CESSION_BAIL       = 4;
    const AD_LOCATION_VAC       = 5;
    const AD_VENTE_PRESTIGE     = 6;
    const AD_FOND_COMMERCE      = 7;

    const BIEN_APPARTEMENT      = 0;
    const BIEN_MAISON           = 1;
    const BIEN_PARKING_BOX      = 2;
    const BIEN_TERRAIN          = 3;
    const BIEN_BOUTIQUE         = 4;
    const BIEN_BUREAU           = 5;
    const BIEN_CHATEAU          = 6;
    const BIEN_IMMEUBLE         = 7;
    const BIEN_TERRAIN_MAISON   = 8;
    const BIEN_DIVERS           = 9;

    const BUSY_NONE = 0;
    const BUSY_OWNER = 1;
    const BUSY_TENANT = 2;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "user:read", "agenda:read", "visit:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Groups({"user:read"})
     */
    private $reference;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Gedmo\Slug(updatable=true, fields={"identifiant"})
     * @Groups({"user:read"})
     */
    private $slug;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $codeTypeAd;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $codeTypeBien;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user:read"})
     */
    private $libelle;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $codeTypeMandat;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user:read"})
     */
    private $createdBy;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user:read"})
     */
    private $updatedBy;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $identifiant;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"user:read"})
     */
    private $isPublished = false;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $status = self::STATUS_INACTIF;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"user:read"})
     */
    private $isDraft = false;

    /**
     * @ORM\OneToOne(targetEntity=ImArea::class, fetch="EAGER", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read"})
     */
    private $area;

    /**
     * @ORM\ManyToOne(targetEntity=ImAgency::class, inversedBy="biens", fetch="EAGER")
     * @ORM\JoinColumn(nullable=false)
     */
    private $agency;

    /**
     * @ORM\ManyToOne(targetEntity=ImNegotiator::class, fetch="EAGER", inversedBy="biens")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read"})
     */
    private $negotiator;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="imBiens")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\OneToOne(targetEntity=ImNumber::class, fetch="EAGER", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read"})
     */
    private $number;

    /**
     * @ORM\OneToOne(targetEntity=ImFeature::class, fetch="EAGER", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read"})
     */
    private $feature;

    /**
     * @ORM\OneToOne(targetEntity=ImAdvantage::class, fetch="EAGER", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read"})
     */
    private $advantage;

    /**
     * @ORM\OneToOne(targetEntity=ImDiag::class, fetch="EAGER", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read"})
     */
    private $diag;

    /**
     * @ORM\OneToOne(targetEntity=ImLocalisation::class, fetch="EAGER", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read"})
     */
    private $localisation;

    /**
     * @ORM\OneToOne(targetEntity=ImFinancial::class, fetch="EAGER", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read"})
     */
    private $financial;

    /**
     * @ORM\ManyToOne(targetEntity=ImOwner::class, fetch="EAGER", inversedBy="biens")
     * @Groups({"user:read", "bien-owner:read"})
     */
    private $owner;

    /**
     * @ORM\OneToMany(targetEntity=ImPhoto::class, mappedBy="bien")
     */
    private $photos;

    /**
     * @ORM\OneToOne(targetEntity=ImPhoto::class, cascade={"persist", "remove"})
     */
    private $mainPhoto;

    /**
     * @ORM\OneToMany(targetEntity=ImTenant::class, mappedBy="bien")
     */
    private $tenants;

    /**
     * @ORM\OneToOne(targetEntity=ImConfidential::class, fetch="EAGER", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read"})
     */
    private $confidential;

    /**
     * @ORM\OneToOne(targetEntity=ImAdvert::class, fetch="EAGER", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read"})
     */
    private $advert;

    /**
     * @ORM\OneToMany(targetEntity=ImVisit::class, mappedBy="bien")
     */
    private $visits;

    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
        $this->photos = new ArrayCollection();
        $this->tenants = new ArrayCollection();
        $this->visits = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReference(): ?string
    {
        return $this->reference;
    }

    public function setReference(string $reference): self
    {
        $this->reference = $reference;

        return $this;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): self
    {
        $this->slug = $slug;

        return $this;
    }

    public function getCodeTypeAd(): ?int
    {
        return $this->codeTypeAd;
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getTypeAdString(): string
    {
        $data = ["Vente", "Location", "Viager", "Produit d'investissement", "Cession bail", "Location vacances", "Vente prestige", "Fond de commerce"];

        return $data[$this->codeTypeAd];
    }

    public function setCodeTypeAd(int $codeTypeAd): self
    {
        $this->codeTypeAd = $codeTypeAd;

        return $this;
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getTypeBienString(): string
    {
        $data = ["Appartement", "Maison", "Parking/Box", "Terrain", "Boutique", "Bureau", "Château", "Immeuble", "Terrain + Maison", "Divers"];

        return $data[$this->codeTypeBien];
    }

    public function getCodeTypeBien(): ?int
    {
        return $this->codeTypeBien;
    }

    public function setCodeTypeBien(int $codeTypeBien): self
    {
        $this->codeTypeBien = $codeTypeBien;

        return $this;
    }

    public function getLibelle(): ?string
    {
        return $this->libelle;
    }

    public function setLibelle(string $libelle): self
    {
        $this->libelle = $libelle;

        return $this;
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getTypeMandatString(): string
    {
        $data = ["Simple", "Exclusif", "Semi-exclusif"];

        return $data[$this->codeTypeMandat];
    }

    public function getCodeTypeMandat(): ?int
    {
        return $this->codeTypeMandat;
    }

    public function setCodeTypeMandat(int $codeTypeMandat): self
    {
        $this->codeTypeMandat = $codeTypeMandat;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    /**
     * return ll -> 5 janv. 2017
     * return LL -> 5 janvier 2017
     *
     * @return string|null
     * @Groups({"user:read"})
     */
    public function getCreatedAtString(): ?string
    {
        return $this->getFullDateString($this->createdAt);
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getCreatedBy(): ?string
    {
        return $this->createdBy;
    }

    public function setCreatedBy(string $createdBy): self
    {
        $this->createdBy = $createdBy;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    /**
     * return ll -> 5 janv. 2017
     * return LL -> 5 janvier 2017
     *
     * @return string|null
     * @Groups({"user:read"})
     */
    public function getUpdatedAtString(): ?string
    {
        return $this->getFullDateString($this->updatedAt);
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $updatedAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getUpdatedBy(): ?string
    {
        return $this->updatedBy;
    }

    public function setUpdatedBy(?string $updatedBy): self
    {
        $this->updatedBy = $updatedBy;

        return $this;
    }

    public function getIdentifiant(): ?string
    {
        return $this->identifiant;
    }

    public function setIdentifiant(string $identifiant): self
    {
        $this->identifiant = $identifiant;

        return $this;
    }

    public function getArea(): ?ImArea
    {
        return $this->area;
    }

    public function setArea(ImArea $area): self
    {
        $this->area = $area;

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

    public function getNegotiator(): ?ImNegotiator
    {
        return $this->negotiator;
    }

    public function setNegotiator(?ImNegotiator $negotiator): self
    {
        $this->negotiator = $negotiator;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getNumber(): ?ImNumber
    {
        return $this->number;
    }

    public function setNumber(ImNumber $number): self
    {
        $this->number = $number;

        return $this;
    }

    public function getFeature(): ?ImFeature
    {
        return $this->feature;
    }

    public function setFeature(ImFeature $feature): self
    {
        $this->feature = $feature;

        return $this;
    }

    public function getAdvantage(): ?ImAdvantage
    {
        return $this->advantage;
    }

    public function setAdvantage(ImAdvantage $advantage): self
    {
        $this->advantage = $advantage;

        return $this;
    }

    public function getDiag(): ?ImDiag
    {
        return $this->diag;
    }

    public function setDiag(ImDiag $diag): self
    {
        $this->diag = $diag;

        return $this;
    }

    public function getLocalisation(): ?ImLocalisation
    {
        return $this->localisation;
    }

    public function setLocalisation(ImLocalisation $localisation): self
    {
        $this->localisation = $localisation;

        return $this;
    }

    public function getFinancial(): ?ImFinancial
    {
        return $this->financial;
    }

    public function setFinancial(ImFinancial $financial): self
    {
        $this->financial = $financial;

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

    public function getIsPublished(): ?bool
    {
        return $this->isPublished;
    }

    public function setIsPublished(bool $isPublished): self
    {
        $this->isPublished = $isPublished;

        return $this;
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getStatusString(): string
    {
        $status = ["Inactif", "Active", "Archive"];

        return $status[$this->status];
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

    public function getIsDraft(): ?bool
    {
        return $this->isDraft;
    }

    public function setIsDraft(bool $isDraft): self
    {
        $this->isDraft = $isDraft;

        return $this;
    }

    /**
     * @return Collection|ImPhoto[]
     */
    public function getPhotos(): Collection
    {
        return $this->photos;
    }

    public function addPhoto(ImPhoto $photo): self
    {
        if (!$this->photos->contains($photo)) {
            $this->photos[] = $photo;
            $photo->setBien($this);
        }

        return $this;
    }

    public function removePhoto(ImPhoto $photo): self
    {
        if ($this->photos->removeElement($photo)) {
            // set the owning side to null (unless already changed)
            if ($photo->getBien() === $this) {
                $photo->setBien(null);
            }
        }

        return $this;
    }

    public function getMainPhoto(): ?ImPhoto
    {
        return $this->mainPhoto;
    }

    public function setMainPhoto(?ImPhoto $mainPhoto): self
    {
        $this->mainPhoto = $mainPhoto;

        return $this;
    }

    /**
     * @return Collection|ImTenant[]
     */
    public function getTenants(): Collection
    {
        return $this->tenants;
    }

    public function addTenant(ImTenant $tenant): self
    {
        if (!$this->tenants->contains($tenant)) {
            $this->tenants[] = $tenant;
            $tenant->setBien($this);
        }

        return $this;
    }

    public function removeTenant(ImTenant $tenant): self
    {
        if ($this->tenants->removeElement($tenant)) {
            // set the owning side to null (unless already changed)
            if ($tenant->getBien() === $this) {
                $tenant->setBien(null);
            }
        }

        return $this;
    }

    public function getConfidential(): ?ImConfidential
    {
        return $this->confidential;
    }

    public function setConfidential(ImConfidential $confidential): self
    {
        $this->confidential = $confidential;

        return $this;
    }

    public function getAdvert(): ?ImAdvert
    {
        return $this->advert;
    }

    public function setAdvert(ImAdvert $advert): self
    {
        $this->advert = $advert;

        return $this;
    }

    /**
     * @return string
     * @Groups({"agenda:read"})
     */
    public function getFullname(): string
    {
        return "#" . $this->reference . " - " . $this->libelle . " | " . $this->getLocalisation()->getFullAddress();
    }

    /**
     * @return Collection|ImVisit[]
     */
    public function getVisits(): Collection
    {
        return $this->visits;
    }

    public function addVisit(ImVisit $visit): self
    {
        if (!$this->visits->contains($visit)) {
            $this->visits[] = $visit;
            $visit->setBien($this);
        }

        return $this;
    }

    public function removeVisit(ImVisit $visit): self
    {
        if ($this->visits->removeElement($visit)) {
            // set the owning side to null (unless already changed)
            if ($visit->getBien() === $this) {
                $visit->setBien(null);
            }
        }

        return $this;
    }
}
