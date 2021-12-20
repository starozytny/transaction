<?php

namespace App\Entity\Immo;

use App\Entity\DataEntity;
use App\Entity\User;
use App\Repository\Immo\ImBienRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImBienRepository::class)
 */
class ImBien extends DataEntity
{
    const AD_VENTE              = 0;
    const AD_LOCATION           = 1;
    const AD_VIAGER             = 2;
    const AD_CESSION_BAIL       = 3;
    const AD_PDT_INVEST         = 4;
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

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Groups({"user:read"})
     */
    private $reference;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Gedmo\Slug(updatable=true, fields={"reference", "identifiant"})
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
     * @ORM\ManyToOne(targetEntity=ImNegotiator::class, inversedBy="biens")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read"})
     */
    private $negotiator;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="imBiens")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
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
        $data = ["Vente", "Location", "Viager", "Cession bail", "Produit d'investissement", "Location vacances", "Vente prestige", "Fond de commerce"];

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
}
