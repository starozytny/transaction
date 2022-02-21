<?php

namespace App\Entity\Immo;

use App\Entity\DataEntity;
use App\Entity\Donnee\DoQuartier;
use App\Entity\Donnee\DoSol;
use App\Entity\Donnee\DoSousType;
use App\Entity\Society;
use App\Entity\User;
use App\Repository\Immo\ImAgencyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImAgencyRepository::class)
 */
class ImAgency extends DataEntity
{
    const FOLDER_LOGO = "immo/logos";
    const FOLDER_TARIF = "immo/tarifs";

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"user:read", "admin:read", "count-agency:read", "owner:read", "select-negotiator:read", "suivi:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user:read", "admin:read", "owner:read"})
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read"})
     */
    private $dirname;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read"})
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $website;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user:read","admin:read"})
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user:read","admin:read"})
     */
    private $emailLocation;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user:read","admin:read"})
     */
    private $emailVente;

    /**
     * @ORM\Column(type="string", length=40, nullable=true)
     * @Groups({"user:read","admin:read"})
     */
    private $phone;

    /**
     * @ORM\Column(type="string", length=40, nullable=true)
     * @Groups({"user:read","admin:read"})
     */
    private $phoneLocation;

    /**
     * @ORM\Column(type="string", length=40, nullable=true)
     * @Groups({"user:read","admin:read"})
     */
    private $phoneVente;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read"})
     */
    private $logo;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $tarif;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups("admin:read")
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups("admin:read")
     */
    private $zipcode;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups("admin:read")
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $lat;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $lon;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $type;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $siret;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $rcs;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $cartePro;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $garantie;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $affiliation;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $mediation;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Groups({"admin:read"})
     */
    private $identifiant;

    /**
     * @ORM\OneToMany(targetEntity=ImBien::class, mappedBy="agency", orphanRemoval=true)
     */
    private $biens;

    /**
     * @ORM\ManyToOne(targetEntity=Society::class, fetch="EAGER", inversedBy="imAgencies")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user:read", "admin:read", "owner:read"})
     */
    private $society;

    /**
     * @ORM\OneToMany(targetEntity=User::class, mappedBy="agency")
     */
    private $users;

    /**
     * @ORM\OneToMany(targetEntity=ImNegotiator::class, mappedBy="agency")
     */
    private $negotiators;

    /**
     * @ORM\OneToMany(targetEntity=ImTenant::class, mappedBy="agency")
     */
    private $tenants;

    /**
     * @ORM\OneToMany(targetEntity=ImOwner::class, mappedBy="agency")
     */
    private $owners;

    /**
     * @ORM\OneToMany(targetEntity=ImProspect::class, mappedBy="agency")
     */
    private $prospects;

    /**
     * @ORM\OneToMany(targetEntity=ImPhoto::class, mappedBy="agency")
     */
    private $photos;

    /**
     * @ORM\OneToMany(targetEntity=ImBuyer::class, mappedBy="agency")
     */
    private $buyers;

    /**
     * @ORM\OneToMany(targetEntity=DoQuartier::class, mappedBy="agency")
     */
    private $doQuartiers;

    /**
     * @ORM\OneToMany(targetEntity=DoSol::class, mappedBy="agency")
     */
    private $doSols;

    /**
     * @ORM\OneToMany(targetEntity=DoSousType::class, mappedBy="agency")
     */
    private $doSousTypes;

    /**
     * @ORM\OneToMany(targetEntity=ImSupport::class, mappedBy="agency")
     */
    private $supports;

    public function __construct()
    {
        $this->biens = new ArrayCollection();
        $this->users = new ArrayCollection();
        $this->negotiators = new ArrayCollection();
        $this->tenants = new ArrayCollection();
        $this->owners = new ArrayCollection();
        $this->prospects = new ArrayCollection();
        $this->photos = new ArrayCollection();
        $this->buyers = new ArrayCollection();
        $this->doQuartiers = new ArrayCollection();
        $this->doSols = new ArrayCollection();
        $this->doSousTypes = new ArrayCollection();
        $this->supports = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDirname(): ?string
    {
        return $this->dirname;
    }

    public function setDirname(string $dirname): self
    {
        $this->dirname = $dirname;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getWebsite(): ?string
    {
        return $this->website;
    }

    public function setWebsite(?string $website): self
    {
        $this->website = $website;

        return $this;
    }

    public function getEmailLocation(): ?string
    {
        return $this->emailLocation;
    }

    public function setEmailLocation(?string $emailLocation): self
    {
        $this->emailLocation = $emailLocation;

        return $this;
    }

    public function getEmailVente(): ?string
    {
        return $this->emailVente;
    }

    public function setEmailVente(?string $emailVente): self
    {
        $this->emailVente = $emailVente;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    public function getPhoneLocation(): ?string
    {
        return $this->phoneLocation;
    }

    public function setPhoneLocation(?string $phoneLocation): self
    {
        $this->phoneLocation = $phoneLocation;

        return $this;
    }

    public function getPhoneVente(): ?string
    {
        return $this->phoneVente;
    }

    public function setPhoneVente(?string $phoneVente): self
    {
        $this->phoneVente = $phoneVente;

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

    public function getLogo(): ?string
    {
        return $this->logo;
    }

    public function setLogo(?string $logo): self
    {
        $this->logo = $logo;

        return $this;
    }

    public function getTarif(): ?string
    {
        return $this->tarif;
    }

    public function setTarif(?string $tarif): self
    {
        $this->tarif = $tarif;

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

    public function getLat(): ?string
    {
        return $this->lat;
    }

    public function setLat(?string $lat): self
    {
        $this->lat = $lat;

        return $this;
    }

    public function getLon(): ?string
    {
        return $this->lon;
    }

    public function setLon(?string $lon): self
    {
        $this->lon = $lon;

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
            $bien->setAgency($this);
        }

        return $this;
    }

    public function removeBien(ImBien $bien): self
    {
        if ($this->biens->removeElement($bien)) {
            // set the owning side to null (unless already changed)
            if ($bien->getAgency() === $this) {
                $bien->setAgency(null);
            }
        }

        return $this;
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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getSiret(): ?string
    {
        return $this->siret;
    }

    public function setSiret(?string $siret): self
    {
        $this->siret = $siret;

        return $this;
    }

    public function getRcs(): ?string
    {
        return $this->rcs;
    }

    public function setRcs(?string $rcs): self
    {
        $this->rcs = $rcs;

        return $this;
    }

    public function getCartePro(): ?string
    {
        return $this->cartePro;
    }

    public function setCartePro(?string $cartePro): self
    {
        $this->cartePro = $cartePro;

        return $this;
    }

    public function getGarantie(): ?string
    {
        return $this->garantie;
    }

    public function setGarantie(?string $garantie): self
    {
        $this->garantie = $garantie;

        return $this;
    }

    public function getAffiliation(): ?string
    {
        return $this->affiliation;
    }

    public function setAffiliation(?string $affiliation): self
    {
        $this->affiliation = $affiliation;

        return $this;
    }

    public function getMediation(): ?string
    {
        return $this->mediation;
    }

    public function setMediation(?string $mediation): self
    {
        $this->mediation = $mediation;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->setAgency($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->removeElement($user)) {
            // set the owning side to null (unless already changed)
            if ($user->getAgency() === $this) {
                $user->setAgency(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ImNegotiator[]
     */
    public function getNegotiators(): Collection
    {
        return $this->negotiators;
    }

    public function addNegotiator(ImNegotiator $negotiator): self
    {
        if (!$this->negotiators->contains($negotiator)) {
            $this->negotiators[] = $negotiator;
            $negotiator->setAgency($this);
        }

        return $this;
    }

    public function removeNegotiator(ImNegotiator $negotiator): self
    {
        if ($this->negotiators->removeElement($negotiator)) {
            // set the owning side to null (unless already changed)
            if ($negotiator->getAgency() === $this) {
                $negotiator->setAgency(null);
            }
        }

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
            $tenant->setAgency($this);
        }

        return $this;
    }

    public function removeTenant(ImTenant $tenant): self
    {
        if ($this->tenants->removeElement($tenant)) {
            // set the owning side to null (unless already changed)
            if ($tenant->getAgency() === $this) {
                $tenant->setAgency(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ImOwner[]
     */
    public function getOwners(): Collection
    {
        return $this->owners;
    }

    public function addOwner(ImOwner $owner): self
    {
        if (!$this->owners->contains($owner)) {
            $this->owners[] = $owner;
            $owner->setAgency($this);
        }

        return $this;
    }

    public function removeOwner(ImOwner $owner): self
    {
        if ($this->owners->removeElement($owner)) {
            // set the owning side to null (unless already changed)
            if ($owner->getAgency() === $this) {
                $owner->setAgency(null);
            }
        }

        return $this;
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getLogoFile(): string
    {
        return $this->getFileOrDefault($this->logo, self::FOLDER_LOGO, "https://robohash.org/" . $this->id . "?size=120x120");
    }

    /**
     * @return Collection|ImProspect[]
     */
    public function getProspects(): Collection
    {
        return $this->prospects;
    }

    public function addProspect(ImProspect $prospect): self
    {
        if (!$this->prospects->contains($prospect)) {
            $this->prospects[] = $prospect;
            $prospect->setAgency($this);
        }

        return $this;
    }

    public function removeProspect(ImProspect $prospect): self
    {
        if ($this->prospects->removeElement($prospect)) {
            // set the owning side to null (unless already changed)
            if ($prospect->getAgency() === $this) {
                $prospect->setAgency(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ImBuyer[]
     */
    public function getBuyers(): Collection
    {
        return $this->buyers;
    }

    public function addBuyer(ImBuyer $buyer): self
    {
        if (!$this->buyers->contains($buyer)) {
            $this->buyers[] = $buyer;
            $buyer->setAgency($this);
        }

        return $this;
    }

    public function removeBuyer(ImBuyer $buyer): self
    {
        if ($this->buyers->removeElement($buyer)) {
            // set the owning side to null (unless already changed)
            if ($buyer->getAgency() === $this) {
                $buyer->setAgency(null);
            }
        }

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
            $photo->setAgency($this);
        }

        return $this;
    }

    public function removePhoto(ImPhoto $photo): self
    {
        if ($this->photos->removeElement($photo)) {
            // set the owning side to null (unless already changed)
            if ($photo->getAgency() === $this) {
                $photo->setAgency(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|DoQuartier[]
     */
    public function getDoQuartiers(): Collection
    {
        return $this->doQuartiers;
    }

    public function addDoQuartier(DoQuartier $doQuartier): self
    {
        if (!$this->doQuartiers->contains($doQuartier)) {
            $this->doQuartiers[] = $doQuartier;
            $doQuartier->setAgency($this);
        }

        return $this;
    }

    public function removeDoQuartier(DoQuartier $doQuartier): self
    {
        if ($this->doQuartiers->removeElement($doQuartier)) {
            // set the owning side to null (unless already changed)
            if ($doQuartier->getAgency() === $this) {
                $doQuartier->setAgency(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|DoSol[]
     */
    public function getDoSols(): Collection
    {
        return $this->doSols;
    }

    public function addDoSol(DoSol $doSol): self
    {
        if (!$this->doSols->contains($doSol)) {
            $this->doSols[] = $doSol;
            $doSol->setAgency($this);
        }

        return $this;
    }

    public function removeDoSol(DoSol $doSol): self
    {
        if ($this->doSols->removeElement($doSol)) {
            // set the owning side to null (unless already changed)
            if ($doSol->getAgency() === $this) {
                $doSol->setAgency(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|DoSousType[]
     */
    public function getDoSousTypes(): Collection
    {
        return $this->doSousTypes;
    }

    public function addDoSousType(DoSousType $doSousType): self
    {
        if (!$this->doSousTypes->contains($doSousType)) {
            $this->doSousTypes[] = $doSousType;
            $doSousType->setAgency($this);
        }

        return $this;
    }

    public function removeDoSousType(DoSousType $doSousType): self
    {
        if ($this->doSousTypes->removeElement($doSousType)) {
            // set the owning side to null (unless already changed)
            if ($doSousType->getAgency() === $this) {
                $doSousType->setAgency(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ImSupport[]
     */
    public function getSupports(): Collection
    {
        return $this->supports;
    }

    public function addSupport(ImSupport $support): self
    {
        if (!$this->supports->contains($support)) {
            $this->supports[] = $support;
            $support->setAgency($this);
        }

        return $this;
    }

    public function removeSupport(ImSupport $support): self
    {
        if ($this->supports->removeElement($support)) {
            // set the owning side to null (unless already changed)
            if ($support->getAgency() === $this) {
                $support->setAgency(null);
            }
        }

        return $this;
    }
}
