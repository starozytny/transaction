<?php

namespace App\Entity;

use App\Entity\Immo\ImAgency;
use App\Entity\Immo\ImBien;
use App\Entity\Agenda\AgEvent;
use App\Entity\Immo\ImNegotiator;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Exception;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use OpenApi\Annotations as OA;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @UniqueEntity(fields={"username"})
 * @UniqueEntity(fields={"email"})
 */
class User extends DataEntity implements UserInterface, PasswordAuthenticatedUserInterface
{
    const FOLDER_AVATARS = "avatars";

    const ADMIN_READ = ['admin:read'];
    const USER_READ = ['user:read'];
    const VISITOR_READ = ['visitor:read'];
    const AGENDA_READ = ['agenda:read'];
    const DONNEE_READ = ['donnee:read'];

    const CODE_ROLE_USER = 0;
    const CODE_ROLE_DEVELOPER = 1;
    const CODE_ROLE_ADMIN = 2;
    const CODE_ROLE_MANAGER = 3;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "count-users:read"})
     * @Groups({"admin:read", "user:read", "agenda:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Assert\NotBlank()
     * @Assert\Type(type="alnum")
     * @Groups({"admin:read", "user:read", "count-users:read", "count-users:read"})
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Assert\Email()
     * @Groups({"admin:read", "user:read", "agenda:read", "count-users:read"})
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     * @Groups({"admin:read"})
     * @OA\Property(type="array", @OA\Items(type="string"))
     */
    private $roles = ['ROLE_USER'];

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read", "user:read", "agenda:read", "count-users:read"})
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read", "user:read", "count-users:read"})
     */
    private $firstname;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $lastLogin;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $forgetCode;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $forgetAt;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read"})
     */
    private $token;

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     * @Groups({"admin:write"})
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "user:read"})
     */
    private $avatar;

    /**
     * @ORM\OneToMany(targetEntity=Notification::class, mappedBy="user")
     */
    private $notifications;

    /**
     * @ORM\OneToMany(targetEntity=Mail::class, mappedBy="user")
     */
    private $mails;

    /**
     * @ORM\ManyToOne(targetEntity=Society::class, fetch="EAGER", inversedBy="users")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"admin:read", "count-users:read"})
     */
    private $society;

    /**
     * @ORM\ManyToOne(targetEntity=ImAgency::class, fetch="EAGER", inversedBy="users")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"admin:read"})
     */
    private $agency;

    /**
     * @ORM\OneToMany(targetEntity=ImBien::class, mappedBy="user")
     */
    private $imBiens;

    /**
     * @ORM\OneToMany(targetEntity=AgEvent::class, mappedBy="creator")
     */
    private $agEvents;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"admin:read"})
     */
    private $negotiatorId;

    /**
     * @throws Exception
     */
    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
        $this->token = $this->initToken();
        $this->notifications = new ArrayCollection();
        $this->mails = new ArrayCollection();
        $this->imBiens = new ArrayCollection();
        $this->agEvents = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * Get label of the high role
     *
     * @return string
     */
    public function getHighRoleSlug(): string
    {
        $rolesSortedByImportance = ['ROLE_DEVELOPER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_USER'];
        $rolesLabel = ['developer', 'admin', 'manager', 'user'];
        $i = 0;
        foreach ($rolesSortedByImportance as $role)
        {
            if (in_array($role, $this->roles))
            {
                return $rolesLabel[$i];
            }
            $i++;
        }

        return "user";
    }

    /**
     * Get label of the high role
     *
     * @return string
     * @Groups({"admin:read", "count-users:read"})
     */
    public function getHighRole(): string
    {
        $rolesSortedByImportance = ['ROLE_DEVELOPER', 'ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_USER'];
        $rolesLabel = ['Développeur', 'Administrateur', 'Manager', 'Utilisateur'];
        $i = 0;
        foreach ($rolesSortedByImportance as $role)
        {
            if (in_array($role, $this->roles))
            {
                return $rolesLabel[$i];
            }
            $i++;
        }

        return "Utilisateur";
    }

    /**
     * Get code of the high role
     *
     * @return int
     * @Groups({"admin:read", "count-users:read"})
     */
    public function getHighRoleCode(): int
    {
        switch($this->getHighRole()){
            case 'Manager':
                return self::CODE_ROLE_MANAGER;
            case 'Développeur':
                return self::CODE_ROLE_DEVELOPER;
            case 'Administrateur':
                return self::CODE_ROLE_ADMIN;
            default:
                return self::CODE_ROLE_USER;
        }
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

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
     * @Groups({"admin:read"})
     */
    public function getCreatedAtString(): ?string
    {
        return $this->getFullDateString($this->createdAt);
    }

    /**
     * How long ago a user was added.
     *
     * @return string
     * @Groups({"admin:read"})
     */
    public function getCreatedAtAgo(): string
    {
        return $this->getHowLongAgo($this->getCreatedAt(), 2);
    }

    public function getLastLogin(): ?\DateTimeInterface
    {
        return $this->lastLogin;
    }

    public function setLastLogin(?\DateTimeInterface $lastLogin): self
    {
        $this->lastLogin = $lastLogin;

        return $this;
    }

    /**
     * How long ago a user was logged for the last time.
     *
     * @Groups({"admin:read"})
     */
    public function getLastLoginAgo(): ?string
    {
        return $this->getHowLongAgo($this->getLastLogin());
    }

    public function getForgetCode(): ?string
    {
        return $this->forgetCode;
    }

    public function setForgetCode(?string $forgetCode): self
    {
        $this->forgetCode = $forgetCode;

        return $this;
    }

    public function getForgetAt(): ?\DateTimeInterface
    {
        return $this->forgetAt;
    }

    public function setForgetAt(?\DateTimeInterface $forgetAt): self
    {
        $this->forgetAt = $forgetAt;

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    public function getHiddenEmail(): string
    {
        $email = $this->getEmail();
        $at = strpos($email, "@");
        $domain = substr($email, $at, strlen($email));
        $firstLetter = substr($email, 0, 1);
        $etoiles = "";
        for($i=1 ; $i < $at ; $i++){
            $etoiles .= "*";
        }
        return $firstLetter . $etoiles . $domain;
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

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
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
     * @return Collection|Notification[]
     */
    public function getNotifications(): Collection
    {
        return $this->notifications;
    }

    public function addNotification(Notification $notification): self
    {
        if (!$this->notifications->contains($notification)) {
            $this->notifications[] = $notification;
            $notification->setUser($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): self
    {
        if ($this->notifications->removeElement($notification)) {
            // set the owning side to null (unless already changed)
            if ($notification->getUser() === $this) {
                $notification->setUser(null);
            }
        }

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    /**
     * Like C. CHHUN
     */
    public function getShortFullName(): string
    {
        return substr($this->firstname, 0,1) . '. ' . mb_strtoupper($this->lastname);
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
     * @return Collection|ImBien[]
     */
    public function getImBiens(): Collection
    {
        return $this->imBiens;
    }

    public function addImBien(ImBien $imBien): self
    {
        if (!$this->imBiens->contains($imBien)) {
            $this->imBiens[] = $imBien;
            $imBien->setUser($this);
        }

        return $this;
    }

    public function removeImBien(ImBien $imBien): self
    {
        if ($this->imBiens->removeElement($imBien)) {
            // set the owning side to null (unless already changed)
            if ($imBien->getUser() === $this) {
                $imBien->setUser(null);
            }
        }

        return $this;
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
     * @Groups({"admin:read", "user:read", "agenda:read", "count-users:read"})
     */
    public function getAvatarFile(): string
    {
        return $this->getFileOrDefault($this->avatar, self::FOLDER_AVATARS, "https://robohash.org/" . $this->username);
    }

    /**
     * @return Collection|Mail[]
     */
    public function getMails(): Collection
    {
        return $this->mails;
    }

    public function addMail(Mail $mail): self
    {
        if (!$this->mails->contains($mail)) {
            $this->mails[] = $mail;
            $mail->setUser($this);
        }

        return $this;
    }

    public function removeMail(Mail $mail): self
    {
        if ($this->mails->removeElement($mail)) {
            // set the owning side to null (unless already changed)
            if ($mail->getUser() === $this) {
                $mail->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|AgEvent[]
     */
    public function getAgEvents(): Collection
    {
        return $this->agEvents;
    }

    public function addAgSlot(AgEvent $agEvent): self
    {
        if (!$this->agEvents->contains($agEvent)) {
            $this->agEvents[] = $agEvent;
            $agEvent->setCreator($this);
        }

        return $this;
    }

    public function removeAgEvents(AgEvent $agEvent): self
    {
        if ($this->agEvents->removeElement($agEvent)) {
            // set the owning side to null (unless already changed)
            if ($agEvent->getCreator() === $this) {
                $agEvent->setCreator(null);
            }
        }

        return $this;
    }

    public function getNegotiatorId(): ?int
    {
        return $this->negotiatorId;
    }

    public function setNegotiatorId(?int $negotiatorId): self
    {
        $this->negotiatorId = $negotiatorId;

        return $this;
    }
}
