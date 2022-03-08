<?php

namespace App\Entity\Immo;

use App\Entity\DataEntity;
use App\Repository\Immo\ImConfidentialRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImConfidentialRepository::class)
 */
class ImConfidential extends DataEntity
{
    const INFORM_AGENCY = 0;
    const INFORM_NEGOTIATOR = 1;
    const INFORM_OTHER = 2;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $inform = self::INFORM_AGENCY;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user:read"})
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=60, nullable=true)
     * @Groups({"user:read"})
     */
    private $phone1;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user:read"})
     */
    private $email;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $visiteAt;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"user:read"})
     */
    private $keysNumber;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user:read"})
     */
    private $keysWhere;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getInform(): ?int
    {
        return $this->inform;
    }

    public function setInform(int $inform): self
    {
        $this->inform = $inform;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(?string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getPhone1(): ?string
    {
        return $this->phone1;
    }

    public function setPhone1(?string $phone1): self
    {
        $this->phone1 = $phone1;

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
     * @return string|null
     * @Groups({"user:read"})
     */
    public function getVisiteAtJavascript(): ?string
    {
        return $this->setDateJavascript($this->visiteAt);
    }

    public function getVisiteAt(): ?\DateTimeInterface
    {
        return $this->visiteAt;
    }

    public function setVisiteAt(?\DateTimeInterface $visiteAt): self
    {
        $this->visiteAt = $visiteAt;

        return $this;
    }

    public function getKeysNumber(): ?int
    {
        return $this->keysNumber;
    }

    public function setKeysNumber(?int $keysNumber): self
    {
        $this->keysNumber = $keysNumber;

        return $this;
    }

    public function getKeysWhere(): ?string
    {
        return $this->keysWhere;
    }

    public function setKeysWhere(?string $keysWhere): self
    {
        $this->keysWhere = $keysWhere;

        return $this;
    }

    public function getKeySentence(): string
    {
        $nbKeys = $this->keysNumber ?: 0;
        $txtKeys = $nbKeys !== 0 ? $nbKeys . " clée" . ($nbKeys > 1 ? "s": "") . "." : "";
        $txtKeys .= $this->keysWhere ? " " . $this->keysWhere . "." : "";
        return trim($txtKeys);
    }

    /**
     * @return string
     * @Groups({"user:read"})
     */
    public function getCommentary(): string
    {
        $txtKeys = $this->getKeySentence();

        $txtVisits = $this->visiteAt ? "Visites à partir du " . $this->getFullDateString($this->visiteAt) . "." : "";

        return $txtKeys . ($txtKeys ? "<br />" . $txtVisits : "");
    }
}
