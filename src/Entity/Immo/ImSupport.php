<?php

namespace App\Entity\Immo;

use App\Repository\Immo\ImSupportRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ImSupportRepository::class)
 */
class ImSupport
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $code;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $ftpServer;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $ftpUser;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $ftpPassword;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $ftpPort;

    /**
     * @ORM\Column(type="integer")
     */
    private $maxPhotos;

    /**
     * @ORM\ManyToOne(targetEntity=ImAgency::class, inversedBy="supports")
     * @ORM\JoinColumn(nullable=false)
     */
    private $agency;

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
}
