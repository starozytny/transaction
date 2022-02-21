<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImSupportRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImSupportRepository::class)
 */
class ImSupport
{
    const SUPPORT_READ = ["support:read"];

    const CODE_SELOGER = 1;
    const CODE_LOGICIMMO = 2;
    const CODE_LEBONCOIN = 3;
    const CODE_PARUVENDU = 4;
    const CODE_ANNONCESJAUNES = 5;
    const CODE_TOPANNONCES = 6;
    const CODE_SITIMMO = 7;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"support:read", "user:read", "publish:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"support:read"})
     */
    private $code;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"support:read", "user:read"})
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"support:read"})
     */
    private $ftpServer;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"support:read"})
     */
    private $ftpUser;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"support:read"})
     */
    private $ftpPassword;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"support:read"})
     */
    private $ftpPort;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"support:read"})
     */
    private $maxPhotos;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"support:read"})
     */
    private $filename;

    /**
     * @ORM\ManyToOne(targetEntity=ImAgency::class, inversedBy="supports")
     * @ORM\JoinColumn(nullable=false)
     */
    private $agency;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $updatedBy;

    /**
     * @ORM\OneToMany(targetEntity=ImPublish::class, mappedBy="support")
     */
    private $publishes;

    public function __construct()
    {
        $this->publishes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getFtpServer(): ?string
    {
        return $this->ftpServer;
    }

    public function setFtpServer(?string $ftpServer): self
    {
        $this->ftpServer = $ftpServer;

        return $this;
    }

    public function getFtpUser(): ?string
    {
        return $this->ftpUser;
    }

    public function setFtpUser(?string $ftpUser): self
    {
        $this->ftpUser = $ftpUser;

        return $this;
    }

    public function getFtpPassword(): ?string
    {
        return $this->ftpPassword;
    }

    public function setFtpPassword(?string $ftpPassword): self
    {
        $this->ftpPassword = $ftpPassword;

        return $this;
    }

    public function getFtpPort(): ?int
    {
        return $this->ftpPort;
    }

    public function setFtpPort(?int $ftpPort): self
    {
        $this->ftpPort = $ftpPort;

        return $this;
    }

    public function getMaxPhotos(): ?int
    {
        return $this->maxPhotos;
    }

    public function setMaxPhotos(int $maxPhotos): self
    {
        $this->maxPhotos = $maxPhotos;

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

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(?string $filename): self
    {
        $this->filename = $filename;

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

    public function getUpdatedBy(): ?string
    {
        return $this->updatedBy;
    }

    public function setUpdatedBy(?string $updatedBy): self
    {
        $this->updatedBy = $updatedBy;

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
            $publish->setSupport($this);
        }

        return $this;
    }

    public function removePublish(ImPublish $publish): self
    {
        if ($this->publishes->removeElement($publish)) {
            // set the owning side to null (unless already changed)
            if ($publish->getSupport() === $this) {
                $publish->setSupport(null);
            }
        }

        return $this;
    }
}
