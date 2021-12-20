<?php

namespace App\Entity\Immo;

use App\Entity\DataEntity;
use App\Repository\Immo\ImDiagRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImDiagRepository::class)
 */
class ImDiag extends DataEntity
{
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
    private $beforeJuly;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $isVirgin;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $isSend;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $createdAtDpe;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user:read"})
     */
    private $referenceDpe;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"user:read"})
     */
    private $dpeLetter;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $dpeValue;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"user:read"})
     */
    private $gesLetter;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $gesValue;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $minAnnual;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"user:read"})
     */
    private $maxAnnual;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBeforeJuly(): ?int
    {
        return $this->beforeJuly;
    }

    public function setBeforeJuly(int $beforeJuly): self
    {
        $this->beforeJuly = $beforeJuly;

        return $this;
    }

    public function getIsVirgin(): ?int
    {
        return $this->isVirgin;
    }

    public function setIsVirgin(int $isVirgin): self
    {
        $this->isVirgin = $isVirgin;

        return $this;
    }

    public function getIsSend(): ?int
    {
        return $this->isSend;
    }

    public function setIsSend(int $isSend): self
    {
        $this->isSend = $isSend;

        return $this;
    }


    /**
     * @return string|null
     * @Groups({"user:read"})
     */
    public function getCreatedAtDpeJavascript(): ?string
    {
        return $this->setDateJavascript($this->createdAtDpe);
    }

    public function getCreatedAtDpe(): ?\DateTimeInterface
    {
        return $this->createdAtDpe;
    }

    public function setCreatedAtDpe(?\DateTimeInterface $createdAtDpe): self
    {
        $this->createdAtDpe = $createdAtDpe;

        return $this;
    }

    public function getReferenceDpe(): ?string
    {
        return $this->referenceDpe;
    }

    public function setReferenceDpe(?string $referenceDpe): self
    {
        $this->referenceDpe = $referenceDpe;

        return $this;
    }

    public function getDpeLetter(): ?string
    {
        return $this->dpeLetter;
    }

    public function setDpeLetter(?string $dpeLetter): self
    {
        $this->dpeLetter = $dpeLetter;

        return $this;
    }

    public function getDpeValue(): ?float
    {
        return $this->dpeValue;
    }

    public function setDpeValue(?float $dpeValue): self
    {
        $this->dpeValue = $dpeValue;

        return $this;
    }

    public function getGesLetter(): ?string
    {
        return $this->gesLetter;
    }

    public function setGesLetter(?string $gesLetter): self
    {
        $this->gesLetter = $gesLetter;

        return $this;
    }

    public function getGesValue(): ?float
    {
        return $this->gesValue;
    }

    public function setGesValue(?float $gesValue): self
    {
        $this->gesValue = $gesValue;

        return $this;
    }

    public function getMinAnnual(): ?float
    {
        return $this->minAnnual;
    }

    public function setMinAnnual(?float $minAnnual): self
    {
        $this->minAnnual = $minAnnual;

        return $this;
    }

    public function getMaxAnnual(): ?float
    {
        return $this->maxAnnual;
    }

    public function setMaxAnnual(?float $maxAnnual): self
    {
        $this->maxAnnual = $maxAnnual;

        return $this;
    }
}
