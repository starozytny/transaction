<?php

namespace App\Entity;

use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImOwner;
use App\Repository\SocietyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=SocietyRepository::class)
 */
class Society extends DataEntity
{
    const FOLDER_LOGOS = "societies/logos";

    const COUNT_READ = ["count-users:read"];

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"user:read", "admin:read", "count-users:read", "owner:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read", "owner:read"})
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read"})
     */
    private $manager;

    /**
     * @ORM\Column(type="integer", unique=true)
     * @Groups({"admin:read"})
     */
    private $code;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read"})
     */
    private $logo;

    /**
     * @ORM\OneToMany(targetEntity=User::class, mappedBy="society")
     */
    private $users;

    /**
     * @ORM\OneToMany(targetEntity=ImAgency::class, mappedBy="society")
     */
    private $imAgencies;

    /**
     * @ORM\OneToMany(targetEntity=ImOwner::class, mappedBy="society")
     */
    private $imOwners;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->imAgencies = new ArrayCollection();
        $this->imOwners = new ArrayCollection();
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

    /**
     * @return string
     * @Groups({"admin:read", "owner:read"})
     */
    public function getCodeString(): string
    {
        $code = $this->code;
        if($code < 10){
            return "000" . $code;
        }elseif($code < 100){
            return "00" . $code;
        }elseif($code < 1000){
            return "0" . $code;
        }

        return $code;
    }

    public function getCode(): ?int
    {
        return $this->code;
    }

    public function setCode(int $code): self
    {
        $this->code = $code;

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
            $user->setSociety($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->removeElement($user)) {
            // set the owning side to null (unless already changed)
            if ($user->getSociety() === $this) {
                $user->setSociety(null);
            }
        }

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

    /**
     * @return Collection|ImAgency[]
     */
    public function getImAgencies(): Collection
    {
        return $this->imAgencies;
    }

    public function addImAgency(ImAgency $imAgency): self
    {
        if (!$this->imAgencies->contains($imAgency)) {
            $this->imAgencies[] = $imAgency;
            $imAgency->setSociety($this);
        }

        return $this;
    }

    public function removeImAgency(ImAgency $imAgency): self
    {
        if ($this->imAgencies->removeElement($imAgency)) {
            // set the owning side to null (unless already changed)
            if ($imAgency->getSociety() === $this) {
                $imAgency->setSociety(null);
            }
        }

        return $this;
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getFullname(): string
    {
        return "#" . $this->getCodeString() . " - " . $this->name;
    }

    /**
     * @return string
     * @Groups({"admin:read"})
     */
    public function getLogoFile(): string
    {
        return $this->getFileOrDefault($this->logo, self::FOLDER_LOGOS, "/placeholders/society.jpg");
    }

    /**
     * @return Collection|ImOwner[]
     */
    public function getImOwners(): Collection
    {
        return $this->imOwners;
    }

    public function addImOwner(ImOwner $imOwner): self
    {
        if (!$this->imOwners->contains($imOwner)) {
            $this->imOwners[] = $imOwner;
            $imOwner->setSociety($this);
        }

        return $this;
    }

    public function removeImOwner(ImOwner $imOwner): self
    {
        if ($this->imOwners->removeElement($imOwner)) {
            // set the owning side to null (unless already changed)
            if ($imOwner->getSociety() === $this) {
                $imOwner->setSociety(null);
            }
        }

        return $this;
    }

    public function getManager(): ?string
    {
        return $this->manager;
    }

    public function setManager(string $manager): self
    {
        $this->manager = $manager;

        return $this;
    }
}
