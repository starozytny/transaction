<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImNegotiatorRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImNegotiatorRepository::class)
 */
class ImNegotiator
{
    const FOLDER_AVATARS = "immo/negotiators/";

    const TRANSPORT_UNKNOWN = 0;
    const TRANSPORT_PIED = 1;
    const TRANSPORT_COMMUN = 2;
    const TRANSPORT_VOITURE_PRO = 3;
    const TRANSPORT_VOITURE_PERSO = 4;
    const TRANSPORT_DEUX_ROUES_PRO = 5;
    const TRANSPORT_DEUX_ROUES_PERSO = 6;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "user:read", "agenda:read", "owner:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=20)
     * @Groups({"admin:read", "user:read"})
     */
    private $code;

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
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $phone;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $phone2;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read", "agenda:read"})
     */
    private $email;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"admin:read"})
     */
    private $transport = 0;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"admin:read"})
     */
    private $immatriculation;

    /**
     * @ORM\ManyToOne(targetEntity=ImAgency::class, fetch="EAGER", inversedBy="negotiators")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"admin:read", "owner:read"})
     */
    private $agency;

    /**
     * @ORM\OneToMany(targetEntity=ImBien::class, mappedBy="negotiator")
     */
    private $biens;

    /**
     * @ORM\OneToMany(targetEntity=ImOwner::class, mappedBy="negotiator")
     */
    private $owners;

    /**
     * @ORM\OneToMany(targetEntity=ImTenant::class, mappedBy="negotiator")
     */
    private $tenants;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $avatar;

    /**
     * @ORM\OneToMany(targetEntity=ImProspect::class, mappedBy="negotiator")
     */
    private $prospects;

    /**
     * @ORM\OneToMany(targetEntity=ImBuyer::class, mappedBy="negotiator")
     */
    private $buyers;

    public function __construct()
    {
        $this->biens = new ArrayCollection();
        $this->owners = new ArrayCollection();
        $this->tenants = new ArrayCollection();
        $this->prospects = new ArrayCollection();
        $this->buyers = new ArrayCollection();
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

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

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

    public function getPhone2(): ?string
    {
        return $this->phone2;
    }

    public function setPhone2(?string $phone2): self
    {
        $this->phone2 = $phone2;

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

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getFullTransportString(): ?string
    {
        if($this->transport == null){
            return null;
        }
        return $this->getTransportString() . (($this->transport != 0 && $this->transport != 1) ? " - " . $this->immatriculation : "");
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getTransportString(): string
    {
        $transports = ["", "Pied", "Transport en commun", "Voiture professionnelle", "Voiture personnelle", "Deux roues professionnel", "Deux roues personnel"];

        return $transports[$this->transport];
    }

    public function getTransport(): ?int
    {
        return $this->transport;
    }

    public function setTransport(?int $transport): self
    {
        $this->transport = $transport;

        return $this;
    }

    public function getImmatriculation(): ?string
    {
        return $this->immatriculation;
    }

    public function setImmatriculation(?string $immatriculation): self
    {
        $this->immatriculation = $immatriculation;

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
     * @Groups({"admin:read", "user:read", "agenda:read", "owner:read"})
     */
    public function getFullname(): string
    {
        return trim($this->lastname . ' ' . $this->firstname);
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
            $bien->setNegotiator($this);
        }

        return $this;
    }

    public function removeBien(ImBien $bien): self
    {
        if ($this->biens->removeElement($bien)) {
            // set the owning side to null (unless already changed)
            if ($bien->getNegotiator() === $this) {
                $bien->setNegotiator(null);
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
            $owner->setNegotiator($this);
        }

        return $this;
    }

    public function removeOwner(ImOwner $owner): self
    {
        if ($this->owners->removeElement($owner)) {
            // set the owning side to null (unless already changed)
            if ($owner->getNegotiator() === $this) {
                $owner->setNegotiator(null);
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
            $tenant->setNegotiator($this);
        }

        return $this;
    }

    public function removeTenant(ImTenant $tenant): self
    {
        if ($this->tenants->removeElement($tenant)) {
            // set the owning side to null (unless already changed)
            if ($tenant->getNegotiator() === $this) {
                $tenant->setNegotiator(null);
            }
        }

        return $this;
    }

    /**
     * @return string
     * @Groups({"admin:read", "user:read", "agenda:read", "owner:read"})
     */
    public function getAvatarFile(): string
    {
        return $this->avatar ? "/" . self::FOLDER_AVATARS . $this->avatar : "https://robohash.org/" . $this->id . "?size=64x64";
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): self
    {
        $this->avatar = $avatar;

        return $this;
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
            $prospect->setNegotiator($this);
        }

        return $this;
    }

    public function removeProspect(ImProspect $prospect): self
    {
        if ($this->prospects->removeElement($prospect)) {
            // set the owning side to null (unless already changed)
            if ($prospect->getNegotiator() === $this) {
                $prospect->setNegotiator(null);
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
            $buyer->setNegotiator($this);
        }

        return $this;
    }

    public function removeBuyer(ImBuyer $buyer): self
    {
        if ($this->buyers->removeElement($buyer)) {
            // set the owning side to null (unless already changed)
            if ($buyer->getNegotiator() === $this) {
                $buyer->setNegotiator(null);
            }
        }

        return $this;
    }
}
