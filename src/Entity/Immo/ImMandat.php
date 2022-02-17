<?php

namespace App\Entity\Immo;

use App\Entity\DataEntity;
use App\Repository\Immo\ImMandatRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ImMandatRepository::class)
 */
class ImMandat extends DataEntity
{
    const TYPE_NONE = 0;
    const TYPE_SIMPLE = 1;
    const TYPE_EXCLUSIF = 2;
    const TYPE_SEMI = 3;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"user:read"})
     */
    private $codeTypeMandat = self::TYPE_NONE;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $startAt;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $endAt;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $priceEstimate;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $fee;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCodeTypeMandat(): ?int
    {
        return $this->codeTypeMandat;
    }

    public function setCodeTypeMandat(int $codeTypeMandat): self
    {
        $this->codeTypeMandat = $codeTypeMandat;

        return $this;
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
     * @Groups({"user:read"})
     */
    public function getTypeMandatString(): string
    {
        $data = ["Aucun", "Simple", "Exclusif", "Semi-exclusif"];

        return $data[$this->codeTypeMandat];
    }

    /**
     * @return string|null
     * @Groups({"user:read"})
     */
    public function getStartAtString(): ?string
    {
        return $this->getFullDateString($this->startAt);
    }

    /**
     * @return string|null
     * @Groups({"user:read"})
     */
    public function getEndAtString(): ?string
    {
        return $this->getFullDateString($this->endAt);
    }

    /**
     * @return string|null
     * @Groups({"user:read"})
     */
    public function getStartAtJavascript(): ?string
    {
        return $this->setDateJavascript($this->startAt);
    }

    /**
     * @return string|null
     * @Groups({"user:read"})
     */
    public function getEndAtJavascript(): ?string
    {
        return $this->setDateJavascript($this->endAt);
    }

    public function getPriceEstimate(): ?float
    {
        return $this->priceEstimate;
    }

    public function setPriceEstimate(?float $priceEstimate): self
    {
        $this->priceEstimate = $priceEstimate;

        return $this;
    }

    public function getFee(): ?float
    {
        return $this->fee;
    }

    public function setFee(?float $fee): self
    {
        $this->fee = $fee;

        return $this;
    }
}
