<?php

namespace App\Entity\Agenda;

use App\Entity\DataEntity;
use App\Entity\Immo\ImBien;
use App\Entity\Immo\ImVisit;
use App\Entity\User;
use App\Repository\Agenda\AgEventRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=AgEventRepository::class)
 */
class AgEvent extends DataEntity
{
    const STATUS_INACTIVE = 0;
    const STATUS_ACTIVE = 1;
    const STATUS_CANCEL = 2;
    const STATUS_OVER = 3;
    const STATUS_DELETE = 4;

    const VISIBILITY_RELATED = 0;
    const VISIBILITY_ONLY_ME = 1;
    const VISIBILITY_ALL = 2;
    const VISIBILITY_UTILISATEURS = 3;
    const VISIBILITY_MANAGERS = 4;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"agenda:read", "visit:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="json")
     * @Groups({"agenda:read", "visit:read"})
     */
    private $visibilities = [self::VISIBILITY_ONLY_ME];

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"agenda:read", "visit:read"})
     */
    private $name;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"visit:read"})
     */
    private $startAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $endAt;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"agenda:read", "visit:read"})
     */
    private $allDay = false;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"agenda:read", "visit:read"})
     */
    private $location;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"agenda:read", "visit:read"})
     */
    private $comment;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"agenda:read", "visit:read"})
     */
    private $status;

    /**
     * @ORM\Column(type="json", nullable=true)
     * @Groups({"agenda:read", "visit:read"})
     */
    private $persons;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, fetch="EAGER", inversedBy="agEvents")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"agenda:read"})
     */
    private $creator;

    /**
     * @ORM\OneToOne(targetEntity=ImVisit::class, fetch="EAGER", mappedBy="agEvent", cascade={"persist", "remove"})
     * @Groups({"agenda:read"})
     */
    private $imVisit;

    public function __construct()
    {
        $this->createdAt = $this->initNewDate();
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
     * @return string|null
     */
    public function getStartAtString(): ?string
    {
        if($this->allDay){
            return $this->getFullDateString($this->startAt, 'll', true);
        }
        return $this->getFullDateString($this->startAt, 'llll', true);
    }

    /**
     * @return string|null
     * @Groups({"agenda:read"})
     */
    public function getStartAtAgenda(): ?string
    {
        return $this->setDateAgenda($this->startAt);
    }

    /**
     * @return string|null
     * @Groups({"agenda:read", "visit:read"})
     */
    public function getStartAtJavascript(): ?string
    {
        return $this->setDateJavascript($this->startAt);
    }

    public function getStartAt(): ?\DateTimeInterface
    {
        return $this->startAt;
    }

    public function setStartAt(?\DateTimeInterface $startAt): self
    {
        $this->startAt = $startAt;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getEndAtString(): ?string
    {
        return $this->getFullDateString($this->endAt, 'llll', true);
    }

    /**
     * @return string|null
     * @Groups({"agenda:read"})
     */
    public function getEndAtAgenda(): ?string
    {
        return $this->setDateAgenda($this->endAt);
    }

    /**
     * @return string|null
     * @Groups({"agenda:read", "visit:read"})
     */
    public function getEndAtJavascript(): ?string
    {
        return $this->setDateJavascript($this->endAt);
    }

    public function getEndAt(): ?\DateTimeInterface
    {
        return $this->endAt;
    }

    public function setEndAt(?\DateTimeInterface $endAt): self
    {
        $this->endAt = $endAt;

        return $this;
    }

    /**
     * @return string
     * @Groups({"visit:read"})
     */
    public function getFullDate(): string
    {
        $start = str_replace(":", "h", $this->getStartAtString());
        $end = str_replace(":", "h", $this->getEndAtString());
        return $start . (($end && $this->endAt !== $this->startAt) ? "<br> à <br>" . $end : "");
    }

    /**
     * @return string
     * @Groups({"visit:read"})
     */
    public function getFullDateInline(): string
    {
        $start = str_replace(":", "h", $this->getStartAtString());
        $end = str_replace(":", "h", $this->getEndAtString());
        return $start . (($end && $this->endAt !== $this->startAt) ? " à " . $end : "");
    }

    public function getAllDay(): ?bool
    {
        return $this->allDay;
    }

    public function setAllDay(bool $allDay): self
    {
        $this->allDay = $allDay;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): self
    {
        $this->location = $location;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): self
    {
        $this->comment = $comment;

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

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $updatedAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        $this->updatedAt = $updatedAt;

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

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function setCreator(?User $creator): self
    {
        $this->creator = $creator;

        return $this;
    }

    /**
     * @return string
     * @Groups({"agenda:read", "visit:read"})
     */
    public function getStatusString(): string
    {
        return $this->getStatusStringEvent($this->status);
    }

    public function getVisibilities(): array
    {
        $visibilities = $this->visibilities;
        // guarantee every user at least has ROLE_USER
        $visibilities[] = self::VISIBILITY_RELATED;

        return array_unique($visibilities);
    }

    public function setVisibilities(array $visibilities): self
    {
        $this->visibilities = $visibilities;

        return $this;
    }

    public function getPersons(): ?array
    {
        $persons = $this->persons;
        // guarantee every user at least has ROLE_USER
        $persons[] = [
            "users" => []
        ];

        return $this->persons;
    }

    public function setPersons(?array $persons): self
    {
        $this->persons = $persons;

        return $this;
    }

    public function getImVisit(): ?ImVisit
    {
        return $this->imVisit;
    }

    public function setImVisit(ImVisit $imVisit): self
    {
        // set the owning side of the relation if necessary
        if ($imVisit->getAgEvent() !== $this) {
            $imVisit->setAgEvent($this);
        }

        $this->imVisit = $imVisit;

        return $this;
    }
}
