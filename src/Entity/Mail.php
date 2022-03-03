<?php

namespace App\Entity;

use App\Repository\MailRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=MailRepository::class)
 */
class Mail extends DataEntity
{
    const FOLDER_FILES = "emails";

    const MAIL_READ = ["mail:read"];

    const STATUS_INBOX = 0;
    const STATUS_DRAFT = 1;
    const STATUS_SENT = 2;
    const STATUS_TRASH = 3;
    const STATUS_ARCHIVED = 4;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"mail:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"mail:read"})
     */
    private $statusOrigin = self::STATUS_SENT;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"mail:read"})
     */
    private $status = self::STATUS_SENT;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"mail:read"})
     */
    private $expeditor;

    /**
     * @ORM\Column(type="json")
     * @Groups({"mail:read"})
     */
    private $destinators = [];

    /**
     * @ORM\Column(type="json")
     * @Groups({"mail:read"})
     */
    private $cc = [];

    /**
     * @ORM\Column(type="json")
     * @Groups({"mail:read"})
     */
    private $bcc = [];

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"mail:read"})
     */
    private $subject;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"mail:read"})
     */
    private $message;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="mails")
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

    public function getExpeditor(): ?string
    {
        return $this->expeditor;
    }

    public function setExpeditor(string $expeditor): self
    {
        $this->expeditor = $expeditor;

        return $this;
    }

    public function getSubject(): ?string
    {
        return $this->subject;
    }

    public function setSubject(string $subject): self
    {
        $this->subject = $subject;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(?string $message): self
    {
        $this->message = $message;

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

    public function getDestinators(): ?array
    {
        return $this->destinators;
    }

    public function setDestinators(array $destinators): self
    {
        $this->destinators = $destinators;

        return $this;
    }

    public function getCc(): ?array
    {
        return $this->cc;
    }

    public function setCc(array $cc): self
    {
        $this->cc = $cc;

        return $this;
    }

    public function getBcc(): ?array
    {
        return $this->bcc;
    }

    public function setBcc(array $bcc): self
    {
        $this->bcc = $bcc;

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

    /**
     * @return string|null
     * @Groups({"mail:read"})
     */
    public function getCreatedAtString(): ?string
    {
        return $this->getFullDateString($this->createdAt, 'llll');
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

    public function getStatusOrigin(): ?int
    {
        return $this->statusOrigin;
    }

    public function setStatusOrigin(int $statusOrigin): self
    {
        $this->statusOrigin = $statusOrigin;

        return $this;
    }
}
