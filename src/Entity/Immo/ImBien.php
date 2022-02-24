<?php

namespace App\Entity\Immo;

use App\Entity\DataEntity;
use App\Entity\History\HiPublish;
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
    const FOLDER_PHOTOS = "immo/photos";

    const COUNT_BY_AGENCY = ["count-agency:read"];

    const ANSWER_NO = 0;
    const ANSWER_YES = 1;
    const ANSWER_UNKNOWN = 99;

    const STATUS_INACTIF = 0;
    const STATUS_ACTIF = 1;
    const STATUS_ARCHIVE = 2;
    const STATUS_DRAFT = 3;

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

    const BUSY_NONE = 0;
    const BUSY_OWNER = 1;
    const BUSY_TENANT = 2;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "user:read", "agenda:read", "visit:read", "suivi:read", "offer:read",
     *     "publish:read", "history:publish"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=20, unique=true)
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
     * @Groups({"user:read", "suivi:read"})
     */
    private $codeTypeAd;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read", "suivi:read"})
     */
    private $codeTypeBien;

    /**
     * @ORM\Column(type="string", length=64)
     * @Groups({"user:read", "suivi:read"})
     */
    private $libelle;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user:read"})
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
    private $status = self::STATUS_ACTIF;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"user:read"})
     */
    private $isDraft = false;

    /**
     * @ORM\Column(type="boolean")
     */
    private $isArchived = false;

    /**
     * @ORM\OneToOne(targetEntity=ImArea::class, fetch="EAGER", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read", "suivi:read"})
     */
    private $area;

    /**
     * @ORM\ManyToOne(targetEntity=ImAgency::class, fetch="EAGER", inversedBy="biens")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read", "count-agency:read"})
     */
    private $agency;

    /**
     * @ORM\ManyToOne(targetEntity=ImNegotiator::class, fetch="EAGER", inversedBy="biens")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read"})
     */
    private $negotiator;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, fetch="EAGER", inversedBy="imBiens")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read"})
     */
    private $user;

    /**
     * @ORM\OneToOne(targetEntity=ImNumber::class, fetch="EAGER", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read", "suivi:read"})
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
     * @Groups({"user:read", "suivi:read"})
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
     * @Groups({"user:read", "suivi:read"})
     */
    private $localisation;

    /**
     * @ORM\OneToOne(targetEntity=ImFinancial::class, fetch="EAGER", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read", "suivi:read"})
     */
    private $financial;

    /**
     * @ORM\ManyToOne(targetEntity=ImOwner::class, fetch="EAGER", inversedBy="biens")
     * @Groups({"user:read"})
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

    /**
     * @ORM\OneToMany(targetEntity=ImRoom::class, mappedBy="bien")
     */
    private $rooms;

    /**
     * @ORM\OneToMany(targetEntity=ImSuivi::class, mappedBy="bien")
     */
    private $suivis;

    /**
     * @ORM\OneToOne(targetEntity=ImMandat::class, fetch="EAGER", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read"})
     */
    private $mandat;

    /**
     * @ORM\OneToMany(targetEntity=ImOffer::class, mappedBy="bien")
     */
    private $offers;

    /**
     * @ORM\OneToMany(targetEntity=ImPublish::class, mappedBy="bien")
     */
    private $publishes;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"user:read"})
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
     * @ORM\OneToMany(targetEntity=ImContract::class, mappedBy="bien")
     */
    private $contracts;

    /**
     * @ORM\OneToMany(targetEntity=HiPublish::class, mappedBy="bien")
     */
    private $hiPublishes;

    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
        $this->photos = new ArrayCollection();
        $this->visits = new ArrayCollection();
        $this->rooms = new ArrayCollection();
        $this->suivis = new ArrayCollection();
        $this->offers = new ArrayCollection();
        $this->publishes = new ArrayCollection();
        $this->contracts = new ArrayCollection();
        $this->hiPublishes = new ArrayCollection();
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

    public function getTypeAdSeloger(): string
    {
        return mb_strtolower($this->getCodeTypeAdString($this->codeTypeAd));
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getTypeAdString(): string
    {
        return $this->getCodeTypeAdString($this->codeTypeAd);
    }

    public function setCodeTypeAd(int $codeTypeAd): self
    {
        $this->codeTypeAd = $codeTypeAd;

        return $this;
    }

    public function getTypeBienSeloger(): string
    {
        $data = ["Appartement", "maison", "parking/Box", "terrain", "boutique", "bureaux", "château", "immeuble", "maison/villa", "inconnu"];

        return $data[$this->codeTypeBien];
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getTypeBienString(): string
    {
        return $this->getCodeTypeBienString($this->codeTypeBien);
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
        $status = ["Inactif", "Actif", "Archive", "Brouillon"];

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
     * @return string
     * @Groups({"agenda:read"})
     */
    public function getShortname(): string
    {
        return $this->libelle . " | " . $this->getLocalisation()->getFullAddress();
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

    /**
     * @return Collection|ImRoom[]
     */
    public function getRooms(): Collection
    {
        return $this->rooms;
    }

    public function addRoom(ImRoom $room): self
    {
        if (!$this->rooms->contains($room)) {
            $this->rooms[] = $room;
            $room->setBien($this);
        }

        return $this;
    }

    public function removeRoom(ImRoom $room): self
    {
        if ($this->rooms->removeElement($room)) {
            // set the owning side to null (unless already changed)
            if ($room->getBien() === $this) {
                $room->setBien(null);
            }
        }

        return $this;
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
            $suivi->setBien($this);
        }

        return $this;
    }

    public function removeSuivi(ImSuivi $suivi): self
    {
        if ($this->suivis->removeElement($suivi)) {
            // set the owning side to null (unless already changed)
            if ($suivi->getBien() === $this) {
                $suivi->setBien(null);
            }
        }

        return $this;
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getMainPhotoFile(): string
    {
        return $this->getMainPhoto() ? $this->getMainPhoto()->getPhotoFile() : "/placeholders/placeholder.jpg";
    }

    public function getMandat(): ?ImMandat
    {
        return $this->mandat;
    }

    public function setMandat(ImMandat $mandat): self
    {
        $this->mandat = $mandat;

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
            $offer->setBien($this);
        }

        return $this;
    }

    public function removeOffer(ImOffer $offer): self
    {
        if ($this->offers->removeElement($offer)) {
            // set the owning side to null (unless already changed)
            if ($offer->getBien() === $this) {
                $offer->setBien(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ImPublish[]
     */
    public function getPublishes(): Collection
    {
        return $this->publishes;
    }

    public function addPublish(ImPublish $publish): self
    {
        if (!$this->publishes->contains($publish)) {
            $this->publishes[] = $publish;
            $publish->setBien($this);
        }

        return $this;
    }

    public function removePublish(ImPublish $publish): self
    {
        if ($this->publishes->removeElement($publish)) {
            // set the owning side to null (unless already changed)
            if ($publish->getBien() === $this) {
                $publish->setBien(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ImContract[]
     */
    public function getContracts(): Collection
    {
        return $this->contracts;
    }

    public function addContract(ImContract $contract): self
    {
        if (!$this->contracts->contains($contract)) {
            $this->contracts[] = $contract;
            $contract->setBien($this);
        }

        return $this;
    }

    public function removeContract(ImContract $contract): self
    {
        if ($this->contracts->removeElement($contract)) {
            // set the owning side to null (unless already changed)
            if ($contract->getBien() === $this) {
                $contract->setBien(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|HiPublish[]
     */
    public function getHiPublishes(): Collection
    {
        return $this->hiPublishes;
    }

    public function addHiPublish(HiPublish $hiPublish): self
    {
        if (!$this->hiPublishes->contains($hiPublish)) {
            $this->hiPublishes[] = $hiPublish;
            $hiPublish->setBien($this);
        }

        return $this;
    }

    public function removeHiPublish(HiPublish $hiPublish): self
    {
        if ($this->hiPublishes->removeElement($hiPublish)) {
            // set the owning side to null (unless already changed)
            if ($hiPublish->getBien() === $this) {
                $hiPublish->setBien(null);
            }
        }

        return $this;
    }
}
